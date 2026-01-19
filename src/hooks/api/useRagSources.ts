import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as sdk from '@/lib/sdk';
import { toast } from 'sonner';

export const ragKeys = {
    all: ['rag'] as const,
    sources: () => [...ragKeys.all, 'sources'] as const,
};

export const useRagSources = () => {
    const queryClient = useQueryClient();

    // 1. List Sources
    const sourcesQuery = useQuery({
        queryKey: ragKeys.sources(),
        queryFn: () => sdk.rag.getSources(),
    });

    // 2. Upload Source (Mock)
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            // This would mock the upload
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { name: file.name };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ragKeys.sources() });
            toast.success("Document uploaded successfully");
        }
    });

    return {
        sources: sourcesQuery.data || [],
        isLoading: sourcesQuery.isLoading,
        upload: uploadMutation.mutate,
        isUploading: uploadMutation.isPending
    };
};
