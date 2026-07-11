'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Sparkles } from 'lucide-react';

export interface ChartDataPoint {
    day: string;
    tokens: number;
    projected?: number;
}

export interface AnalyticsChartProps {
    data: ChartDataPoint[];
    isLoading: boolean;
}

const DATE_RANGES = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'] as const;

export function AnalyticsChart({ data, isLoading }: AnalyticsChartProps) {
    const [dateRange, setDateRange] = useState<string>('Last 30 Days');

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8 h-full relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Token Usage Analytics</h3>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-6 mr-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Actual</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-200 dark:bg-blue-800" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Projected</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="text-sm font-semibold border-none bg-transparent text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors"
                        >
                            {DATE_RANGES.map(range => (
                                <option key={range} value={range}>{range}</option>
                            ))}
                        </select>
                        <button className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all">
                            <Download className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 relative">
                {/* Floating Insight Card */}
                <div className="absolute top-10 left-0 z-10 hidden xl:block">
                    <div className="w-[240px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-5 shadow-sm backdrop-blur-sm">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                Better context management can reduce token costs. Try summarizing older chats!
                            </p>
                        </div>
                        <button className="w-full text-center text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3 shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:scale-[1.02]">
                            Run Analysis
                        </button>
                    </div>
                </div>

                {/* Chart */}
                <div className="flex-1 min-w-0 h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={0}>
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="#f1f5f9"
                                strokeOpacity={0.6}
                            />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                fontSize={12}
                                fontWeight={500}
                                tick={{ fill: '#94a3b8' }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                fontSize={12}
                                fontWeight={500}
                                tick={{ fill: '#94a3b8' }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: 'none',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                                    padding: '12px',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                                itemStyle={{ color: '#475569' }}
                            />
                            <Bar
                                dataKey="tokens"
                                name="Actual"
                                fill="#3b82f6"
                                radius={[6, 6, 6, 6]}
                                barSize={12}
                            />
                            {data.some(d => d.projected !== undefined) && (
                                <Bar
                                    dataKey="projected"
                                    name="Projected"
                                    fill="#bfdbfe"
                                    radius={[6, 6, 6, 6]}
                                    barSize={12}
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
