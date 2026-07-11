'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Inbox } from 'lucide-react';

export interface ActionItem {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timestamp: string;
    type: 'pipeline' | 'system' | 'billing';
}

interface PriorityActionQueueProps {
    actions?: ActionItem[];
    isLoading?: boolean;
}

export function PriorityActionQueue({ actions = [], isLoading }: PriorityActionQueueProps) {
    if (isLoading) {
        return <Skeleton className="h-64 w-full rounded-2xl" />;
    }

    const isEmpty = !actions || actions.length === 0;

    return (
        <div className="relative overflow-hidden rounded-2xl p-5 glass-obsidian">
            {/* Light Mode Cloud Accent */}
            <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.15] dark:hidden pointer-events-none mix-blend-multiply" />
            
            <div className="relative z-10 mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">Priority Queue</h3>
                {!isEmpty && (
                    <span className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {actions.length} Active
                    </span>
                )}
                {isEmpty && (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> All clear
                    </span>
                )}
            </div>

            {isEmpty ? (
                <div className="relative z-10 flex flex-col items-center justify-center py-8 gap-3">
                    <div className="relative flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Inbox className="h-5 w-5 text-emerald-400" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Active Alerts</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[170px] leading-relaxed">
                            Your workspace is healthy. Critical events will show up here.
                        </p>
                    </div>
                    {/* Ghost rows */}
                    <div className="w-full space-y-2 mt-1">
                        {[70, 55, 80].map((w, i) => (
                            <div key={i} className="flex items-center gap-2.5 opacity-30">
                                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                <div className="flex-1 space-y-1">
                                    <div className="h-2 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${w}%` }} />
                                    <div className="h-1.5 w-2/5 rounded bg-slate-100 dark:bg-slate-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative z-10 space-y-4">
                    {actions.map((item) => (
                        <div key={item.id} className="group flex gap-3">
                            <div className={cn(
                                "mt-1 flex h-2 w-2 shrink-0 rounded-full ring-2 ring-offset-2",
                                item.priority === 'high' ? "bg-rose-500 ring-rose-100" :
                                    item.priority === 'medium' ? "bg-amber-500 ring-amber-100" :
                                        "bg-blue-500 ring-blue-100"
                            )} />

                            <div className="min-w-0 flex-1 border-b border-slate-100 dark:border-slate-800/50 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="truncate text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.timestamp}</span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="relative z-10 mt-4 w-full text-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                View all activity
            </button>
        </div>
    );
}
