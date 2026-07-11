'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, CheckCircle, Loader2, XCircle, MoreHorizontal, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PipelineRow {
    id: string;
    name: string;
    type?: string;
    status: 'active' | 'draft' | 'archived' | 'processing' | 'completed' | 'queued' | 'failed';
    lastRun?: string;
    duration?: string;
    progress?: number;
}

export interface PipelineTableProps {
    pipelines: PipelineRow[];
    isLoading: boolean;
}

const STATUS_TABS = [
    { key: 'all', label: 'All Projects' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'failed', label: 'Canceled' }, // Mapped to Canceled in UI
] as const;

const statusConfig: Record<string, { icon: typeof Clock; color: string; bgColor: string; label: string }> = {
    active: { icon: Loader2, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'In Progress' },
    processing: { icon: Loader2, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'In Progress' },
    completed: { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Completed' },
    failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Failed' },
    queued: { icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50', label: 'Queued' },
    draft: { icon: Clock, color: 'text-slate-500', bgColor: 'bg-slate-50', label: 'Draft' },
    archived: { icon: Clock, color: 'text-slate-400', bgColor: 'bg-slate-50', label: 'Archived' },
};

function getStatusDisplay(status: string) {
    return statusConfig[status] || statusConfig['draft'];
}

function formatTimeAgo(dateStr?: string): string {
    if (!dateStr) return 'Apr 1';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PipelineTable({ pipelines, isLoading }: PipelineTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('status') ?? 'all';

    // Count per-status for tab badges
    const counts: Record<string, number> = {};
    pipelines.forEach(p => {
        const s = p.status === 'failed' ? 'failed' : p.status;
        counts[s] = (counts[s] || 0) + 1;
    });

    const handleTabChange = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex items-center gap-6 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-24" />
                    ))}
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-8 min-h-[500px]">
            {/* Header + Search */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Manage Projects</h3>
                <button className="p-2 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
            </div>

            {/* Tabs (Text + Badge) */}
            <div className="flex items-center gap-8 mb-6 border-b border-transparent">
                {STATUS_TABS.map(tab => {
                    const count = tab.key === 'all'
                        ? pipelines.length
                        : counts[tab.key] || 0;
                    const isActive = activeTab === tab.key;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => handleTabChange(tab.key)}
                            className={cn(
                                'group flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative',
                                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            )}
                        >
                            {tab.label}
                            <span className={cn(
                                'flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] rounded-full transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200'
                            )}>
                                {count}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Scrollable Table Container */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-2">
                        <div className="col-span-4">Client</div>
                        <div className="col-span-3">Task</div>
                        <div className="col-span-2">Due on</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">More</div>
                    </div>

                    {/* Table Body */}
                    <div className="space-y-2">
                        {pipelines.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-sm text-slate-400">No pipelines found.</p>
                            </div>
                        ) : (
                            pipelines.map((pipeline) => {
                                const config = getStatusDisplay(pipeline.status);

                                return (
                                    <div
                                        key={pipeline.id}
                                        onClick={() => router.push(`/workflow?id=${pipeline.id}`)}
                                        className="grid grid-cols-12 items-center gap-4 px-4 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                    >
                                        {/* Client (Avatar + Name) */}
                                        <div className="col-span-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100 dark:border-blue-900 shrink-0">
                                                {pipeline.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                                                    {pipeline.name}
                                                </div>
                                                <div className="text-xs text-slate-400 truncate">@{pipeline.name.toLowerCase().replace(/\s/g, '.')}</div>
                                            </div>
                                        </div>

                                        {/* Task (Name + Type) */}
                                        <div className="col-span-3 min-w-0">
                                            <div className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate">
                                                {pipeline.type || 'RAG Pipeline'}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate">Automated workflow</div>
                                        </div>

                                        {/* Due Date */}
                                        <div className="col-span-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                {formatTimeAgo(pipeline.lastRun)}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <span className={cn(
                                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                                                config.color,
                                                config.bgColor
                                            )}>
                                                {config.icon && <config.icon className="w-3 h-3" />}
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Action */}
                                        <div className="col-span-1 text-right">
                                            <button className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
