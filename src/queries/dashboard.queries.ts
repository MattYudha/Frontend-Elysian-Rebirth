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
    health_score?: number | null;   // null = no pipeline data yet → empty state
    has_pipeline_data?: boolean;
    pipeline_total?: number;
    pipeline_failed?: number;
    latency_p95_ms?: number;
    budget_limit?: number;
    systems?: Record<string, string>;
    total_savings?: number;
    regional_heatmap?: Array<{ region: string; flagged_count: number; total_markup: number; }>;
}

export function useDashboardStats() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'stats'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: Record<string, any> }>('/api/v1/dashboard/stats');
            const d = res.data ?? {};
            return {
                // KPI cards
                docs:             Number(d.total_documents  ?? 0),
                apiCalls:         Number(d.tokens_used      ?? 0),
                activePipelines:  Number(d.active_workflows ?? 0),
                errorRate:        0,
                successRate:      0,
                growth:           0,

                // Health score (nullable → empty state when no pipeline data)
                health_score:      d.health_score ?? null,
                has_pipeline_data: Boolean(d.has_pipeline_data),
                pipeline_total:    Number(d.pipeline_total   ?? 0),
                pipeline_failed:   Number(d.pipeline_failed  ?? 0),
                latency_p95_ms:    Number(d.latency_p95_ms   ?? 0),

                // Billing / system
                budget_limit: Number(d.budget_limit ?? 5000),
                systems:      d.systems as Record<string, string> | undefined,

                // Savings & Heatmap
                total_savings:    Number(d.total_savings ?? 0),
                regional_heatmap: d.regional_heatmap ?? [],
            } satisfies DashboardStats;
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

export interface UsageCostPoint {
    date: string;
    cost: number;
    tokens: number;
}

export interface LatencyPoint {
    date: string;
    latency?: number;
    p95?: number;
    p99?: number;
    errors?: number;
}

export interface SavingsPoint {
    date: string;
    savings: number;
}

export interface DashboardChartData {
    usage_costs: UsageCostPoint[];
    latency: LatencyPoint[];
    budget_savings: SavingsPoint[];
}

export function useChartData() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'chart'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: DashboardChartData }>('/api/v1/dashboard/charts');
            return res.data || { usage_costs: [], latency: [], budget_savings: [] };
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

// ── Audit Logs & Priority Queue (Enterprise Cards) ──

export interface AuditLog {
    id: string;
    user: {
        name: string;
        email: string;
        avatar?: string;
    };
    action: string;
    target: string;
    timestamp: string;
    status: 'success' | 'failure';
}

export function useAuditLogs() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'audit-logs'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: any[] }>('/api/v1/dashboard/audit-logs?limit=10');
            const items = res.data || [];
            return items.map((item) => ({
                id: item.id,
                user: {
                    name: item.actor_name || 'System',
                    email: item.actor_email || '',
                    avatar: item.actor_avatar || undefined,
                },
                action: item.action,
                target: item.resource_type,
                timestamp: item.created_at,
                status: 'success' as const,
            }));
        },
        staleTime: 30_000,
        enabled: !!tenantId,
    });
}

export interface PriorityItem {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timestamp: string;
    type: 'pipeline' | 'system' | 'billing';
}

export function usePriorityQueue() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['dashboard', tenantId, 'priority-queue'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: any[] }>('/api/v1/dashboard/priority-queue');
            const items = res.data || [];
            return items.map((item) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                priority: item.priority as 'high' | 'medium' | 'low',
                timestamp: item.timestamp,
                type: item.type as 'pipeline' | 'system' | 'billing',
            }));
        },
        staleTime: 30_000,
        enabled: !!tenantId,
    });
}

// ── Tenant Members (Tenant Access Avatar Group) ──

export interface TenantMemberItem {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
}

export function useTenantMembers() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: ['tenant', tenantId, 'members'],
        queryFn: async () => {
            const res = await http.get<{ status: string; data: any[] }>(`/api/v1/tenants/${tenantId}/members`);
            const items = res.data || [];
            return items.map((m) => ({
                id: m.id,
                name: m.name || 'Unknown',
                email: m.email || '',
                avatar: m.avatar || undefined,
                role: m.role || 'member',
            })) as TenantMemberItem[];
        },
        staleTime: 60_000,
        enabled: !!tenantId,
    });
}
