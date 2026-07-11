import { http } from '../http';

export interface ExecutionResponse {
    status: string;
    execution_id: string;
    message: string;
}

export interface ExecutionLog {
    id: string;
    node_id?: string;
    level: string;
    message: string;
    timestamp: string;
}

export interface ExecutionDetails {
    id: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    workflow_id: string;
    logs: ExecutionLog[];
    started_at?: string;
    finished_at?: string;
    duration?: number;
}

export const executionClient = {
    start: async (workflowId: string): Promise<ExecutionResponse> => {
        const response = await http.post<ExecutionResponse>(`/workflows/${workflowId}/execute`, {});
        return response;
    },

    get: async (executionId: string): Promise<ExecutionDetails> => {
        const response = await http.get<{ data: ExecutionDetails }>(`/executions/${executionId}`);
        return response.data;
    },

    list: async (workflowId: string) => {
        const response = await http.get(`/executions?workflow_id=${workflowId}`);
        return response;
    }
};
