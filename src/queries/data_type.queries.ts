import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataTypeService, type CreateDataTypeDTO } from '@/services/data_type.service';
import { toast } from 'sonner';

export const dataTypeKeys = {
    all: ['dataTypes'] as const,
    list: () => [...dataTypeKeys.all, 'list'] as const,
};

/**
 * useDataTypes — Get all data types (system + tenant specific)
 */
export function useDataTypes() {
    return useQuery({
        queryKey: dataTypeKeys.list(),
        queryFn: dataTypeService.list,
        staleTime: 30_000,
    });
}

/**
 * useCreateDataType — Create a new custom data type
 */
export function useCreateDataType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDataTypeDTO) => dataTypeService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dataTypeKeys.list() });
            toast.success('Data type created successfully.');
        },
        onError: () => {
            toast.error('Failed to create data type.');
        }
    });
}

/**
 * useDeleteDataType — Delete a custom data type
 */
export function useDeleteDataType() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => dataTypeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dataTypeKeys.list() });
            toast.success('Data type deleted successfully.');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.error || 'Failed to delete data type.');
        }
    });
}
