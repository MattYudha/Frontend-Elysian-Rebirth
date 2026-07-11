'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Search, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Types
export interface PipelineRow {
    id: string;
    name: string;
    type?: string;
    status: 'active' | 'draft' | 'archived' | 'processing' | 'completed' | 'queued' | 'failed';
    lastRun?: string;
}

interface MasterPipelineTableProps {
    pipelines: PipelineRow[];
    isLoading?: boolean;
    activeTab?: string;
}

const TABS = [
    { id: 'all', label: 'All Pipelines' },
    { id: 'active', label: 'Running' },
    { id: 'completed', label: 'Completed' },
    { id: 'failed', label: 'Failed' }
];

export function MasterPipelineTable({ pipelines, isLoading, activeTab = 'all' }: MasterPipelineTableProps) {
    const router = useRouter();

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(window.location.search);
        if (tabId === 'all') params.delete('status');
        else params.set('status', tabId);
        router.push(`?${params.toString()}`);
    };

    if (isLoading) return <Skeleton className="h-[400px] w-full rounded-2xl" />;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Table Header / Toolbar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">

                {/* Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={cn(
                                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                                activeTab === tab.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-48 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                </div>
            </div>

            {/* Table Content - MUST be wrapped in overflow-x-auto with min-w constraint */}
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Pipeline Name</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                    Last Run <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pipelines.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No pipelines found for this filter.
                                </td>
                            </tr>
                        ) : pipelines.map((p) => (
                            <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                            {p.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                                {p.name}
                                            </div>
                                            <div className="text-xs text-slate-500">ID: {p.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">
                                    {p.type || 'RAG Workflow'}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                                    {p.lastRun ? new Date(p.lastRun).toLocaleDateString() : 'Never'}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={p.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        failed: 'bg-rose-50 text-rose-700 ring-rose-600/20',
        processing: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        draft: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style = (styles as any)[status] || styles.draft;

    return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset", style)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
