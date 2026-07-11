import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { config } from './config';
import { globalDegradation } from './globalDegradation';
import { useAuthStore } from '@/store/authStore';

// Global flag to prevent multiple simultaneous redirects on 401
let isRedirecting = false;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};


// Safe cookie reader
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

class HttpClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.api.baseURL,
            timeout: config.api.timeout,
            withCredentials: true, // Vital for HttpOnly session execution & CSRF
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor: CSRF Token Injection & Bearer Token
        this.client.interceptors.request.use(
            (config) => {
                const method = config.method?.toLowerCase();

                // FORCE BFF PROXY for all backend requests if running in browser
                if (typeof window !== 'undefined' && config.url?.startsWith('/api/v1/')) {
                    config.baseURL = ''; // Use same origin
                    config.url = `/api/proxy${config.url.replace('/api/v1', '')}`;
                }

                // Authentication is now exclusively handled via HTTP-Only cookies.
                // The BFF Proxy will read the cookie and inject the Authorization header for us.
                // We no longer manually append the token from Zustand store, preventing stale token resurrection.

                // Inject X-Tenant-ID header from cookie
                const tenantId = getCookie('tenant_id');
                if (tenantId) {
                    config.headers['X-Tenant-ID'] = tenantId;
                }

                // Inject CSRF mitigation for destructive/mutation endpoints
                if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
                    const csrfToken = getCookie('XSRF-TOKEN') || getCookie('csrf_token');
                    if (csrfToken) {
                        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
                        config.headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor: Global 401 & degradation handling
        this.client.interceptors.response.use(
            (response) => {
                globalDegradation.clearFor(response.config.url);
                return response;
            },
            async (error) => {
                const status = error.response?.status;
                const originalRequest = error.config;

                // Attempt to silently refresh token on 401 before redirecting
                if (status === 401 && originalRequest && !originalRequest._retry) {
                    originalRequest._retry = true;

                    if (isRefreshing) {
                        return new Promise((resolve) => {
                            subscribeTokenRefresh((token: string) => {
                                // Provide token if available, but proxy handles it anyway
                                if (token) {
                                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                }
                                resolve(this.client(originalRequest));
                            });
                        });
                    }

                    isRefreshing = true;

                    try {
                        console.log('[HTTP Client] Token expired. Attempting token refresh...');
                        const res = await fetch('/api/auth/refresh', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (res.ok) {
                            console.log('[HTTP Client] Token refresh succeeded. Retrying request.');
                            
                            isRefreshing = false;
                            onRefreshed(''); // Proxy handles the new token cookie automatically

                            // The proxy will automatically read the new HttpOnly cookie on the retry
                            return this.client(originalRequest);
                        }
                        isRefreshing = false;
                    } catch (refreshError) {
                        isRefreshing = false;
                        console.error('[HTTP Client] Silent token refresh failed:', refreshError);
                    }
                }

                // The Global 401/403 Interceptor: Kills Zombie Sessions / Invalid Tenants
                if (status === 401 || status === 403) {
                    console.error("HTTP 401/403 TRIGGERED BY URL:", originalRequest.url, "Status:", status);
                    if (typeof window !== 'undefined' && !isRedirecting) {
                        const path = window.location.pathname;
                        // Only redirect if not already on auth pages
                        if (!path.includes('/login') && !path.includes('/register') && !path.includes('/callback') && !path.includes('/403')) {
                            isRedirecting = true;
                            
                            // 1. Schedule redirect immediately after attempting to clear cookies via BFF
                            fetch('/api/auth/logout', { method: 'POST' })
                                .catch((e) => console.warn("Logout API failed during 401 redirect:", e))
                                .finally(() => {
                                    if (status === 403) {
                                        window.location.href = '/403';
                                    } else {
                                        window.location.href = '/login?session_expired=true';
                                    }
                                });

                            // 2. Force state synchronization (delete from memory) safely
                            try {
                                useAuthStore.getState().logout();
                            } catch (e) {
                                console.warn("Logout cleanup failed:", e);
                            }
                        }
                    }
                }

                if (status === 503 || status === 504 || status === 429) {
                    globalDegradation.markDegraded(error.config?.url, status);
                }

                return Promise.reject(error);
            }
        );
    }

    async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config);
        return response.data;
    }

    async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config);
        return response.data;
    }

    async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config);
        return response.data;
    }

    async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data, config);
        return response.data;
    }
}

export const http = new HttpClient();
