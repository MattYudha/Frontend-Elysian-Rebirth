'use client';

import { useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials } from '@/types/auth';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';
const TOKEN_EXPIRY_KEY = 'token_expiry';

type AuthStatus = 'idle' | 'authenticated' | 'expired' | 'refreshing' | 'failed';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');

    const clearAuth = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        setUser(null);
        setIsAuthenticated(false);
        setAuthStatus('idle');
    }, []);

    const refreshToken = useCallback(async () => {
        const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!currentRefreshToken) return;

        setAuthStatus('refreshing');

        try {
            // Mock refresh - in production, call /api/auth/refresh
            await new Promise(resolve => setTimeout(resolve, 500));

            const newToken = 'refreshed-token-' + Date.now();
            const newExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

            localStorage.setItem(TOKEN_KEY, newToken);
            localStorage.setItem(TOKEN_EXPIRY_KEY, newExpiry.toString());
            setAuthStatus('authenticated');
        } catch (error) {
            console.error('Token refresh failed:', error);
            setAuthStatus('failed');
            clearAuth();
        }
    }, [clearAuth]);

    // Check token expiry and refresh if needed
    const checkTokenExpiry = useCallback(async () => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return;

        const expiryTime = parseInt(expiry, 10);
        const now = Date.now();
        const timeUntilExpiry = expiryTime - now;

        // If token expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            await refreshToken();
        }
    }, [refreshToken]);

    // Auto-refresh token before expiry
    useEffect(() => {
        const interval = setInterval(checkTokenExpiry, 60 * 1000); // Check every minute
        return () => clearInterval(interval);
    }, [checkTokenExpiry]);

    // Load user from storage on mount
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;

        if (token && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                setAuthStatus('authenticated');
                checkTokenExpiry();
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                clearAuth();
            }
        }
        setIsLoading(false);
    }, [checkTokenExpiry, clearAuth]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);

        // Mock login - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock user and tokens
        const mockUser: User = {
            id: 'demo-user-1',
            name: 'Demo User',
            email: credentials.email,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq6RiKyKUXBQ6iJ_IIFhPMNeq-Cm0RzmgbnOwEdhWsiB5bzEN1yQ0Tc3Mf4GGMSM0o2d8dEHnMlBOz6zKmYH6YpPydOCpnE9f_DliAS3rDmHSd24jzMbTlbiB4Xj5acnh0r83eFwCnqdqvTK6llF_m33LZD1gizISonINq2Hbhe2-4FQxl_s6NwbM9trXMwHeUVvdctzt5IZsolgDcTRKu_7D3410kuumbQaodEPT1DHBJG_Vi0gBtO5doRvts6h1FiSLtCCnmj98',
            roles: ['admin', 'editor'],
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockRefreshToken = 'mock-refresh-token-' + Date.now();
        const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour from now

        // Store in localStorage
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, mockRefreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

        setUser(mockUser);
        setIsAuthenticated(true);
        setAuthStatus('authenticated');
        setIsLoading(false);

        return { user: mockUser, token: mockToken };
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        clearAuth();
        setIsLoading(false);

        // Redirect to login
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }, [clearAuth]);

    const hasRole = useCallback((role: string) => {
        return user?.roles.includes(role) ?? false;
    }, [user]);

    const hasAnyRole = useCallback((roles: string[]) => {
        return roles.some((role) => user?.roles.includes(role)) ?? false;
    }, [user]);

    const getToken = useCallback(() => {
        return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading,
        authStatus,
        login,
        logout,
        refreshToken,
        hasRole,
        hasAnyRole,
        getToken,
    };
}
