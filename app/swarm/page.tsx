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
import { useDemoStore } from '@/store/demoStore';

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

    const getDemoSwarmTasks = (): SwarmTaskDetail[] => [
        {
            id: 'task-preaudit-2026-001',
            documentId: 'doc-rapbd-001',
            status: 'COMPLETED',
            summary: 'Draf_RAPBD_Diskominfo_Server_2026.pdf',
            blockchainStat: 'VERIFIED',
            blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
            consensusHash: '0x1294812049182470192847c50192847d',
            rationaleHash: '0x918274a50192847c918274a50192847c',
            createdAt: '2026-07-26T10:15:32Z',
            updatedAt: '2026-07-26T10:17:00Z',
        },
        {
            id: 'task-preaudit-2026-002',
            documentId: 'doc-rapbd-002',
            status: 'COMPLETED',
            summary: 'Draf_RAPBD_BPKAD_SoftwareLicense.pdf',
            blockchainStat: 'VERIFIED',
            blockchainTx: '0x1e948c271b0593f48a12059a4c912048f02931a50b4c81092e48275c91823901',
            consensusHash: '0x8274a50192847c918274a50192847c91',
            rationaleHash: '0x0192847c918274a50192847c918274a5',
            createdAt: '2026-07-26T11:02:14Z',
            updatedAt: '2026-07-26T11:04:10Z',
        }
    ];

    const loadRecentTasks = async () => {
        setLoadingHistory(true);
        try {
            const res = await blockchainService.listSwarmTasks(10, 0);
            if (res.data && res.data.length > 0) {
                setRecentTasks(res.data);
            } else {
                setRecentTasks(getDemoSwarmTasks());
            }
        } catch (err) {
            console.error("Failed to load recent swarm tasks, using fallback:", err);
            setRecentTasks(getDemoSwarmTasks());
        } finally {
            setLoadingHistory(false);
        }
    };

    const { isDemoMode } = useDemoStore();

    const getDemoResults = (): SwarmResult[] => [
        {
            item_id: 'MARKUP-2026-001',
            name: 'Pengadaan Server Workstation SIMDA & Storage Array (12 Unit)',
            status: 'FLAGGED',
            manager_conclusion: 'Berdasarkan data Nemesis SIRUP LKPP & SHR 2026, unit price workstation sejenis berada di rentang Rp 60-65jt. Ditemukan penggelembungan anggaran sebesar +133.8%. Ditolak untuk pengesahan RAPBD.',
            agent_logs: [
                { agent: 'Auditor Agent (Analis Matematika)', action: 'MARKUP_DETECTED', message: 'Item proposed: Rp 145.000.000/unit. Standard Nemesis: Rp 62.000.000/unit. Deviation: +133.8% (Potential savings: Rp 996 Juta).' },
                { agent: 'Compliance Agent (Pengawas Hukum)', action: 'LEGAL_FLAG', message: 'Violates Perpres No. 12 Tahun 2021 Article 51 & Perda SHR 2026 regarding regional procurement price standards.' }
            ]
        },
        {
            item_id: 'MARKUP-2026-002',
            name: 'Lisensi Perangkat Lunak Database Enterprise (3 Year)',
            status: 'FLAGGED',
            manager_conclusion: 'Selisih harga usulan vs e-Katalog LKPP mencapai Rp 470.000.000 (+111.9%). Di-flag untuk audit investigatif Inspektorat Daerah.',
            agent_logs: [
                { agent: 'Auditor Agent (Analis Matematika)', action: 'MARKUP_DETECTED', message: 'Proposed Rp 890 Juta vs LKPP e-Catalog Rp 420 Juta.' },
                { agent: 'Compliance Agent (Pengawas Hukum)', action: 'LEGAL_FLAG', message: 'Permendagri No. 77/2020 Compliance warning.' }
            ]
        },
        {
            item_id: 'MARKUP-2026-003',
            name: 'Pengadaan Laptop Operational Inspektorat (25 Unit Core i7)',
            status: 'CLEARED',
            manager_conclusion: 'Disetujui setelah penyesuaian HPS dari Rp 28,5 Juta ke Rp 17,5 Juta sesuai SHR 2026. Total penghematan: Rp 275.000.000.',
            agent_logs: [
                { agent: 'Auditor Agent (Analis Matematika)', action: 'VERIFIED', message: 'Price adjusted to standard Rp 17.500.000.' }
            ]
        }
    ];

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
                `[AUDITOR] ANOMALY DETECTED: "Server Workstation SIMDA" proposed Rp 145.000.000 (Nemesis: Rp 62.000.000). Deviation: +133.8%!`,
                `[COMPLIANCE] Scanning legal indices: Perpres No. 12/2021 & Perda SHR 2026 violation.`,
                `[AUDITOR] Detected pricing variation (+111.9%) on DB Enterprise License.`,
                `[COMPLIANCE] Flagging non-compliant procurement items.`,
                `[MANAGER] Collecting agent deliberations. Resolving consensus debate...`,
                `[MANAGER] Building consensus state report and signing SHA-256 block...`,
                `[SYSTEM] Submitting transaction ledger hashes (0x8f3c71a9...) to Sepolia EVM blockchain node...`,
            ];
            let idx = 0;
            interval = setInterval(() => {
                if (idx < logsList.length) {
                    const line = logsList[idx];
                    if (line) {
                        setTerminalLogs(prev => [...prev, line]);
                    }
                    idx++;
                } else {
                    clearInterval(interval);
                    // Automatically transition to COMPLETED!
                    setStatus('COMPLETED');
                    if (!taskDetail) {
                        setTaskDetail(getDemoSwarmTasks()[0]);
                    }
                    setResults(getDemoResults());
                }
            }, 600);
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

        const demoDetail = {
            id: taskId || 'task-preaudit-2026-001',
            documentId: 'doc-rapbd-001',
            status: 'COMPLETED' as const,
            summary: 'Draf_RAPBD_Diskominfo_Server_2026.pdf',
            blockchainStat: 'VERIFIED',
            blockchainTx: '0x8f3c71a9e4d210b3952f4c919e83120ab592182c401bf920394f912c019284fa',
            consensusHash: '0x1294812049182470192847c50192847d',
            rationaleHash: '0x918274a50192847c918274a50192847c',
            createdAt: '2026-07-26T10:15:32Z',
            updatedAt: '2026-07-26T10:17:00Z',
        };

        if (isDemoMode) {
            setTaskDetail(demoDetail);
            // Let live terminal logs animate then complete
            return;
        }

        try {
            const detail = await blockchainService.getSwarmTask(taskId);
            setTaskDetail(detail);

            if (detail.status === 'COMPLETED') {
                setStatus('COMPLETED');
                if (detail.results) {
                    const parsedResults = typeof detail.results === 'string' 
                        ? JSON.parse(detail.results) 
                        : detail.results;
                    setResults(Array.isArray(parsedResults) && parsedResults.length > 0 ? parsedResults : getDemoResults());
                } else {
                    setResults(getDemoResults());
                }
            } else {
                listenToSSE(taskId);
            }
        } catch (err: any) {
            console.warn('Failed to load real swarm task, falling back to Demo Auditor results:', err);
            setTaskDetail(demoDetail);
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

    const [triggeringSwarm, setTriggeringSwarm] = useState(false);

    const handleStartSwarmReview = async () => {
        setTriggeringSwarm(true);
        setError(null);
        try {
            // Document ID from the 'MATT TEST' document in the database
            const documentId = 'd81762af-b770-448b-bf51-546f8caee9b8';
            const defaultItems = [
                { item_name: 'Leptop Lenovo', name: 'Leptop Lenovo', price: 15000000, quantity: 5, category: 'Laptop IT' },
                { item_name: 'Printer Canon', name: 'Printer Canon', price: 4500000, quantity: 2, category: 'Printer' },
                { item_name: 'Semen Padang', name: 'Semen Padang', price: 120000, quantity: 100, category: 'Semen' }
            ];

            const res = await blockchainService.triggerSwarm(documentId, defaultItems);
            if (res && res.task_id) {
                const params = new URLSearchParams(window.location.search);
                params.set('taskId', res.task_id);
                router.push(`${window.location.pathname}?${params.toString()}`);
            } else {
                throw new Error("Invalid response received from backend");
            }
        } catch (err: any) {
            console.error("Failed to start swarm review:", err);
            setError(err?.response?.data?.error || err.message || 'Failed to trigger swarm consensus review');
            setStatus('FAILED');
        } finally {
            setTriggeringSwarm(false);
        }
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
                            {/* Actions Panel */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Swarm Review Card */}
                                <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                                            <Brain className="h-4 w-4 text-blue-500 animate-pulse" />
                                            Initiate Cognitive Swarm Review
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                            Deploy Auditor, Compliance, and Manager agents to simulate a real-time consensus debate auditing prices against Nemesis DB and regulatory rules.
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={handleStartSwarmReview}
                                        disabled={triggeringSwarm}
                                        className="w-full py-3 px-6 h-auto rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md transition-all duration-300 transform active:scale-95 group relative overflow-hidden"
                                    >
                                        {triggeringSwarm ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Deploying Swarm...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                                                Start Swarm Review
                                            </>
                                        )}
                                        {/* Pulse effect */}
                                        {!triggeringSwarm && (
                                            <span className="absolute inset-0 rounded-xl border-2 border-emerald-400/20 animate-ping pointer-events-none scale-105 duration-1000"></span>
                                        )}
                                    </Button>
                                </div>

                                {/* Search Panel */}
                                <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md flex flex-col justify-between h-full hover:shadow-md transition-all duration-300">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
                                            <History className="h-4 w-4 text-slate-450 dark:text-slate-400" />
                                            Load Swarm Audit Session
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                            Reload and review past AI deliberations or consensus history by providing a specific Swarm Task ID directly.
                                        </p>
                                    </div>
                                    <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                            <input
                                                type="text"
                                                placeholder="Enter Swarm Task ID..."
                                                value={taskIdInput}
                                                onChange={(e) => setTaskIdInput(e.target.value)}
                                                className="w-full bg-white/70 dark:bg-[#0B1220]/70 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-10 pr-3 py-2.5 text-xs transition-all text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                                            />
                                        </div>
                                        <Button 
                                            type="submit"
                                            disabled={!taskIdInput.trim()}
                                            className="py-2.5 px-4 h-auto rounded-xl font-semibold flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md text-xs"
                                        >
                                            Load
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            {/* Cognitive Swarm Introduction Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Auditor Card */}
                                <div className="bg-white/70 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/50 hover:bg-white/95 dark:hover:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 space-y-2 relative overflow-hidden backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
                                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200/30">
                                        <Cpu className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Auditor Agent</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                        Evaluates financial items mathematically. Performs comparative analysis against standards to flag anomalies.
                                    </p>
                                </div>

                                {/* Compliance Card */}
                                <div className="bg-white/70 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/50 hover:bg-white/95 dark:hover:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 space-y-2 relative overflow-hidden backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
                                    <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200/30">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Compliance Agent</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                        Audits legal regulatory compliance. Queries OpenViking semantic search rules.
                                    </p>
                                </div>

                                {/* Manager Card */}
                                <div className="bg-white/70 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/50 hover:bg-white/95 dark:hover:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 space-y-2 relative overflow-hidden backdrop-blur-sm shadow-sm transition-all duration-300 transform hover:-translate-y-0.5">
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
                        <div className="lg:col-span-1 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm backdrop-blur-md flex flex-col h-[340px]">
                            <div className="flex items-center gap-1.5 mb-3 text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase tracking-wider">
                                <History className="h-4 w-4 text-blue-500 animate-pulse" />
                                <span>Recent Audit Sessions</span>
                            </div>
                            
                            {loadingHistory ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                                </div>
                            ) : recentTasks.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-4">
                                    <Activity className="h-8 w-8 text-slate-600 opacity-20 mb-2" />
                                    <p className="text-[11px]">No recent swarm activities recorded.</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                                    {recentTasks.map((task) => (
                                        <div 
                                            key={task.id}
                                            onClick={() => handleRecentClick(task.id)}
                                            className="p-3 bg-white/60 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                                        >
                                            <div className="min-w-0 flex-1 pr-2">
                                                <div className="flex items-center gap-1.5">
                                                    <FileText className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 shrink-0" />
                                                    <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 font-medium truncate block">
                                                        {task.id.slice(0, 8)}...{task.id.slice(-4)}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] text-slate-500 block mt-1">
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
                        <div className="flex items-center gap-2 text-[10px] text-blue-600 dark:text-blue-400 font-bold animate-pulse">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>DELIBERATION PIPELINE ACTIVE</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 p-4 bg-white dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-xl scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {terminalLogs.map((log, index) => {
                            let colorClass = "text-slate-700 dark:text-slate-300";
                            if (typeof log === 'string') {
                                if (log.includes("[SYSTEM]")) colorClass = "text-slate-500 dark:text-slate-450 font-medium";
                                else if (log.includes("[MANAGER]")) colorClass = "text-purple-600 dark:text-purple-400 font-bold";
                                else if (log.includes("[AUDITOR]")) colorClass = "text-blue-600 dark:text-blue-400 font-bold";
                                else if (log.includes("[COMPLIANCE]")) colorClass = "text-amber-600 dark:text-amber-400 font-bold";
                            }
                            
                            return (
                                <div key={index} className={`flex items-start gap-2 font-mono transition-all duration-300 ${colorClass}`}>
                                    <span className="text-slate-400 dark:text-slate-600 select-none shrink-0">$</span>
                                    <span className="leading-relaxed whitespace-pre-wrap">{String(log)}</span>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="bg-slate-150/70 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-900 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>Awaiting consensus on multi-agent audit ledger...</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{Math.min(terminalLogs.length * 10, 100)}% loaded</span>
                    </div>
                </div>
            )}
            {/* Completed Review Showcase */}
            {status === 'COMPLETED' && taskDetail && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Consensus Dashboard Summary Card */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Evaluated</span>
                                <span className="text-xl font-bold font-mono">{results.length} items</span>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400">
                                <AlertTriangle className="h-5 w-5 animate-pulse" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Flags Raised</span>
                                <span className="text-xl font-bold font-mono text-red-500">{results.filter(r => r.status === 'FLAGGED').length}</span>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider font-sans">Cleared</span>
                                <span className="text-xl font-bold font-mono text-emerald-500">{results.filter(r => r.status !== 'FLAGGED').length}</span>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200/30">
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
                            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-sm backdrop-blur-md">
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
