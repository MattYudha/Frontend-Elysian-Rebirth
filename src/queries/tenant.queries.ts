/**
 * src/queries/tenant.queries.ts
 *
 * Tenant Query Layer
 * Policy: staleTime Infinity — tenants never change mid-session
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTenants, fetchTenantById, fetchTenantMembers, updateTenant, updateMemberRole } from '@/services/tenant.service';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export const tenantKeys = {
    all: ['tenants'] as const,
    list: () => [...tenantKeys.all, 'list'] as const,
    detail: (id: string) => [...tenantKeys.all, 'detail', id] as const,
    members: (id: string) => [...tenantKeys.all, 'members', id] as const,
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

/**
 * useTenantMembers — Get all live members of a tenant
 */
export function useTenantMembers(id: string) {
    return useQuery({
        queryKey: [...tenantKeys.all, 'members', id],
        queryFn: () => fetchTenantMembers(id),
        enabled: !!id,
        staleTime: 60_000,
    });
}

/**
 * useUpdateTenant — Mutate tenant details
 */
export function useUpdateTenant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name?: string; plan_tier?: string } }) => 
            updateTenant(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: tenantKeys.list() });
            queryClient.invalidateQueries({ queryKey: tenantKeys.detail(data.id) });
            toast.success('Workspace updated successfully.');
        },
        onError: () => {
            toast.error('Failed to update workspace.');
        }
    });
}

/**
 * useUpdateMemberRole — Update a member's role in the current tenant
 */
export function useUpdateMemberRole() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            updateMemberRole(currentTenant?.id || '', userId, role),
        onSuccess: () => {
            if (currentTenant?.id) {
                queryClient.invalidateQueries({ queryKey: tenantKeys.members(currentTenant.id) });
            }
            toast.success('Member role updated successfully.');
        },
        onError: () => {
            toast.error('Failed to update member role.');
        }
    });
}
