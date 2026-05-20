"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Server,
    Clock,
    Activity,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { fetchWorkflowById, workflowKeys } from "@/queries/workflow.queries"
import { cn } from "@/lib/utils"
import { useTenant } from "@/contexts/TenantContext"

interface PipelineDetailDrawerProps {
    pipelineId: string | null
    isOpen: boolean
    onClose: () => void
}

const statusColors = {
    active: "text-blue-600 bg-blue-50 border-blue-200",
    draft: "text-slate-600 bg-slate-50 border-slate-200",
    archived: "text-slate-500 bg-slate-100 border-slate-200",
    processing: "text-amber-600 bg-amber-50 border-amber-200",
    completed: "text-emerald-600 bg-emerald-50 border-emerald-200",
    queued: "text-violet-600 bg-violet-50 border-violet-200",
    failed: "text-rose-600 bg-rose-50 border-rose-200",
}

export function PipelineDetailDrawer({ pipelineId, isOpen, onClose }: PipelineDetailDrawerProps) {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    // Internal Fetching - Drawer owns its data requests
    const { data: pipeline, isLoading, isError } = useQuery({
        queryKey: workflowKeys.detail(tenantId, pipelineId!),
        queryFn: () => fetchWorkflowById(pipelineId!),
        enabled: !!pipelineId && isOpen && !!tenantId,
    })

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    // Handle Escape key closure
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop Overlay - Elysian Specification */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
                        onClick={onClose}
                        aria-label="Close pipeline details"
                    />

                    {/* Drawer Body - Elysian Glassmorphism */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative flex h-full w-full max-w-md flex-col border-l border-blue-100/50 bg-white/70 backdrop-blur-md shadow-2xl z-10"
                    >
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="flex flex-col items-center gap-2 text-blue-500">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="text-sm font-medium text-slate-500">Fetching Details...</span>
                                </div>
                            </div>
                        ) : isError || !pipeline ? (
                            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                                <div className="rounded-full bg-rose-50 p-3">
                                    <XCircle className="h-8 w-8 text-rose-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-slate-900">Pipeline not found</p>
                                    <p className="text-sm text-slate-500">The requested pipeline could not be loaded or no longer exists.</p>
                                </div>
                                <Button variant="outline" onClick={onClose} className="mt-2">Close</Button>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-start justify-between border-b border-blue-50/50 px-6 py-5 bg-gradient-to-r from-blue-50/30 to-transparent">
                                    <div className="flex flex-col gap-1 min-w-0 pr-4">
                                        <h2 className="text-lg font-semibold text-slate-900 truncate leading-tight">
                                            {pipeline.name}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border", statusColors[pipeline.status as keyof typeof statusColors] || statusColors.draft)}>
                                                {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
                                            </span>
                                            <span className="text-xs text-slate-400 font-mono">ID: {pipeline.id.substring(0, 8)}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                        onClick={onClose}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">

                                    {/* Metadata Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-blue-50/50 bg-white/40">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <CalendarDays className="h-4 w-4" />
                                                <span className="text-xs font-medium uppercase tracking-wider">Created</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {new Date(pipeline.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-blue-50/50 bg-white/40">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Activity className="h-4 w-4" />
                                                <span className="text-xs font-medium uppercase tracking-wider">Last Run</span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800">
                                                {pipeline.lastRun ? new Date(pipeline.lastRun).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Nodes / Edges Summary - Target Accents */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                            <Server className="h-4 w-4 text-blue-500" />
                                            Architecture Summary
                                        </h3>
                                        <div className="rounded-xl border border-blue-100/50 bg-gradient-to-r from-blue-500/80 to-cyan-400/80 p-4 shadow-sm">
                                            <div className="flex justify-around text-center">
                                                <div className="space-y-1">
                                                    <p className="text-2xl font-bold text-white drop-shadow-sm">{pipeline.nodes?.length || 0}</p>
                                                    <p className="text-xs font-medium text-blue-50">Total Nodes</p>
                                                </div>
                                                <div className="w-px bg-white/20" />
                                                <div className="space-y-1">
                                                    <p className="text-2xl font-bold text-white drop-shadow-sm">{pipeline.edges?.length || 0}</p>
                                                    <p className="text-xs font-medium text-blue-50">Connections</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Execution Logs Placeholder */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                                Recent Activity
                                            </h3>
                                            <Button variant="link" className="text-xs h-auto p-0 text-blue-600">View All</Button>
                                        </div>

                                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-100 before:to-transparent">

                                            {/* Dummy Log Trace 1 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                </div>
                                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white/60 p-3 rounded-lg border border-blue-50 shadow-sm">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-xs text-slate-800">Vector Indexing</h4>
                                                        <time className="text-[10px] text-slate-400">2 min ago</time>
                                                    </div>
                                                    <p className="text-xs text-slate-500">Processed 1,204 documents</p>
                                                </div>
                                            </div>

                                            {/* Dummy Log Trace 2 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                </div>
                                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white/60 p-3 rounded-lg border border-blue-50 shadow-sm">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold text-xs text-slate-800">Chunking & Embeddings</h4>
                                                        <time className="text-[10px] text-slate-400">5 min ago</time>
                                                    </div>
                                                    <p className="text-xs text-slate-500">OpenAI text-embedding-ada-002</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </>
                        )}
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    )
}
