'use client';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';

export interface MetricCardProps {
    label: string;
    value: string | number;
    previousValue?: string | number;
    delta?: number;          // e.g. +4, -8
    deltaPercent?: number;   // e.g. -8 (%)
    isLoading?: boolean;
}

export function MetricCard({ label, value, previousValue, delta, deltaPercent, isLoading }: MetricCardProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4 h-full">
                <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-4 w-32" />
            </div>
        );
    }

    const isPositive = (delta ?? 0) >= 0;
    const hasDelta = delta !== undefined && delta !== null;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full flex flex-col justify-between">
            {/* Header row: label + delta badge */}
            <div className="flex items-start justify-between mb-2">
                <span className="text-base font-bold text-slate-700 dark:text-slate-200">{label}</span>
                {hasDelta && (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full",
                            isPositive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                    >
                        {isPositive ? '+' : ''}{delta}
                    </span>
                )}
            </div>

            {/* Big number */}
            <div className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
            </div>

            {/* Subtitle */}
            {previousValue !== undefined && (
                <p className="text-xs font-medium text-slate-400">
                    Compare <span className="text-slate-500 dark:text-slate-300">{typeof previousValue === 'number' ? previousValue.toLocaleString() : previousValue}</span> (last month)
                </p>
            )}
        </div>
    );
}
