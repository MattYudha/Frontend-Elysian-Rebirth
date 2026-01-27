'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ConnectionMode,
    NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from './store';

// Import Custom Nodes
import { MousePointerClick } from 'lucide-react';
import { LLMNode } from './nodes/LLMNode';
import { BranchNode } from './nodes/BranchNode';
import { TextNode } from './nodes/TextNode';
import { DocumentNode } from './nodes/DocumentNode';
import { AnimatedEdge } from './edges/AnimatedEdge';

const nodeTypes: NodeTypes = {
    llm: LLMNode,
    branch: BranchNode,
    text: TextNode,
    document: DocumentNode,
    // Add more types here
};

const edgeTypes = {
    animated: AnimatedEdge,
};

export function Canvas({ mobileMode = 'edit' }: { mobileMode?: 'view' | 'edit' }) {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        isValidConnection,
        setSelectedNode,
    } = useWorkflowStore();

    // Responsive Logic
    // In strict View Mode, disable node dragging.
    // Pan on drag is always enabled for navigation.
    // Selection is enabled in both modes (to open Config).
    const isNodeDraggable = mobileMode === 'edit';
    const isConnectable = mobileMode === 'edit';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
        setSelectedNode(node.id);
    }, [setSelectedNode]);

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const defaultEdgeOptions = {
        type: 'animated',
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
    };

    return (
        <div className="h-full w-full bg-slate-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionMode={ConnectionMode.Loose}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
                className="bg-slate-50"

                // Interaction Controls
                nodesDraggable={isNodeDraggable}
                nodesConnectable={isConnectable}
                elementsSelectable={true}
                panOnDrag={true}
                zoomOnPinch={true}
                minZoom={0.2}
            >
                <Background color="#94a3b8" gap={20} size={1} />

                {/* Desktop Controls */}
                <Controls className="hidden md:flex bg-white border-slate-200 shadow-sm" />

                {/* Mobile: Hide MiniMap to save space, or make it toggleable (hidden for now as per feedback) */}
                <MiniMap
                    className="hidden md:block bg-white border-slate-200 shadow-sm rounded-lg overflow-hidden"
                    maskColor="rgba(241, 245, 249, 0.7)"
                    zoomable
                    pannable
                />

                {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-2xl shadow-lg text-center max-w-md mx-4">
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <MousePointerClick className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">Your Canvas is Empty</h3>
                            </div>
                            <p className="text-sm text-slate-500 mb-2 leading-relaxed">
                                <span className="md:hidden">Tap <strong>+</strong></span>
                                <span className="hidden md:inline">Drag components from the Sidebar</span> to start building.
                            </p>
                        </div>
                    </div>
                )}
            </ReactFlow>
        </div>
    );
}
