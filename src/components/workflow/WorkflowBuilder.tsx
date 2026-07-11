'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { useSearchParams, useRouter } from 'next/navigation';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { Toolbar } from './Toolbar';
import { useWorkflowStore } from './store';
import { ConfigPanel } from './ConfigPanel';
import { ResultsPanel } from './ResultsPanel';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Plus, Settings2, GitBranch, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWorkflowLoader, useSaveWorkflow, useWorkflows, useCreateWorkflow, useDeleteWorkflow } from '@/queries/workflow.queries';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ─── Client-side cycle detection ────────────────────────────────────────────
// Returns true if the given edges create a cycle (DAG violation).
// We detect cycles BEFORE auto-save to prevent hitting the backend needlessly.
function hasCycle(nodes: { id: string }[], edges: { source: string; target: string }[]): boolean {
    const adjacency: Record<string, string[]> = {};
    nodes.forEach((n) => { adjacency[n.id] = []; });
    edges.forEach((e) => {
        if (adjacency[e.source]) adjacency[e.source].push(e.target);
    });

    const visited = new Set<string>();
    const stack = new Set<string>();

    function dfs(nodeId: string): boolean {
        if (stack.has(nodeId)) return true;   // back-edge → cycle
        if (visited.has(nodeId)) return false;
        visited.add(nodeId);
        stack.add(nodeId);
        for (const neighbor of adjacency[nodeId] || []) {
            if (dfs(neighbor)) return true;
        }
        stack.delete(nodeId);
        return false;
    }

    return nodes.some((n) => !visited.has(n.id) && dfs(n.id));
}

// ─── Auto-save hook ──────────────────────────────────────────────────────────
// Debounced 1000ms. Silently aborts if:
//   1. No workflow ID (can't save without a target)
//   2. Not dirty (nothing changed)
//   3. Cycle detected client-side (avoid backend round-trips + 400 spam)
function useAutoSave(workflowId: string | null) {
    const nodes = useWorkflowStore((s) => s.nodes);
    const edges = useWorkflowStore((s) => s.edges);
    const isDirty = useWorkflowStore((s) => s.isDirty);
    const serverVersion = useWorkflowStore((s) => s.serverVersion);
    const saveMutation = useSaveWorkflow();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Guard 1: no target
        if (!workflowId || !isDirty) return;

        // Guard 2: client-side cycle abort — prevents backend 422 spam
        if (hasCycle(nodes, edges)) return;

        // Debounce
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            saveMutation.mutate({
                id: workflowId,
                nodes,
                edges,
                expectedVersion: serverVersion,
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges, isDirty, workflowId]);

    return saveMutation.isPending;
}

