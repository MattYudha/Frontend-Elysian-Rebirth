import { ActionTooltip } from '@/components/ActionTooltip';
import type { RagSource } from '@/lib/sdk/schemas';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertOctagon,
    Trash2,
    ExternalLink,
} from 'lucide-react';
import React from 'react';

interface SourceCardProps {
    source: RagSource;
    onDelete?: (id: string) => void;
    className?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({
    source,
    onDelete,
    className,
}) => {
    // Simplified Elysian Status Colors
    const getStatusColor = (status: RagSource['status']) => {
        switch (status) {
            case 'ready':
                return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'processing':
                return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'failed':
                return 'text-red-600 bg-red-50 border-red-100';
            default:
                return 'text-slate-500 bg-slate-50 border-slate-100';
        }
    };

    const StatusIcon = {
        ready: CheckCircle2,
        processing: Clock,
        failed: AlertOctagon,
        queued: Clock,
        indexing: Clock, // Should use Loader2 if imported, but Clock matches existing
        uploading: Clock
    }[source.status] || FileText;

    return (
        <div
            className={cn(
                'group relative p-4 rounded-[16px] border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-100',
                className
            )}
        >
            {/* Top Row: Icon + Meta */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#F7FBFF] text-blue-600 border border-blue-50/50">
                        <FileText className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 truncate max-w-[140px]" title={source.name}>
                            {source.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="uppercase tracking-wider font-medium">{source.type}</span>
                            <span>•</span>
                            <span>{(source.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    </div>
                </div>

                <ActionTooltip label={source.status}>
                    <div className={cn("p-1.5 rounded-full shrink-0", getStatusColor(source.status))}>
                        <StatusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </div>
                </ActionTooltip>
            </div>

            {/* Middle: Intelligence Tags (Entities) */}
            <div className="min-h-[28px] flex flex-wrap gap-1.5 mb-4">
                {source.entities.length > 0 ? source.entities.slice(0, 2).map((entity, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md border border-slate-100 font-medium truncate max-w-[100px]">
                        {entity.name}
                    </span>
                )) : (
                    <span className="text-[10px] text-slate-300 italic">Tanpa entitas</span>
                )}
            </div>

            {/* Bottom: Value & Actions */}
            <div className="pt-3 mt-auto border-t border-slate-50 flex items-center justify-between">
                {/* Value Metric (Left) */}
                {source.valueMetrics?.moneySaved ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        + Rp {(source.valueMetrics.moneySaved / 1000000).toFixed(1)}jt
                    </span>
                ) : <span className="text-xs text-slate-300">-</span>}

                {/* Actions (Right) */}
                <div className="flex gap-1">
                    {source.suggestedActions?.[0] ? (
                        <Button size="sm" className="h-7 text-[10px] px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 shadow-none border-0 font-semibold">
                            {source.suggestedActions[0].label}
                        </Button>
                    ) : (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500" onClick={() => onDelete?.(source.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
