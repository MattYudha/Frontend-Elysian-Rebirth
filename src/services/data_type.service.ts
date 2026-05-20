import { http } from '@/lib/http';

export interface DataType {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    fields_count: number;
    is_system: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateDataTypeDTO {
    name: string;
    description?: string;
}

export const dataTypeService = {
    /**
     * Fetch all data types for the active tenant
     */
    list: async (): Promise<DataType[]> => {
        const response = await http.get<{ status: string; data: DataType[] }>('/api/v1/data-types');
        return response.data || [];
    },

    /**
     * Create a new data type
     */
    create: async (data: CreateDataTypeDTO): Promise<DataType> => {
        const response = await http.post<{ status: string; data: DataType }>('/api/v1/data-types', data);
        return response.data;
    },

    /**
     * Delete a data type by ID
     */
    delete: async (id: string): Promise<{ message: string }> => {
        return http.delete<{ message: string }>(`/api/v1/data-types/${id}`);
    }
};
