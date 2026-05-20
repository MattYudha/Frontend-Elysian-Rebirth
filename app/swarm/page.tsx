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
    Lock
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

    const loadAndListen = async (taskId: string) => {
        setStatus('PROCESSING');
        setError(null);
        setResults([]);
        setTaskDetail(null);

        try {
            // First, fetch current task details from DB
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
                // If it is PENDING or RUNNING, listen via SSE
                listenToSSE(taskId);
            }
        } catch (err: any) {
            console.error('Failed to load swarm task:', err);
            // If it failed to fetch, we can still try to listen via SSE or show error
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
                        
                        // Update local details representation
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
            // Don't close immediately as it might try to reconnect, but set a fallback state if it takes too long
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
                <div className="space-y-8">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Auditor Card */}
                        <div className="bg-white/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl p-5 space-y-3 relative overflow-hidden backdrop-blur-sm">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/30">
                                <Cpu className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Auditor Agent</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Evaluates financial items mathematically. Performs comparative analysis against Nemesis regional pricing standards to identify budget markup flags.
                            </p>
                        </div>

                        {/* Compliance Card */}
                        <div className="bg-white/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl p-5 space-y-3 relative overflow-hidden backdrop-blur-sm">
                            <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/30">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Compliance Agent</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Audits legal and regulatory compliance. Interacts with the OpenViking library semantic search to provide local regulation mappings.
                            </p>
                        </div>

                        {/* Manager Card */}
                        <div className="bg-white/30 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl p-5 space-y-3 relative overflow-hidden backdrop-blur-sm">
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/30">
                                <Brain className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Manager Agent</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Facilitates structured consensus debate and reconciles findings. Generates final audit report conclusions and issues system flags.
                            </p>
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
                <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px] backdrop-blur-md">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <h3 className="font-bold text-slate-800 dark:text-white animate-pulse">Running Swarm Deliberation Pipeline</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm text-center">
                        The cognitive agents are currently executing analysis and checking database indices. Real-time updates will stream below.
                    </p>
                </div>
            )}

            {/* Completed Review Showcase */}
            {status === 'COMPLETED' && taskDetail && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Pane: Task Details & Blockchain */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-md">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Session Info</h3>
                            
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
                                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Blockchain Audit Trail</h3>
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
                        <div className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <Terminal className="h-4 w-4" /> Consensus Results ({results.length} items evaluated)
                        </div>

                        {results.length === 0 ? (
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
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
            )}
        </div>
    );
}
