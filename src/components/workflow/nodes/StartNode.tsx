'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { useWorkflowStore } from '../store';
import { NodeStatusBadge } from './NodeStatusBadge';
import { cn } from '@/lib/utils';

export const StartNode = memo(({ data, id, selected }: NodeProps) => {
    const { execution } = useWorkflowStore();
    const status = execution.nodeStatus[id];

    return (
        <div className={cn(
            "relative group rounded-xl border bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 shadow-sm transition-all w-48",
            selected ? "border-blue-500 shadow-md ring-1 ring-blue-500/20" : "border-slate-200 dark:border-blue-900/40 hover:border-slate-300 dark:hover:border-blue-700/50 hover:shadow-md"
        )}>
            {/* Status Badge */}
            <NodeStatusBadge status={status} />

            {/* Glowing Accent for Start Node */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10 rounded-xl pointer-events-none" />

            {/* Node Content */}
            <div className="p-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <Play className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                        {data.label || 'Start'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-0.5">
                        Trigger
                    </div>
                </div>
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className={cn(
                    "w-3 h-3 border-2 transition-colors",
                    selected ? "bg-blue-500 border-white dark:border-[#0B1120]" : "bg-white dark:bg-[#0B1120] border-slate-300 dark:border-slate-600"
                )}
            />
        </div>
    );
});
StartNode.displayName = 'StartNode';
