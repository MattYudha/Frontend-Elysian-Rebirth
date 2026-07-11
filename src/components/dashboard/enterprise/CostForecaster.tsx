'use client';

import { useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, AreaChart, Area } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, ArrowUpRight, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';
import type { CostMetric } from '@/types/api-responses';

interface CostForecasterProps {
    data: CostMetric[];
    savingsData?: Array<{ date: string; savings: number }>;
    totalSavings?: number;
    isLoading?: boolean;
}

export function CostForecaster({ data, savingsData = [], totalSavings = 0, isLoading }: CostForecasterProps) {
    const [activeTab, setActiveTab] = useState<'spend' | 'savings'>('spend');

    if (isLoading) {
        return <Skeleton className="h-[320px] w-full rounded-2xl" />;
    }

    const isEmpty = !data || data.length === 0 || data.every(d => d.amount === 0);
    const isSavingsEmpty = !savingsData || savingsData.length === 0 || savingsData.every(s => s.savings === 0);

    const currentSpend = isEmpty ? 0 : data.reduce((acc, curr) => acc + curr.amount, 0);
    const budgetLimit = data[0]?.budget || 5000;
    const projected = isEmpty ? 0 : (data[data.length - 1]?.projected || 0);
    const isOverBudget = projected > budgetLimit;

    return (
        <div className="relative overflow-hidden rounded-2xl p-6 glass-obsidian">
            {/* Light Mode Cloud Accent */}
            <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.10] dark:hidden pointer-events-none mix-blend-multiply" />
            
            <div className="relative z-10 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Financial Intelligence</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Real-time spend forecast vs potential budget savings</p>

                    <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {activeTab === 'spend' ? (
                            <>
                                {!isEmpty && (
                                    <>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Spend</p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">${currentSpend.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Projected (EOM)</p>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-2xl font-bold ${isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-50'}`}>
                                                    ${projected.toFixed(2)}
                                                </p>
                                                {isOverBudget && (
                                                    <span className="flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full">
                                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                                        Over Budget
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Budget Saved</p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    Rp {totalSavings.toLocaleString('id-ID')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Tab Switcher */}
                    <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200/10">
                        <button
                            onClick={() => setActiveTab('spend')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                activeTab === 'spend'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Spend Forecast
                        </button>
                        <button
                            onClick={() => setActiveTab('savings')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                activeTab === 'savings'
                                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            Budget Savings
                        </button>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {activeTab === 'spend' ? (
                isEmpty ? (
                    <div className="relative z-10 flex flex-col items-center justify-center h-[240px] gap-4">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-20 w-20 rounded-full bg-emerald-500/8 animate-ping" style={{ animationDuration: '3s' }} />
                            <div className="absolute h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
                            <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-emerald-500/30">
                                <DollarSign className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Spend Data Yet</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                                Billing data will appear once your pipelines start processing token requests
                            </p>
                        </div>

                        <div className="w-full max-w-[280px] rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-3.5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Monthly Budget</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">${budgetLimit.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div className="h-full w-0 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-700" />
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">$0.00 spent of ${budgetLimit.toLocaleString()} budget</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeOpacity={0.05} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    tickFormatter={(value) => `$${value}`}
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
                                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                                />
                                <Bar
                                    dataKey="amount"
                                    name="Daily Spend"
                                    fill="url(#colorSpend)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={32}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="projected"
                                    name="Projected"
                                    stroke="#fbbf24"
                                    strokeWidth={3}
                                    dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <ReferenceLine y={budgetLimit} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Budget Limit', fill: '#ef4444', fontSize: 10 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )
            ) : (
                isSavingsEmpty ? (
                    <div className="relative z-10 flex flex-col items-center justify-center h-[240px] gap-4">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-20 w-20 rounded-full bg-emerald-500/8 animate-ping" style={{ animationDuration: '3s' }} />
                            <div className="absolute h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
                            <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Budget Saved Yet</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                                Savings metrics will be calculated once budget anomalies are flagged by the Swarm review
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={savingsData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <defs>
                                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeOpacity={0.05} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`}
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
                                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Saved']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="savings"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorSavings)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )
            )}
        </div>
    );
}
