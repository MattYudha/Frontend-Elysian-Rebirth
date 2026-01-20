'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/';
import { FileText, Database, Link as LinkIcon, AlertCircle, BookOpen } from 'lucide-react';
import { NodeStatusBadge } from './NodeStatusBadge';
import { useWorkflowStore } from '../store';

interface DocumentNodeData {
    label: string;
    sourceType?: 'upload' | 'url' | 'knowledge_base';
    filename?: string;
    size?: string;
    pageCount?: number;
    status?: 'indexed' | 'processing' | 'error';
}

export function DocumentNode({ id, data, selected }: NodeProps<DocumentNodeData>) {
    const executionStatus = useWorkflowStore((s) => s.execution.nodeStatus[id]);

    return (
        <div className="relative group font-sans">
            <NodeStatusBadge status={executionStatus} />

            {/* Output Handle only */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-orange-300 group-hover:!bg-orange-500 w-2 h-2 transition-all rounded-full"
            />

            <Card className={`w-[280px] shadow-sm transition-all duration-300 ${selected ? 'border-orange-400 ring-1 ring-orange-400 shadow-lg' : 'hover:border-orange-300 hover:shadow-md'} bg-white border-slate-200`}>

                {/* Enterprise Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-white border border-slate-200 text-orange-600 flex items-center justify-center shadow-sm">
                            <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 leading-none">
                                {data.label || 'Knowledge Source'}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                                Context & Grounding
                            </p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    {/* Metadata Section */}
                    {data.filename ? (
                        <div className="bg-orange-50/50 p-2.5 rounded border border-orange-100 flex items-start gap-3">
                            <div className="mt-0.5 text-orange-400">
                                {data.sourceType === 'url' ? <LinkIcon className="h-3.5 w-3.5" /> :
                                    data.sourceType === 'knowledge_base' ? <Database className="h-3.5 w-3.5" /> :
                                        <FileText className="h-3.5 w-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-700 truncate" title={data.filename}>
                                    {data.filename}
                                </p>
                                <p className="text-[10px] text-slate-500 flex gap-2 mt-0.5">
                                    <span>{data.size || '1.2 MB'}</span>
                                    <span>•</span>
                                    <span>{data.pageCount || 12} ref</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 italic text-center py-3 border border-dashed border-slate-200 rounded-md bg-slate-50/50">
                            No source linked
                        </div>
                    )}

                    {/* Footer / Status */}
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Index Status</span>
                        <div className="flex items-center gap-1">
                            {data.status === 'indexed' && (
                                <span className="text-green-700 font-bold text-[10px] flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                    READY
                                </span>
                            )}
                            {data.status === 'error' && (
                                <span className="text-red-700 font-bold text-[10px] flex items-center gap-1.5 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                    <AlertCircle className="h-3 w-3" />
                                    FAILED
                                </span>
                            )}
                            {!data.status && <span className="text-[10px] font-medium text-slate-400">Unprocessed</span>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
