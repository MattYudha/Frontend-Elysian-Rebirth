// Enterprise Dashboard Shell
// Implements strict 12-column grid architecture as requested by Technical Advisor

'use client';

import { useState, useCallback } from 'react';
import { Calendar, Download, Plus, CheckCircle, Loader2, ArrowRight, Users } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useTenant } from '@/contexts/TenantContext';
import { useRouter } from 'next/navigation';

// Queries
import { useDashboardStats, useChartData, useActivityFeed, useAuditLogs, usePriorityQueue, useTenantMembers } from '@/queries/dashboard.queries';
import { useWorkflows, useCreateWorkflow } from '@/queries/workflow.queries';

// UI
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';

// Enterprise Components
import { PrimaryKpiCard } from './enterprise/PrimaryKpiCard';
import { TokenUsageChartCard, ChartDataPoint } from './enterprise/TokenUsageChartCard';
import { SystemHealthCard } from './enterprise/SystemHealthCard';
import { ActivePipelinesList } from './ActivePipelinesList';
import { PipelineDetailDrawer } from './PipelineDetailDrawer';
import { QuickCreateModalLayout } from '@/components/ui/QuickCreateModalLayout';
import { AiCopilotWidget } from './enterprise/AiCopilotWidget';
import { PriorityActionQueue, ActionItem } from './enterprise/PriorityActionQueue';
import { TenantAvatarGroup, type TenantMember } from './TenantAvatarGroup';

// New "Expansion" Components
import { CostForecaster } from './enterprise/CostForecaster';
import { LatencyMonitor } from './enterprise/LatencyMonitor';
import { AuditLogWidget } from './enterprise/AuditLogWidget';
import type { CostMetric, LatencyMetric, AuditLog } from '@/types/api-responses';

// ─── Date range type ───────────────────────────────────────
type DateRangeOption = '7d' | '30d' | '90d' | 'custom';
interface DateRange { from: Date; to: Date; label: string; }

function buildDateRange(option: DateRangeOption, custom?: { from: Date; to: Date }): DateRange {
    const to = new Date();
    switch (option) {
        case '7d':  return { from: subDays(to, 7),  to, label: 'Last 7 Days' };
        case '90d': return { from: subDays(to, 90), to, label: 'Last 90 Days' };
        case 'custom':
            return custom
                ? { ...custom, label: `${format(custom.from, 'MMM d')} – ${format(custom.to, 'MMM d')}` }
                : { from: subDays(to, 30), to, label: 'Last 30 Days' };
        case '30d':
        default:    return { from: subDays(to, 30), to, label: 'Last 30 Days' };
    }
}

