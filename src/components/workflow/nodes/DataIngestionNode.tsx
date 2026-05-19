'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/';
import { Database, Globe, Server, AlertCircle } from 'lucide-react';
import { NodeStatusBadge } from './NodeStatusBadge';
import { useWorkflowStore } from '../store';
import { cn } from '@/lib/utils';

interface DataIngestionNodeData {
    label: string;
    ingestionType?: 'rag' | 'sql' | 'web_scraper';
    sourceName?: string;
    sourceUrl?: string;
    status?: 'ready' | 'indexing' | 'error';
}

const TYPE_CONFIG = {
    rag: { label: 'RAG', icon: Database, color: 'teal' },
    sql: { label: 'SQL', icon: Server, color: 'cyan' },
    web_scraper: { label: 'Web', icon: Globe, color: 'sky' },
} as const;

export function DataIngestionNode({ id, data, selected }: NodeProps<DataIngestionNodeData>) {
    const executionStatus = useWorkflowStore((s) => s.execution.nodeStatus[id]);
    const typeConfig = data.ingestionType ? TYPE_CONFIG[data.ingestionType] : null;
    const Icon = typeConfig?.icon ?? Database;

    return (
        <div className="relative group font-sans">
            {/* Output Handle only — Data Ingestion is always a source */}
            <Card className={cn(
                'w-[280px] shadow-sm transition-all duration-300 backdrop-blur-md glass-obsidian',
                'bg-white/90 dark:bg-slate-900/40',
                selected
                    ? 'border-teal-500 ring-1 ring-teal-500 shadow-xl'
                    : 'border-teal-200 dark:border-teal-900/50 hover:border-teal-400 hover:shadow-md'
            )}>
                {/* Header */}
                <div className="px-4 py-3 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-900/30 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-sm">
                            <Icon className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-50 leading-none">
                                {data.label || 'Data Ingestion'}
                            </h3>
                            <p className="text-[10px] font-medium text-teal-500 uppercase tracking-wider mt-1">
                                {typeConfig ? typeConfig.label + ' Connector' : 'Ingestion Source'}
                            </p>
                        </div>
                    </div>
                    <div className="scale-90 opacity-80">
                        <NodeStatusBadge status={executionStatus} />
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    {/* Source Name Preview */}
                    {data.sourceName ? (
                        <div className="bg-teal-50/50 dark:bg-teal-900/10 rounded-md p-2.5 border border-teal-100 dark:border-teal-800/30 flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                                {data.sourceName}
                            </p>
                        </div>
                    ) : (
                        <div className="border border-dashed border-teal-200 dark:border-teal-800 rounded-md p-3 text-center">
                            <p className="text-[10px] italic text-slate-400">Click to configure source</p>
                        </div>
                    )}

                    {/* Status Badge Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Index Status</span>
                        <div>
                            {data.status === 'ready' && (
                                <span className="text-green-700 font-bold text-[10px] flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    READY
                                </span>
                            )}
                            {data.status === 'indexing' && (
                                <span className="text-yellow-700 font-bold text-[10px] flex items-center gap-1.5 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                    INDEXING
                                </span>
                            )}
                            {data.status === 'error' && (
                                <span className="text-red-700 font-bold text-[10px] flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                    <AlertCircle className="h-3 w-3" />
                                    ERROR
                                </span>
                            )}
                            {!data.status && (
                                <span className="text-[10px] text-slate-400 italic">Unprocessed</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-teal-400 group-hover:!bg-teal-600 w-2 h-2 transition-all rounded-full"
            />
        </div>
    );
}
