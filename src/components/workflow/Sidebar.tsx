'use client';

import React, { useState } from 'react';
import { Bot, GitFork, MessageSquare, MousePointerClick, Search, FileText, UserCog, Database, Server, Globe, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/';

interface SidebarProps {
    onNodeSelect?: (type: string, label: string) => void;
}

export function Sidebar({ onNodeSelect }: SidebarProps) {
    const [search, setSearch] = useState('');

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    // Helper to handle both click and drag setup if needed, but click is distinct
    const handleNodeClick = (type: string, label: string) => {
        if (onNodeSelect) {
            onNodeSelect(type, label);
        }
    };

    const matches = (term: string) => term.toLowerCase().includes(search.toLowerCase());

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-blue-900/30 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-20 flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 dark:border-blue-900/30 space-y-3">
                <h2 className="font-semibold text-slate-800 dark:text-slate-50 flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    Components
                </h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 h-9 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-blue-900/30 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Intelligence</h3>
                    {matches('Reasoning Engine') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'llm', 'Reasoning Engine')}
                            onClick={() => handleNodeClick('llm', 'Reasoning Engine')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Reasoning Engine</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Advanced Logic & Generation</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Agents</h3>
                    {matches('AI Agent') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 dark:border-blue-900/30 bg-white dark:bg-slate-900/40 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'agent', 'AI Agent')}
                            onClick={() => handleNodeClick('agent', 'AI Agent')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                <UserCog className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">AI Agent</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Autonomous Task Executor</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Data Ingestion</h3>
                    {matches('RAG Knowledge Base') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-teal-200 dark:border-teal-900/30 bg-white dark:bg-slate-900/40 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'data_ingestion', 'RAG Knowledge Base')}
                            onClick={() => handleNodeClick('data_ingestion', 'RAG Knowledge Base')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                                <Database className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">RAG Knowledge Base</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Vector & Semantic Retrieval</span>
                            </div>
                        </div>
                    )}
                    {matches('SQL Connector') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-teal-200 dark:border-teal-900/30 bg-white dark:bg-slate-900/40 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'data_ingestion', 'SQL Connector')}
                            onClick={() => handleNodeClick('data_ingestion', 'SQL Connector')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                                <Server className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">SQL Connector</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Structured Database Query</span>
                            </div>
                        </div>
                    )}
                    {matches('Web Scraper') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-teal-200 dark:border-teal-900/30 bg-white dark:bg-slate-900/40 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'data_ingestion', 'Web Scraper')}
                            onClick={() => handleNodeClick('data_ingestion', 'Web Scraper')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Web Scraper</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Live URL Data Extraction</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Logic</h3>
                    {matches('Branch') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-slate-900/40 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'branch', 'Logic Router')}
                            onClick={() => handleNodeClick('branch', 'Logic Router')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                                <GitFork className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Logic Router</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Conditional Flow Control</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider px-1">Compliance & SupTech</h3>
                    {matches('FDS') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-900/40 hover:border-red-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'guardrail', 'FDS Fraud Check')}
                            onClick={() => handleNodeClick('guardrail', 'FDS Fraud Check')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <ShieldAlert className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">FDS Fraud Check</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">RAG Semantic Guardrail</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Knowledge</h3>
                    {matches('Knowledge Source') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-slate-900/40 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'document', 'Knowledge Source')}
                            onClick={() => handleNodeClick('document', 'Knowledge Source')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Knowledge Source</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Grounding Data & Context</span>
                            </div>
                        </div>
                    )}

                    {matches('Input Parameter') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-blue-900/30 bg-white dark:bg-slate-900/40 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group glass-obsidian"
                            onDragStart={(event) => onDragStart(event, 'text', 'Input Parameter')}
                            onClick={() => handleNodeClick('text', 'Input Parameter')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Input Parameter</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Static Operational Variables</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#0B1120]/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Drag items to the canvas
                </p>
            </div>
        </aside>
    );
}