// ─── Export helper ─────────────────────────────────────────
function downloadCSV(filename: string, rows: string[][]) {
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

interface DashboardShellProps {
    initialStatusFilter?: string;
}

export function DashboardShell({ }: DashboardShellProps) {
    const { t } = useTranslation();
    const user = useAuthStore(state => state.user);
    const { currentTenant } = useTenant();
    const router = useRouter();

    // ── Date Range State ──────────────────────────────────
    const [rangeOption, setRangeOption] = useState<DateRangeOption>('30d');
    const [customRange, setCustomRange] = useState<{ from: Date; to: Date } | undefined>();
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [pickingFrom, setPickingFrom] = useState<Date | undefined>();
    const dateRange = buildDateRange(rangeOption, customRange);

    // ── Data Hooks ────────────────────────────────────────
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: chartData, isLoading: chartLoading } = useChartData();
    const { data: activities, isLoading: activitiesLoading } = useActivityFeed();
    const { data: pipelines, isLoading: pipelinesLoading } = useWorkflows();
    const { data: auditLogsData, isLoading: auditLogsLoading } = useAuditLogs();
    const { data: priorityQueueData, isLoading: priorityQueueLoading } = usePriorityQueue();
    const { data: tenantMembers, isLoading: membersLoading } = useTenantMembers();
    const createPipelineMutation = useCreateWorkflow();

    // ── UI States ─────────────────────────────────────────
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [pipelineName, setPipelineName] = useState('');
    const [pipelineTemplate, setPipelineTemplate] = useState('blank');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCreatePipeline = useCallback(() => {
        if (!pipelineName.trim()) return;
        createPipelineMutation.mutate(
            { name: pipelineName, status: 'draft' },
            {
                onSuccess: (created) => {
                    setCreateSuccess(true);
                    setTimeout(() => {
                        setIsQuickCreateOpen(false);
                        setPipelineName('');
                        setPipelineTemplate('blank');
                        setCreateSuccess(false);
                        router.push(`/workflow`);
                    }, 1200);
                }
            }
        );
    }, [pipelineName, createPipelineMutation, router]);

    // ── Export handler ────────────────────────────────────
    const handleExport = useCallback(() => {
        const rows: string[][] = [
            ['Metric', 'Value', 'Date Range'],
            ['Total Documents', String(stats?.docs ?? 0), dateRange.label],
            ['API Calls', String(stats?.apiCalls ?? 0), dateRange.label],
            ['Active Pipelines', String(stats?.activePipelines ?? 0), dateRange.label],
            ['Health Score', String(stats?.health_score ?? 0), dateRange.label],
            [],
            ['Pipeline', 'Status', 'Last Updated'],
            ...(pipelines ?? []).map(p => [p.name, p.status, p.lastUpdated ? format(new Date(p.lastUpdated), 'yyyy-MM-dd HH:mm') : 'N/A']),
        ];
        downloadCSV(`elysian-dashboard-${format(new Date(), 'yyyy-MM-dd')}.csv`, rows);
    }, [stats, pipelines, dateRange]);

    // ── Transform Data ────────────────────────────────────
    const usageCosts = (chartData && 'usage_costs' in chartData && Array.isArray(chartData.usage_costs)) ? chartData.usage_costs : [];
    const latencyList = (chartData && 'latency' in chartData && Array.isArray(chartData.latency)) ? chartData.latency : [];

    const chartPoints: ChartDataPoint[] = usageCosts.map(d => ({
        day: d.date,
        tokens: d.tokens,
        projected: d.tokens * 1.1,
    }));

    const budgetLimit = stats?.budget_limit ?? 5000;

    const costData: CostMetric[] = usageCosts.map(d => ({
        date: d.date,
        amount: d.cost,
        currency: 'USD',
        budget: budgetLimit,
        projected: d.cost * 1.25,
    }));

    const latencyData: LatencyMetric[] = latencyList.map(d => ({
        timestamp: d.date,
        p95: d.p95 ?? d.latency ?? 0,
        p99: d.p99 ?? (d.latency ? d.latency * 1.3 : 0),
        errors: Number(d.errors ?? 0)
    }));

    const auditLogs = auditLogsData || [];

    const priorityItems: ActionItem[] = (priorityQueueData ?? []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        timestamp: item.timestamp,
        type: item.type,
    }));

    // ── Map tenant members to TenantMember format ─────────
    const tenantMemberList: TenantMember[] = (tenantMembers ?? []).map(m => ({
        id: m.id,
        name: m.name,
        avatarUrl: m.avatar,
        role: (m.role === 'admin' ? 'admin' : m.role === 'viewer' ? 'viewer' : 'member') as TenantMember['role'],
    }));

    return (
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user?.name || 'Admin'}. Here is your platform status.</p>
                </div>

                {/* Header Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">

                    {/* ── Tenant Access (Live from DB) ── */}
                    <div className="hidden md:flex items-center gap-2.5 pr-3 border-r border-slate-200/60 dark:border-slate-700/50 mr-1">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-medium text-slate-500">Tenant Access</span>
                        </div>
                        {membersLoading ? (
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                                ))}
                            </div>
                        ) : tenantMemberList.length > 0 ? (
                            <TenantAvatarGroup members={tenantMemberList} max={3} size="default" />
                        ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                <Users className="h-3 w-3" />
                                Only you
                            </div>
                        )}
                    </div>

                    {/* ── Quick Create (Wired to Backend) ── */}
                    <button
                        onClick={() => setIsQuickCreateOpen(true)}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-500/30 hover:shadow-blue-500/40"
                    >
                        <Plus className="h-4 w-4" />
                        Quick Create
                    </button>

                    {/* ── Last 30 Days Date Picker (Functional) ── */}
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                            <button className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-lg border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                <span>{dateRange.label}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">Quick Select</p>
                                <div className="flex flex-col gap-1">
                                    {([
                                        { key: '7d', label: 'Last 7 Days' },
                                        { key: '30d', label: 'Last 30 Days' },
                                        { key: '90d', label: 'Last 90 Days' },
                                    ] as const).map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => { setRangeOption(key); setCustomRange(undefined); setDatePickerOpen(false); }}
                                            className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${rangeOption === key ? 'bg-blue-600 text-white font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">Custom Range</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                                    {pickingFrom
                                        ? `From: ${format(pickingFrom, 'MMM d, yyyy')} — Pick end date`
                                        : 'Click a start date'}
                                </p>
                                <CalendarUI
                                    mode="single"
                                    selected={pickingFrom}
                                    onSelect={(date) => {
                                        if (!date) return;
                                        if (!pickingFrom) {
                                            setPickingFrom(date);
                                        } else {
                                            const from = pickingFrom < date ? pickingFrom : date;
                                            const to   = pickingFrom < date ? date : pickingFrom;
                                            setCustomRange({ from, to });
                                            setRangeOption('custom');
                                            setPickingFrom(undefined);
                                            setDatePickerOpen(false);
                                        }
                                    }}
                                    initialFocus
                                />
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* ── Export (Downloads real CSV) ── */}
                    <button
                        onClick={handleExport}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
                        title="Export dashboard data as CSV"
                    >
                        <Download className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Main Enterprise 12-Column Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">

                {/* ========================================== */}
                {/* LEFT COLUMN: MAIN ANALYTICS (Span 8 cols)  */}
                {/* ========================================== */}
                <div className="flex min-w-0 flex-col space-y-4 sm:space-y-6 lg:col-span-7 xl:col-span-8">

                    {/* 1. Primary KPIs (Row of 3 or 4 small cards) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <PrimaryKpiCard
                            label="Total Documents"
                            value={(stats?.docs ?? 0).toLocaleString()}
                            delta={12}
                            isLoading={statsLoading}
                        />
                        <PrimaryKpiCard
                            label="API Calls"
                            value={(stats?.apiCalls ?? 0).toLocaleString()}
                            delta={-2.4}
                            isLoading={statsLoading}
                        />
                        <PrimaryKpiCard
                            label="Active Pipelines"
                            value={stats?.activePipelines ?? 0}
                            delta={5}
                            isLoading={statsLoading}
                        />
                    </div>

                    {/* 2. Secondary Analytics (Two charts side-by-side) */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Token Usage Area Chart */}
                        <div className="w-full min-w-0">
                            <TokenUsageChartCard data={chartPoints} isLoading={chartLoading} />
                        </div>

                        {/* System Health Radial */}
                        <div className="w-full min-w-0">
                            <SystemHealthCard
                                score={stats?.health_score}
                                hasPipelineData={stats?.has_pipeline_data}
                                pipelineTotal={stats?.pipeline_total}
                                pipelineFailed={stats?.pipeline_failed}
                                latencyP95={stats?.latency_p95_ms}
                                systems={stats?.systems}
                                isLoading={statsLoading}
                            />
                        </div>
                    </div>

                    {/* 3. Cost Forecaster (Full Width) */}
                    <div className="w-full min-w-0">
                        <CostForecaster data={costData} isLoading={statsLoading} />
                    </div>

                    {/* 4. Latency Monitor (Full Width) */}
                    <div className="w-full min-w-0">
                        <LatencyMonitor data={latencyData} isLoading={statsLoading} />
                    </div>

                    {/* 5. Active Pipelines Timeline (Full width) */}
                    <div className="w-full min-w-0">
                        <ActivePipelinesList
                            onPipelineClick={(id) => {
                                setSelectedPipelineId(id);
                                setIsDrawerOpen(true);
                            }}
                        />
                    </div>

                    {/* 6. Audit Logs (Full Width) */}
                    <div className="w-full min-w-0">
                        <AuditLogWidget logs={auditLogs} isLoading={statsLoading || auditLogsLoading} />
                    </div>

                </div>

                {/* ========================================== */}
                {/* RIGHT COLUMN: ASSISTANT & TASKS (Span 4 cols) */}
                {/* ========================================== */}
                <div className="flex w-full flex-col space-y-4 sm:space-y-6 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:no-scrollbar pb-6">

                    {/* 1. AI Assistant Widget (Persistent, highly prominent) */}
                    <div className="shrink-0">
                        <AiCopilotWidget />
                    </div>

                    {/* 2. Activity / Priority Queue */}
                    <div className="shrink-0">
                        <PriorityActionQueue actions={priorityItems} isLoading={priorityQueueLoading || activitiesLoading} />
                    </div>

                </div>
            </div>

            {/* Pipeline Detail Drawer */}
            <PipelineDetailDrawer
                pipelineId={selectedPipelineId}
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setTimeout(() => setSelectedPipelineId(null), 300);
                }}
            />

            {/* ── Quick Create Modal (Wired to Backend) ── */}
            <QuickCreateModalLayout
                open={isQuickCreateOpen}
                onClose={() => {
                    if (createPipelineMutation.isPending) return;
                    setIsQuickCreateOpen(false);
                    setPipelineName('');
                    setPipelineTemplate('blank');
                    setCreateSuccess(false);
                }}
                onSubmitShortcut={() => handleCreatePipeline()}
            >
                {createSuccess ? (
                    /* Success State */
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-50">Pipeline Created!</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Redirecting to Workflow Builder…</p>
                        </div>
                    </div>
                ) : (
                    /* Create Form */
                    <div className="flex flex-col gap-5">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 tracking-tight flex items-center gap-2">
                                <Plus className="h-5 w-5 text-blue-500" />
                                Quick Create Pipeline
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Name your pipeline and pick a template to get started instantly.
                            </p>
                        </div>

                        {/* Templates */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Choose Template</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { key: 'blank',   icon: '📄', label: 'Blank', desc: 'Start from scratch' },
                                    { key: 'rag',     icon: '📚', label: 'Doc Q&A RAG', desc: 'Document retrieval' },
                                    { key: 'support', icon: '💬', label: 'Support Agent', desc: 'Customer service AI' },
                                    { key: 'etl',     icon: '⚙️', label: 'ETL Pipeline', desc: 'Data ingestion' },
                                ].map(tpl => (
                                    <button
                                        key={tpl.key}
                                        onClick={() => setPipelineTemplate(tpl.key)}
                                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                                            pipelineTemplate === tpl.key
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <span className="text-lg">{tpl.icon}</span>
                                        <div>
                                            <p className={`text-sm font-semibold ${pipelineTemplate === tpl.key ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>{tpl.label}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{tpl.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pipeline Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Pipeline Name</label>
                            <input
                                type="text"
                                value={pipelineName}
                                onChange={(e) => setPipelineName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && pipelineName.trim()) handleCreatePipeline(); }}
                                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all"
                                placeholder="e.g. Data Ingestion RAG"
                                autoFocus
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => { setIsQuickCreateOpen(false); setPipelineName(''); }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePipeline}
                                disabled={createPipelineMutation.isPending || !pipelineName.trim()}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {createPipelineMutation.isPending ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                                ) : (
                                    <>Create Pipeline <ArrowRight className="h-4 w-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </QuickCreateModalLayout>
        </div>
    );
}

// Re-export as a Server Component compatible export 
// (though it's 'use client', it's safe to be rendered by Page)
