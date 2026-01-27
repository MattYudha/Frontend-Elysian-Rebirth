'use client';

import React, { useCallback, useRef } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { useWorkflowStore } from './store';

// We will import ConfigPanel later in Phase 3
import { ConfigPanel } from './ConfigPanel';
import { ResultsPanel } from './ResultsPanel';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Plus, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function WorkflowBuilderContent() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { project } = useReactFlow();
    const { addNode, selectedNode, setSelectedNode } = useWorkflowStore();

    // Mobile State
    const [mobileMode, setMobileMode] = useState<'view' | 'edit'>('edit');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Derived config open state based on selection
    const isConfigOpen = !!selectedNode;

    // Close sidebar when config opens (node selected)
    useEffect(() => {
        if (isConfigOpen) setIsSidebarOpen(false);
    }, [isConfigOpen]);

    // Close config (deselect) when sidebar opens
    useEffect(() => {
        if (isSidebarOpen) setSelectedNode(null);
    }, [isSidebarOpen, setSelectedNode]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowWrapper.current?.getBoundingClientRect();

            if (!position) return;

            const droppedPosition = project({
                x: event.clientX - position.left,
                y: event.clientY - position.top,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position: droppedPosition,
                data: { label },
            };

            addNode(newNode);
            setIsSidebarOpen(false); // Close mobile sidebar after drop/click (if we support click-to-add later)
        },
        [project, addNode]
    );

    const onNodeSelect = (type: string, label: string) => {
        // Simple positioning strategy: Center or slight offset
        // In a real app, we might use project({x: center, y: center}) relative to view
        const position = {
            x: Math.random() * 100 + 100,
            y: Math.random() * 100 + 100
        };

        const newNode = {
            id: `${type}-${Date.now()}`,
            type,
            position,
            data: { label },
        };

        addNode(newNode);
        setIsSidebarOpen(false);
        toast.success(`Added ${label}`);
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-slate-50 relative">
            {/* Desktop Sidebar (Palette) */}
            <div className="hidden md:flex flex-col h-full z-20 shadow-xl shadow-slate-200/50">
                <Sidebar onNodeSelect={onNodeSelect} />
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative h-full" ref={reactFlowWrapper}>
                <Toolbar mobileMode={mobileMode} setMobileMode={setMobileMode} setIsSidebarOpen={setIsSidebarOpen} />
                <div
                    className="absolute inset-0 cursor-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUwyMyAxNkwxNCAxOEw5IDMwTDEgMVoiIGZpbGw9IiMxMTE4MjciIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4='),_default]"
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <style jsx global>{`
                        .react-flow__pane, .react-flow__node, .react-flow__edge {
                            cursor: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEgMUwyMyAxNkwxNCAxOEw5IDMwTDEgMVoiIGZpbGw9IiMxMTE4MjciIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4='), default !important;
                        }
                    `}</style>
                    <Canvas mobileMode={mobileMode} />
                </div>
                {/* Mobile Empty State Overlay */}
                <div className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 text-xs text-slate-400 font-medium text-center">
                    {mobileMode === 'view' ? "View Mode: Pan & Zoom" : "Edit Mode: Drag Nodes"}
                </div>
                <ResultsPanel />
            </div>

            {/* Desktop Config Panel */}
            <div className="hidden lg:block h-full z-20 shadow-xl shadow-slate-200/50">
                <ConfigPanel />
            </div>

            {/* MOBILE: Sidebar Sheet (Bottom) */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="bottom" className="h-[50vh] p-0 md:hidden">
                    <div className="h-full overflow-y-auto">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Plus className="h-4 w-4 text-blue-500" /> Add Node
                            </h3>
                            <div className="text-xs text-slate-400">Drag or Tap to Add</div>
                        </div>
                        <div className="p-4">
                            <Sidebar onNodeSelect={onNodeSelect} />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* MOBILE: Config Sheet (Right) */}
            <Sheet open={isConfigOpen} onOpenChange={(open) => !open && setSelectedNode(null)}>
                <SheetContent side="right" className="w-[90vw] sm:w-[500px] p-0 md:hidden z-[60]">
                    <div className="h-full overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                            <Settings2 className="h-4 w-4 text-slate-500" />
                            <span className="font-semibold text-sm text-slate-700">Node Configuration</span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <ConfigPanel />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export function WorkflowBuilder() {
    return (
        <ReactFlowProvider>
            <WorkflowBuilderContent />
        </ReactFlowProvider>
    );
}
