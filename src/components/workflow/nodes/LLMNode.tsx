'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/';
import { Slider } from '@/components/ui/';
import { Bot } from 'lucide-react';

interface LLMNodeData {
    label: string;
    model?: string;
    temperature?: number;
    systemPrompt?: string;
}

export function LLMNode({ data, selected }: NodeProps<LLMNodeData>) {
    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
            <Card className={`w-[300px] shadow-sm ${selected ? 'border-primary ring-1 ring-primary' : ''}`}>
                <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        {data.label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">Model</label>
                        <Select defaultValue={data.model || 'gpt-4'}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-muted-foreground flex justify-between">
                            <span>Temperature</span>
                            <span>{(data.temperature || 0.7).toFixed(1)}</span>
                        </label>
                        <Slider
                            defaultValue={[data.temperature || 0.7]}
                            max={2}
                            step={0.1}
                            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        />
                    </div>
                </CardContent>
            </Card>
            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
}
