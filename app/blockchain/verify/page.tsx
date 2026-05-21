'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { blockchainService, VerificationResult, SwarmTaskDetail } from '@/services/blockchain.service';
import { 
    ShieldCheck, 
    ShieldAlert, 
    Loader2, 
    Search, 
    ExternalLink, 
    Database, 
    Cpu, 
    Clock, 
    FileText, 
    CheckCircle2, 
    XCircle,
    ArrowRight,
    Lock,
    History,
    Activity,
    ChevronRight,
    Award,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Protected } from '@/components/auth/Protected';

export default function BlockchainVerifyPage() {
    return (
        <Protected>
            <BlockchainVerifyContent />
        </Protected>
    );
}

function BlockchainVerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [taskIdInput, setTaskIdInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [taskDetail, setTaskDetail] = useState<SwarmTaskDetail | null>(null);
    const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'mismatch' | 'verified'>('all');

    // Recent task history state
    const [recentTasks, setRecentTasks] = useState<SwarmTaskDetail[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const taskIdParam = searchParams.get('taskId');

    useEffect(() => {
        if (taskIdParam) {
            setTaskIdInput(taskIdParam);
            handleVerify(taskIdParam);
        } else {
            setTaskDetail(null);
            setVerifyResult(null);
            loadRecentTasks();
        }
    }, [taskIdParam]);

    const loadRecentTasks = async () => {
        setLoadingHistory(true);
        try {
            const res = await blockchainService.listSwarmTasks(10, 0);
            setRecentTasks(res.data || []);
        } catch (err) {
            console.error("Failed to load recent swarm tasks for verification:", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleVerify = async (idToVerify: string) => {
        const targetId = idToVerify.trim();
        if (!targetId) return;

        setLoading(true);
        setError(null);
        setTaskDetail(null);
        setVerifyResult(null);

        try {
            const params = new URLSearchParams(window.location.search);
            params.set('taskId', targetId);
            router.replace(`${window.location.pathname}?${params.toString()}`);

            const [detail, result] = await Promise.all([
                blockchainService.getSwarmTask(targetId),
                blockchainService.verify(targetId)
            ]);

            setTaskDetail(detail);
            setVerifyResult(result);
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err?.response?.data?.error || err.message || 'Failed to perform blockchain verification');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleVerify(taskIdInput);
    };

    const handleRecentClick = (id: string) => {
        setTaskIdInput(id);
        handleVerify(id);
    };

    const clearActiveTask = () => {
        router.push(window.location.pathname);
    };

    const formatHash = (hash?: string) => {
        if (!hash) return 'N/A';
        if (hash === '0x0000000000000000000000000000000000000000000000000000000000000000') return 'Empty (0x000...)';
        return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
    };

    const formatDate = (timestampStr: string) => {
        const timestamp = parseInt(timestampStr, 10);
        if (isNaN(timestamp) || timestamp === 0) return 'N/A';
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <div className="h-full flex flex-col overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                        <Lock className="h-3 w-3" /> Trust Layer
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent font-heading">
                        Blockchain Provenance Check
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-sans">
                        Verify the immutable audit trail of Swarm consensus decisions. Compare local system records directly against Sepolia smart contract logs.
                    </p>
                </div>
                {taskDetail && (
                    <Button 
                        onClick={clearActiveTask}
                        variant="outline"
                        className="border-slate-200 dark:border-slate-800 text-xs shrink-0 self-start md:self-auto"
                    >
                        Back to Registry
                    </Button>
                )}
            </div>

            {/* Verification Form Card */}
            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Initiate Crypto Verification Proof</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-505" />
                        <input
                            type="text"
                            placeholder="Enter Swarm Task ID (UUID)..."
                            value={taskIdInput}
                            onChange={(e) => setTaskIdInput(e.target.value)}
                            className="w-full bg-white/70 dark:bg-[#0B1220]/70 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl pl-11 pr-4 py-3 text-sm transition-all text-slate-900 dark:text-white placeholder-slate-400 outline-none shadow-inner"
                        />
                    </div>
                    <Button 
                        type="submit"
                        disabled={loading || !taskIdInput.trim()}
                        className="py-3 px-6 h-auto rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify On-Chain
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* If NO task selected: Show Recent Registry Trail */}
            {!loading && !taskDetail && !verifyResult && (
                <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                        <History className="h-4 w-4 text-blue-500" />
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-sans">
                            Recent Audited Sessions Registry
                        </h3>
                    </div>

                    {loadingHistory ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                        </div>
                    ) : recentTasks.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-center">
                            <Activity className="h-10 w-10 text-slate-550 opacity-20 mb-2" />
                            <p className="text-xs">No audited sessions found in system records.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200/50 dark:border-slate-800/60 text-slate-400 uppercase font-semibold">
                                        <th className="py-3 px-4 font-sans">Task ID</th>
                                        <th className="py-3 px-4 font-sans">Document ID</th>
                                        <th className="py-3 px-4 font-sans">Registration Date</th>
                                        <th className="py-3 px-4 font-sans">Ledger Hash Status</th>
                                        <th className="py-3 px-4 text-right font-sans">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTasks.map((task) => (
                                        <tr 
                                            key={task.id}
                                            className="border-b border-slate-100 dark:border-slate-850/40 hover:bg-slate-50/40 dark:hover:bg-slate-900/40 transition-colors"
                                        >
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-800 dark:text-slate-200 font-medium">
                                                {task.id}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                                                {task.documentId}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500">
                                                {new Date(task.createdAt).toLocaleString()}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {task.blockchainTx ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                                        <CheckCircle className="h-3 w-3" /> COMMITTED
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                                                        <Clock className="h-3 w-3" /> QUEUED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <Button 
                                                    onClick={() => handleRecentClick(task.id)}
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-1 ml-auto"
                                                >
                                                    Verify Prove
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">Verification Process Interrupted</h4>
                        <p className="text-xs text-red-700 dark:text-red-500 mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
                    <div className="lg:col-span-1 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl h-80" />
                    <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl h-80" />
                </div>
            )}

            {/* Verification Result Showcase */}
            {!loading && taskDetail && verifyResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Local Task Metadata */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-sm backdrop-blur-md">
                            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Database className="h-4 w-4 text-blue-500" />
                                Database Record
                            </h3>
                            
                            <div className="space-y-4 text-xs">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block mb-1">Task ID</span>
                                    <span className="font-mono bg-slate-100 dark:bg-[#0B1220] p-1.5 rounded text-[11px] block overflow-x-auto text-slate-700 dark:text-slate-300">
                                        {taskDetail.id}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block mb-1">Associated Document ID</span>
                                    <span className="font-mono bg-slate-100 dark:bg-[#0B1220] p-1.5 rounded text-[11px] block overflow-x-auto text-slate-700 dark:text-slate-300">
                                        {taskDetail.documentId}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Execution Status</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            taskDetail.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' :
                                            taskDetail.status === 'FAILED' ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
                                            'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400'
                                        }`}>
                                            {taskDetail.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Created At</span>
                                        <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1 font-medium">
                                            <Clock className="h-3 w-3" />
                                            {new Date(taskDetail.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Network Config Block */}
                        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 space-y-4 shadow-xl border border-indigo-900/30 relative overflow-hidden">
                            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                                <Cpu className="h-32 w-32" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Network Context</h4>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between border-b border-indigo-900/50 pb-2">
                                    <span className="text-slate-400">Smart Contract</span>
                                    <span className="font-mono text-indigo-200">AuditTrail.sol</span>
                                </div>
                                <div className="flex justify-between border-b border-indigo-900/50 pb-2">
                                    <span className="text-slate-400">Target Chain</span>
                                    <span className="font-medium text-green-400">Sepolia (EVM)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Transaction</span>
                                    {taskDetail.blockchainTx ? (
                                        <a 
                                            href={`https://sepolia.etherscan.io/tx/${taskDetail.blockchainTx}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-mono font-medium underline"
                                        >
                                            {taskDetail.blockchainTx.substring(0, 8)}...
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    ) : (
                                        <span className="text-slate-500">Uncommitted</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Status & Hash Comparison */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className={`border rounded-2xl p-6 shadow-sm backdrop-blur-md flex flex-col md:flex-row items-center gap-6 ${
                            verifyResult.verified 
                                ? 'bg-green-50/40 dark:bg-green-950/10 border-green-200 dark:border-green-900/30' 
                                : 'bg-red-50/40 dark:bg-red-950/10 border-red-200 dark:border-red-900/30'
                        }`}>
                            <div className="shrink-0">
                                {verifyResult.verified ? (
                                    <div className="h-16 w-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 border border-green-200/50 shadow-inner">
                                        <ShieldCheck className="h-10 w-10" />
                                    </div>
                                ) : (
                                    <div className="h-16 w-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 border border-red-200/50 shadow-inner animate-pulse">
                                        <ShieldAlert className="h-10 w-10" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 text-center md:text-left space-y-1">
                                <span className={`text-xs font-bold uppercase tracking-wider ${verifyResult.verified ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {verifyResult.verified ? 'On-Chain Veracity Confirmed' : 'Integrity Match Failure'}
                                </span>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {verifyResult.verified 
                                        ? 'Local Consensus Hashes Match Sepolia Logs' 
                                        : verifyResult.error || 'consensus record discrepancy detected'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                                    {verifyResult.verified 
                                        ? 'This audit consensus is certified authentic. It has not been tampered with since being registered on the public ledger.' 
                                        : 'Warning: The local data hashes do not match the hashes recorded on the public smart contract ledger. Investigation is advised.'}
                                </p>
                            </div>
                        </div>

                        {/* Hash Comparison Table */}
                        <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md space-y-4">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Cryptographic Hash Verification</h4>
                            
                            <div className="space-y-4">
                                {/* Rationale Hash */}
                                <div className="border border-slate-200/50 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rationale Hash</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                            verifyResult.localRationaleHash === verifyResult.onChainRationaleHash && verifyResult.localRationaleHash !== ''
                                                ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                                        }`}>
                                            {verifyResult.localRationaleHash === verifyResult.onChainRationaleHash && verifyResult.localRationaleHash !== '' ? 'Match' : 'Mismatch'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block mb-0.5">Database (Local)</span>
                                            <span className="text-slate-700 dark:text-slate-300 truncate block bg-white dark:bg-[#0B1220] p-1.5 rounded border border-slate-200/30 dark:border-slate-800/30">
                                                {verifyResult.localRationaleHash || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block mb-0.5">Sepolia (On-Chain)</span>
                                            <span className="text-slate-700 dark:text-slate-300 truncate block bg-white dark:bg-[#0B1220] p-1.5 rounded border border-slate-200/30 dark:border-slate-800/30">
                                                {verifyResult.onChainRationaleHash || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Consensus Hash */}
                                <div className="border border-slate-200/50 dark:border-slate-800/60 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Consensus Hash</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                            verifyResult.localConsensusHash === verifyResult.onChainConsensusHash && verifyResult.localConsensusHash !== ''
                                                ? 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                                        }`}>
                                            {verifyResult.localConsensusHash === verifyResult.onChainConsensusHash && verifyResult.localConsensusHash !== '' ? 'Match' : 'Mismatch'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                        <div>
                                            <span className="text-[10px] text-slate-400 block mb-0.5">Database (Local)</span>
                                            <span className="text-slate-700 dark:text-slate-300 truncate block bg-white dark:bg-[#0B1220] p-1.5 rounded border border-slate-200/30 dark:border-slate-800/30">
                                                {verifyResult.localConsensusHash || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 block mb-0.5">Sepolia (On-Chain)</span>
                                            <span className="text-slate-700 dark:text-slate-300 truncate block bg-white dark:bg-[#0B1220] p-1.5 rounded border border-slate-200/30 dark:border-slate-800/30">
                                                {verifyResult.onChainConsensusHash || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* On-Chain Metadata */}
                        {verifyResult.verified && (
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white">Smart Contract Transaction Metadata</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                                            <span className="text-slate-400">Block Height</span>
                                            <span className="font-mono text-slate-700 dark:text-slate-300">{verifyResult.blockNumber}</span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                                            <span className="text-slate-400">Registry Timestamp</span>
                                            <span className="text-slate-700 dark:text-slate-300">{formatDate(verifyResult.timestamp)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                                            <span className="text-slate-400">Registrar Address</span>
                                            <span className="font-mono text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={verifyResult.owner}>
                                                {verifyResult.owner}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1.5 border-b border-slate-200/40 dark:border-slate-800/40">
                                            <span className="text-slate-400">Proof Protocol</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">AuditTrail-v3.0.0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
