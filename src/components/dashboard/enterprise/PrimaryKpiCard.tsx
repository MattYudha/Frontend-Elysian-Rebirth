import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface PrimaryKpiCardProps {
    label: string;
    value: string | number;
    delta?: number;
    deltaLabel?: string;
    icon?: React.ElementType;
    isLoading?: boolean;
    trendData?: number[];
}

export function PrimaryKpiCard({
    label,
    value,
    delta,
    deltaLabel = "vs last month",
    icon: Icon,
    isLoading,
    trendData
}: PrimaryKpiCardProps) {
    if (isLoading) {
        return <Skeleton className="h-[140px] w-full rounded-2xl" />;
    }

    const isPositive = delta && delta >= 0;
    const isNeutral = delta === 0;

    // Mock trend data for visual density
    const sparklineData = (trendData || [40, 30, 45, 50, 45, 60, 55, 70, 65, 80]).map((val, i) => ({ i, val }));

    return (
        <div className="relative overflow-hidden rounded-xl p-5 transition-all hover:shadow-md glass-obsidian">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                {Icon && <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />}
            </div>

            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {value}
                </h3>
            </div>

            <div className="mt-4 flex items-center justify-between">
                {/* Delta Badge */}
                {delta !== undefined && (
                    <div className={cn(
                        "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                        isPositive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                            isNeutral ? "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400" :
                                "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                    )}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> :
                            isNeutral ? <Minus className="h-3 w-3" /> :
                                <ArrowDownRight className="h-3 w-3" />}
                        <span>{Math.abs(delta)}%</span>
                        <span className="ml-1 opacity-60 hidden sm:inline">{deltaLabel}</span>
                    </div>
                )}

                {/* Micro Sparkline */}
                <div className="h-8 w-16 sm:w-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="val"
                                stroke={isPositive ? '#10b981' : isNeutral ? '#94a3b8' : '#e11d48'}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
