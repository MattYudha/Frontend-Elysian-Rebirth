// Enterprise Dashboard Shell
// Implements strict 12-column grid architecture as requested by Technical Advisor

'use client';

import { useState, useCallback } from 'react';
import { Calendar, Download, Plus, CheckCircle, Loader2, ArrowRight, Users, ExternalLink } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { useTenant } from '@/contexts/TenantContext';
import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

// Queries
import { useDashboardStats, useChartData, useActivityFeed, useAuditLogs, usePriorityQueue, useTenantMembers } from '@/queries/dashboard.queries';
import { useWorkflows, useCreateWorkflow, fetchWorkflowById, workflowKeys, useSaveWorkflow } from '@/queries/workflow.queries';

// UI
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';

// Enterprise Components
import { TokenUsageChartCard, ChartDataPoint } from './enterprise/TokenUsageChartCard';
import { SystemHealthCard } from './enterprise/SystemHealthCard';
import { ActivePipelinesList } from './ActivePipelinesList';
import { PipelineDetailDrawer } from './PipelineDetailDrawer';
import { QuickCreateModalLayout } from '@/components/ui/QuickCreateModalLayout';
import { AiCopilotWidget } from './enterprise/AiCopilotWidget';
import { PriorityActionQueue, ActionItem } from './enterprise/PriorityActionQueue';
import { TenantAvatarGroup, type TenantMember } from './TenantAvatarGroup';
import { GettingStartedWidget } from './GettingStartedWidget';
import { GuidedTour } from '@/components/ui/GuidedTour';
import { ElysianWorkflowDrawer } from './ElysianWorkflowDrawer';
import { GlassCard } from '@/components/ui/GlassCard';

// Bento-Grid Layout Components
import ReadOnlyWorkflowCanvas from './ReadOnlyWorkflowCanvas';
import LiveAlertsList from './LiveAlertsList';
import PerformanceMiniChart from './PerformanceMiniChart';
import MetricStatCard from './MetricStatCard';

// New "Expansion" Components
import { CostForecaster } from './enterprise/CostForecaster';
import { LatencyMonitor } from './enterprise/LatencyMonitor';
import { AuditLogWidget } from './enterprise/AuditLogWidget';
import { RegionalHeatmap } from './enterprise/RegionalHeatmap';
import type { CostMetric, LatencyMetric, AuditLog } from '@/types/api-responses';

