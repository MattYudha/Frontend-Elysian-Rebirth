'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/';
import { Textarea } from '@/components/ui/';
import { FileText } from 'lucide-react';

interface TextNodeData {
    label: string;
    text?: string;
}

export function TextNode({ data, selected }: NodeProps<TextNodeData>) {
    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
            <Card className={`w-[300px] shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : ''}`}>
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {data.label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    <Textarea
                        defaultValue={data.text}
                        placeholder="Enter text content..."
                        rows={4}
                        className="text-xs resize-none"
                    />
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
}