// ─── WorkflowBuilderContent ──────────────────────────────────────────────────
function WorkflowBuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const workflowId = searchParams.get('id');

    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { project } = useReactFlow();
    const {
        addNode,
        selectedNode,
        setSelectedNode,
        setWorkflowId,
        resetWorkflow,
    } = useWorkflowStore();

    // Load workflow list for pipeline selection
    const { data: workflows } = useWorkflows();
    const createMutation = useCreateWorkflow();
    const saveMutation = useSaveWorkflow();
    const deleteMutation = useDeleteWorkflow();

    // Find active workflow object
    const activeWorkflow = workflows?.find((w) => w.id === workflowId);

    // Load workflow from server whenever ID changes
    const { isLoading: isLoadingWorkflow } = useWorkflowLoader(workflowId);

    // Auto-save (debounced, silent, cycle-safe)
    const isSaving = useAutoSave(workflowId);

    // Redirect to last active or first available workflow if none is selected
    // Or if the selected workflow does not belong to the current tenant (tenant mismatch redirect)
    useEffect(() => {
        if (workflows && workflows.length > 0) {
            const exists = workflows.some((w) => w.id === workflowId);
            if (!exists) {
                const lastActive = localStorage.getItem('last_active_workflow_id');
                const lastActiveExists = workflows.some((w) => w.id === lastActive);
                if (lastActive && lastActiveExists) {
                    router.replace(`/workflow?id=${lastActive}`);
                } else {
                    router.replace(`/workflow?id=${workflows[0].id}`);
                }
            } else {
                localStorage.setItem('last_active_workflow_id', workflowId!);
            }
        }
    }, [workflowId, workflows, router]);

    // Handler to create a completely new, clean pipeline starting with Trigger
    const handleCreateNew = () => {
        createMutation.mutate(
            { name: 'Pipeline Baru', status: 'draft' },
            {
                onSuccess: (created) => {
                    const defaultNodes = [
                        {
                            id: 'start-1',
                            type: 'start',
                            data: { label: 'Start Trigger' },
                            position: { x: 250, y: 50 },
                        },
                    ];
                    saveMutation.mutate(
                        { id: created.id, nodes: defaultNodes, edges: [], expectedVersion: '' },
                        {
                            onSuccess: () => {
                                router.replace(`/workflow?id=${created.id}`);
                                toast.success('Pipeline baru berhasil dibuat!');
                            }
                        }
                    );
                }
            }
        );
    };

    // Handler to delete the active pipeline with trash UI confirmation
    const handleDeleteActive = () => {
        if (!workflowId) return;

        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus pipeline ini?");
        if (!confirmDelete) return;

        deleteMutation.mutate(workflowId, {
            onSuccess: () => {
                toast.success('Pipeline berhasil dihapus!');
                const remaining = workflows?.filter((w) => w.id !== workflowId);
                if (remaining && remaining.length > 0) {
                    router.replace(`/workflow?id=${remaining[0].id}`);
                } else {
                    localStorage.removeItem('last_active_workflow_id');
                    resetWorkflow();
                    router.replace('/workflow');
                }
            }
        });
    };

    // Sync workflowId into store so Toolbar and other components can read it
    useEffect(() => {
        setWorkflowId(workflowId);
    }, [workflowId, setWorkflowId]);

    // Cleanup on unmount — prevent state contamination between pipelines
    useEffect(() => {
        return () => {
            resetWorkflow();
        };
    }, [resetWorkflow]);

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
            console.log("onDrop triggered inside WorkflowBuilder!");

            const type = event.dataTransfer.getData('application/reactflow/type');
            const label = event.dataTransfer.getData('application/reactflow/label');
            console.log(`onDrop - type: ${type}, label: ${label}`);

            if (typeof type === 'undefined' || !type) {
                console.warn("onDrop aborted: type is undefined or empty");
                return;
            }

            const position = reactFlowWrapper.current?.getBoundingClientRect();
            if (!position) {
                console.warn("onDrop aborted: reactFlowWrapper bounds not found");
                return;
            }

            const droppedPosition = project({
                x: event.clientX - position.left,
                y: event.clientY - position.top,
            });
            console.log(`onDrop - droppedPosition calculated:`, droppedPosition);

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position: droppedPosition,
                data: { label },
            };
            console.log("onDrop - adding node:", newNode);

            addNode(newNode);
            setIsSidebarOpen(false);
        },
        [project, addNode]
    );

    const onNodeSelect = (type: string, label: string) => {
        const position = {
            x: Math.random() * 100 + 100,
            y: Math.random() * 100 + 100,
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
        <div className="flex h-full w-full overflow-hidden relative">
            {/* Desktop Sidebar (Palette) */}
            <div className="hidden md:flex flex-col h-full z-20 shadow-xl shadow-slate-200/50 dark:shadow-none border-r border-slate-200/50 dark:border-blue-900/30">
                <Sidebar onNodeSelect={onNodeSelect} />
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative h-full" ref={reactFlowWrapper}>
                {/* Pipeline Switcher & Creation Panel (Responsive) */}
                <div className="flex absolute top-4 left-4 z-20 items-center gap-1 md:gap-2">
                    <Select
                        value={workflowId || ''}
                        onValueChange={(val) => {
                            if (val) router.replace(`/workflow?id=${val}`);
                        }}
                    >
                        <SelectTrigger className="w-[115px] sm:w-[150px] md:w-[220px] h-9 md:h-10 border border-slate-200/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all font-sans font-medium flex items-center gap-1 px-2 md:px-3 text-xs md:text-sm">
                            <GitBranch className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500 shrink-0" />
                            <SelectValue placeholder="Pilih Pipeline">
                                <span className="truncate">{activeWorkflow ? activeWorkflow.name : 'Pilih Pipeline'}</span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200/50 dark:border-blue-900/30 rounded-lg shadow-lg font-sans z-[30]">
                            {workflows && workflows.length > 0 ? (
                                workflows.map((w) => (
                                    <SelectItem
                                        key={w.id}
                                        value={w.id}
                                        className="focus:bg-blue-50 dark:focus:bg-blue-950/50 cursor-pointer text-slate-700 dark:text-slate-300"
                                    >
                                        <span className="flex items-center justify-between w-full gap-4">
                                            <span className="font-medium truncate max-w-[130px]">{w.name}</span>
                                            <span className="text-[10px] font-mono opacity-60 uppercase bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200/30">
                                                v{w.version || '1.0.0'}
                                            </span>
                                        </span>
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-slate-500">
                                    Tidak ada pipeline
                                </div>
                            )}
                        </SelectContent>
                    </Select>

                    <button
                        onClick={handleCreateNew}
                        disabled={createMutation.isPending || saveMutation.isPending}
                        title="Buat Pipeline Baru"
                        className="h-9 w-9 md:h-10 md:w-10 border border-slate-200/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md text-slate-800 dark:text-slate-200 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                        {createMutation.isPending || saveMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        ) : (
                            <Plus className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        )}
                    </button>

                    <button
                        onClick={handleDeleteActive}
                        disabled={deleteMutation.isPending || !workflowId}
                        title="Hapus Pipeline Aktif"
                        className="h-9 w-9 md:h-10 md:w-10 border border-red-200/30 dark:border-red-900/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg shadow-sm backdrop-blur-md transition-all flex items-center justify-center disabled:opacity-30"
                    >
                        {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </button>
                </div>

                <Toolbar
                    workflowId={workflowId}
                    isSaving={isSaving}
                    mobileMode={mobileMode}
                    setMobileMode={setMobileMode}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Loading overlay when fetching from DB */}
                {isLoadingWorkflow && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-[#0B1120]/60 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading workflow...</p>
                        </div>
                    </div>
                )}

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
                    {mobileMode === 'view' ? 'View Mode: Pan & Zoom' : 'Edit Mode: Drag Nodes'}
                </div>
                <ResultsPanel />
            </div>

            {/* Desktop Config Panel */}
            <div className="hidden lg:block h-full z-20 shadow-xl shadow-slate-200/50 dark:shadow-none border-l border-slate-200/50 dark:border-blue-900/30">
                <ConfigPanel />
            </div>

            {/* MOBILE: Sidebar Sheet (Bottom) */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent side="bottom" className="h-[50vh] p-0 md:hidden bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-blue-900/30">
                    <div className="h-full overflow-y-auto">
                        <div className="p-4 border-b border-slate-100 dark:border-blue-900/30 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900/40 z-10 backdrop-blur-md">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Plus className="h-4 w-4 text-blue-500" /> Add Node
                            </h3>
                            <div className="text-xs text-slate-400 dark:text-slate-500">Drag or Tap to Add</div>
                        </div>
                        <div className="p-4">
                            <Sidebar onNodeSelect={onNodeSelect} />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* MOBILE: Config Sheet (Right) */}
            <Sheet open={isConfigOpen} onOpenChange={(open) => !open && setSelectedNode(null)}>
                <SheetContent side="right" className="w-[90vw] sm:w-[500px] p-0 md:hidden z-[60] bg-white dark:bg-[#0B1120] border-l border-slate-200 dark:border-blue-900/30">
                    <div className="h-full overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-blue-900/30 flex items-center gap-2 bg-slate-50 dark:bg-slate-900/40">
                            <Settings2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Node Configuration</span>
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
