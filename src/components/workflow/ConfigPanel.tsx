
'use client';

import React from 'react';
import { useWorkflowStore } from './store';
import { Input, Label, Textarea, Button, Separator, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/';
import { Settings2, X, Trash2, Bot, GitFork, FileText, UserCog, Database } from 'lucide-react';

export function ConfigPanel() {
    const { ui, nodes, updateNodeData, setSelectedNode } = useWorkflowStore();
    const selectedNodeId = ui.selectedNodeId;

    // Find the actual node object
    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    if (!selectedNode) {
        return (
            <aside className="w-80 border-l border-slate-200 dark:border-blue-900/30 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-20 flex flex-col h-full items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <Settings2 className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="font-semibold text-slate-600 dark:text-slate-300">Configuration</h3>
                <p className="text-sm mt-2">Select a node on the canvas to configure its properties.</p>
            </aside>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: string, value: any) => {
        updateNodeData(selectedNode.id, { [key]: value });
    };

    return (
        <aside className="w-80 border-l border-slate-200 dark:border-blue-900/30 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-20 flex flex-col h-full animate-in slide-in-from-right-10 duration-300">
            <div className="p-4 border-b border-slate-100 dark:border-blue-900/30 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                <h2 className="font-semibold text-slate-800 dark:text-slate-50 flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    Settings
                </h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200" onClick={() => setSelectedNode(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Visual Guide / Info */}
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-blue-900/30 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                        <div className="mt-1 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-1 rounded shadow-sm border border-slate-100 dark:border-slate-800">
                            {selectedNode.type === 'llm' ? <Bot className="h-3.5 w-3.5" /> :
                                selectedNode.type === 'branch' ? <GitFork className="h-3.5 w-3.5" /> :
                                    selectedNode.type === 'document' ? <FileText className="h-3.5 w-3.5" /> :
                                        selectedNode.type === 'agent' ? <UserCog className="h-3.5 w-3.5" /> :
                                            selectedNode.type === 'data_ingestion' ? <Database className="h-3.5 w-3.5" /> :
                                                <Settings2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                {selectedNode.type === 'llm' ? 'Reasoning Engine' :
                                    selectedNode.type === 'document' ? 'Knowledge Source' :
                                        selectedNode.type === 'branch' ? 'Logic Router' :
                                            selectedNode.type === 'agent' ? 'AI Agent' :
                                                selectedNode.type === 'data_ingestion' ? 'Data Ingestion' :
                                                    'Static Input'}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                                {selectedNode.type === 'llm' ? 'Configures the artificial intelligence model, instruction set, and output parameters.' :
                                    selectedNode.type === 'document' ? 'Manages external data references and vector indexing for RAG pipelines.' :
                                        selectedNode.type === 'branch' ? 'Determines execution path based on boolean logic evaluation.' :
                                            selectedNode.type === 'agent' ? 'Defines autonomous agent role, objective, and tools it can use.' :
                                                selectedNode.type === 'data_ingestion' ? 'Configures the data source (RAG/SQL/Web) that feeds into downstream agents.' :
                                                    'Defines constant variables for the workflow.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-blue-900/30 pb-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identity</h3>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-300">Node Identifier</Label>
                        <Input
                            value={(selectedNode.data.label as string) || ''}
                            onChange={(e) => handleChange('label', e.target.value)}
                            className="bg-white dark:bg-slate-900 h-8 text-xs border-slate-200 dark:border-blue-900/50 dark:text-slate-100"
                        />
                    </div>
                </div>

                <Separator className="bg-slate-100 dark:bg-blue-900/30" />

                {/* Dynamic Content based on Type */}
                <Accordion type="single" collapsible defaultValue="properties" className="w-full">
                    <AccordionItem value="properties" className="border-b-0">
                        <AccordionTrigger className="text-sm font-semibold text-slate-700 dark:text-slate-200 py-2 hover:no-underline">
                            {selectedNode.type === 'llm' ? 'Engine Configuration' :
                                selectedNode.type === 'branch' ? 'Routing Logic' :
                                    selectedNode.type === 'document' ? 'Source Properties' :
                                        selectedNode.type === 'agent' ? 'Agent Configuration' :
                                            selectedNode.type === 'data_ingestion' ? 'Ingestion Configuration' :
                                                'Parameters'}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-5 pt-2">

                            {selectedNode.type === 'llm' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Behavior Instruction</Label>
                                        <Textarea
                                            placeholder="Define the agent's persona, constraints, and operational rules..."
                                            value={(selectedNode.data.systemPrompt as string) || ''}
                                            onChange={(e) => handleChange('systemPrompt', e.target.value)}
                                            className="min-h-[120px] bg-white dark:bg-slate-900 font-mono text-xs border-slate-200 dark:border-blue-900/50 focus:border-slate-400 dark:focus:border-blue-700 dark:text-slate-200 resize-none p-3"
                                        />
                                        <p className="text-[10px] text-slate-400 leading-tight">
                                            These instructions effectively program the reasoning engine.
                                        </p>
                                    </div>
                                    <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md border border-slate-100 dark:border-blue-900/30">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Global Creativity Override</Label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="number"
                                                min="0" max="1" step="0.1"
                                                value={(selectedNode.data.temperature as number) || 0.7}
                                                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                                                className="w-16 h-7 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100 text-center"
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
                                        value={(selectedNode.data.condition as string) || ''}
                                        onChange={(e) => handleChange('condition', e.target.value)}
                                        className="font-mono text-xs bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100"
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
                                            value={(selectedNode.data.sourceType as string) || 'upload'}
                                            onValueChange={(val) => handleChange('sourceType', val)}
                                        >
                                            <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 dark:text-slate-100">
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
                                            value={(selectedNode.data.filename as string) || ''}
                                            onChange={(e) => handleChange('filename', e.target.value)}
                                            placeholder={selectedNode.data.sourceType === 'url' ? 'https://docs.elysian.com/spec' : 'q3_financial_report.pdf'}
                                            className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 dark:text-slate-100"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs h-8 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
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
                                        value={(selectedNode.data.text as string) || ''}
                                        onChange={(e) => handleChange('text', e.target.value)}
                                        className="min-h-[100px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100"
                                    />
                                </div>
                            )}

                            {/* ========== AGENT NODE CONFIG ========== */}
                            {selectedNode.type === 'agent' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Agent Role</Label>
                                        <Select
                                            value={(selectedNode.data.role as string) || ''}
                                            onValueChange={(val) => handleChange('role', val)}
                                        >
                                            <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 dark:text-slate-100">
                                                <SelectValue placeholder="Select role..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="analyst">Analyst</SelectItem>
                                                <SelectItem value="writer">Writer</SelectItem>
                                                <SelectItem value="researcher">Researcher</SelectItem>
                                                <SelectItem value="support">Support Agent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Objective</Label>
                                        <Textarea
                                            placeholder="Describe what this agent should accomplish..."
                                            value={(selectedNode.data.objective as string) || ''}
                                            onChange={(e) => handleChange('objective', e.target.value)}
                                            className="min-h-[100px] bg-white dark:bg-slate-900 font-mono text-xs border-slate-200 dark:border-blue-900/50 dark:text-slate-200 resize-none p-3"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Available Tools</Label>
                                        <div className="flex flex-col gap-2">
                                            {(['web_search', 'calculator', 'code_executor'] as const).map((tool) => {
                                                const tools = (selectedNode.data.tools as string[]) || [];
                                                const active = tools.includes(tool);
                                                const TOOL_LABELS: Record<string, string> = { web_search: 'Web Search', calculator: 'Calculator', code_executor: 'Code Executor' };
                                                return (
                                                    <button
                                                        key={tool}
                                                        onClick={() => handleChange('tools', active ? tools.filter((t: string) => t !== tool) : [...tools, tool])}
                                                        className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-all text-left ${active
                                                                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                                            }`}
                                                    >
                                                        {active ? '✓ ' : '+ '}{TOOL_LABELS[tool]}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ========== DATA INGESTION NODE CONFIG ========== */}
                            {selectedNode.type === 'data_ingestion' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Ingestion Type</Label>
                                        <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-md border border-slate-100 dark:border-blue-900/30">
                                            {(['rag', 'sql', 'web_scraper'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => handleChange('ingestionType', type)}
                                                    className={`text-[10px] font-medium py-1.5 px-2 rounded capitalize transition-all ${(selectedNode.data.ingestionType as string) === type
                                                            ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-sm border border-teal-200 dark:border-teal-800'
                                                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                                        }`}
                                                >
                                                    {type === 'web_scraper' ? 'Web' : type.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Source Name</Label>
                                        <Input
                                            value={(selectedNode.data.sourceName as string) || ''}
                                            onChange={(e) => handleChange('sourceName', e.target.value)}
                                            placeholder="e.g. Customer Support KB"
                                            className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 dark:text-slate-100"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full text-xs h-8 border-dashed border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                            onClick={() => {
                                                handleChange('status', 'indexing');
                                                setTimeout(() => handleChange('status', 'ready'), 1500);
                                            }}
                                        >
                                            Simulate Index Job
                                        </Button>
                                    </div>
                                </>
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
