'use client';

import { Activity, Clock, Zap, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { MetaChipsRow } from '@/components/workstreams/MetaChipsRow';

import { PipelineBoard } from '@/components/workstreams/PipelineBoard';
import { TimelineGantt } from '@/components/workstreams/TimelineGantt';
import { useActiveWorkstreams } from '@/hooks/useWorkstreams';

export default function ActiveWorkstreamsPage() {
    const { data: workstreams, isLoading, isError } = useActiveWorkstreams();

    // Dynamic metrics dynamically memoized to prevent breaking MetaChipsRow rendering
    // FIX: Do not put raw React Elements (JSX) inside useMemo that depends on dynamic data
    // FIX: Moved useMemo above early returns to comply with React Hooks rules
    const globalMetricsData = useMemo(() => {
        if (!workstreams) return [];
        return [
            {
                label: 'Active Pipelines',
                value: workstreams.raw.length.toString(),
                iconId: 'activity',
                trend: { text: '+3 vs yesterday', direction: 'up' as const }
            },
            {
                label: 'Tokens Used (Last 24h)',
                value: `${(workstreams.boardData.reduce((acc, t) => acc + t.tokensUsed, 0) / 1000).toFixed(1)}k`,
                iconId: 'zap',
                trend: { text: '-12% usage', direction: 'up' as const }
            },
            {
                label: 'Avg Execution Time',
                value: '18s',
                iconId: 'clock',
                trend: { text: '+2s latency', direction: 'down' as const }
            }
        ];
    }, [workstreams]);

    // Map icon keys to actual React Elements outside the memoized data block
    const globalMetrics = globalMetricsData.map(item => ({
        ...item,
        icon: item.iconId === 'activity' ? <Activity className="h-3.5 w-3.5 text-indigo-500" /> :
            item.iconId === 'zap' ? <Zap className="h-3.5 w-3.5 text-amber-500" /> :
                <Clock className="h-3.5 w-3.5 text-blue-500" />
    }));

    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-sm text-slate-500">Initializing Core AI Engine...</p>
            </div>
        );
    }

    if (isError || !workstreams) {
        return (
            <div className="w-full h-[60vh] flex flex-col items-center justify-center">
                <p className="text-sm text-red-500">Failed to load active pipelines. Please check workflow service.</p>
            </div>
        );
    }

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Active Workstreams</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Monitor currently running AI agent pipelines across all tenants.
                    </p>
                </div>

                {/* Global Metrics Row using Glassmorphism */}
                <MetaChipsRow items={globalMetrics} />
            </div>

            {/* Week 2 & 3: Interactive Boards connected to workflow service */}
            <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
                <TimelineGantt tasks={workstreams.ganttData} />
            </div>

            <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both mt-12">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                        Operational Pipeline
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop agents between pipeline stages. Operations execute instantly based on column context.</p>
                </div>
                <PipelineBoard initialTasks={workstreams.boardData} />
            </div>
        </div>
    );
}
