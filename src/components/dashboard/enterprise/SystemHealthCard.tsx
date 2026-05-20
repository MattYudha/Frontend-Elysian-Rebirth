'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertTriangle, Activity, Rocket, ArrowRight } from 'lucide-react';

interface SystemHealthCardProps {
    score?: number | null;   // null = no pipeline data → show empty state
    hasPipelineData?: boolean;
    pipelineTotal?: number;
    pipelineFailed?: number;
    latencyP95?: number;
    systems?: {
        api_gateway?: string;
        vector_db?: string;
        latency?: string;
    };
    isLoading?: boolean;
}

const StatusIcon = ({ status }: { status?: string }) =>
    status === 'operational'
        ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
        : <AlertTriangle className="h-3.5 w-3.5 text-amber-500 animate-pulse" />;

function scoreColor(score: number) {
    if (score >= 90) return { bar: '#10b981', text: 'text-emerald-500', label: 'Excellent', badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' };
    if (score >= 75) return { bar: '#3b82f6', text: 'text-blue-500',    label: 'Good',      badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' };
    if (score >= 50) return { bar: '#f59e0b', text: 'text-amber-500',   label: 'Degraded',  badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' };
    return             { bar: '#ef4444', text: 'text-rose-500',    label: 'Critical',  badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' };
}

export function SystemHealthCard({
    score,
    hasPipelineData = false,
    pipelineTotal = 0,
    pipelineFailed = 0,
    latencyP95 = 0,
    systems = { api_gateway: 'operational', vector_db: 'operational', latency: 'operational' },
    isLoading,
}: SystemHealthCardProps) {
    if (isLoading) {
        return <Skeleton className="h-[300px] w-full rounded-2xl" />;
    }

    const isEmpty = !hasPipelineData || score == null;
    const safeScore = isEmpty ? 0 : score!;
    const colors = scoreColor(safeScore);
    const successRate = pipelineTotal > 0 ? Math.round(((pipelineTotal - pipelineFailed) / pipelineTotal) * 100) : 0;

    return (
        <div className="h-full flex flex-col justify-between rounded-2xl p-5 glass-obsidian">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">System Health</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isEmpty ? 'Awaiting pipeline data' : 'Computed from last 30 days'}
                    </p>
                </div>
                {!isEmpty && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {colors.label}
                    </span>
                )}
            </div>

            {/* ── Empty State ── */}
            {isEmpty ? (
                <div className="flex flex-col items-center justify-center flex-1 py-6 gap-4">
                    {/* Animated rings */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute h-20 w-20 rounded-full border-2 border-dashed border-blue-300/30 dark:border-blue-700/30 animate-spin" style={{ animationDuration: '8s' }} />
                        <div className="absolute h-14 w-14 rounded-full border border-blue-400/20 dark:border-blue-600/20" />
                        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-slate-500/10 flex items-center justify-center border border-blue-500/20">
                            <Activity className="h-5 w-5 text-blue-400" />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Data Yet</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[180px] leading-relaxed">
                            Health score is computed dynamically once your first pipeline runs
                        </p>
                    </div>

                    {/* Formula preview */}
                    <div className="w-full space-y-2 px-1">
                        {[
                            { label: 'Success Rate', weight: '50 pts', color: 'bg-emerald-400' },
                            { label: 'Error Rate',   weight: '30 pts', color: 'bg-amber-400' },
                            { label: 'P95 Latency',  weight: '20 pts', color: 'bg-blue-400' },
                        ].map(({ label, weight, color }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${color} shrink-0`} />
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex-1">{label}</span>
                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{weight}</span>
                            </div>
                        ))}
                    </div>

                    <a
                        href="/workflow"
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                    >
                        <Rocket className="h-3 w-3" /> Run a pipeline <ArrowRight className="h-3 w-3" />
                    </a>
                </div>
            ) : (
                /* ── Live Score ── */
                <>
                    {/* Radial Chart */}
                    <div className="relative flex-1 min-h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={14}
                                data={[{ name: 'Health', value: safeScore, fill: colors.bar }]}
                                startAngle={180}
                                endAngle={0}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar background dataKey="value" cornerRadius={30} fill={colors.bar} />
                            </RadialBarChart>
                        </ResponsiveContainer>

                        {/* Center text */}
                        <div className="absolute inset-0 top-6 flex flex-col items-center justify-center pointer-events-none">
                            <span className={`text-4xl font-bold ${colors.text}`}>{safeScore}%</span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Health Score</span>
                        </div>
                    </div>

                    {/* Breakdown pills */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="flex flex-col items-center rounded-lg bg-slate-50/70 dark:bg-slate-800/40 p-2 border border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{successRate}%</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Success</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-slate-50/70 dark:bg-slate-800/40 p-2 border border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{pipelineFailed}</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Errors</span>
                        </div>
                        <div className="flex flex-col items-center rounded-lg bg-slate-50/70 dark:bg-slate-800/40 p-2 border border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                {latencyP95 > 0 ? `${Math.round(latencyP95)}ms` : '—'}
                            </span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">P95</span>
                        </div>
                    </div>

                    {/* System status row */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-3">
                        {[
                            { key: 'api_gateway', label: 'API Gateway' },
                            { key: 'vector_db',   label: 'Vector DB' },
                            { key: 'latency',     label: 'Latency' },
                        ].map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <StatusIcon status={systems[key as keyof typeof systems]} />
                                <span className="text-[10px] text-slate-600 dark:text-slate-300">{label}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
