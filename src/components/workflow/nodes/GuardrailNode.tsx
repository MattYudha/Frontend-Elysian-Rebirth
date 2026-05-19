import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ShieldAlert } from 'lucide-react';
import { NodeStatusBadge } from './NodeStatusBadge';
import type { NodeStatus } from '../types';

export const GuardrailNode = memo(({ data, selected, isConnectable }: any) => {
    return (
        <div className={`relative px-4 py-3 rounded-lg border-2 shadow-sm bg-white dark:bg-slate-900 
            ${selected ? 'border-red-500 shadow-red-500/20' : 'border-red-200 dark:border-red-900/50'}
            transition-all w-[240px]`}
        >
            <NodeStatusBadge status={data.status as NodeStatus} />
            <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-red-400 border-2 border-white dark:border-slate-900" />
            
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Fraud Verify</div>
                    <div className="text-[10px] text-slate-500 max-w-[150px] truncate">
                        {data.config?.rule || 'Semantic Guardrail FDS'}
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-red-400 border-2 border-white dark:border-slate-900" />
        </div>
    );
});
