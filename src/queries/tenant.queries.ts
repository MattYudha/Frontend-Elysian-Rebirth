/**
 * src/queries/tenant.queries.ts
 *
 * Tenant Query Layer
 * Policy: staleTime Infinity — tenants never change mid-session
 */

import { useQuery } from '@tanstack/react-query';
import { fetchTenants, fetchTenantById } from '@/services/tenant.service';
import { useAuthStore } from '@/store/authStore';

export const tenantKeys = {
    all: ['tenants'] as const,
    list: () => [...tenantKeys.all, 'list'] as const,
    detail: (id: string) => [...tenantKeys.all, 'detail', id] as const,
};

/**
 * useTenants — List available tenants
 * Policy: Infinity staleTime — tenant data is effectively static within a session
 */
export function useTenants() {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isLoadingSession = useAuthStore(state => state.isLoadingSession);

    return useQuery({
        queryKey: tenantKeys.list(),
        queryFn: fetchTenants,
        staleTime: Infinity,   // Never refetch during session
        gcTime: Infinity,      // Keep in cache for entire session lifetime
        enabled: isAuthenticated && !isLoadingSession,
        retry: (failureCount, error: unknown) => {
            // Never retry on auth errors — prevents the 401 loop
            const axiosError = error as { response?: { status?: number } };
            if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
                return false;
            }
            return failureCount < 2;
        },
    });
}

/**
 * useTenantDetail — Single tenant by ID
 */
export function useTenantDetail(id: string) {
    return useQuery({
        queryKey: tenantKeys.detail(id),
        queryFn: () => fetchTenantById(id),
        enabled: !!id,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
