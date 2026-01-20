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

function WorkflowBuilderContent() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { project } = useReactFlow();
    const { addNode } = useWorkflowStore();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');

            // check if the dropped element is valid
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
                id: `${type}-${Date.now()}`, // simple ID generation
                type,
                position: droppedPosition,
                data: { label },
            };

            addNode(newNode);
        },
        [project, addNode]
    );

    return (
        <div className="flex h-[calc(100vh-6rem)] w-full overflow-hidden bg-slate-50">
            {/* Sidebar (Palette) */}
            <div className="hidden md:flex flex-col h-full z-20 shadow-xl shadow-slate-200/50">
                <Sidebar />
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative h-full" ref={reactFlowWrapper}>
                <Toolbar />
                <div className="absolute inset-0" onDrop={onDrop} onDragOver={onDragOver}>
                    <Canvas />
                </div>
                <ResultsPanel />
            </div>

            {/* Config Panel */}
            <div className="hidden lg:block h-full z-20 shadow-xl shadow-slate-200/50">
                <ConfigPanel />
            </div>
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
