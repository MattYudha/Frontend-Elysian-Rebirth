'use client';

import React from 'react';
import { Play, Save, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/';
import { useWorkflowStore } from './store';
import { toast } from 'sonner';

export function Toolbar() {
    const { nodes, edges, meta, startExecution, setNodeStatus, publishVersion } = useWorkflowStore();

    const handleRun = async () => {
        startExecution();

        // Enterprise Execution Contract (v1.0)
        const payload = {
            workflowId: meta.workflowId,
            version: meta.version,
            executionId: `exec_${Date.now()}`,
            timestamp: new Date().toISOString(),
            nodes: nodes.map(n => ({
                id: n.id,
                type: n.type,
                config: n.data,
            })),
            edges: edges.map(e => ({
                from: e.source,
                to: e.target,
                portFrom: e.sourceHandle || 'default',
                portTo: e.targetHandle || 'default'
            })),
            entryPoint: nodes.find(n => n.type === 'input')?.id || 'start',
        };

        console.log('🚀 [Execution Contract] Payload:', JSON.stringify(payload, null, 2));
        toast.success("Workflow Execution Started", {
            description: `Run ID: ${payload.executionId} - Status: Running`,
        });

        // Mock Execution Engine (drives the visual state)
        // In real app, this would be driven by SSE/WebSockets from backend
        const sortedNodes = [...nodes]; // Naive topology, just array order for now

        for (const node of sortedNodes) {
            // Update UI to show running
            setNodeStatus(node.id, 'running');

            // Simulate processing time (1s)
            await new Promise(r => setTimeout(r, 800));

            // Update UI to show success
            setNodeStatus(node.id, 'success');
        }

        toast.info("Execution Completed", {
            description: "All nodes processed successfully."
        });
    };

    const handlePublish = () => {
        const oldVersion = meta.version;
        publishVersion();
        // Delay toast to show after state update (not strict necessary but feels better if sync)
        toast.success("Workflow Published", {
            description: `Promoted v${oldVersion} → Production Snapshot`,
        });
    };

    return (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm z-10 flex items-center gap-2">
            <div className="px-3 py-1 flex flex-col items-end mr-2 border-r border-slate-100 pr-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.status === 'published' ? 'text-green-600' : 'text-amber-500'}`}>
                    {meta.status}
                </span>
                <span className="text-xs font-mono text-slate-600">v{meta.version}</span>
            </div>

            <Button variant="outline" size="sm" onClick={handlePublish} className="h-8 gap-1.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                <Save className="h-3.5 w-3.5" />
                Publish
            </Button>

            <Button size="sm" onClick={handleRun} className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                <Play className="h-3.5 w-3.5 fill-current" />
                Run
            </Button>
        </div>
    );
}
