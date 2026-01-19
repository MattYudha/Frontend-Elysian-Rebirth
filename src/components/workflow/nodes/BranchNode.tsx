'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/';
import { Input } from '@/components/ui/';
import { GitFork } from 'lucide-react';

interface BranchNodeData {
    label: string;
    condition?: string;
}

export function BranchNode({ data, selected }: NodeProps<BranchNodeData>) {
    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
            <Card className={`w-[300px] shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : ''}`}>
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <GitFork className="h-4 w-4 text-muted-foreground" />
                        {data.label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Condition</label>
                        <Input
                            defaultValue={data.condition}
                            placeholder="e.g., score > 0.8"
                            className="h-8 text-xs"
                        />
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between px-1">
                        <span>← True</span>
                        <span>False →</span>
                    </div>
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Left} id="true" className="!bg-green-500" />
            <Handle type="source" position={Position.Right} id="false" className="!bg-red-500" />
        </div>
    );
}
