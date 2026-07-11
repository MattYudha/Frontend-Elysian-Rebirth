"use client";

import React from 'react';
import { Workflow } from '@/services/workflow.service';
import { Clock, CheckCircle, Loader2, XCircle, FileEdit, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface PipelineBoardProps {
    pipelines: Workflow[];
    onPipelineClick?: (id: string) => void;
}

export function PipelineBoard({ pipelines, onPipelineClick }: PipelineBoardProps) {
    const columns = [
        { id: 'draft', title: 'Draft', icon: FileEdit, color: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-200' },
        { id: 'queued', title: 'Queued', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-200' },
        { id: 'processing', title: 'Processing', icon: Loader2, color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-200' },
        { id: 'completed', title: 'Completed', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-200' },
        { id: 'failed', title: 'Failed', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500', border: 'border-rose-200' },
    ];

    const getPipelinesByStatus = (status: string) => {
        return pipelines.filter(p => p.status.toLowerCase() === status);
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar h-full w-full">
            {columns.map(col => {
                const columnPipelines = getPipelinesByStatus(col.id);
                return (
                    <div key={col.id} className="flex flex-col w-[280px] shrink-0 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm rounded-xl border border-blue-100/50 dark:border-blue-900/30 shadow-sm relative overflow-hidden">
                        <div className={cn("absolute top-0 left-0 right-0 h-1", col.bg, "opacity-20 dark:opacity-40")} />

                        <div className="p-3 border-b border-blue-100/50 dark:border-blue-900/30 flex flex-row items-center justify-between bg-white/40 dark:bg-slate-900/60">
                            <div className="flex items-center gap-2">
                                <col.icon className={cn("h-4 w-4", col.color, col.id === 'processing' && "animate-spin")} />
                                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm tracking-tight">{col.title}</span>
                            </div>
                            <Badge variant="secondary" className="bg-white/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-700 font-medium">
                                {columnPipelines.length}
                            </Badge>
                        </div>

                        <div className="flex-1 p-3 flex flex-col gap-3 min-h-[300px] bg-slate-50/20 dark:bg-slate-900/10">
                            {columnPipelines.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 italic py-8 border-2 border-dashed border-slate-200/50 dark:border-slate-800 rounded-lg bg-white/20 dark:bg-slate-900/20">
                                    No pipelines
                                </div>
                            ) : (
                                columnPipelines.map(pipeline => (
                                    <div
                                        key={pipeline.id}
                                        className={cn(
                                            "group cursor-pointer rounded-lg p-3 transition-all duration-200 border glass-obsidian shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5",
                                            col.border,
                                            col.id === 'completed' && "hover:border-emerald-300 dark:hover:border-emerald-500/50",
                                            col.id === 'processing' && "hover:border-blue-300 dark:hover:border-blue-500/50",
                                            col.id === 'failed' && "hover:border-rose-300 dark:hover:border-rose-500/50",
                                            col.id === 'queued' && "hover:border-orange-300 dark:hover:border-orange-500/50",
                                            col.id === 'draft' && "hover:border-amber-300 dark:hover:border-amber-500/50"
                                        )}
                                        onClick={() => onPipelineClick?.(pipeline.id)}
                                    >
                                        <p className="font-medium text-sm text-slate-800 dark:text-slate-200 leading-tight mb-2 line-clamp-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                            {pipeline.name}
                                        </p>

                                        {pipeline.status === 'processing' && pipeline.progress !== undefined && (
                                            <div className="w-full bg-slate-100/80 dark:bg-slate-800 rounded-full h-1.5 mb-2 mt-1 shadow-inner overflow-hidden">
                                                <div className={cn("h-1.5 rounded-full transition-all duration-500", col.bg)} style={{ width: `${pipeline.progress}%` }}></div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                                <User className="h-3 w-3 opacity-60" />
                                                <span className="opacity-90">System</span>
                                            </div>
                                            <span className="opacity-80">
                                                {pipeline.createdAt ? new Date(pipeline.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
