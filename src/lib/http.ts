import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { config } from './config';
import { globalDegradation } from './globalDegradation';
import { useAuthStore } from '@/store/authStore';

// Global flag to prevent multiple simultaneous redirects on 401
let isRedirecting = false;

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

                // Inject Bearer Token from Zustand Store
                const token = useAuthStore.getState().accessToken;
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

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
            (error) => {
                const status = error.response?.status;

                // The Global 401/403 Interceptor: Kills Zombie Sessions / Invalid Tenants
                if (status === 401 || status === 403) {
                    if (typeof window !== 'undefined' && !isRedirecting) {
                        const path = window.location.pathname;
                        // Only redirect if not already on auth pages
                        if (!path.includes('/login') && !path.includes('/register') && !path.includes('/callback') && !path.includes('/403')) {
                            isRedirecting = true;
                            
                            // 1. Schedule redirect immediately so it doesn't get blocked
                            setTimeout(() => {
                                if (status === 403) {
                                    window.location.href = '/403';
                                } else {
                                    window.location.href = '/login?session_expired=true';
                                }
                            }, 100);

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
