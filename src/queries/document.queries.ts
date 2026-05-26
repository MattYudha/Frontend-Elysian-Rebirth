import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'sonner';

export interface Document {
    id: string;
    tenant_id: string;
    user_id: string;
    title: string;
    category: string;
    source_uri: string;
    status: string;
    created_at: string;
    last_updated_at: string;
}

export interface ListDocumentsResponse {
    data: Document[];
    meta: {
        total: number;
        limit: number;
        offset: number;
    };
}

export const documentKeys = {
    all: ['documents'] as const,
    lists: (tenantId: string) => [...documentKeys.all, tenantId, 'list'] as const,
    detail: (tenantId: string, id: string) => [...documentKeys.all, tenantId, 'detail', id] as const,
};

// Fetch all documents for the active tenant
export function useDocuments() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: documentKeys.lists(tenantId),
        queryFn: async () => {
            const res = await http.get<ListDocumentsResponse>('/api/v1/documents?limit=100');
            return res.data || [];
        },
        enabled: !!tenantId,
        staleTime: 10_000,
    });
}

// Fetch raw text for a specific document
export function useDocumentRaw(documentId: string | null) {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: documentKeys.detail(tenantId, documentId!),
        queryFn: async () => {
            const res = await http.get<{ id: string; raw_text: string; hash: string }>(
                `/api/v1/documents/${documentId}/raw`
            );
            return res;
        },
        enabled: !!documentId && !!tenantId,
        staleTime: 30_000,
    });
}

// Update document raw text (or create draft if it does not exist)
export function useUpdateDocumentText() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, text, title, status }: { id: string; text: string; title?: string; status?: string }) => {
            const res = await http.patch<{ status: string; message: string }>(
                `/api/v1/documents/${id}/text`,
                { extracted_text: text, title, status }
            );
            return res;
        },
        onSuccess: (_, variables) => {
            // Invalidate lists and details
            queryClient.invalidateQueries({ queryKey: documentKeys.lists(tenantId) });
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(tenantId, variables.id) });
        },
    });
}

// Delete document
export function useDeleteDocument() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await http.delete<{ status: string; message: string }>(
                `/api/v1/documents/${id}`
            );
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists(tenantId) });
            toast.success("Dokumen berhasil dihapus!");
        },
        onError: (err: any) => {
            toast.error("Gagal menghapus dokumen: " + (err.message || err));
        }
    });
}
