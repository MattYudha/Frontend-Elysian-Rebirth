/**
 * dashboard.queries.ts — React Query hooks for dashboard data
 *
 * All dashboard data fetching lives here.
 * DashboardShell calls these hooks and passes results as props.
 * Presentation components never call these directly.
 */
import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http';
import { fetchWorkflows } from '@/services/workflow.service';
import { useTenant } from '@/contexts/TenantContext';

// ── Stats (Zone A — KPI Metric Cards) ──

export interface DashboardStats {
    docs: number;
    apiCalls: number;
    errorRate: number;
    successRate: number;
    growth: number;
    previousDocs?: number;
    previousApiCalls?: number;
    activePipelines?: number;
    previousActivePipelines?: number;
}

export function useDashboardStats() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'stats'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: DashboardStats }>('/api/v1/dashboard/stats');
            return res.data;
        },
        staleTime: 30_000,
        enabled: !!tenantId,
    });
}

// ── Chart Data (Zone B — Analytics Chart) ──

export interface ChartDataPoint {
    day: string;
    tokens: number;
    projected?: number;
}

export function useChartData() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'chart'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: ChartDataPoint[] }>('/api/v1/dashboard/charts');
            return res.data || [];
        },
        staleTime: 30_000,
        enabled: !!tenantId,
    });
}

// ── Activity Feed (Zone C — Priority Tasks) ──

export interface ActivityItem {
    id: string;
    type: 'pipeline' | 'knowledge' | 'chat' | 'system';
    title: string;
    description: string;
    timestamp: string;
    status?: string;
}

export function useActivityFeed() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'activity'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: any[] }>('/api/v1/activity?limit=20');
            const items = res.data || [];
            return items.map((item) => ({
                id: item.id || item.ID || String(Math.random()),
                type: item.type || 'system',
                title: item.title || item.Title || 'System Activity',
                description: item.description || item.Description || '',
                timestamp: item.timestamp || item.CreatedAt || new Date().toISOString(),
                status: item.status || 'completed',
            }));
        },
        staleTime: 30_000,
        enabled: !!tenantId,
    });
}

// ── Pipelines (Zone E — Pipeline Table, kept for backward compat) ──

export interface Pipeline {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'failed';
    lastRun: string;
    accuracy: string;
}

export function useActivePipelines() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'pipelines'],
        queryFn: async () => {
            const workflows = await fetchWorkflows();
            return workflows.map(wf => ({
                id: wf.id,
                name: wf.name,
                status: wf.status === 'active' || wf.status === 'processing' ? 'active' as const : 'paused' as const,
                lastRun: wf.lastRun || 'Never',
                accuracy: '99.5%',
            }));
        },
        staleTime: 30_000,
        enabled: !!tenantId,
    });
}
