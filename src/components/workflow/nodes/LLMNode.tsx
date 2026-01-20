'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider, Label, Button, Separator } from '@/components/ui/';
import { Bot, Cpu, Thermometer, ChevronDown, ChevronUp, Sparkles, Zap, Shield, Settings2 } from 'lucide-react';
import { NodeStatusBadge } from './NodeStatusBadge';
import { useWorkflowStore } from '../store';

interface LLMNodeData {
    label: string;
    model?: string;
    temperature?: number;
    systemPrompt?: string;
    preset?: 'balanced' | 'creative' | 'precise';
}

export function LLMNode({ id, data, selected }: NodeProps<LLMNodeData>) {
    const { execution, updateNodeData } = useWorkflowStore();
    const executionStatus = execution.nodeStatus[id];
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Preset Logic
    const currentPreset = data.preset || 'balanced';

    const handlePresetChange = (value: 'balanced' | 'creative' | 'precise') => {
        let temp = 0.7;
        if (value === 'creative') temp = 0.9;
        if (value === 'precise') temp = 0.2;

        updateNodeData(id, {
            preset: value,
            temperature: temp
        });
    };

    const handleModelChange = (value: string) => {
        updateNodeData(id, { model: value });
    };

    const handleTempChange = (value: number[]) => {
        updateNodeData(id, { temperature: value[0] });
    };

    return (
        <div className="relative group font-sans">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-slate-400 group-hover:!bg-slate-600 w-2 h-2 transition-all rounded-full"
            />

            <Card className={`w-[340px] shadow-sm transition-all duration-300 ${selected ? 'border-slate-500 ring-1 ring-slate-500 shadow-xl' : 'hover:border-slate-400 hover:shadow-md'} bg-white border-slate-200`}>

                {/* Enterprise Header */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 leading-none">
                                {data.label || 'Reasoning Engine'}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                                Generative Logic
                            </p>
                        </div>
                    </div>
                    {/* Status is subtle now */}
                    <div className="scale-90 opacity-80">
                        <NodeStatusBadge status={executionStatus} />
                    </div>
                </div>

                <CardContent className="p-4 space-y-5">

                    {/* Primary Control: Presets (Hiding Complexity) */}
                    <div className="space-y-2 nodrag">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Output Style</Label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-md border border-slate-100">
                            {['precise', 'balanced', 'creative'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePresetChange(p as any)}
                                    className={`text-[10px] font-medium py-1.5 px-2 rounded capitalize transition-all ${currentPreset === p ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Instruction Preview */}
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Instruction</Label>
                        <div className="bg-slate-50 p-3 rounded-md border border-slate-100/50 min-h-[60px]">
                            <p className="text-[11px] text-slate-600 font-mono leading-relaxed line-clamp-3">
                                {data.systemPrompt ? `"${data.systemPrompt}"` : <span className="text-slate-400 italic">Define behavior policy...</span>}
                            </p>
                        </div>
                    </div>

                    {/* Advanced Toggle */}
                    <div className="pt-2 nodrag">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider w-full justify-center"
                        >
                            {showAdvanced ? 'Hide Configuration' : 'Advanced Configuration'}
                            {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {showAdvanced && (
                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                <Separator className="bg-slate-100" />

                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                                        <Cpu className="h-3 w-3" />
                                        Model Architecture
                                    </Label>
                                    <Select value={data.model || 'gpt-4o'} onValueChange={handleModelChange}>
                                        <SelectTrigger className="h-7 text-[11px] bg-white border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4o">GPT-4o (Reasoning)</SelectItem>
                                            <SelectItem value="claude-3-opus">Claude 3 Opus (Analysis)</SelectItem>
                                            <SelectItem value="deepseek-v3">DeepSeek V3 (Balanced)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                                            <Thermometer className="h-3 w-3" />
                                            Temperature override
                                        </Label>
                                        <span className="text-[10px] font-mono text-slate-500">
                                            {data.temperature?.toFixed(1) || 0.7}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[data.temperature || 0.7]}
                                        max={1}
                                        step={0.1}
                                        onValueChange={handleTempChange}
                                        className="[&_.bg-primary]:bg-slate-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-slate-400 group-hover:!bg-slate-600 w-2 h-2 transition-all rounded-full"
            />
        </div>
    );
}
