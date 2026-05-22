import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Terminal, ShieldAlert, CheckCircle2, Loader2, X, Link2, ExternalLink, RefreshCw } from 'lucide-react';
import { AgentChatPanel } from './AgentChatPanel';

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

interface BlockchainInfo {
    tx_hash?: string;
    network?: string;
    status?: string;
}

interface SwarmReviewPanelProps {
    documentId: string;
    items: any[];
    onClose: () => void;
}

interface ConsoleLog {
    timestamp: number;
    agent: string;
    step: string;
    message?: string;
    type: 'system' | 'agent';
}

const cleanThinkTags = (text: string | undefined): string => {
    if (!text) return '';
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
    cleaned = cleaned.replace(/<think>[\s\S]*/gi, '');
    cleaned = cleaned.trim();
    
    // Check if the cleaned text is a JSON representation or contains JSON manager_conclusion key
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        try {
            const parsed = JSON.parse(cleaned);
            if (parsed.manager_conclusion) {
                return parsed.manager_conclusion.trim();
            }
            if (parsed.message) {
                return parsed.message.trim();
            }
        } catch (e) {
            // Regex fallback for invalid JSON strings containing manager_conclusion
            const match = cleaned.match(/"manager_conclusion"\s*:\s*"([^"]+)"/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
    }
    
    // Regex check if the string contains the manager_conclusion key
    if (cleaned.includes('"manager_conclusion"')) {
        const match = cleaned.match(/"manager_conclusion"\s*:\s*"([^"]+)"/);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    return cleaned;
};

