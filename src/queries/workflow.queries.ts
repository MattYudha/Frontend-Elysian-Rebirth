/**
 * src/queries/workflow.queries.ts
 * 
 * Query Layer + Zustand ← React Query Bridge (Server-First)
 * 
 * Key changes from previous version:
 * - useWorkflowLoader ALWAYS seeds Zustand from server (no isDirty wall)
 * - useSaveWorkflow sends expectedVersion for OCC conflict detection
 * - 409 Conflict handled gracefully with user notification
 */

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWorkflows, fetchWorkflowById, saveWorkflow as saveWorkflowApi, createWorkflow, publishWorkflow as publishWorkflowApi, deleteWorkflow } from '@/services/workflow.service';
export { fetchWorkflowById };

import { useWorkflowStore } from '@/components/workflow/store';
import { activityKeys } from '@/queries/activity.queries';
import { toast } from 'sonner';
import type { Node, Edge } from 'reactflow';
import { useTenant } from '@/contexts/TenantContext';

// Enterprise Query Key Factory
export const workflowKeys = {
    all: ['workflows'] as const,
    lists: (tenantId: string) => [...workflowKeys.all, tenantId, 'list'] as const,
    detail: (tenantId: string, id: string) => [...workflowKeys.all, tenantId, 'detail', id] as const,
};

/**
 * useWorkflows Hook
 * Fetches list of workflows (pipeline list).
 * Accepts optional { status } filter for URL-driven tab filtering.
 * When status is provided and not 'all', filters client-side (until backend supports ?status=).
 */
export function useWorkflows(filters?: { status?: string }) {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: [...workflowKeys.lists(tenantId), filters?.status ?? 'all'],
        queryFn: fetchWorkflows,
        staleTime: 30 * 1000,
        retry: 1,
        enabled: !!tenantId,
        select: (data) => {
            if (!filters?.status || filters.status === 'all') return data;
            return data.filter(w => w.status === filters.status);
        },
    });
}

/**
 * useWorkflowLoader — Bridge: React Query → Zustand Canvas (No isDirty Wall)
 * 
 * ALWAYS seeds Zustand with latest server data via setFromServer().
 * Stores serverVersion for OCC on subsequent saves.
 * isDirty is a UX indicator only — never blocks server data flow.
 */
export function useWorkflowLoader(workflowId: string | null) {
    const setFromServer = useWorkflowStore(state => state.setFromServer);
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    const query = useQuery({
        queryKey: workflowKeys.detail(tenantId, workflowId!),
        queryFn: () => fetchWorkflowById(workflowId!),
        enabled: !!workflowId && !!tenantId,
        staleTime: 30_000,
    });

    // Bridge: ALWAYS seed Zustand when server data arrives.
    // No isDirty gate — server data is the source of truth.
    // setFromServer records the version for OCC on next save.
    useEffect(() => {
        if (query.data) {
            const workflow = query.data;
            const nodes = workflow.graph?.nodes ?? workflow.nodes ?? [];
            const edges = workflow.graph?.edges ?? workflow.edges ?? [];
            setFromServer(
                nodes as Node[],
                edges as Edge[],
                workflow.version ?? ''
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.data]);

    return query;
}

/**
 * useSaveWorkflow — Persist canvas state (SILENT: used for auto-save)
 *
 * ⚠️ NO TOASTS. Auto-save must never interrupt the user with notifications.
 * Errors are silently swallowed. The isDirty indicator in the toolbar
 * shows the save state instead.
 *
 * Sends expectedVersion for OCC (Optimistic Concurrency Control).
 * 409 Conflict is handled silently — a manual Publish will surface the conflict.
 */
export function useSaveWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (data: { id: string; nodes: unknown[]; edges: unknown[]; expectedVersion: string }) =>
            saveWorkflowApi(data),
        onSuccess: (result, variables) => {
            const store = useWorkflowStore.getState();
            store.setDirty(false);
            if (result?.version) {
                store.setFromServer(
                    store.nodes,
                    store.edges,
                    result.version
                );
            }
            // Silently invalidate caches — no toast
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(tenantId, variables.id) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });
        },
        onError: () => {
            // Silent — auto-save errors must not spam the user.
            // isDirty stays true so the user knows there are unsaved changes.
        },
    });
}

/**
 * usePublishWorkflow — Validate DAG and publish explicitly (LOUD)
 *
 * This is the only mutation that shows toasts.
 * Called when the user clicks the Publish button.
 * Will show a clear error if the workflow has cycles.
 */
export function usePublishWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (workflowId: string) => publishWorkflowApi(workflowId),
        onSuccess: (_, workflowId) => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(tenantId, workflowId) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });
            toast.success('Workflow dipublish!', {
                description: 'Pipeline Anda siap dieksekusi.',
            });
        },
        onError: (error: Error & { response?: { status?: number; data?: { error?: string } } }) => {
            const errMsg = error?.response?.data?.error || error.message || 'Publish gagal';
            if (error?.response?.status === 422) {
                // Cycle detected
                toast.error('Publish Gagal: Workflow Mengandung Cycle', {
                    description: 'Pastikan semua koneksi antar-node tidak membentuk loop sebelum publish.',
                    duration: 8000,
                });
            } else {
                toast.error('Gagal mempublish workflow', { description: errMsg });
            }
        },
    });
}
/**
 * useCreateWorkflow — Create a new workflow/pipeline
 */
export function useCreateWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (data: { name: string; status?: 'active' | 'draft' | 'archived' | 'processing' | 'completed' | 'queued' | 'failed' }) =>
            createWorkflow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });
            toast.success('Pipeline created successfully');
        },
        onError: () => {
            toast.error('Failed to create pipeline');
        },
    });
}

/**
 * useDeleteWorkflow — Delete a workflow/pipeline
 */
export function useDeleteWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (id: string) => deleteWorkflow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });
            toast.success('Pipeline deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete pipeline');
        },
    });
}

