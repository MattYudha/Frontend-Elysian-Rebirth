import React from 'react';
import { Play, Save, Eye, MousePointer2, Plus, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/';
import { useWorkflowStore } from './store';
import { toast } from 'sonner';
import { useReactFlow } from 'reactflow';

interface ToolbarProps {
    mobileMode?: 'view' | 'edit';
    setMobileMode?: (mode: 'view' | 'edit') => void;
    setIsSidebarOpen?: (open: boolean) => void;
}

export function Toolbar({ mobileMode, setMobileMode, setIsSidebarOpen }: ToolbarProps) {
    const { nodes, edges, meta, startExecution, setNodeStatus, publishVersion } = useWorkflowStore();
    const { fitView } = useReactFlow();

    const handleRun = async () => {
        startExecution();
        // ... (existing logic) ...
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

        toast.success("Workflow Execution Started", {
            description: `Run ID: ${payload.executionId} - Status: Running`,
        });

        const sortedNodes = [...nodes];
        for (const node of sortedNodes) {
            setNodeStatus(node.id, 'running');
            await new Promise(r => setTimeout(r, 800));
            setNodeStatus(node.id, 'success');
        }

        toast.info("Execution Completed", {
            description: "All nodes processed successfully."
        });
    };

    const handlePublish = () => {
        const oldVersion = meta.version;
        publishVersion();
        toast.success("Workflow Published", {
            description: `Promoted v${oldVersion} → Production Snapshot`,
        });
    };

    return (
        <>
            {/* DESKTOP TOOLBAR (Top Right) */}
            <div className="hidden md:flex absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm z-10 items-center gap-2">
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

            {/* MOBILE FLOATING TOOLBAR (Bottom Center) */}
            <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-2 rounded-full bg-slate-900/90 backdrop-blur-md shadow-2xl border border-slate-700/50 text-white" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>

                {/* Mode Toggle */}
                <div className="flex bg-slate-800 rounded-full p-1 mr-2">
                    <button
                        onClick={() => setMobileMode?.('view')}
                        className={`p-2 rounded-full transition-all ${mobileMode === 'view' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setMobileMode?.('edit')}
                        className={`p-2 rounded-full transition-all ${mobileMode === 'edit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <MousePointer2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Actions (Only enabled in Edit mode or universal) */}
                <div className="h-6 w-px bg-slate-700 mx-1" />

                <button
                    onClick={() => setIsSidebarOpen?.(true)}
                    disabled={mobileMode === 'view'}
                    className={`p-2 rounded-full transition-all ${mobileMode === 'edit' ? 'bg-white text-slate-900 hover:bg-blue-50' : 'opacity-30 cursor-not-allowed text-slate-400'}`}
                >
                    <Plus className="h-5 w-5" />
                </button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleRun}
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-full h-9 w-9"
                >
                    <Play className="h-5 w-5 fill-current" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => fitView({ padding: 0.2 })}
                    className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full h-9 w-9"
                >
                    <Maximize className="h-4 w-4" />
                </Button>
            </div>
        </>
    );
}