export function SwarmReviewPanel({ documentId, items, onClose }: SwarmReviewPanelProps) {
    const [status, setStatus] = useState<'IDLE' | 'CHECKING_EXISTING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('CHECKING_EXISTING');
    const [taskId, setTaskId] = useState<string | null>(null);
    const [results, setResults] = useState<SwarmResult[]>([]);
    const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(null);
    const [selectedItemForChat, setSelectedItemForChat] = useState<SwarmResult | null>(null);

    // Dynamic console tracking states
    const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('Initializing Swarm Review...');
    const [activeAgent, setActiveAgent] = useState<'System' | 'Auditor' | 'Pengawas' | 'Manager' | null>('System');
    const consoleEndRef = useRef<HTMLDivElement>(null);
    const hasTriggeredRef = useRef(false);

    const checkExistingTask = async () => {
        try {
            const res = await fetch(`/api/proxy/swarm/tasks?document_id=${documentId}`);
            if (!res.ok) {
                setStatus('IDLE');
                return;
            }
            const json = await res.json();
            if (json.status === 'success' && json.data && json.data.length > 0) {
                const task = json.data[0];
                setTaskId(task.id);
                hasTriggeredRef.current = true;

                const blockchain = {
                    tx_hash: task.blockchain_tx || '',
                    network: task.blockchain_network || 'Sepolia',
                    status: task.blockchain_status || 'PENDING_COMMIT'
                };

                if (task.status === 'COMPLETED') {
                    const rawResults = task.results;
                    let parsedResults: SwarmResult[] = [];
                    if (rawResults) {
                        parsedResults = typeof rawResults === 'string'
                            ? JSON.parse(rawResults)
                            : rawResults;
                    }

                    // Clean results
                    const cleanedResults = parsedResults.map((r: any) => ({
                        ...r,
                        manager_conclusion: cleanThinkTags(r.manager_conclusion),
                        agent_logs: (r.agent_logs || []).map((l: any) => ({
                            ...l,
                            message: cleanThinkTags(l.message)
                        }))
                    }));

                    setResults(cleanedResults);
                    setBlockchainInfo(blockchain);
                    
                    const bcStatus = blockchain.status;
                    const isBlockchainFinal = bcStatus === 'VERIFIED' || bcStatus === 'FAILED' || bcStatus === 'UNCOMMITTED';
                    
                    if (isBlockchainFinal) {
                        setConsoleLogs(prev => [
                            ...prev,
                            {
                                timestamp: Date.now(),
                                agent: 'System',
                                step: bcStatus === 'VERIFIED'
                                    ? 'Consensus verified. Blockchain audit trail locked. (loaded from history)'
                                    : `Consensus verified. Blockchain audit trail status: ${bcStatus || 'N/A'}. (loaded from history)`,
                                type: 'system'
                            }
                        ]);
                        setProgress(100);
                        setCurrentStep('Review Completed');
                    } else {
                        // Blockchain is still committing/confirming
                        setConsoleLogs(prev => [
                            ...prev,
                            {
                                timestamp: Date.now(),
                                agent: 'System',
                                step: bcStatus === 'PENDING_COMMIT'
                                    ? 'Consensus finalized. Committing audit trail to blockchain... (loaded from history)'
                                    : 'Blockchain transaction submitted. Waiting for confirmation... (loaded from history)',
                                type: 'system'
                            }
                        ]);
                        setProgress(bcStatus === 'PENDING_COMMIT' ? 90 : 95);
                        setCurrentStep(bcStatus === 'PENDING_COMMIT' ? 'Committing to Blockchain...' : 'Confirming Blockchain Transaction...');
                    }
                    setStatus('COMPLETED');
                } else if (task.status === 'PROCESSING' || task.status === 'PENDING') {
                    setConsoleLogs([
                        {
                            timestamp: Date.now(),
                            agent: 'System',
                            step: `Resuming swarm review task. Task ID: ${task.id}...`,
                            type: 'system'
                        }
                    ]);
                    setProgress(task.status === 'PENDING' ? 10 : 50);
                    setCurrentStep('Resuming consensus task...');
                    setStatus('PROCESSING');
                    listenToSSE(task.id);
                } else if (task.status === 'FAILED') {
                    setConsoleLogs([
                        {
                            timestamp: Date.now(),
                            agent: 'System',
                            step: `Task ${task.id} failed in previous run.`,
                            type: 'system'
                        }
                    ]);
                    setStatus('FAILED');
                } else {
                    setStatus('IDLE');
                }
            } else {
                setStatus('IDLE');
            }
        } catch (err) {
            console.error("Error checking existing task:", err);
            setStatus('IDLE');
        }
    };

    useEffect(() => {
        checkExistingTask();
    }, [documentId]);

    // Auto-scroll logic for terminal console
    useEffect(() => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [consoleLogs]);

    const triggerSwarm = async () => {
        setStatus('PROCESSING');
        setProgress(5);
        setCurrentStep('Initializing Swarm Review Pipeline...');
        setConsoleLogs([
            {
                timestamp: Date.now(),
                agent: 'System',
                step: 'Initializing Swarm Review Pipeline...',
                type: 'system'
            }
        ]);
        setActiveAgent('System');

        try {
            // Get tenant_id from cookies (fallback)
            const getCookie = (name: string) => {
                if (typeof document === 'undefined') return null;
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop()?.split(';').shift();
                return null;
            };
            const tenantId = getCookie('tenant_id');
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            };
            if (tenantId) {
                headers['X-Tenant-ID'] = tenantId;
            }

            // Use BFF Proxy route (reads token from HTTP-Only cookie server-side)
            const res = await fetch('/api/proxy/swarm/upload', {
                method: 'POST',
                headers,
                body: JSON.stringify({ document_id: documentId, items })
            });
            const data = await res.json();
            
            if (data.task_id) {
                setTaskId(data.task_id);
                setConsoleLogs(prev => [
                    ...prev,
                    {
                        timestamp: Date.now(),
                        agent: 'System',
                        step: `Consensus task created. Task ID: ${data.task_id}. Subscribing to stream...`,
                        type: 'system'
                    }
                ]);
                setProgress(10);
                setCurrentStep('Subscribing to consensus stream...');
                listenToSSE(data.task_id);
            } else {
                setConsoleLogs(prev => [
                    ...prev,
                    {
                        timestamp: Date.now(),
                        agent: 'System',
                        step: 'Pipeline registration failed. No task ID returned.',
                        type: 'system'
                    }
                ]);
                setStatus('FAILED');
            }
        } catch (e: any) {
            setConsoleLogs(prev => [
                ...prev,
                {
                    timestamp: Date.now(),
                    agent: 'System',
                    step: `Pipeline trigger error: ${e.message || e}`,
                    type: 'system'
                }
            ]);
            setStatus('FAILED');
        }
    };

    const listenToSSE = (taskId: string) => {
        // Use BFF Proxy SSE endpoint
        const eventSource = new EventSource(`/api/proxy/swarm/events?task_id=${taskId}`);
        let errorCount = 0;
        const MAX_SSE_ERRORS = 5;
        
        eventSource.onmessage = (event) => {
            // Reset error count on successful message
            errorCount = 0;
            try {
                const data = JSON.parse(event.data);
                
                // CRITICAL SECURITY CONSTRAINT: Filter by taskId to prevent cross-leakage
                if (data.task_id !== taskId) {
                    return;
                }

                if (data.status === 'PROCESSING') {
                    if (data.progress !== undefined) {
                        setProgress(data.progress);
                    }
                    if (data.step) {
                        setCurrentStep(cleanThinkTags(data.step));
                    }
                    if (data.agent) {
                        setActiveAgent(data.agent);
                    }

                    // Append to console logs
                    setConsoleLogs(prev => {
                        const cleanStep = cleanThinkTags(data.step);
                        const cleanMsg = cleanThinkTags(data.message);
                        
                        // Check if we already have a log with the same step/message at the end
                        // to avoid duplicates if SSE redelivers
                        const isDuplicate = prev.some(log => 
                            log.step === cleanStep && 
                            log.message === cleanMsg && 
                            log.agent === data.agent
                        );
                        if (isDuplicate) return prev;

                        return [...prev, {
                            timestamp: data.timestamp || Date.now(),
                            agent: data.agent || 'System',
                            step: cleanStep || '',
                            message: cleanMsg,
                            type: data.agent === 'System' ? 'system' : 'agent'
                        }];
                    });
                } else if (data.status === 'COMPLETED') {
                    const cleanedResults = (data.results || []).map((r: any) => ({
                        ...r,
                        manager_conclusion: cleanThinkTags(r.manager_conclusion),
                        agent_logs: (r.agent_logs || []).map((l: any) => ({
                            ...l,
                            message: cleanThinkTags(l.message)
                        }))
                    }));

                    setResults(cleanedResults);
                    setBlockchainInfo(data.blockchain || null);
                    setStatus('COMPLETED');

                    const bcStatus = data.blockchain?.status;
                    const isBlockchainFinal = !bcStatus || bcStatus === 'VERIFIED' || bcStatus === 'FAILED' || bcStatus === 'UNCOMMITTED';

                    if (isBlockchainFinal) {
                        setConsoleLogs(prev => {
                            if (prev.some(log => log.step.includes('Consensus verified'))) return prev;
                            return [
                                ...prev,
                                {
                                    timestamp: Date.now(),
                                    agent: 'System',
                                    step: bcStatus === 'VERIFIED' 
                                        ? 'Consensus verified. Blockchain audit trail locked.'
                                        : `Consensus verified. Blockchain audit trail status: ${bcStatus || 'N/A'}.`,
                                    type: 'system'
                                }
                            ];
                        });
                        setProgress(100);
                        setCurrentStep('Review Completed');
                        setActiveAgent(null);
                        eventSource.close();
                    } else {
                        // Blockchain is still committing or confirming!
                        setConsoleLogs(prev => {
                            const stepMsg = bcStatus === 'PENDING_COMMIT' 
                                ? 'Consensus finalized. Committing audit trail to blockchain...' 
                                : 'Blockchain transaction submitted. Waiting for confirmation...';
                            
                            if (prev.some(log => log.step === stepMsg)) return prev;
                            return [
                                ...prev,
                                {
                                    timestamp: Date.now(),
                                    agent: 'System',
                                    step: stepMsg,
                                    type: 'system'
                                }
                            ];
                        });
                        setProgress(bcStatus === 'PENDING_COMMIT' ? 90 : 95);
                        setCurrentStep(bcStatus === 'PENDING_COMMIT' ? 'Committing to Blockchain...' : 'Confirming Blockchain Transaction...');
                    }
                }
            } catch (e) {
                console.error("Failed to parse SSE", e);
            }
        };

        eventSource.onerror = () => {
            errorCount++;
            if (errorCount >= MAX_SSE_ERRORS) {
                // Too many errors — stop reconnecting
                eventSource.close();
                setConsoleLogs(prev => [
                    ...prev,
                    {
                        timestamp: Date.now(),
                        agent: 'System',
                        step: 'Stream disconnected after multiple retries. Results will appear when ready.',
                        type: 'system'
                    }
                ]);
            } else if (errorCount === 1) {
                // Only log the first error to avoid flooding console
                setConsoleLogs(prev => [
                    ...prev,
                    {
                        timestamp: Date.now(),
                        agent: 'System',
                        step: 'Event stream reconnecting...',
                        type: 'system'
                    }
                ]);
            }
        };
    };

    useEffect(() => {
        if (items.length > 0 && status === 'IDLE' && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            triggerSwarm();
        }
    }, [items, status]);

    // Polling fallback to check task status in case SSE stream is disconnected
    useEffect(() => {
        if (!taskId) return;

        const isBcFinal = blockchainInfo && (blockchainInfo.status === 'VERIFIED' || blockchainInfo.status === 'FAILED' || blockchainInfo.status === 'UNCOMMITTED');
        const shouldPoll = status === 'PROCESSING' || (status === 'COMPLETED' && !isBcFinal);
        if (!shouldPoll) return;

        const intervalId = setInterval(async () => {
            try {
                const res = await fetch(`/api/proxy/swarm/tasks/${taskId}`);
                if (!res.ok) return;
                const json = await res.json();
                if (json.status === 'success' && json.data) {
                    const task = json.data;
                    
                    const blockchain = {
                        tx_hash: task.blockchain_tx || '',
                        network: task.blockchain_network || 'Sepolia',
                        status: task.blockchain_status || 'PENDING_COMMIT'
                    };

                    const isBlockchainFinal = blockchain.status === 'VERIFIED' || blockchain.status === 'FAILED' || blockchain.status === 'UNCOMMITTED';

                    if (task.status === 'COMPLETED') {
                        const rawResults = task.results;
                        let parsedResults: SwarmResult[] = [];
                        if (rawResults) {
                            parsedResults = typeof rawResults === 'string'
                                ? JSON.parse(rawResults)
                                : rawResults;
                        }

                        // Clean results
                        const cleanedResults = parsedResults.map((r: any) => ({
                            ...r,
                            manager_conclusion: cleanThinkTags(r.manager_conclusion),
                            agent_logs: (r.agent_logs || []).map((l: any) => ({
                                ...l,
                                message: cleanThinkTags(l.message)
                            }))
                        }));

                        setResults(cleanedResults);
                        setBlockchainInfo(blockchain);

                        if (isBlockchainFinal) {
                            clearInterval(intervalId);
                            setConsoleLogs(prev => {
                                if (prev.some(l => l.step.includes('Consensus verified'))) {
                                    return prev;
                                }
                                return [
                                    ...prev,
                                    {
                                        timestamp: Date.now(),
                                        agent: 'System',
                                        step: blockchain?.status === 'VERIFIED'
                                            ? 'Consensus verified. Blockchain audit trail locked. (via status polling)'
                                            : `Consensus verified. Blockchain audit trail status: ${blockchain?.status || 'N/A'} (via status polling)`,
                                        type: 'system'
                                    }
                                ];
                            });

                            setProgress(100);
                            setCurrentStep('Review Completed');
                            setActiveAgent(null);
                            setStatus('COMPLETED');
                        } else {
                            // Update console logs for blockchain progress in polling fallback
                            setConsoleLogs(prev => {
                                const stepMsg = blockchain.status === 'PENDING_COMMIT'
                                    ? 'Committing audit trail to blockchain... (via status polling)'
                                    : 'Confirming blockchain transaction... (via status polling)';
                                if (prev.some(l => l.step === stepMsg)) return prev;
                                return [
                                    ...prev,
                                    {
                                        timestamp: Date.now(),
                                        agent: 'System',
                                        step: stepMsg,
                                        type: 'system'
                                    }
                                ];
                            });
                            setProgress(blockchain.status === 'PENDING_COMMIT' ? 90 : 95);
                            setCurrentStep(blockchain.status === 'PENDING_COMMIT' ? 'Committing to Blockchain...' : 'Confirming Blockchain Transaction...');
                            setStatus('COMPLETED');
                        }
                    } else if (task.status === 'FAILED') {
                        clearInterval(intervalId);
                        setStatus('FAILED');
                        setConsoleLogs(prev => [
                            ...prev,
                            {
                                timestamp: Date.now(),
                                agent: 'System',
                                step: 'Pipeline execution failed (verified via status polling).',
                                type: 'system'
                            }
                        ]);
                    }
                }
            } catch (err) {
                console.error("Error polling swarm task:", err);
            }
        }, 3000);

        return () => clearInterval(intervalId);
    }, [status, taskId, blockchainInfo]);

    if (selectedItemForChat) {
        return (
            <AgentChatPanel 
                result={selectedItemForChat} 
                onBack={() => setSelectedItemForChat(null)} 
            />
        );
    }

    // Helper to truncate long error messages for cleaner console output
    const truncateMsg = (msg: string, max = 120) => {
        if (!msg) return msg;
        if (msg.length <= max) return msg;
        return msg.slice(0, max) + '…';
    };

    return (
        <div className="w-80 lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 animate-in slide-in-from-right-8 text-slate-800 dark:text-slate-300 font-mono text-sm flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-2 shrink-0">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Terminal className="h-4 w-4" />
                    <h3 className="font-semibold uppercase tracking-wider text-xs">Swarm Pipeline</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-slate-800 dark:hover:text-white" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            {status === 'CHECKING_EXISTING' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 shrink-0">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">Checking task history...</span>
                </div>
            )}

            {status === 'PROCESSING' && (
                <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
                    {/* Professional Console/Terminal */}
                    <div className="flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-md dark:shadow-2xl h-72 lg:h-80 shrink-0">
                        {/* Terminal Window Header */}
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 select-none">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500 block"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 dark:bg-yellow-500 block"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500 block"></span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono ml-2 font-semibold">swarm_pipeline // console</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-ping"></span>
                                <span className="text-[9px] text-green-600 dark:text-green-400 font-mono uppercase tracking-wider font-bold">Live</span>
                            </div>
                        </div>

                        {/* Live Console Output */}
                        <div className="flex-1 bg-white dark:bg-slate-950 p-3 font-mono text-[10px] lg:text-[11px] overflow-y-auto space-y-2 select-text text-slate-700 dark:text-slate-350 leading-relaxed">
                            {consoleLogs.map((log, i) => {
                                const timeString = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                                
                                let agentColor = 'text-blue-600 dark:text-cyan-400'; // System
                                if (log.agent === 'Auditor') agentColor = 'text-amber-700 dark:text-amber-400';
                                else if (log.agent === 'Pengawas') agentColor = 'text-purple-700 dark:text-purple-400';
                                else if (log.agent === 'Manager') agentColor = 'text-emerald-700 dark:text-emerald-400';

                                return (
                                    <div key={i} className="border-b border-slate-100 dark:border-slate-900 pb-1.5 last:border-0">
                                        <span className="text-slate-400 dark:text-slate-500 mr-2">[{timeString}]</span>
                                        <span className={`${agentColor} font-bold mr-1`}>[{log.agent?.toUpperCase() || 'SYSTEM'}]</span>
                                        <span className="text-slate-800 dark:text-slate-200">{truncateMsg(cleanThinkTags(log.step), 100)}</span>
                                        {log.message && (
                                            <div className="mt-1 pl-3 text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-800 whitespace-pre-wrap leading-normal text-[9px] lg:text-[10px] break-all">
                                                {truncateMsg(cleanThinkTags(log.message), 150)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={consoleEndRef} />
                        </div>
                    </div>

                    {/* Progress Bar & Current Status */}
                    <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Pipeline Progress</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold font-mono">{progress}%</span>
                        </div>
                        
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                            <div 
                                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Loader2 className="h-3 w-3 animate-spin text-blue-500 shrink-0" />
                            <span className="truncate italic">Current Task: {currentStep}</span>
                        </div>
                    </div>

                    {/* Agent Status Cards Grid */}
                    <div className="grid grid-cols-3 gap-2 shrink-0">
                        {[
                            { name: 'Auditor', label: 'Auditor', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5' },
                            { name: 'Pengawas', label: 'Compliance', color: 'text-purple-500 border-purple-500/20 bg-purple-500/5' },
                            { name: 'Manager', label: 'Manager', color: 'text-emerald-500 border-emerald-500/20 bg-emerald-50/5' },
                        ].map((ag) => {
                            const isActive = activeAgent === ag.name;
                            const isFinished = consoleLogs.some(l => l.agent === ag.name && l.step.includes('selesai'));
                            
                            let statusText = 'WAITING';
                            let badgeClass = 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800';
                            if (isActive) {
                                statusText = 'ACTIVE';
                                badgeClass = `${ag.color} font-extrabold animate-pulse border shadow-sm`;
                            } else if (isFinished) {
                                statusText = 'DONE';
                                badgeClass = 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40 border';
                            }

                            return (
                                <div key={ag.name} className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{ag.label}</span>
                                    <div className={`mt-1.5 px-2 py-0.5 rounded text-[8px] font-bold tracking-wider ${badgeClass}`}>
                                        {statusText}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {status === 'FAILED' && (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center p-4">
                    <ShieldAlert className="h-10 w-10 text-red-500 animate-bounce" />
                    <h4 className="text-sm font-bold text-red-500">Pipeline Failed</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                        Swarm agent reviews could not be executed or reached a processing error. Check the backend logs.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 text-xs border-slate-200 dark:border-slate-800" onClick={triggerSwarm}>
                        Retry Pipeline
                    </Button>
                </div>
            )}

            {status === 'COMPLETED' && (
                <div className="space-y-4 flex-1 overflow-y-auto pr-1 flex flex-col">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 gap-1.5 font-bold uppercase tracking-wider mb-2 shrink-0 py-2.5 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:border-blue-300 dark:hover:border-blue-800" 
                        onClick={triggerSwarm}
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Re-run Swarm Audit
                    </Button>
                    {/* Blockchain verification card */}
                    {blockchainInfo && (
                        (() => {
                            const status = blockchainInfo.status || 'PENDING_COMMIT';
                            let cardClass = '';
                            let iconClass = '';
                            const textClass = '';
                            let badgeText = '';
                            let icon = null;

                            if (status === 'VERIFIED') {
                                cardClass = 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300';
                                iconClass = 'text-emerald-600 dark:text-emerald-400';
                                badgeText = 'Verified on Blockchain';
                                icon = <CheckCircle2 className="h-3.5 w-3.5 animate-pulse" />;
                            } else if (status === 'FAILED') {
                                cardClass = 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300';
                                iconClass = 'text-red-600 dark:text-red-400';
                                badgeText = 'Blockchain Commit Failed';
                                icon = <ShieldAlert className="h-3.5 w-3.5 animate-bounce" />;
                            } else if (status === 'PENDING_CONFIRMATION') {
                                cardClass = 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300';
                                iconClass = 'text-amber-600 dark:text-amber-400';
                                badgeText = 'Confirming Transaction...';
                                icon = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
                            } else {
                                // PENDING_COMMIT or empty
                                cardClass = 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300';
                                iconClass = 'text-blue-600 dark:text-blue-400';
                                badgeText = 'Committing to Blockchain...';
                                icon = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
                            }

                            return (
                                <div className={`p-3 rounded-lg border shadow-sm transition-all duration-300 ${cardClass}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold tracking-wide">
                                            {icon}
                                            <span className={iconClass}>{badgeText}</span>
                                        </div>
                                        {blockchainInfo.tx_hash && (
                                            <a 
                                                href={`https://sepolia.etherscan.io/tx/${blockchainInfo.tx_hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[9px] hover:underline opacity-85 hover:opacity-100 font-sans font-semibold transition-opacity duration-200 text-blue-650 dark:text-blue-450"
                                            >
                                                <span>View Tx</span>
                                                <ExternalLink className="h-2.5 w-2.5" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-[9px] mt-1.5 font-mono opacity-70 flex justify-between items-center">
                                        <span>Network: {blockchainInfo.network || 'Sepolia'}</span>
                                        {blockchainInfo.tx_hash && (
                                            <span className="truncate max-w-[150px] text-right font-mono" title={blockchainInfo.tx_hash}>
                                                Tx: {blockchainInfo.tx_hash.slice(0, 10)}...{blockchainInfo.tx_hash.slice(-8)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })()
                    )}

                    {results.map((res, idx) => (
                        <div 
                            key={idx} 
                            className={`p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                                res.status === 'FLAGGED' 
                                ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40' 
                                : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                            }`}
                            onClick={() => {
                                if (res.status === 'FLAGGED') {
                                    setSelectedItemForChat(res);
                                }
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-slate-500 dark:text-slate-400">Item: {res.item_id}</span>
                                {res.status === 'FLAGGED' ? (
                                    <Badge variant="destructive" className="h-5 text-[10px] px-1 rounded-sm gap-1 bg-red-650 dark:bg-red-900 hover:bg-red-700">
                                        <ShieldAlert className="h-3 w-3" /> FLAGGED
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="h-5 text-[10px] px-1 rounded-sm gap-1 border-emerald-500 dark:border-emerald-900 text-emerald-600 dark:text-emerald-500 bg-emerald-50/10">
                                        <CheckCircle2 className="h-3 w-3" /> CLEARED
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="space-y-1 mb-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                                {res.agent_logs?.map((log, i) => (
                                    <div key={i} className="text-[10px]">
                                        <span className="text-blue-600 dark:text-blue-400 font-bold">[{log.agent}]</span>{' '}
                                        <span className="text-slate-500 dark:text-slate-400">{log.action}:</span>{' '}
                                        <span className={res.status === 'FLAGGED' ? 'text-red-700 dark:text-red-300' : 'text-slate-600 dark:text-slate-300'}>
                                            {cleanThinkTags(log.message)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {res.manager_conclusion && (
                                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 italic">
                                    {cleanThinkTags(res.manager_conclusion)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
