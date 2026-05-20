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
import { fetchWorkflows, fetchWorkflowById, saveWorkflow as saveWorkflowApi, createWorkflow } from '@/services/workflow.service';
export { fetchWorkflowById };

import { useWorkflowStore } from '@/store/workflowStore';
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
            setFromServer(
                (workflow.nodes ?? []) as Node[],
                (workflow.edges ?? []) as Edge[],
                workflow.version ?? ''
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query.data]);

    return query;
}

/**
 * useSaveWorkflow — Persist canvas state with OCC (Optimistic Concurrency Control)
 * 
 * Sends expectedVersion (last-known server version hash/ETag).
 * If backend returns 409 Conflict, another user/tab has modified the workflow.
 * User is notified and must refresh to get latest state.
 */
export function useSaveWorkflow() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (data: { id: string; nodes: unknown[]; edges: unknown[]; expectedVersion: string }) =>
            saveWorkflowApi(data),
        onSuccess: (result, variables) => {
            // Update local version to the new server version
            const store = useWorkflowStore.getState();
            store.setDirty(false);
            // If server returns a new version, record it
            if (result?.version) {
                store.setFromServer(
                    store.nodes,
                    store.edges,
                    result.version
                );
            }
            // Invalidate caches
            queryClient.invalidateQueries({ queryKey: workflowKeys.detail(tenantId, variables.id) });
            queryClient.invalidateQueries({ queryKey: workflowKeys.lists(tenantId) });
            queryClient.invalidateQueries({ queryKey: activityKeys.all });
            toast.success('Workflow saved successfully');
        },
        onError: (error: Error & { response?: { status?: number } }) => {
            if (error.response?.status === 409) {
                // OCC conflict — another user/tab modified this workflow
                toast.error(
                    'Conflict: This workflow was modified by another session. Please refresh to get the latest version.',
                    { duration: 8000 }
                );
            } else {
                toast.error('Failed to save. Your changes are preserved locally.');
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