const dashboardTourSteps = [
    {
        targetSelector: '.tour-getting-started',
        title: 'Checklist Langkah Awal',
        content: 'Selamat datang di Elysian Rebirth! Selesaikan checklist interaktif ini untuk memandu Anda menguji fitur-fitur platform seperti mengunggah regulasi, memuat draf contoh, dan menjalankan AI Swarm.',
        position: 'left' as const
    },
    {
        targetSelector: '.tour-swarm-canvas',
        title: 'Active Swarm Orchestration',
        content: 'Pantau secara real-time bagaimana agen AI berkolaborasi mengeksekusi pipeline audit Anda secara otonom.',
        position: 'bottom' as const
    },
    {
        targetSelector: '.tour-metrics',
        title: 'Metrik Pengawasan Real-time',
        content: 'Lihat ringkasan dokumen yang diaudit, tingkat kepatuhan, agen aktif, dan estimasi kebocoran biaya yang berhasil dicegah.',
        position: 'bottom' as const
    },
    {
        targetSelector: '.tour-token',
        title: 'Token Consumption',
        content: 'Pantau penggunaan token AI per hari lengkap dengan proyeksi ke depan untuk manajemen budget yang efektif.',
        position: 'right' as const
    },
    {
        targetSelector: '.tour-financial',
        title: 'Financial Intelligence',
        content: 'Estimasi penggunaan biaya infrastruktur AI (Spend Forecast) dibandingkan dengan jumlah anggaran markup yang diselamatkan (Budget Savings).',
        position: 'right' as const
    },
    {
        targetSelector: '.tour-mlops',
        title: 'MLOps Performance',
        content: 'Pantau end-to-end latency dan performa P99 dari engine Elysian untuk memastikan SLA operasional tetap optimal.',
        position: 'right' as const
    },
    {
        targetSelector: '.tour-heatmap',
        title: 'Peta Regional Anomali',
        content: 'Peta interaktif ini memperlihatkan daerah mana saja di Indonesia dengan tingkat markup anggaran tertinggi.',
        position: 'top' as const
    }
];



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
    const tenantId = currentTenant?.id || '';

    // Find the active workflow or default to the first one in the list to load its graph
    const activeWorkflow = pipelines?.find(p => p.status === 'active' || p.status === 'processing' || (p.status as string) === 'published' || p.status === 'completed') ?? pipelines?.[0];
    const activeWorkflowId = activeWorkflow?.id ?? null;

    const { data: activeWorkflowDetail } = useQuery({
        queryKey: workflowKeys.detail(tenantId, activeWorkflowId!),
        queryFn: () => fetchWorkflowById(activeWorkflowId!),
        enabled: !!activeWorkflowId && !!tenantId,
        staleTime: 0,
        refetchInterval: 2000, // Poll every 2s for real-time dashboard sync
    });
    const { data: auditLogsData, isLoading: auditLogsLoading } = useAuditLogs();
    const { data: priorityQueueData, isLoading: priorityQueueLoading } = usePriorityQueue();
    const { data: tenantMembers, isLoading: membersLoading } = useTenantMembers();
    const createPipelineMutation = useCreateWorkflow();
    const saveWorkflowMutation = useSaveWorkflow();

    const handleNodeDragStop = useCallback((event: any, node: any, currentNodes: any[]) => {
        if (!activeWorkflowId) return;
        saveWorkflowMutation.mutate({
            id: activeWorkflowId,
            nodes: currentNodes,
            edges: activeWorkflowDetail?.graph?.edges ?? activeWorkflowDetail?.edges ?? [],
            expectedVersion: activeWorkflowDetail?.version ?? '',
        });
    }, [activeWorkflowId, activeWorkflowDetail, saveWorkflowMutation]);

    // ── UI States ─────────────────────────────────────────
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const [pipelineName, setPipelineName] = useState('');
    const [pipelineTemplate, setPipelineTemplate] = useState('blank');
    const [createSuccess, setCreateSuccess] = useState(false);
    const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isWorkflowDrawerOpen, setIsWorkflowDrawerOpen] = useState(false);

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
                        // Pass the pipeline ID so WorkflowBuilder loads the correct graph
                        router.push(`/workflow?id=${created.id}`);
                    }, 1200);
                }
            }
        );
    }, [pipelineName, createPipelineMutation, router]);

    // ── Export handler ────────────────────────────────────
    const handleExport = useCallback(() => {
        const rows: string[][] = [
            ['Metric', 'Value', 'Date Range'],
            [t.dashboard.documents, String(stats?.docs ?? 0), dateRange.label],
            [t.dashboard.apiCalls, String(stats?.apiCalls ?? 0), dateRange.label],
            [t.dashboard.activePipelines, String(stats?.activePipelines ?? 0), dateRange.label],
            ['Health Score', String(stats?.health_score ?? 0), dateRange.label],
            [],
            ['Pipeline', 'Status', 'Last Updated'],
            ...(pipelines ?? []).map(p => [p.name, p.status, p.lastUpdated ? format(new Date(p.lastUpdated), 'yyyy-MM-dd HH:mm') : 'N/A']),
        ];
        downloadCSV(`elysian-dashboard-${format(new Date(), 'yyyy-MM-dd')}.csv`, rows);
    }, [stats, pipelines, dateRange, t]);

    // ── Transform Data ────────────────────────────────────
    const usageCosts = (chartData && 'usage_costs' in chartData && Array.isArray(chartData.usage_costs)) ? chartData.usage_costs : [];
    const latencyList = (chartData && 'latency' in chartData && Array.isArray(chartData.latency)) ? chartData.latency : [];
    const savingsList = (chartData && 'budget_savings' in chartData && Array.isArray(chartData.budget_savings)) ? chartData.budget_savings : [];

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

    const savingsChartData = savingsList.map(d => ({
        date: d.date,
        savings: d.savings,
    }));

    const totalSavings = stats?.total_savings ?? 0;

    const latencyData: LatencyMetric[] = latencyList.map(d => ({
        timestamp: d.date,
        p95: d.p95 ?? d.latency ?? 0,
        p99: d.p99 ?? (d.latency ? d.latency * 1.3 : 0),
        errors: Number(d.errors ?? 0)
    }));

    const auditLogs = auditLogsData || [];

    const priorityItems: ActionItem[] = (priorityQueueData ?? []).map(item => {
        let displayTime = '';
        try {
            if (item.timestamp) {
                const date = new Date(item.timestamp);
                if (!isNaN(date.getTime())) {
                    displayTime = format(date, 'yyyy-MM-dd HH:mm');
                } else {
                    displayTime = String(item.timestamp);
                }
            }
        } catch {
            displayTime = String(item.timestamp || '');
        }
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            priority: item.priority,
            timestamp: displayTime,
            type: item.type,
        };
    });

    // ── Map tenant members to TenantMember format ─────────
    const tenantMemberList: TenantMember[] = (tenantMembers ?? []).map(m => ({
        id: m.id,
        name: m.name,
        avatarUrl: m.avatar,
        role: (m.role === 'admin' ? 'admin' : m.role === 'viewer' ? 'viewer' : 'member') as TenantMember['role'],
    }));

    return (
        <>
            {/* Ambient Background Elements (Fixed) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-30 dark:hidden mix-blend-overlay fixed" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8 relative z-10">
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
                        className="tour-quick-create flex-1 sm:flex-none justify-center flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-500/30 hover:shadow-blue-500/40"
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

            {/* Bento-Grid Enterprise Dashboard Layout */}
            <div className="space-y-6">
                {/* SECTION ATAS: OPERASI LIVE (GRID 3 KOLOM DESKTOP, STACK MOBILE) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* CARD UTAMA: ACTIVE SWARM ORCHESTRATION (SPAN 2 KOLOM) */}
                    <GlassCard className="tour-swarm-canvas lg:col-span-2 h-[350px] md:h-[450px] p-5 flex flex-col justify-between relative overflow-hidden group bg-white/60 dark:bg-[#0B1120]/60 border border-slate-200/60 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:backdrop-blur-xl">
                        {/* Light Mode Cloud Accent */}
                        <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.10] dark:hidden pointer-events-none mix-blend-multiply" />
                        
                        <div className="relative z-10 flex justify-between items-center mb-3 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Swarm Orchestration</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Live visualization of autonomous multi-agent audit sequences.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {activeWorkflowId && (
                                    <button 
                                        onClick={() => router.push(`/workflow?id=${activeWorkflowId}`)}
                                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all border border-blue-200 dark:border-blue-500/20 active:scale-95"
                                        title="Open in Workflow Builder"
                                    >
                                        Open Builder <ExternalLink className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <span className="flex h-2.5 w-2.5 relative" title="Live Engine Sync: Connected">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                            </div>
                        </div>
                        
                        {/* Wrapper with absolute dimensions for ReactFlow */}
                        <div className="flex-1 w-full rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-[#09090b]/50 overflow-hidden relative">
                            <ReadOnlyWorkflowCanvas 
                                nodes={activeWorkflowDetail?.graph?.nodes ?? activeWorkflowDetail?.nodes ?? undefined}
                                edges={activeWorkflowDetail?.graph?.edges ?? activeWorkflowDetail?.edges ?? undefined}
                                onNodeDragStop={handleNodeDragStop}
                            />
                        </div>
                    </GlassCard>

                    {/* SIDEBAR SEBELAH KANAN (2 CARDS STACKED) */}
                    <div className="flex flex-col gap-6 lg:h-[450px]">
                        {/* Card Kanan 1: Real-time Compliance Alerts */}
                        <GlassCard className="flex-1 p-5 overflow-hidden flex flex-col relative bg-white/60 dark:bg-[#0B1120]/60 border border-slate-200/60 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:backdrop-blur-xl">
                            {/* Light Mode Cloud Accent */}
                            <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.15] dark:hidden pointer-events-none mix-blend-multiply" />
                            
                            <h3 className="relative z-10 text-sm font-semibold mb-3 text-red-800 dark:text-red-400 flex items-center gap-2 shrink-0">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Real-time Compliance Alerts
                            </h3>
                            <div className="flex-1 overflow-hidden">
                                <LiveAlertsList alerts={priorityItems} />
                            </div>
                        </GlassCard>

                        {/* Card Kanan 2: Performance latency chart */}
                        <GlassCard className="flex-1 p-5 flex flex-col justify-between relative overflow-hidden bg-white/60 dark:bg-[#0B1120]/60 border border-slate-200/60 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:backdrop-blur-xl">
                            {/* Light Mode Cloud Accent */}
                            <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.15] dark:hidden pointer-events-none mix-blend-multiply" />
                            
                            <div className="relative z-10 shrink-0 mb-2">
                                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Engine Efficiency</h3>
                                <p className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {latencyData.length > 0 ? `${latencyData[latencyData.length - 1].p99.toFixed(1)} ms` : "—"}
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal ml-1">avg latency</span>
                                </p>
                            </div>
                            <div className="h-28 w-full flex items-center justify-center">
                                {latencyData.length > 0 ? (
                                    <PerformanceMiniChart data={latencyData.map(d => ({ date: d.timestamp, latency: d.p95 }))} />
                                ) : (
                                    <span className="text-xs text-slate-500">Belum ada aktivitas engine</span>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* SECTION TENGAH: METRIC STAT CARDS (GRID 4 KOLOM DESKTOP, grid-cols-2 TABLET, grid-cols-1 MOBILE) */}
                <div className="tour-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricStatCard
                        title="Total Simpanan"
                        value={statsLoading ? "..." : (stats?.docs ? `Rp ${(stats.docs * 150000).toLocaleString()}` : "Rp 0")}
                        change={stats?.docs ? "+12% bulan ini" : "Belum ada simpanan"}
                        type="docs"
                    />
                    <MetricStatCard
                        title="Pinjaman Aktif"
                        value={statsLoading ? "..." : (stats?.docs ? `${stats?.health_score ?? 0} Pinjaman` : "-")}
                        change={stats?.docs ? "Status lancar" : "Menunggu pengajuan"}
                        type="compliance"
                    />
                    <MetricStatCard
                        title="Aktivitas Anggota"
                        value={statsLoading ? "..." : `${stats?.activePipelines ?? 0} Transaksi`}
                        change={stats?.activePipelines ? "Diproses real-time" : "Sistem idle"}
                        type="workers"
                    />
                    <MetricStatCard
                        title="Estimasi SHU Anda"
                        value={statsLoading ? "..." : (stats?.total_savings ? `Rp ${stats.total_savings.toLocaleString()}` : "Rp 0")}
                        change={stats?.total_savings ? "Dibagikan akhir tahun" : "Belum ada SHU"}
                        type="savings"
                    />
                </div>

                {/* SECTION BAWAH: DETAILED TELEMETRY & SIDEBAR (GRID 12 KOLOM) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8 border-t border-white/5 pt-8 mt-8">
                    
                    {/* LEFT COLUMN: CHARTS & LOGS (Span 8 cols on desktop) */}
                    <div className="flex min-w-0 flex-col space-y-6 lg:col-span-7 xl:col-span-8">
                        {/* Token Consumption */}
                        <div className="tour-token w-full min-w-0">
                            <TokenUsageChartCard data={chartPoints} isLoading={chartLoading} />
                        </div>

                        {/* System Health */}
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

                        {/* Spend Forecast (Financial Intelligence) */}
                        <div className="tour-financial w-full min-w-0">
                            <CostForecaster 
                                data={costData} 
                                savingsData={savingsChartData} 
                                totalSavings={totalSavings} 
                                isLoading={statsLoading || chartLoading} 
                            />
                        </div>

                        {/* Regional Hotspots */}
                        <div id="regional-heatmap" className="tour-heatmap w-full min-w-0">
                            <RegionalHeatmap 
                                data={(stats?.regional_heatmap ?? []).filter(
                                    (r: any) => r.flagged_count > 0 && r.total_markup > 0
                                )} 
                                isLoading={statsLoading} 
                            />
                        </div>

                        {/* MLOps Latency Monitor */}
                        <div className="tour-mlops w-full min-w-0">
                            <LatencyMonitor data={latencyData} isLoading={statsLoading} />
                        </div>

                        {/* Pipeline Activity List */}
                        <div className="w-full min-w-0">
                            <ActivePipelinesList
                                onPipelineClick={(id) => {
                                    setSelectedPipelineId(id);
                                    setIsDrawerOpen(true);
                                }}
                            />
                        </div>

                        {/* Security Audit logs */}
                        <div className="w-full min-w-0">
                            <AuditLogWidget logs={auditLogs} isLoading={statsLoading || auditLogsLoading} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: COPILOT & CHECKS (Span 4 cols on desktop) */}
                    <div className="flex w-full flex-col space-y-6 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-2rem)] lg:overflow-y-auto lg:no-scrollbar pb-6">
                        {/* langkah awal checklist */}
                        <div className="shrink-0">
                            <GettingStartedWidget onOpenWorkflow={() => setIsWorkflowDrawerOpen(true)} />
                        </div>

                        {/* Elysian Copilot Widget */}
                        <div className="shrink-0">
                            <AiCopilotWidget activeAlertsCount={priorityItems.length} />
                        </div>

                        {/* Priority Action Queue */}
                        <div className="shrink-0">
                            <PriorityActionQueue actions={priorityItems} isLoading={priorityQueueLoading || activitiesLoading} />
                        </div>
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

            {/* Guided Tour Engine */}
            <GuidedTour steps={dashboardTourSteps} tourKey="dashboard_tour" />

            {/* Elysian Workflow Guide Drawer */}
            <ElysianWorkflowDrawer
                isOpen={isWorkflowDrawerOpen}
                onClose={() => setIsWorkflowDrawerOpen(false)}
            />
        </div>
        </>
    );
}

// Re-export as a Server Component compatible export 
// (though it's 'use client', it's safe to be rendered by Page)
