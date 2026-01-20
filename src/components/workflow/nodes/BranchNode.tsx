'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/';
import { Input } from '@/components/ui/';
import { GitFork } from 'lucide-react';
import { NodeStatusBadge } from './NodeStatusBadge';
import { useWorkflowStore } from '../store';

interface BranchNodeData {
    label: string;
    condition?: string;
}

export function BranchNode({ id, data, selected }: NodeProps<BranchNodeData>) {
    const status = useWorkflowStore((s) => s.execution.nodeStatus[id]);

    return (
        <div className="relative group">
            <NodeStatusBadge status={status} />
            <Handle type="target" position={Position.Top} className="!bg-slate-400 group-hover:!bg-purple-500 transition-colors" />
            <Card className={`w-[300px] shadow-sm transition-all duration-300 ${selected ? 'border-purple-500 ring-1 ring-purple-500 shadow-md' : 'hover:border-purple-300'}`}>
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700">
                        <div className="p-1 rounded bg-purple-100 text-purple-600">
                            <GitFork className="h-3.5 w-3.5" />
                        </div>
                        {data.label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-slate-500">Condition</label>
                        <Input
                            defaultValue={data.condition}
                            placeholder="e.g., score > 0.8"
                            className="h-7 text-xs border-slate-200 bg-slate-50/50"
                        />
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 flex justify-between px-1">
                        <span className="text-green-600">← True</span>
                        <span className="text-red-500">False →</span>
                    </div>
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Left} id="true" className="!bg-green-500 w-3 h-3" />
            <Handle type="source" position={Position.Right} id="false" className="!bg-red-500 w-3 h-3" />
        </div>
    );
}
