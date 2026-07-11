import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { toast } from 'sonner';

export interface Teammate {
    id: string;
    name: string;
    email: string;
    role: string;
    lastActive: string;
}

export function useTeammates() {
    const queryClient = useQueryClient();

    // Fetch Teammates (GET)
    const { data: teammates, isLoading, isError, error } = useQuery({
        queryKey: queryKeys.workspace.teammates(),
        queryFn: async (): Promise<Teammate[]> => {
            const res = await fetch('/api/workspace/teammates');
            if (!res.ok) throw new Error('Failed to fetch teammates');
            const json = await res.json();
            return json.data;
        }
    });

    // Delete Teammate (DELETE) - Optimistic Update Example
    const deleteTeammate = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/workspace/teammates/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete teammate');
        },
        onMutate: async (deletedId) => {
            // Cancel any outgoing refetches to prevent overwrite
            await queryClient.cancelQueries({ queryKey: queryKeys.workspace.teammates() });

            // Snapshot previous value
            const previousTeammates = queryClient.getQueryData<Teammate[]>(queryKeys.workspace.teammates());

            // Optimistically update cache
            if (previousTeammates) {
                queryClient.setQueryData<Teammate[]>(
                    queryKeys.workspace.teammates(),
                    old => old?.filter(t => t.id !== deletedId)
                );
            }

            // Return context with snapshotted value
            return { previousTeammates };
        },
        onError: (err, deletedId, context) => {
            // Rollback on error
            if (context?.previousTeammates) {
                queryClient.setQueryData(queryKeys.workspace.teammates(), context.previousTeammates);
            }
            toast.error('Failed to remove teammate');
        },
        onSettled: () => {
            // Always refetch after error or success to ensure backend sync
            queryClient.invalidateQueries({ queryKey: queryKeys.workspace.teammates() });
        },
        onSuccess: () => {
            toast.success('Teammate removed successfully');
        }
    });

    return {
        teammates,
        isLoading,
        isError,
        error,
        deleteTeammate: deleteTeammate.mutate,
        isDeleting: deleteTeammate.isPending
    };
}
