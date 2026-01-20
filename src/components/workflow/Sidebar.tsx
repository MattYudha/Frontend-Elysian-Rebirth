'use client';

import React, { useState } from 'react';
import { Bot, GitFork, MessageSquare, MousePointerClick, Search, FileText } from 'lucide-react';
import { Card, Input } from '@/components/ui/';

export function Sidebar() {
    const [search, setSearch] = useState('');

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const matches = (term: string) => term.toLowerCase().includes(search.toLowerCase());

    return (
        <aside className="w-64 border-r border-slate-200 bg-white/80 backdrop-blur-md z-20 flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 space-y-3">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <MousePointerClick className="h-4 w-4 text-blue-600" />
                    Components
                </h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 h-9 text-sm bg-slate-50 border-slate-200 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Intelligence</h3>
                    {matches('Reasoning Engine') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                            onDragStart={(event) => onDragStart(event, 'llm', 'Reasoning Engine')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Reasoning Engine</span>
                                <span className="text-[10px] text-slate-500">Advanced Logic & Generation</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Logic</h3>
                    {matches('Branch') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                            onDragStart={(event) => onDragStart(event, 'branch', 'Logic Router')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <GitFork className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Logic Router</span>
                                <span className="text-[10px] text-slate-500">Conditional Flow Control</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Knowledge</h3>
                    {matches('Knowledge Source') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-orange-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                            onDragStart={(event) => onDragStart(event, 'document', 'Knowledge Source')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Knowledge Source</span>
                                <span className="text-[10px] text-slate-500">Grounding Data & Context</span>
                            </div>
                        </div>
                    )}

                    {matches('Input Parameter') && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-green-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                            onDragStart={(event) => onDragStart(event, 'text', 'Input Parameter')}
                            draggable
                        >
                            <div className="h-8 w-8 rounded-md bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">Input Parameter</span>
                                <span className="text-[10px] text-slate-500">Static Operational Variables</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <p className="text-xs text-slate-500 text-center">
                    Drag items to the canvas
                </p>
            </div>
        </aside>
    );
}
