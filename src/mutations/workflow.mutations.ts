/**
 * src/mutations/workflow.mutations.ts
 * 
 * Mutation Layer
 * Responsibilities:
 * - Wrap useMutation
 * - Handle Side Effects (Invalidation, Toasts)
 * - Targeted Cache Updates (Invalidate smallest scope)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWorkflow, deleteWorkflow } from '@/services/workflow.service';
import { workflowKeys } from '@/queries/workflow.queries';
import { useTenant } from '@/contexts/TenantContext';

export function useCreateWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: createWorkflow,
        onSuccess: () => {
            // Invalidate the 'lists' scope to refetch the main table
            // This is efficient: calls to 'detail' are NOT invalidated.
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });
        },
    });
}

export function useDeleteWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: deleteWorkflow,
        onSuccess: (data, variables) => {
            // 1. Invalidate list to remove from table
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });

            // 2. Invalidate specific detail just in case user is viewing it (force refresh/error)
            // variables is the 'id' passed to deleteWorkflow
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(tenantId, variables) });
        },
    });
}
