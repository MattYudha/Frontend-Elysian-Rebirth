'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, AlertCircle, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import type { LatencyMetric } from '@/types/api-responses';

interface LatencyMonitorProps {
    data: LatencyMetric[];
    isLoading?: boolean;
}

export function LatencyMonitor({ data, isLoading }: LatencyMonitorProps) {
    if (isLoading) {
        return <Skeleton className="h-[320px] w-full rounded-2xl" />;
    }

    const isEmpty = !data || data.length === 0 || data.every(d => d.p95 === 0 && d.p99 === 0);

    const currentP95 = isEmpty ? 0 : (data[data.length - 1]?.p95 || 0);
    const currentP99 = isEmpty ? 0 : (data[data.length - 1]?.p99 || 0);
    const status = isEmpty ? 'idle' : currentP95 < 200 ? 'healthy' : currentP95 < 500 ? 'degraded' : 'critical';

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 glass-obsidian">
            {/* Light Mode Cloud Accent */}
            <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.10] dark:hidden pointer-events-none mix-blend-multiply" />
            
            <div className="relative z-10 mb-6 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">MLOps Performance</h3>
                        {status === 'healthy' && (
                            <span className="flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <CheckCircle className="mr-1 h-3 w-3" /> Healthy
                            </span>
                        )}
                        {status === 'degraded' && (
                            <span className="flex items-center rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                                <AlertCircle className="mr-1 h-3 w-3" /> Degraded
                            </span>
                        )}
                        {status === 'idle' && (
                            <span className="flex items-center rounded-full bg-slate-100 dark:bg-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                <Activity className="mr-1 h-3 w-3" /> Idle
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">End-to-end inference latency (ms)</p>

                    {!isEmpty && (
                        <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">p95 Latency</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{currentP95.toFixed(0)}ms</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">p99 Latency</p>
                                <p className="text-2xl font-bold text-slate-500 dark:text-slate-400">{currentP99.toFixed(0)}ms</p>
                            </div>
                        </div>
                    )}
                </div>

                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {isEmpty ? (
                <div className="relative z-10 flex flex-col items-center justify-center h-[240px] gap-4">
                    {/* Animated radar/pulse icon */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute h-20 w-20 rounded-full border border-violet-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="absolute h-14 w-14 rounded-full border border-violet-500/30" />
                        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center border border-violet-500/30">
                            <Activity className="h-5 w-5 text-violet-400" />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Awaiting First Execution</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                            Latency telemetry will appear as soon as your first AI pipeline runs
                        </p>
                    </div>

                    {/* Stat placeholders */}
                    <div className="flex items-center gap-3">
                        {[
                            { label: 'P95 Latency', color: 'from-violet-500/20 to-violet-500/5', border: 'border-violet-500/20', text: 'text-violet-400' },
                            { label: 'P99 Latency', color: 'from-slate-500/10 to-slate-500/5', border: 'border-slate-500/20', text: 'text-slate-400' },
                        ].map(({ label, color, border, text }) => (
                            <div key={label} className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl bg-gradient-to-b ${color} border ${border}`}>
                                <span className={`text-lg font-bold ${text}`}>—ms</span>
                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">{label}</span>
                            </div>
                        ))}
                    </div>

                    <a href="/workflow" className="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline transition-colors">
                        Go to Workflow Builder <ArrowRight className="h-3 w-3" />
                    </a>
                </div>
            ) : (
                <div className="relative z-10 h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid vertical={false} strokeOpacity={0.05} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickFormatter={(value) => `${value}ms`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    color: 'var(--foreground)',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ fontSize: '12px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Line
                                type="monotone"
                                dataKey="p95"
                                name="p95 (Typical)"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="p99"
                                name="p99 (Outliers)"
                                stroke="#cbd5e1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
