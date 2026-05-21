'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Protected } from '@/components/auth/Protected';
import { 
    Terminal, 
    ShieldAlert, 
    CheckCircle2, 
    Loader2, 
    X, 
    Link2, 
    Search,
    Shield, 
    Brain, 
    ArrowRight,
    Play,
    Cpu,
    ExternalLink,
    Lock,
    History,
    Activity,
    FileText,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    DownloadCloud
} from 'lucide-react';
import { Button } from '@/components/ui';
import { AgentChatPanel } from '@/components/swarm/AgentChatPanel';
import { blockchainService, SwarmTaskDetail } from '@/services/blockchain.service';

interface LogLine {
    agent: string;
    action: string;
    message: string;
}

interface SwarmResult {
    item_id: string;
    status: 'FLAGGED' | 'CLEARED' | 'PENDING';
    agent_logs: LogLine[];
    manager_conclusion?: string;
}

export default function SwarmReviewPage() {
    return (
        <Protected>
            <SwarmReviewContent />
        </Protected>
    );
}

function SwarmReviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const taskIdParam = searchParams.get('taskId');

    const [taskIdInput, setTaskIdInput] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('IDLE');
    const [results, setResults] = useState<SwarmResult[]>([]);
    const [taskDetail, setTaskDetail] = useState<SwarmTaskDetail | null>(null);
    const [selectedItemForChat, setSelectedItemForChat] = useState<SwarmResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Recent task history state
    const [recentTasks, setRecentTasks] = useState<SwarmTaskDetail[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Live terminal log simulator state
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    useEffect(() => {
        if (taskIdParam) {
            setTaskIdInput(taskIdParam);
            loadAndListen(taskIdParam);
        } else {
            setStatus('IDLE');
            setResults([]);
            setTaskDetail(null);
        }
    }, [taskIdParam]);

    // Fetch history when IDLE
    useEffect(() => {
        if (status === 'IDLE') {
            loadRecentTasks();
        }
    }, [status]);

    const loadRecentTasks = async () => {
        setLoadingHistory(true);
        try {
            const res = await blockchainService.listSwarmTasks(10, 0);
            setRecentTasks(res.data || []);
        } catch (err) {
            console.error("Failed to load recent swarm tasks:", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Live terminal logs simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'PROCESSING') {
            setTerminalLogs([
                `[SYSTEM] Connecting to Cognitive Swarm Node...`,
                `[SYSTEM] Connected. Swarm agent workspace verified.`,
            ]);
            const logsList = [
                `[MANAGER] Allocating subtasks to Auditor Agent & Compliance Agent...`,
                `[AUDITOR] Retrieving document context vectors...`,
                `[COMPLIANCE] Connecting to OpenViking semantic regulations database...`,
                `[AUDITOR] Auditing transactional items for pricing anomalies...`,
                `[COMPLIANCE] Scanning legal indices for compliance rules...`,
                `[AUDITOR] Detected pricing variation. Correlating with global averages...`,
                `[COMPLIANCE] Verification complete: No critical legal violations.`,
                `[MANAGER] Collecting agent deliberations. Resolving consensus debate...`,
                `[MANAGER] Building consensus state report and signing SHA-255 block...`,
                `[SYSTEM] Submitting transaction ledger hashes to blockchain node...`,
            ];
            let idx = 0;
            interval = setInterval(() => {
                if (idx < logsList.length) {
                    setTerminalLogs(prev => [...prev, logsList[idx]]);
                    idx++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [status]);

    const loadAndListen = async (taskId: string) => {
        setStatus('PROCESSING');
        setError(null);
        setResults([]);
        setTaskDetail(null);

        try {
            const detail = await blockchainService.getSwarmTask(taskId);
            setTaskDetail(detail);

            if (detail.status === 'COMPLETED') {
                setStatus('COMPLETED');
                if (detail.results) {
                    const parsedResults = typeof detail.results === 'string' 
                        ? JSON.parse(detail.results) 
                        : detail.results;
                    setResults(Array.isArray(parsedResults) ? parsedResults : []);
                }
            } else if (detail.status === 'FAILED') {
                setStatus('FAILED');
                setError('Swarm task execution failed on backend');
            } else {
                listenToSSE(taskId);
            }
        } catch (err: any) {
            console.error('Failed to load swarm task:', err);
            setError(err?.response?.data?.error || err.message || 'Task not found or database read failed');
            setStatus('FAILED');
        }
    };

    const listenToSSE = (taskId: string) => {
        const eventSource = new EventSource(`/api/proxy/swarm/events?task_id=${taskId}`);
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.task_id === taskId || data.id === taskId) {
                    if (data.status === 'COMPLETED') {
                        const parsedResults = typeof data.results === 'string'
                            ? JSON.parse(data.results)
                            : data.results;
                        setResults(Array.isArray(parsedResults) ? parsedResults : []);
                        
                        setTaskDetail(prev => prev ? {
                            ...prev,
                            status: 'COMPLETED',
                            rationaleHash: data.rationale_hash || prev.rationaleHash,
                            consensusHash: data.consensus_hash || prev.consensusHash,
                            blockchainTx: data.blockchain_tx || prev.blockchainTx,
                            blockchainStat: data.blockchain_status || prev.blockchainStat,
                        } : null);

                        setStatus('COMPLETED');
                        eventSource.close();
                    } else if (data.status === 'FAILED') {
                        setStatus('FAILED');
                        setError('Swarm task failed to complete consensus');
                        eventSource.close();
                    }
                }
            } catch (e) {
                console.error("Failed to parse SSE", e);
            }
        };

        eventSource.onerror = (e) => {
            console.error("SSE Error occurred", e);
        };

        return () => {
            eventSource.close();
        };
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const targetId = taskIdInput.trim();
        if (!targetId) return;

        const params = new URLSearchParams(window.location.search);
        params.set('taskId', targetId);
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    const clearActiveTask = () => {
        router.push(window.location.pathname);
    };

    const handleRecentClick = (id: string) => {
        setTaskIdInput(id);
        const params = new URLSearchParams(window.location.search);
        params.set('taskId', id);
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    if (selectedItemForChat) {
        return (
            <div className="h-full flex flex-col p-6">
                <AgentChatPanel 
                    result={selectedItemForChat} 
                    onBack={() => setSelectedItemForChat(null)} 
                />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                        <Brain className="h-3.5 w-3.5" /> Cognitive Swarm
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-heading">
                        Swarm Consensus Hub
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                        Monitor active multi-agent audit deliberations. Inspect consensus logs of Auditor, Compliance, and Manager agents.
                    </p>
                </div>
                {status !== 'IDLE' && (
                    <Button 
                        onClick={clearActiveTask}
                        variant="outline"
                        className="border-slate-200 dark:border-slate-800 text-xs shrink-0 self-start md:self-auto"
                    >
                        Back to Search
                    </Button>
                )}
            </div>


            {/* If IDLE: Show Input / Intro */}
            {status === 'IDLE' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Search and Intro (Left) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Search Panel */}
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Load Swarm Audit Session</h3>
                                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-505" />
                                        <input
                                            type="text"
                                            placeholder="Enter Swarm Task ID..."
                                            value={taskIdInput}
                                            onChange={(e) => setTaskIdInput(e.target.value)}
                                            className="w-full bg-white/70 dark:bg-[#0B1220]/70 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-blue-400 focus:border-blue-400 rounded-xl pl-11 pr-4 py-3 text-sm transition-all text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                                        />
                                    </div>
                                    <Button 
                                        type="submit"
                                        disabled={!taskIdInput.trim()}
                                        className="py-3 px-6 h-auto rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                                    >
                                        Load Session
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>

                            {/* Cognitive Swarm Introduction Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Auditor Card */}
                                <div className="bg-white/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-xl p-4 space-y-2 relative overflow-hidden backdrop-blur-sm">
                                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/30">
                                        <Cpu className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Auditor Agent</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                        Evaluates financial items mathematically. Performs comparative analysis against standards to flag anomalies.
                                    </p>
                                </div>

                                {/* Compliance Card */}
                                <div className="bg-white/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-xl p-4 space-y-2 relative overflow-hidden backdrop-blur-sm">
                                    <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/30">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Compliance Agent</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                        Audits legal regulatory compliance. Queries OpenViking semantic search rules.
                                    </p>
                                </div>

                                {/* Manager Card */}
                                <div className="bg-white/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-xl p-4 space-y-2 relative overflow-hidden backdrop-blur-sm">
                                    <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/30">
                                        <Brain className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Manager Agent</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                        Facilitates consensus debate and reconciles findings. Generates final report conclusions.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent History (Right) */}
                        <div className="lg:col-span-1 bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm backdrop-blur-md flex flex-col h-[340px]">
                            <div className="flex items-center gap-1.5 mb-3 text-slate-850 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider">
                                <History className="h-4 w-4 text-blue-500 animate-pulse" />
                                <span>Recent Audit Sessions</span>
                            </div>
                            
                            {loadingHistory ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-455" />
                                </div>
                            ) : recentTasks.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-4">
                                    <Activity className="h-8 w-8 text-slate-650 opacity-20 mb-2" />
                                    <p className="text-[11px]">No recent swarm activities recorded.</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                                    {recentTasks.map((task) => (
                                        <div 
                                            key={task.id}
                                            onClick={() => handleRecentClick(task.id)}
                                            className="p-3 bg-white/60 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                                        >
                                            <div className="min-w-0 flex-1 pr-2">
                                                <div className="flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-555 shrink-0" />
                                                    <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate block">
                                                        {task.id.slice(0, 8)}...{task.id.slice(-4)}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] text-slate-450 block mt-1">
                                                    {new Date(task.createdAt).toLocaleDateString()} · {new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                                    task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    task.status === 'FAILED' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-amber-500/10 text-amber-500 animate-pulse'
                                                }`}>
                                                    {task.status}
                                                </span>
                                                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200 transition-transform group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {status === 'FAILED' && error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">Failed to Load Swarm Review</h4>
                        <p className="text-xs text-red-700 dark:text-red-500 mt-0.5">{error}</p>
                        <Button onClick={clearActiveTask} variant="ghost" size="sm" className="mt-2 text-xs text-red-600 hover:text-red-500 p-0 h-auto">
                            Search another ID
                        </Button>
                    </div>
                </div>
            )}

            {/* Processing / Running State */}
            {status === 'PROCESSING' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col space-y-4 min-h-[400px] shadow-2xl relative overflow-hidden font-mono text-xs text-slate-350">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-500/85"></span>
                            <span className="h-3 w-3 rounded-full bg-yellow-500/85"></span>
                            <span className="h-3 w-3 rounded-full bg-green-500/85"></span>
                            <span className="text-[10px] text-slate-500 font-semibold ml-2 uppercase tracking-wider">Cognitive Swarm CLI v1.2.0</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold animate-pulse">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>DELIBERATION PIPELINE ACTIVE</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 p-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {terminalLogs.map((log, index) => {
                            let colorClass = "text-slate-300";
                            if (log.includes("[SYSTEM]")) colorClass = "text-slate-500 font-medium";
                            else if (log.includes("[MANAGER]")) colorClass = "text-purple-400 font-bold";
                            else if (log.includes("[AUDITOR]")) colorClass = "text-blue-400 font-bold";
                            else if (log.includes("[COMPLIANCE]")) colorClass = "text-amber-400 font-bold";
                            
                            return (
                                <div key={index} className={`flex items-start gap-1 font-mono transition-all duration-300 ${colorClass}`}>
                                    <span className="text-slate-600 select-none shrink-0">$</span>
                                    <span className="leading-relaxed whitespace-pre-wrap">{log}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-900 text-[10.5px] text-slate-400 flex items-center justify-between">
                        <span>Awaiting consensus on multi-agent audit ledger...</span>
                        <span className="font-semibold text-slate-550">{Math.min(terminalLogs.length * 10, 100)}% loaded</span>
                    </div>
                </div>
            )}
            {/* Completed Review Showcase */}
            {status === 'COMPLETED' && taskDetail && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Consensus Dashboard Summary Card */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Evaluated</span>
                                <span className="text-xl font-bold font-mono">{results.length} items</span>
                            </div>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                                <AlertTriangle className="h-5 w-5 animate-pulse" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Flags Raised</span>
                                <span className="text-xl font-bold font-mono text-red-500">{results.filter(r => r.status === 'FLAGGED').length}</span>
                            </div>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Cleared</span>
                                <span className="text-xl font-bold font-mono text-emerald-500">{results.filter(r => r.status !== 'FLAGGED').length}</span>
                            </div>
                        </div>

                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Brain className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Consensus Rate</span>
                                <span className="text-xl font-bold font-mono text-purple-500">
                                    {results.length > 0 ? Math.round((results.filter(r => r.status !== 'FLAGGED').length / results.length) * 100) : 100}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Pane: Task Details & Blockchain */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-md">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans">Session Info</h3>
                                
                                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                                    <div>
                                        <span className="text-slate-400 block mb-0.5">Task ID</span>
                                        <code className="bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded font-mono text-[10px] block truncate">
                                            {taskDetail.id}
                                        </code>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block mb-0.5">Document ID</span>
                                        <code className="bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded font-mono text-[10px] block truncate">
                                            {taskDetail.documentId}
                                        </code>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                                        <span className="text-slate-400">Created At</span>
                                        <span>{new Date(taskDetail.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <span className="text-slate-400">Status</span>
                                        <span className="text-green-600 dark:text-green-400 font-bold uppercase">COMPLETED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Blockchain Status Widget */}
                            <div className="bg-gradient-to-br from-slate-900 via-[#0E1527] to-indigo-950 text-white rounded-2xl p-6 space-y-4 shadow-md border border-indigo-900/30">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-indigo-400" />
                                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider font-sans">Blockchain Audit Trail</h3>
                                </div>
                                
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between border-b border-indigo-950/60 pb-2">
                                        <span className="text-slate-400">Registry Status</span>
                                        <span className={`font-bold ${taskDetail.blockchainStat === 'VERIFIED' ? 'text-green-400' : 'text-amber-400'}`}>
                                            {taskDetail.blockchainStat || 'PENDING'}
                                        </span>
                                    </div>

                                    {taskDetail.blockchainTx ? (
                                        <>
                                            <div className="flex justify-between border-b border-indigo-950/60 pb-2">
                                                <span className="text-slate-400">Network</span>
                                                <span>{taskDetail.blockchainNet || 'Sepolia'}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block mb-1">Transaction Hash</span>
                                                <a 
                                                    href={`https://sepolia.etherscan.io/tx/${taskDetail.blockchainTx}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-300 hover:text-indigo-200 font-mono text-[10px] truncate block underline flex items-center gap-1"
                                                >
                                                    {taskDetail.blockchainTx}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-[10px] text-slate-500">
                                            Hashes are generated but the smart contract registration is queued.
                                        </p>
                                    )}

                                    <div className="pt-2">
                                        <Button 
                                            onClick={() => router.push(`/blockchain/verify?taskId=${taskDetail.id}`)}
                                            className="w-full text-xs font-semibold py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-1.5"
                                        >
                                            <Link2 className="h-3.5 w-3.5" />
                                            Launch Provenance Check
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Pane: Review Logs */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                                <Terminal className="h-4 w-4" /> Consensus Results ({results.length} items evaluated)
                            </div>

                            {results.length === 0 ? (
                                <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 text-center text-slate-400 font-sans">
                                    No budget items were flagged or cleared during this review session.
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {results.map((res, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => {
                                                if (res.status === 'FLAGGED') {
                                                    setSelectedItemForChat(res);
                                                }
                                            }}
                                            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                                                res.status === 'FLAGGED' 
                                                ? 'bg-red-50/20 dark:bg-red-950/10 border-red-200 dark:border-red-900/40 hover:bg-red-50/30 dark:hover:bg-red-950/20' 
                                                : 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-50/50 dark:hover:bg-slate-850/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Item Index: #{res.item_id}</span>
                                                {res.status === 'FLAGGED' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                                                        <ShieldAlert className="h-3 w-3" /> FLAGGED FOR REVIEW
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900">
                                                        <CheckCircle2 className="h-3 w-3" /> CLEARED
                                                    </span>
                                                )}
                                            </div>

                                            {/* Debate Logs */}
                                            <div className="space-y-3 pl-3 border-l-2 border-slate-200 dark:border-slate-800 mb-4">
                                                {res.agent_logs?.map((log, i) => (
                                                    <div key={i} className="text-xs">
                                                        <span className={`font-bold mr-1.5 ${
                                                            log.agent === 'Auditor Agent' ? 'text-blue-600 dark:text-blue-400' :
                                                            log.agent === 'Compliance Agent' ? 'text-amber-600 dark:text-amber-400' :
                                                            'text-purple-600 dark:text-purple-400'
                                                        }`}>
                                                            [{log.agent}]
                                                        </span>
                                                        <span className="text-slate-500 font-medium mr-1.5">{log.action}:</span>
                                                        <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                                                            {log.message}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {res.manager_conclusion && (
                                                <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-500 dark:text-slate-400 italic">
                                                    <strong>Consensus Conclusion:</strong> {res.manager_conclusion}
                                                </div>
                                            )}

                                            {res.status === 'FLAGGED' && (
                                                <div className="mt-3 text-[10px] text-blue-500 flex items-center gap-1 justify-end font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Click to chat with agents <ArrowRight className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
