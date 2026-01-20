
'use client';

import React from 'react';
import { useWorkflowStore } from './store';
import { Card, CardHeader, CardTitle, CardContent, Input, Label, Textarea, Button, Separator, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/';
import { Settings2, X, Trash2, Bot, GitFork, FileText, Info } from 'lucide-react';

export function ConfigPanel() {
    const { ui, nodes, updateNodeData, setSelectedNode } = useWorkflowStore();
    const selectedNodeId = ui.selectedNodeId;

    // Find the actual node object
    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    if (!selectedNode) {
        return (
            <aside className="w-80 border-l border-slate-200 bg-white/80 backdrop-blur-md z-20 flex flex-col h-full items-center justify-center text-center p-6 text-slate-400">
                <Settings2 className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="font-semibold text-slate-600">Configuration</h3>
                <p className="text-sm mt-2">Select a node on the canvas to configure its properties.</p>
            </aside>
        );
    }

    const handleChange = (key: string, value: any) => {
        updateNodeData(selectedNode.id, { [key]: value });
    };

    return (
        <aside className="w-80 border-l border-slate-200 bg-white/80 backdrop-blur-md z-20 flex flex-col h-full animate-in slide-in-from-right-10 duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-blue-600" />
                    Settings
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800" onClick={() => setSelectedNode(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Visual Guide / Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 text-slate-500 bg-white p-1 rounded shadow-sm border border-slate-100">
                            {selectedNode.type === 'llm' ? <Bot className="h-3.5 w-3.5" /> :
                                selectedNode.type === 'branch' ? <GitFork className="h-3.5 w-3.5" /> :
                                    selectedNode.type === 'document' ? <FileText className="h-3.5 w-3.5" /> : <Settings2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                {selectedNode.type === 'llm' ? 'Reasoning Engine' :
                                    selectedNode.type === 'document' ? 'Knowledge Source' :
                                        selectedNode.type === 'branch' ? 'Logic Router' : 'Static Input'}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                                {selectedNode.type === 'llm' ? 'Configures the artificial intelligence model, instruction set, and output parameters.' :
                                    selectedNode.type === 'document' ? 'Manages external data references and vector indexing for RAG pipelines.' :
                                        selectedNode.type === 'branch' ? 'Determines execution path based on boolean logic evaluation.' :
                                            'Defines constant variables for the workflow.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identity</h3>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Node Identifier</Label>
                        <Input
                            value={selectedNode.data.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            className="bg-white h-8 text-xs border-slate-200"
                        />
                    </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* Dynamic Content based on Type */}
                <Accordion type="single" collapsible defaultValue="properties" className="w-full">
                    <AccordionItem value="properties" className="border-b-0">
                        <AccordionTrigger className="text-sm font-semibold text-slate-700 py-2 hover:no-underline">
                            {selectedNode.type === 'llm' ? 'Engine Configuration' :
                                selectedNode.type === 'branch' ? 'Routing Logic' :
                                    selectedNode.type === 'document' ? 'Source Properties' :
                                        'Parameters'}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-5 pt-2">

                            {selectedNode.type === 'llm' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600">Behavior Instruction</Label>
                                        <Textarea
                                            placeholder="Define the agent's persona, constraints, and operational rules..."
                                            value={selectedNode.data.systemPrompt || ''}
                                            onChange={(e) => handleChange('systemPrompt', e.target.value)}
                                            className="min-h-[120px] bg-white font-mono text-xs border-slate-200 focus:border-slate-400 resize-none p-3"
                                        />
                                        <p className="text-[10px] text-slate-400 leading-tight">
                                            These instructions effectively program the reasoning engine.
                                        </p>
                                    </div>
                                    <div className="space-y-2 bg-slate-50 p-3 rounded-md border border-slate-100">
                                        <Label className="text-xs font-semibold text-slate-600">Global Creativity Override</Label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="number"
                                                min="0" max="1" step="0.1"
                                                value={selectedNode.data.temperature || 0.7}
                                                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                                                className="w-16 h-7 text-xs bg-white text-center"
                                            />
                                            <p className="text-[10px] text-slate-400 flex-1">
                                                Higher values (0.8+) increase randomness. Lower values (0.2) favor determinism.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'branch' && (
                                <div className="space-y-2">
                                    <Label>Evaluation Expression</Label>
                                    <Input
                                        placeholder="e.g. input.length > 0"
                                        value={selectedNode.data.condition || ''}
                                        onChange={(e) => handleChange('condition', e.target.value)}
                                        className="font-mono text-xs bg-slate-50"
                                    />
                                    <p className="text-[10px] text-slate-400">
                                        Javascript boolean evaluation.
                                    </p>
                                </div>
                            )}

                            {selectedNode.type === 'document' && (
                                <>
                                    <div className="space-y-2">
                                        <Label>Source Origin</Label>
                                        <Select
                                            value={selectedNode.data.sourceType || 'upload'}
                                            onValueChange={(val) => handleChange('sourceType', val)}
                                        >
                                            <SelectTrigger className="h-8 text-xs bg-white border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upload">Upload File</SelectItem>
                                                <SelectItem value="url">External URL Resource</SelectItem>
                                                <SelectItem value="knowledge_base">Enterprise Knowledge Base</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            {selectedNode.data.sourceType === 'url' ? 'Resource URI' : 'Asset Filename'}
                                        </Label>
                                        <Input
                                            value={selectedNode.data.filename || ''}
                                            onChange={(e) => handleChange('filename', e.target.value)}
                                            placeholder={selectedNode.data.sourceType === 'url' ? 'https://docs.elysian.com/spec' : 'q3_financial_report.pdf'}
                                            className="h-8 text-xs bg-white border-slate-200"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs h-8 border-dashed border-slate-300 text-slate-600 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                                            onClick={() => handleChange('status', 'indexed')}
                                        >
                                            Run Indexing Job
                                        </Button>
                                    </div>
                                </>
                            )}

                            {selectedNode.type === 'text' && (
                                <div className="space-y-2">
                                    <Label>Default Value</Label>
                                    <Textarea
                                        placeholder="Enter text..."
                                        value={selectedNode.data.text || ''}
                                        onChange={(e) => handleChange('text', e.target.value)}
                                        className="min-h-[100px] bg-slate-50"
                                    />
                                </div>
                            )}

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="pt-4 mt-auto">
                    <Button variant="destructive" className="w-full gap-2" size="sm">
                        <Trash2 className="h-4 w-4" />
                        Delete Node
                    </Button>
                </div>
            </div>
        </aside>
    );
}
