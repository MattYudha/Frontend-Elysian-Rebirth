import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';

export interface DashboardStats {
    docs: number;
    apiCalls: number;
    errorRate: number;
    successRate: number;
    growth: number;
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const response = await http.get<{ status: string, data: DashboardStats }>('/api/dashboard/stats');
            return response.data;
        }
    });
}

export interface Pipeline {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'failed';
    lastRun: string;
    accuracy: string;
}

export function useActivePipelines() {
    return useQuery({
        queryKey: ['dashboard', 'pipelines'],
        queryFn: async () => {
            const response = await http.get<{ status: string, data: Pipeline[] }>('/api/dashboard/pipelines');
            return response.data;
        }
    });
}

export function useChartData() {
    return useQuery({
        queryKey: ['dashboard', 'chart'],
        queryFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await http.get<{ status: string, data: any[] }>('/api/dashboard/chart');
            return response.data;
        }
    });
}
