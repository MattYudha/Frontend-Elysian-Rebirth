'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, AgentActionRequest } from '@/store/notificationStore';
import { formatDistanceToNow, isBefore } from 'date-fns';
import {
    Bot, AlertTriangle, Info, ShieldAlert, CheckCircle2, ChevronLeft,
    XCircle, Undo2, ArrowLeft, Search, Filter, Clock, ShieldCheck,
    ShieldX, ShieldQuestion, CheckSquare, Square, Download, Copy, Play,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const AiMarkdownRenderer = dynamic(() => import('@/lib/markdown/AiMarkdownRenderer'), { ssr: false });

export function ActionCenterClient() {
    const { actions, approveAction, rejectAction, undoAction, refreshSLAStatuses, fetchActions } = useNotificationStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');

    useEffect(() => {
        fetchActions();
    }, [fetchActions]);

    // Bulk Selection State
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    // Executive Pipeline Log Simulation & Override States
    const [executingLogs, setExecutingLogs] = useState<string[]>([]);
    const [justificationNote, setJustificationNote] = useState('');
    const [isOverrideChecked, setIsOverrideChecked] = useState(false);

    const activeTab = searchParams.get('tab') || 'pending';
    const payloadTab = searchParams.get('payload') || 'explanation';

    const setTab = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const setPayloadTab = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('payload', tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const selectedAction = useMemo(() => actions.find(a => a.id === selectedId), [actions, selectedId]);

    // Periodic SLA refresh
    useEffect(() => {
        const interval = setInterval(() => {
            refreshSLAStatuses();
        }, 60000); // every minute
        return () => clearInterval(interval);
    }, [refreshSLAStatuses]);

    // Simulated Execution Logs Effect
    useEffect(() => {
        if (!selectedAction) {
            setExecutingLogs([]);
            return;
        }

        const isProcessing = selectedAction.status === 'approving' || selectedAction.status === 'rejecting';
        if (!isProcessing) {
            setExecutingLogs([]);
            return;
        }

        const isApprove = selectedAction.status === 'approving';
        const rawSteps = isApprove ? [
            `[${new Date().toLocaleTimeString()}] INITIATING AUDIT APPROVAL PROOF FOR ACTION ID: ${selectedAction.id}`,
            `[${new Date().toLocaleTimeString()}] PARSING REQUEST CONFIGURATION... OK`,
            `[${new Date().toLocaleTimeString()}] VERIFYING BLAST RADIUS SCOPE CONTEXT: ${selectedAction.blastRadius.scope.toUpperCase()}`,
            `[${new Date().toLocaleTimeString()}] EVALUATING POLICY RUNTIME GUARDRAILS...`,
            ...selectedAction.policyChecks.map(p => `  -> POLICY CHECK: ${p.label} [${p.status.toUpperCase()}]`),
            `[${new Date().toLocaleTimeString()}] COMPILING STATE PROOF HASH...`,
            `[${new Date().toLocaleTimeString()}] PREPARING TO EMIT CRYPTOGRAPHIC STATE TO PUBLIC BLOCKCHAIN LEDGER...`,
            `[${new Date().toLocaleTimeString()}] BROADCASTING STATE EMISSION...`,
            `[${new Date().toLocaleTimeString()}] EXECUTING STACK WORKFLOW TRIGGER FOR TARGET: ${selectedAction.target.system.toUpperCase()}`,
            `[${new Date().toLocaleTimeString()}] STATE SUCCESSFUL. COMPLETED PROCESS FLOW.`
        ] : [
            `[${new Date().toLocaleTimeString()}] INITIATING REJECTION DISPATCH FOR ACTION ID: ${selectedAction.id}`,
            `[${new Date().toLocaleTimeString()}] CANCELLING WORKFLOW EXECUTION STACK...`,
            `[${new Date().toLocaleTimeString()}] REVERTING TRANSACTION METADATA ENTRIES...`,
            `[${new Date().toLocaleTimeString()}] WRITING COMPLIANCE EXCEPTION LOGS...`,
            `[${new Date().toLocaleTimeString()}] DISPATCH COMPLETE. REJECTION FINALIZED.`
        ];

        setExecutingLogs([rawSteps[0]]);
        let currentStep = 1;
        const interval = setInterval(() => {
            if (currentStep < rawSteps.length) {
                setExecutingLogs(prev => [...prev, rawSteps[currentStep]]);
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 300);

        return () => clearInterval(interval);
    }, [selectedAction?.status, selectedAction?.id]);

    // Derived Filter & Grouping Logic
    const groupedActions = useMemo(() => {
        const filtered = actions.filter(a => {
            // Tab filtering
            if (activeTab === 'pending') {
                if (!['pending', 'approving', 'rejecting'].includes(a.status)) return false;
                if (a.riskScore >= 75) return false; // Critical risk goes to Exceptions
            } else if (activeTab === 'exceptions') {
                const isException = ['failed', 'expired'].includes(a.status) || (['pending', 'approving', 'rejecting'].includes(a.status) && a.riskScore >= 75);
                if (!isException) return false;
            } else if (activeTab === 'review') {
                if (!['approved', 'rejected', 'executed'].includes(a.status)) return false;
            }

            // Search text
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!a.title.toLowerCase().includes(q) &&
                    !a.sourceAgent.toLowerCase().includes(q) &&
                    !a.tenant.toLowerCase().includes(q)) {
                    return false;
                }
            }

            // Filter Chip
            if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;

            return true;
        });

        const now = new Date().getTime();

        return {
            dueSoon: filtered.filter(a => new Date(a.slaDueAt).getTime() - now < 1000 * 60 * 60 * 2), // < 2 hours
            critical: filtered.filter(a => (a.severity === 'critical' || a.severity === 'high') && (new Date(a.slaDueAt).getTime() - now >= 1000 * 60 * 60 * 2)),
            everythingElse: filtered.filter(a => a.severity !== 'critical' && a.severity !== 'high' && (new Date(a.slaDueAt).getTime() - now >= 1000 * 60 * 60 * 2))
        };
    }, [actions, searchQuery, filterSeverity]);

    const toggleSelection = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const next = new Set(selectedItems);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedItems(next);
    };

    const handleBulkApprove = () => {
        let approvedCount = 0;
        let rejectCount = 0;

        Array.from(selectedItems).forEach(id => {
            const action = actions.find(a => a.id === id);
            if (!action) return;

            // Strict Guardrails for Bulk Approval
            const hasFailingPolicy = action.policyChecks.some(p => p.status === 'fail');
            const isInvalidType = action.type === 'BILLING' || action.type === 'IDENTITY';
            const isHighSeverity = action.severity === 'critical' || action.severity === 'high';
            const isExpired = new Date().getTime() >= new Date(action.expiresAt).getTime();

            if (hasFailingPolicy || isInvalidType || isHighSeverity || isExpired) {
                rejectCount++;
            } else {
                approveAction(action.id);
                approvedCount++;
            }
        });

        if (approvedCount > 0) {
            toast.success(`Bulk approved ${approvedCount} actions.`);
        }
        if (rejectCount > 0) {
            toast.error(`${rejectCount} actions failed bulk guardrails and were skipped.`, { duration: 5000 });
        }

        setSelectedItems(new Set());
    };

    const handleApprove = (action: AgentActionRequest) => {
        approveAction(action.id, isOverrideChecked ? justificationNote : undefined);
        toast('Action Approving', {
            description: `Approval for "${action.title}" pending execution.`,
            action: { label: 'Undo', onClick: () => undoAction(action.id) },
            icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
            duration: 3500
        });
        setJustificationNote('');
        setIsOverrideChecked(false);
    };

    const handleReject = (action: AgentActionRequest) => {
        rejectAction(action.id, justificationNote || undefined);
        toast('Action Rejecting', {
            description: `Rejection for "${action.title}" sent.`,
            action: { label: 'Undo', onClick: () => undoAction(action.id) },
            icon: <XCircle className="h-4 w-4 text-rose-500" />,
            duration: 3500
        });
        setJustificationNote('');
        setIsOverrideChecked(false);
    };

    const getRiskColor = (score: number) => {
        if (score >= 75) return 'text-rose-600 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-900';
        if (score >= 40) return 'text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-900';
        return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
    };

    const renderActionCard = (action: AgentActionRequest) => {
        const isSelected = selectedId === action.id;
        const isPending = action.status === 'approving' || action.status === 'rejecting';
        const isSelectedForBulk = selectedItems.has(action.id);

        const now = new Date().getTime();
        const isExpired = now >= new Date(action.expiresAt).getTime();
        const isOverdue = now >= new Date(action.slaDueAt).getTime() && !isExpired;

        return (
            <motion.div
                key={action.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isPending || isExpired ? 0.5 : 1, y: 0, scale: isPending ? 0.98 : 1 }}
                exit={{ opacity: 0, x: -50 }}
                onClick={() => !isPending && !isExpired && setSelectedId(action.id)}
                className={cn(
                    "relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden group",
                    isSelected
                        ? "bg-white dark:bg-[#0B1120] border-blue-300 dark:border-blue-900/50 shadow-md ring-1 ring-blue-500/20"
                        : "bg-white/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900 shadow-sm",
                    (isPending || isExpired) && "pointer-events-none grayscale"
                )}
            >
                {/* Checkbox overlay for bulk actions */}
                {!isPending && !isExpired && (
                    <div
                        onClick={(e) => toggleSelection(e, action.id)}
                        className={cn(
                            "absolute top-4 left-4 z-20 cursor-pointer text-slate-400 hover:text-blue-500 transition-opacity",
                            isSelectedForBulk ? "opacity-100 text-blue-500" : "opacity-0 group-hover:opacity-100"
                        )}
                    >
                        {isSelectedForBulk ? <CheckSquare className="h-5 w-5 bg-white dark:bg-black rounded-sm" /> : <Square className="h-5 w-5 bg-white dark:bg-black rounded-sm" />}
                    </div>
                )}

                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 dark:bg-black/20 backdrop-blur-[1px] z-10">
                        <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/80 gap-1.5 shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            {action.status === 'approving' ? 'Approving' : 'Rejecting'}
                        </Badge>
                    </div>
                )}

                {isExpired && (
                    <div className="absolute top-2 right-2 z-10">
                        <Badge variant="destructive" className="bg-slate-500 text-[10px] h-5">Expired</Badge>
                    </div>
                )}

                <div className={cn("flex gap-3", (isSelectedForBulk || (!isPending && !isExpired)) ? "ml-7" : "")}>
                    <div className="mt-1">
                        {(action.severity === 'critical' || action.severity === 'high') && <AlertTriangle className="h-5 w-5 text-rose-500" />}
                        {action.severity === 'medium' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                        {action.severity === 'low' && <Info className="h-5 w-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{action.title}</h4>
                            {!isExpired && (
                                <span className={cn(
                                    "text-[10px] shrink-0 mt-0.5 font-medium",
                                    isOverdue ? "text-rose-500 font-bold" : "text-slate-500"
                                )}>
                                    due {formatDistanceToNow(new Date(action.slaDueAt), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{action.summary}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 text-slate-600 dark:text-slate-300 gap-1 px-1.5 py-0 border-none">
                                <Bot className="h-3 w-3" />
                                {action.sourceAgent}
                            </Badge>
                            <span className="text-[10px] px-1.5 py-0 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-md truncate max-w-[100px]">
                                {action.tenant}
                            </span>
                            <div className={cn("ml-auto text-[10px] px-1.5 py-[2px] rounded-md border font-mono font-semibold", getRiskColor(action.riskScore))}>
                                RISK {action.riskScore}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex h-full w-full relative">
            {/* Left Pane: Master Queue */}
            <div className={cn(
                "flex flex-col h-full bg-slate-900/5 dark:bg-[#060D18]/40 border-r border-slate-200/50 dark:border-slate-800/50 transition-all duration-300",
                "w-full md:w-[400px] lg:w-[450px] shrink-0",
                selectedId ? "hidden md:flex" : "flex"
            )}>
                {/* Triage Bar Header */}
                <div className="p-4 md:p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2 mb-4">
                        <ShieldAlert className="h-5 w-5 text-blue-500" />
                        Action Center
                    </h2>

                    <Tabs value={activeTab} onValueChange={setTab} className="w-full mb-4">
                        <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                            <TabsTrigger value="exceptions" className="text-xs">Exceptions</TabsTrigger>
                            <TabsTrigger value="review" className="text-xs">Review</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative mb-3">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search title, agent, tenant..."
                            className="pl-9 h-9 bg-white/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
                            <Badge
                                key={severity}
                                variant={filterSeverity === severity ? 'default' : 'secondary'}
                                className="cursor-pointer capitalize px-2 py-0.5 text-[11px] whitespace-nowrap"
                                onClick={() => setFilterSeverity(severity)}
                            >
                                {severity}
                            </Badge>
                        ))}
                    </div>

                    {selectedItems.size > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between animate-in slide-in-from-top-2">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{selectedItems.size} selected</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => setSelectedItems(new Set())}>Clear</Button>
                                <Button size="sm" variant="default" className="h-7 text-xs px-2 bg-blue-600 hover:bg-blue-700" onClick={handleBulkApprove}>Bulk Approve</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Queue Lists Grouped */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {(groupedActions.dueSoon.length === 0 && groupedActions.critical.length === 0 && groupedActions.everythingElse.length === 0) ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 relative">
                                <span className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-ping"></span>
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                {activeTab === 'pending' ? 'All Systems Normal' : activeTab === 'exceptions' ? 'No Exceptions' : 'No Reviews'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">No items match this filter.</p>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {groupedActions.dueSoon.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5 px-1"><Clock className="h-3 w-3" /> Due Soon</h5>
                                    {groupedActions.dueSoon.map(renderActionCard)}
                                </div>
                            )}

                            {groupedActions.critical.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 px-1"><AlertTriangle className="h-3 w-3" /> Critical Risk</h5>
                                    {groupedActions.critical.map(renderActionCard)}
                                </div>
                            )}

                            {groupedActions.everythingElse.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Queue</h5>
                                    {groupedActions.everythingElse.map(renderActionCard)}
                                </div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Right Pane: Detail Reader */}
            <div className={cn(
                "flex-1 flex flex-col bg-slate-50 dark:bg-[#0B1120] h-full overflow-hidden transition-all relative",
                !selectedId ? "hidden md:flex items-center justify-center" : "flex"
            )}>
                {!selectedId ? (
                    <div className="text-center p-8 hidden md:block">
                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Bot className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No Action Selected</h3>
                        <p className="text-sm text-slate-500 mt-1">Select an agent request from the queue to review and authorize.</p>
                    </div>
                ) : selectedAction && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">

                        {/* Detail Header */}
                        <div className="p-4 md:p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 flex items-start gap-4">
                            <Button variant="ghost" size="icon" className="md:hidden shrink-0 -ml-2" onClick={() => setSelectedId(null)}>
                                <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                            </Button>

                            <div className="flex-1 min-w-0 max-w-[980px] mx-auto w-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-[10px] uppercase bg-slate-100 dark:bg-slate-800/50 font-mono tracking-wider text-slate-600 dark:text-slate-400">
                                        {selectedAction.type.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="text-xs font-mono text-slate-500">{selectedAction.tenant}</span>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {selectedAction.title}
                                </h2>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-1.5"><Bot className="h-4 w-4" /> {selectedAction.sourceAgent}</div>
                                    <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatDistanceToNow(new Date(selectedAction.createdAt), { addSuffix: true })}</div>
                                    <div className="flex items-center gap-1.5"><Play className="h-4 w-4" /> <span className="font-mono text-xs">{selectedAction.id}</span></div>
                                </div>
                            </div>
                        </div>
                        {/* Scrollable Content Pane - Crucially we pad-bottom to prevent sticky footer clash */}
                        <div className="flex-1 overflow-y-auto w-full pb-28">
                            <div className="max-w-[980px] w-full mx-auto p-4 md:p-6 space-y-6">
                                { (selectedAction.status === 'approving' || selectedAction.status === 'rejecting') ? (
                                    <div className="bg-slate-950 text-slate-200 font-mono text-xs p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-3 min-h-[400px] flex flex-col justify-between">
                                        <div className="flex items-center gap-2 pb-3 border-b border-slate-905/30 text-slate-400">
                                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="ml-2 font-sans font-bold text-[10px] uppercase tracking-wider text-slate-400">Orchestrator Execution Pipeline</span>
                                        </div>
                                        <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] scrollbar-thin pt-2">
                                            {executingLogs.map((log, index) => (
                                                <div key={index} className="leading-relaxed whitespace-pre-wrap">
                                                    <span className="text-blue-500 font-bold">&gt;&gt;</span> {log}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-3 border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-between">
                                            <span className="uppercase tracking-wider">Status: {selectedAction.status.toUpperCase()}</span>
                                            <span>{Math.min(executingLogs.length * 10, 100)}% committed</span>
                                        </div>
                                    </div>
                                ) : (selectedAction.status === 'approved' || selectedAction.status === 'rejected') ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-white dark:bg-[#060D18] rounded-2xl border border-slate-200/60 dark:border-slate-850 shadow-sm animate-in zoom-in-95 duration-300">
                                        <div className={cn(
                                            "w-16 h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg",
                                            selectedAction.status === 'approved' ? "bg-emerald-500 shadow-emerald-500/20" : "bg-rose-500 shadow-rose-500/20"
                                        )}>
                                            {selectedAction.status === 'approved' ? <CheckCircle2 className="w-8 h-8 animate-bounce" /> : <XCircle className="w-8 h-8 animate-bounce" />}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Action {selectedAction.status === 'approved' ? 'Approved & Executed' : 'Rejected'}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                                            The agent request has been successfully processed and logged in the immutable audit ledger.
                                        </p>
                                        <Button className="mt-6 text-xs bg-blue-600 hover:bg-blue-750 text-white font-medium" onClick={() => setSelectedId(null)}>
                                            Dismiss & Back to Queue
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Risk & Policy Summary Panel */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Risk Block */}
                                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm p-5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4" /> Risk Analysis
                                                    </h3>
                                                    <Badge className={getRiskColor(selectedAction.riskScore)} variant="outline">Score: {selectedAction.riskScore}/100</Badge>
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                                                    {selectedAction.summary}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                        <span className="text-slate-400 block mb-1">Blast Radius</span>
                                                        <span className="font-semibold dark:text-slate-200 uppercase">{selectedAction.blastRadius.scope}</span>
                                                        {selectedAction.blastRadius.rowsAffected && <span className="text-slate-500 ml-1">({selectedAction.blastRadius.rowsAffected} rows)</span>}
                                                    </div>
                                                    <div className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                        <span className="text-slate-400 block mb-1">Target System</span>
                                                        <span className="font-semibold dark:text-slate-200 uppercase">{selectedAction.target.system}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Policy Guardrails Block */}
                                            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm p-5 space-y-3">
                                                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                                                    <ShieldAlert className="h-4 w-4" /> Policy Guidelines
                                                </h3>
                                                {selectedAction.policyChecks.map(policy => (
                                                    <div key={policy.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                        {policy.status === 'pass' && <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />}
                                                        {policy.status === 'fail' && <ShieldX className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />}
                                                        {policy.status === 'warn' && <ShieldQuestion className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />}
                                                        <div>
                                                            <p className={cn("text-sm font-medium", policy.status === 'fail' ? "text-rose-700 dark:text-rose-400" : "text-slate-700 dark:text-slate-300")}>
                                                                {policy.label}
                                                            </p>
                                                            {policy.details && <p className="text-xs text-slate-500 mt-0.5">{policy.details}</p>}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Human Override Controls */}
                                                {selectedAction.policyChecks.some(p => p.status === 'fail' || p.status === 'warn') && (
                                                    <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                id="override-policies"
                                                                checked={isOverrideChecked}
                                                                onChange={(e) => setIsOverrideChecked(e.target.checked)}
                                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 cursor-pointer"
                                                            />
                                                            <label htmlFor="override-policies" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1">
                                                                Request Human Override Justification
                                                            </label>
                                                        </div>

                                                        {isOverrideChecked && (
                                                            <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                                                                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Override Justification Note *</span>
                                                                <textarea
                                                                    placeholder="Describe why this action is safe to bypass existing policy rules..."
                                                                    value={justificationNote}
                                                                    onChange={(e) => setJustificationNote(e.target.value)}
                                                                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-[#060D18] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-250 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[60px]"
                                                                    required
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Swarm Intelligence Memory Pack update Explanation */}
                                        <div className="rounded-xl border border-blue-500/20 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 dark:from-blue-950/20 dark:to-purple-950/5 shadow-sm p-5 space-y-3">
                                            <h3 className="font-semibold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                                <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                                                Swarm Memory Pack Feedback Loop
                                            </h3>
                                            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                                                Setiap keputusan manual, persetujuan bypass, atau penolakan kebijakan yang Anda lakukan akan dikirim kembali ke <strong>AI Swarm</strong> secara otomatis.
                                            </p>
                                            <div className="p-3 bg-white/50 dark:bg-slate-950/40 rounded-lg border border-blue-500/10 text-[11px] text-slate-500 dark:text-slate-400">
                                                <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">💡 Cara Swarm Belajar:</span>
                                                Setelah Anda memberikan justifikasi dan menyetujui, AI Swarm akan mempelajari pengecualian ini secara otomatis untuk audit di masa mendatang (Memory Pack updated).
                                            </div>
                                        </div>

                                        {/* Main Payload Tabs Viewer */}
                                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#060D18] shadow-sm overflow-hidden">
                                            <Tabs value={payloadTab} onValueChange={setPayloadTab} className="w-full">
                                                <div className="bg-slate-100/50 dark:bg-slate-900/50 px-4 pt-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                                    <TabsList className="bg-transparent h-10 p-0">
                                                        {selectedAction.explanation && <TabsTrigger value="explanation" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#0B1120] rounded-b-none border-t border-x border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 pb-2">Explanation</TabsTrigger>}
                                                        {selectedAction.payloadType === 'diff' && <TabsTrigger value="diff" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#0B1120] rounded-b-none border-t border-x border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 pb-2">Diff Viewer</TabsTrigger>}
                                                        <TabsTrigger value="raw" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#0B1120] rounded-b-none border-t border-x border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 pb-2">Raw Payload</TabsTrigger>
                                                        <TabsTrigger value="trace" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#0B1120] rounded-b-none border-t border-x border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-800 pb-2">Audit Trace</TabsTrigger>
                                                    </TabsList>

                                                    <div className="flex gap-2 pb-1">
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedAction.payload, null, 2))}>
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                                                            <Download className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="p-0 min-h-[300px] text-sm text-slate-700 dark:text-slate-350">
                                                    {selectedAction.explanation && (
                                                        <TabsContent value="explanation" className="p-6 m-0 border-none">
                                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                                <AiMarkdownRenderer content={selectedAction.explanation} />
                                                            </div>
                                                        </TabsContent>
                                                    )}

                                                    {selectedAction.payloadType === 'diff' && (
                                                        <TabsContent value="diff" className="p-0 m-0 border-none overflow-x-auto text-[13px]">
                                                            <ReactDiffViewer
                                                                oldValue={JSON.stringify(selectedAction.payload.before, null, 2)}
                                                                newValue={JSON.stringify(selectedAction.payload.after, null, 2)}
                                                                splitView={true}
                                                                compareMethod={DiffMethod.WORDS}
                                                                useDarkTheme={true}
                                                                styles={{
                                                                    variables: {
                                                                        dark: {
                                                                            diffViewerBackground: 'transparent',
                                                                            diffViewerColor: '#cbd5e1',
                                                                            addedBackground: '#064e3b',
                                                                            addedColor: '#34d399',
                                                                            removedBackground: '#881337',
                                                                            removedColor: '#f43f5e',
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </TabsContent>
                                                    )}

                                                    <TabsContent value="raw" className="p-6 m-0 border-none">
                                                        <pre className="p-4 text-xs font-mono text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-800">
                                                            {JSON.stringify(selectedAction.payload, null, 2)}
                                                        </pre>
                                                    </TabsContent>

                                                    <TabsContent value="trace" className="p-6 m-0 border-none">
                                                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                                                            {selectedAction.timelineEvents.map((event, idx) => (
                                                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                                    <div className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                                        <Clock className="w-3 h-3" />
                                                                    </div>
                                                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm text-xs">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="font-bold text-slate-800 dark:text-slate-200">{event.type}</div>
                                                                            <div className="text-slate-500 font-mono text-[10px]">{formatDistanceToNow(new Date(event.at), { addSuffix: true })}</div>
                                                                        </div>
                                                                        <div className="text-slate-600 dark:text-slate-400 mb-2">{event.note}</div>
                                                                        <div className="font-semibold text-blue-600 dark:text-blue-400 text-[10px] uppercase">{event.actor}</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </TabsContent>
                                                </div>
                                            </Tabs>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sticky Footer Actions */}
                        <div className="absolute bottom-0 w-full px-4 md:px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 z-40">
                            {activeTab !== 'review' && selectedAction.status !== 'approved' && selectedAction.status !== 'rejected' && selectedAction.status !== 'approving' && selectedAction.status !== 'rejecting' ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" className="h-10 text-xs">Request Changes</Button>
                                        <Button variant="outline" className="h-10 text-xs">Escalate</Button>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                                        <Button
                                            variant="outline"
                                            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 h-10 w-full md:w-auto"
                                            onClick={() => handleReject(selectedAction)}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md h-10 w-full md:w-auto gap-2"
                                            onClick={() => handleApprove(selectedAction)}
                                            // Guardrail check: Critical Policy fails, unless Override is checked with a valid justification
                                            disabled={selectedAction.policyChecks.some(p => p.status === 'fail') && !(isOverrideChecked && justificationNote.trim().length > 0)}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            {isOverrideChecked ? 'Override Decision' : 'Approve manually'}
                                        </Button>
                                    </div>
                                </>
                            ) : (activeTab === 'review' || selectedAction.status === 'approved' || selectedAction.status === 'rejected') && (selectedAction.status !== 'approving' && selectedAction.status !== 'rejecting') ? (
                                <div className="flex items-center gap-3 w-full justify-end">
                                    <Button variant="outline" className="h-10 text-xs gap-2" onClick={() => setSelectedId(null)}>
                                        Back to List
                                    </Button>
                                    {selectedAction.status === 'approved' && (
                                        <Button variant="outline" className="h-10 text-xs gap-2">
                                            <Undo2 className="h-4 w-4" />
                                            Revert Changes
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-500 font-mono animate-pulse w-full text-center py-2">
                                    PROCESSING SECURE EMISSION PIPELINE... PLEASE DO NOT CLOSE THIS VIEW
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
