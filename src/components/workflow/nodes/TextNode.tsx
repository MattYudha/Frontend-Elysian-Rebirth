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
            <Card className={`w-[300px] shadow-sm transition-all duration-300 ${selected ? 'border-green-500 dark:border-green-400 ring-1 ring-green-500 dark:ring-green-400 shadow-md' : 'border-slate-200 dark:border-blue-900/30'} bg-white/90 dark:bg-slate-900/40 backdrop-blur-md glass-obsidian`}>
                <CardHeader className="p-3 pb-0 bg-slate-50/50 dark:bg-[#0B1120]/60 border-b border-transparent dark:border-blue-900/30 rounded-t-lg">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-50">
                        <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                            <FileText className="h-3.5 w-3.5" />
                        </div>
                        {data.label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 mt-2">
                    <Textarea
                        defaultValue={data.text}
                        placeholder="Enter text content..."
                        rows={4}
                        className="text-xs resize-none bg-slate-50/50 dark:bg-[#0B1120]/50 border-slate-200 dark:border-blue-900/50 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
}
