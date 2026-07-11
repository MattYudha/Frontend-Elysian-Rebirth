import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as agentService from '@/services/agent.service';
import { useTenant } from '@/contexts/TenantContext';

export const agentKeys = {
    all: ['agents'] as const,
    list: (tenantId: string) => [...agentKeys.all, tenantId, 'list'] as const,
    detail: (tenantId: string, id: string) => [...agentKeys.all, tenantId, 'detail', id] as const,
};

export function useAgents() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: agentKeys.list(tenantId),
        queryFn: agentService.fetchAgents,
        enabled: !!tenantId,
    });
}

export function useAgent(id: string) {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: agentKeys.detail(tenantId, id),
        queryFn: () => agentService.fetchAgentById(id),
        enabled: !!id && !!tenantId,
    });
}

export function useCreateAgent() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: agentService.createAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.list(tenantId) });
        },
    });
}

export function useUpdateAgent() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<agentService.Agent> }) =>
            agentService.updateAgent(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: agentKeys.list(tenantId) });
            queryClient.invalidateQueries({ queryKey: agentKeys.detail(tenantId, variables.id) });
        },
    });
}

export function useDeleteAgent() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: agentService.deleteAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.list(tenantId) });
        },
    });
}

export function useCreateSkill() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: ({ agentId, skill }: { agentId: string; skill: Partial<agentService.Skill> }) =>
            agentService.createSkill(agentId, skill),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: agentKeys.detail(tenantId, variables.agentId) });
        },
    });
}

export function useDeleteSkill() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: ({ agentId, skillId }: { agentId: string; skillId: string }) =>
            agentService.deleteSkill(agentId, skillId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: agentKeys.detail(tenantId, variables.agentId) });
        },
    });
}
