import React from 'react';
import { Play, Cloud, CloudCheck, Eye, MousePointer2, Plus, Maximize, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/';
import { useReactFlow } from 'reactflow';
import { usePublishWorkflow, useCreateWorkflow, useSaveWorkflow } from '@/queries/workflow.queries';
import { useRouter } from 'next/navigation';
import { useWorkflowStore } from './store';

interface ToolbarProps {
    workflowId?: string | null;
    isSaving?: boolean;
    mobileMode?: 'view' | 'edit';
    setMobileMode?: (mode: 'view' | 'edit') => void;
    setIsSidebarOpen?: (open: boolean) => void;
}

export function Toolbar({ workflowId, isSaving, mobileMode, setMobileMode, setIsSidebarOpen }: ToolbarProps) {
    const { meta, executeWorkflow, isDirty, nodes, edges } = useWorkflowStore();
    const { fitView } = useReactFlow();
    const router = useRouter();

    const publishMutation = usePublishWorkflow();
    const createMutation = useCreateWorkflow();
    const saveMutation = useSaveWorkflow();

    const handleRun = async () => {
        await executeWorkflow();
    };

    const handlePublish = () => {
        if (!workflowId) return;
        publishMutation.mutate(workflowId);
    };

    const handleCreateAndSave = () => {
        createMutation.mutate(
            { name: 'Untitled Workflow', status: 'draft' },
            {
                onSuccess: (created) => {
                    saveMutation.mutate(
                        { id: created.id, nodes, edges, expectedVersion: '' },
                        {
                            onSuccess: () => {
                                router.replace(`/workflow?id=${created.id}`);
                            }
                        }
                    );
                }
            }
        );
    };

    // Save status indicator
    const SaveIndicator = ({ compact = false }: { compact?: boolean }) => {
        if (isSaving) {
            return (
                <span className="flex items-center gap-1.5 text-[10px] text-blue-500 dark:text-blue-400" title="Saving...">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {!compact && "Saving..."}
                </span>
            );
        }
        if (isDirty) {
            return (
                <span className="flex items-center gap-1.5 text-[10px] text-amber-500 dark:text-amber-400" title="Unsaved changes">
                    <Cloud className="h-3 w-3" />
                    {!compact && "Unsaved"}
                </span>
            );
        }
        if (!isDirty && workflowId) {
            return (
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400" title="All changes saved">
                    <CloudCheck className="h-3 w-3" />
                    {!compact && "Saved"}
                </span>
            );
        }
        return null;
    };

    return (
        <>
            {/* DESKTOP TOOLBAR (Top Right) */}
            <div className="hidden md:flex absolute top-4 right-4 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md p-2 rounded-lg border border-slate-200 dark:border-blue-900/30 shadow-sm z-10 items-center gap-2 glass-obsidian">
                {/* Version + Status */}
                <div className="px-3 py-1 flex flex-col items-end mr-2 border-r border-slate-100 dark:border-blue-900/30 pr-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.status === 'published' ? 'text-green-600 dark:text-green-500' : 'text-amber-500 dark:text-amber-400'}`}>
                        {meta.status}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">v{meta.version}</span>
                </div>

                {/* Auto-save status */}
                <div className="mr-2 border-r border-slate-100 dark:border-blue-900/30 pr-4">
                    <SaveIndicator />
                </div>

                {/* Publish Button (or Create Draft if new) */}
                {!workflowId ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCreateAndSave}
                        disabled={createMutation.isPending || saveMutation.isPending}
                        className="h-8 gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                    >
                        {(createMutation.isPending || saveMutation.isPending) ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                        ) : (
                            <><Cloud className="h-3.5 w-3.5" /> Save Pipeline</>
                        )}
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePublish}
                        disabled={publishMutation.isPending}
                        className="h-8 gap-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border-slate-200 dark:border-slate-800/80 hover:border-blue-200 dark:hover:border-blue-500/50 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 disabled:opacity-50"
                    >
                        {publishMutation.isPending ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing...</>
                        ) : (
                            <><CloudCheck className="h-3.5 w-3.5" /> Publish</>
                        )}
                    </Button>
                )}

                {/* Run Button */}
                <Button size="sm" onClick={handleRun} className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Run
                </Button>
            </div>

            {/* MOBILE STATUS BAR (Top Right) */}
            <div className="md:hidden absolute top-4 right-4 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md p-1.5 rounded-lg border border-slate-200 dark:border-blue-900/30 shadow-sm z-20 flex items-center gap-1.5 glass-obsidian">
                <span className={`text-[9px] font-bold uppercase tracking-wider ${meta.status === 'published' ? 'text-green-600 dark:text-green-500' : 'text-amber-500 dark:text-amber-400'}`}>
                    {meta.status}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-blue-900/30 pl-1.5">
                    v{meta.version}
                </span>
                <div className="border-l border-slate-200 dark:border-blue-900/30 pl-1.5 flex items-center">
                    <SaveIndicator compact />
                </div>
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
