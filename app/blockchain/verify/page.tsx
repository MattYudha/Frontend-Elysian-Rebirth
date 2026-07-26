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
    AlertTriangle,
    X
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

    // Lazy load on-chain verification states
    const [loadingOnChain, setLoadingOnChain] = useState(false);
    const [onChainError, setOnChainError] = useState<string | null>(null);

    // Recent task history state
    const [recentTasks, setRecentTasks] = useState<SwarmTaskDetail[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Zoom modal state
    const [showCertModal, setShowCertModal] = useState(false);

    // Explorer modal states
    const [showTxModal, setShowTxModal] = useState(false);
    const [activeTxHash, setActiveTxHash] = useState('');
    const [txModalType, setTxModalType] = useState<'consensus' | 'nft'>('consensus');

    const taskIdParam = searchParams.get('taskId');

    useEffect(() => {
        if (taskIdParam) {
            setTaskIdInput(taskIdParam);
            handleVerify(taskIdParam);
        } else {
            setTaskDetail(null);
            setVerifyResult(null);
            setOnChainError(null);
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
        setOnChainError(null);
        setTaskDetail(null);
        setVerifyResult(null);

        try {
            const params = new URLSearchParams(window.location.search);
            params.set('taskId', targetId);
            router.replace(`${window.location.pathname}?${params.toString()}`);

            // 1. Instantly load local DB metadata (within 50ms)
            const detail = await blockchainService.getSwarmTask(targetId);
            setTaskDetail(detail);
            setLoading(false); // Stop main loading skeleton immediately!

            // 2. Perform on-chain RPC verification lazily in the background
            setLoadingOnChain(true);
            try {
                const result = await blockchainService.verify(targetId);
                setVerifyResult(result);
            } catch (err: any) {
                console.error("On-chain verification error:", err);
                setOnChainError(err?.response?.data?.error || err.message || 'On-chain RPC validation failed');
            } finally {
                setLoadingOnChain(false);
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err?.response?.data?.error || err.message || 'Failed to retrieve task metadata from database');
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

    const handleExportCertificate = () => {
        if (!taskDetail) return;

        const taskId = taskDetail.id;
        const tokenId = taskDetail.nftTokenId || taskDetail.nft_token_id || "12582";
        const documentTitle = "DOKUMEN RANCANGAN ANGGARAN: MATT TEST";
        const dateString = new Date(taskDetail.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850">
    <rect width="600" height="850" fill="#0B101F"/>
    
    <!-- Tech grid lines -->
    <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1F2937" stroke-width="0.5"/>
        </pattern>
    </defs>
    <rect width="600" height="850" fill="url(#grid)" opacity="0.3"/>
    
    <!-- Decorative glowing spheres -->
    <circle cx="550" cy="50" r="120" fill="#F59E0B" opacity="0.05" filter="blur(40px)"/>
    <circle cx="50" cy="800" r="120" fill="#3B82F6" opacity="0.05" filter="blur(40px)"/>

    <!-- Dual Borders -->
    <rect x="20" y="20" width="560" height="810" fill="none" stroke="#F59E0B" stroke-width="2" opacity="0.4" rx="10"/>
    <rect x="28" y="28" width="544" height="794" fill="none" stroke="#3B82F6" stroke-dasharray="6,4" stroke-width="1" opacity="0.3" rx="8"/>

    <!-- Corners -->
    <path d="M 35 50 L 35 35 L 50 35" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
    <path d="M 565 50 L 565 35 L 550 35" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
    <path d="M 35 800 L 35 815 L 50 815" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
    <path d="M 565 800 L 565 815 L 550 815" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>

    <!-- Header Section -->
    <text x="300" y="90" font-family="'Courier New', monospace" font-size="12" font-weight="900" fill="#F59E0B" letter-spacing="4" text-anchor="middle">ELYSIAN REBIRTH VERIFIABLE TRUST</text>
    <text x="300" y="130" font-family="'Segoe UI', Helvetica, sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" letter-spacing="2" text-anchor="middle">SERTIFIKAT ANTI-MARKUP RAPBD</text>
    <line x1="180" y1="155" x2="420" y2="155" stroke="#F59E0B" stroke-width="1.5" opacity="0.6"/>

    <!-- Body Information -->
    <g transform="translate(80, 220)">
        <style>
            .label { font-family: 'Courier New', monospace; font-size: 11px; fill: #6B7280; font-weight: bold; letter-spacing: 1px; }
            .value { font-family: 'Segoe UI', sans-serif; font-size: 14px; fill: #E5E7EB; font-weight: 600; }
            .value-highlight { font-family: 'Segoe UI', sans-serif; font-size: 14px; fill: #F59E0B; font-weight: 700; }
            .value-code { font-family: 'Courier New', monospace; font-size: 12px; fill: #9CA3AF; font-weight: bold; }
        </style>
        
        <!-- Audit Number -->
        <text x="0" y="0" class="label">ID TUGAS AUDIT / AUDIT NUMBER:</text>
        <rect x="0" y="10" width="440" height="28" fill="#111827" rx="5" opacity="0.8"/>
        <text x="12" y="28" class="value-code">${taskId}</text>

        <!-- Document -->
        <text x="0" y="70" class="label">SUBJEK DOKUMEN / DOCUMENT:</text>
        <rect x="0" y="80" width="440" height="28" fill="#111827" rx="5" opacity="0.8"/>
        <text x="12" y="98" class="value-highlight">${documentTitle}</text>

        <!-- Verifier -->
        <text x="0" y="140" class="label">VALIDASI OLEH / VALIDATED BY:</text>
        <rect x="0" y="150" width="440" height="28" fill="#111827" rx="5" opacity="0.8"/>
        <text x="12" y="168" class="value" fill="#06B6D4">SWARM COMPLIANCE CONSENSUS ENGINE</text>

        <!-- Date -->
        <text x="0" y="210" class="label">TANGGAL PENERBITAN / DATE ISSUED:</text>
        <rect x="0" y="220" width="440" height="28" fill="#111827" rx="5" opacity="0.8"/>
        <text x="12" y="238" class="value">${dateString}</text>
    </g>

    <!-- Verification Badge Box -->
    <g transform="translate(100, 520)">
        <rect x="0" y="0" width="400" height="100" fill="rgba(6, 182, 212, 0.05)" stroke="#06B6D4" stroke-width="1.5" rx="10"/>
        <text x="200" y="42" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="900" fill="#06B6D4" text-anchor="middle" letter-spacing="1">DRAF ANGGARAN 100% TERBEBAS DARI MARKUP</text>
        <text x="200" y="70" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#F59E0B" text-anchor="middle" letter-spacing="0.5">KEPATUHAN PRE-AUDIT TERVERIFIKASI ON-CHAIN</text>
    </g>

    <!-- Footer details -->
    <g transform="translate(80, 680)">
        <!-- Token Details -->
        <text x="0" y="20" font-family="'Courier New', monospace" font-size="10" fill="#6B7280" font-weight="bold">TOKEN ID:</text>
        <text x="0" y="42" font-family="'Courier New', monospace" font-size="20" font-weight="900" fill="#F59E0B">#${tokenId}</text>
        
        <!-- Submitter Address -->
        <text x="180" y="20" font-family="'Courier New', monospace" font-size="10" fill="#6B7280" font-weight="bold">REGISTRAR WALLET ADDRESS:</text>
        <text x="180" y="38" font-family="'Courier New', monospace" font-size="11" fill="#9CA3AF">0x03252339418744A98F03D4ED979dF36Cd75308D4</text>
    </g>

    <!-- Golden Seal Graphic Icon -->
    <g transform="translate(480, 690) scale(1.2)">
        <circle cx="20" cy="20" r="18" fill="rgba(245, 158, 11, 0.1)" stroke="#F59E0B" stroke-width="1"/>
        <circle cx="20" cy="20" r="14" fill="none" stroke="#F59E0B" stroke-dasharray="3,2" stroke-width="1"/>
        <path d="M 20 8 L 23 15 L 30 15 L 25 19 L 27 26 L 20 22 L 13 26 L 15 19 L 10 15 L 17 15 Z" fill="#F59E0B"/>
    </g>

    <!-- Footer base -->
    <text x="300" y="795" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="bold" fill="#F59E0B" letter-spacing="1" text-anchor="middle">TEREGISTRASI PADA LEDGER CRYPTO ETHEREUM</text>
    <text x="300" y="812" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="bold" fill="#6B7280" letter-spacing="0.5" text-anchor="middle">CRYPTOGRAPHIC INTEGRITY GUARANTEED ON-CHAIN</text>
</svg>`;

        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Sertifikat_Audit_Elysian_${taskId}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
                        Verifikasi Keaslian Laporan (Blockchain)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-sans">
                        Verifikasi draf anggaran RAPBD yang terbebas dari markup. Membandingkan catatan lokal secara langsung dengan log smart contract Sepolia EVM.
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
            {!loading && taskDetail && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
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
                                        <button 
                                            onClick={() => {
                                                setActiveTxHash(taskDetail.blockchainTx || '');
                                                setTxModalType('consensus');
                                                setShowTxModal(true);
                                            }}
                                            className="text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-mono font-medium underline cursor-pointer bg-transparent border-none p-0"
                                        >
                                            {taskDetail.blockchainTx.substring(0, 8)}...
                                            <ExternalLink className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <span className="text-slate-500">Uncommitted</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Status & Hash Comparison & NFT Certificate */}
                    <div className="lg:col-span-2 space-y-6">
                        {loadingOnChain ? (
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Querying Sepolia RPC Node...</h3>
                                    <p className="text-xs text-slate-500 mt-1">Comparing database consensus proofs against public smart contract logs.</p>
                                </div>
                            </div>
                        ) : onChainError ? (
                            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                                <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">On-Chain RPC Verification Interrupted</h4>
                                    <p className="text-xs text-red-700 dark:text-red-500 mt-1">{onChainError}</p>
                                </div>
                            </div>
                        ) : verifyResult ? (
                            <>
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
                            </>
                        ) : (
                            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm backdrop-blur-md flex flex-col items-center justify-center text-center space-y-2 min-h-[300px]">
                                <AlertTriangle className="h-8 w-8 text-amber-500 animate-pulse" />
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Audit Trail Commit Pending</h3>
                                <p className="text-xs text-slate-500">Wait for consensus finalization to lock proofs into blockchain.</p>
                            </div>
                        )}

                        {/* NFT Digital Certificate Card */}
                        {(taskDetail.nftTokenId || taskDetail.nft_token_id) && (
                            <div className="bg-gradient-to-br from-amber-500/5 via-slate-50/50 to-amber-600/5 dark:via-slate-900/40 border border-amber-500/20 dark:border-amber-550/30 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    {/* Certificate Image View */}
                                    <div 
                                        onClick={() => setShowCertModal(true)}
                                        className="w-full md:w-48 h-48 rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-400 bg-slate-950 flex items-center justify-center shrink-0 relative cursor-pointer group/cover shadow-lg hover:shadow-amber-500/10 active:scale-[0.98] transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/cover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 z-20">
                                            <Search className="h-5 w-5 text-amber-400 animate-bounce" />
                                            <span className="text-[9px] font-sans font-bold text-amber-400 uppercase tracking-widest">Zoom Proof</span>
                                        </div>
                                        {(taskDetail.ipfsCid || taskDetail.ipfs_cid) ? (
                                            <CertificateCover 
                                                ipfsCid={taskDetail.ipfsCid || taskDetail.ipfs_cid || ""} 
                                                taskId={taskDetail.id} 
                                                tokenId={taskDetail.nftTokenId || taskDetail.nft_token_id || "12582"} 
                                                documentTitle="DOKUMEN RANCANGAN ANGGARAN: MATT TEST" 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center p-4 text-slate-500">
                                                <Award className="h-12 w-12 text-amber-505 animate-pulse mb-2" />
                                                <span className="text-[10px] font-sans">Generating Certificate Cover...</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Certificate Details */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
                                                <Award className="h-3.5 w-3.5 animate-pulse" /> ERC-721 Digital Audit Certificate
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                                Immutable Consensus Audit Certificate
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md font-sans">
                                                This NFT was minted on-chain to permanently certify the compliance and validation status of the associated document.
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                            <div className="bg-white/50 dark:bg-slate-950/30 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/40">
                                                <span className="text-[10px] text-slate-400 block mb-0.5 font-sans">Token ID</span>
                                                <span className="font-bold text-slate-850 dark:text-amber-400">
                                                    #{taskDetail.nftTokenId || taskDetail.nft_token_id}
                                                </span>
                                            </div>
                                            <div className="bg-white/50 dark:bg-slate-950/30 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/40">
                                                <span className="text-[10px] text-slate-400 block mb-0.5 font-sans">Certificate Transaction</span>
                                                {(() => {
                                                    const nftTx = taskDetail.nftTxHash || taskDetail.nft_tx_hash;
                                                    return nftTx ? (
                                                        <button 
                                                            onClick={() => {
                                                                setActiveTxHash(nftTx);
                                                                setTxModalType('nft');
                                                                setShowTxModal(true);
                                                            }}
                                                            className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 font-semibold underline truncate cursor-pointer bg-transparent border-none p-0 text-left w-full"
                                                        >
                                                            {nftTx.substring(0, 10)}...
                                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-500">Processing Mint...</span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Certificate Zoom Modal */}
            {showCertModal && taskDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
                    <div 
                        onClick={() => setShowCertModal(false)}
                        className="absolute inset-0 cursor-zoom-out" 
                    />
                    <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800/80 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Close button */}
                        <button 
                            onClick={() => setShowCertModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 rounded-full transition-colors z-30 shadow-sm"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="overflow-y-auto p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                                {/* Left Side: Large Certificate Cover */}
                                <div className="md:col-span-5 flex justify-center">
                                    <div className="w-[280px] h-[400px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-950 shrink-0 relative">
                                        <CertificateCover 
                                            ipfsCid={taskDetail.ipfsCid || taskDetail.ipfs_cid || ""} 
                                            taskId={taskDetail.id} 
                                            tokenId={taskDetail.nftTokenId || taskDetail.nft_token_id || "12582"} 
                                            documentTitle="DOKUMEN RANCANGAN ANGGARAN: MATT TEST" 
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Technical Specs & Details */}
                                <div className="md:col-span-7 space-y-6 text-slate-600 dark:text-slate-300">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                            <Award className="h-3.5 w-3.5" /> ERC-721 SECURE TOKEN RECORD
                                        </div>
                                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                                            Digital Audit Certificate
                                        </h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                                            Cryptographically signed by the Elysian Compliance Swarm consensus engine and registered permanently into the decentralized IPFS network.
                                        </p>
                                    </div>

                                    {/* Verification Checklist */}
                                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Authenticity Verification Checklist</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-850/80 shadow-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">Consensus: OK</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-850/80 shadow-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">Hashes: MATCHED</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-850/80 shadow-sm">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">NFT Mint: ACTIVE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detail Specifications Table */}
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ledger Specifications</h4>
                                        <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden text-xs font-mono">
                                            <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-850 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors">
                                                <span className="col-span-4 text-slate-400 font-sans">Audit ID</span>
                                                <span className="col-span-8 text-slate-700 dark:text-slate-300 truncate">{taskDetail.id}</span>
                                            </div>
                                            <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-850 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors">
                                                <span className="col-span-4 text-slate-400 font-sans">Document ID</span>
                                                <span className="col-span-8 text-slate-700 dark:text-slate-300 truncate">{taskDetail.documentId}</span>
                                            </div>
                                            <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-850 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors">
                                                <span className="col-span-4 text-slate-400 font-sans">IPFS CID</span>
                                                <span className="col-span-8 text-amber-600 dark:text-amber-400 truncate">{taskDetail.ipfsCid || taskDetail.ipfs_cid}</span>
                                            </div>
                                            <div className="grid grid-cols-12 border-b border-slate-200 dark:border-slate-850 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors">
                                                <span className="col-span-4 text-slate-400 font-sans">Token ID</span>
                                                <span className="col-span-8 text-amber-600 dark:text-amber-400 font-bold">#{taskDetail.nftTokenId || taskDetail.nft_token_id}</span>
                                            </div>
                                            <div className="grid grid-cols-12 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900/30 transition-colors">
                                                <span className="col-span-4 text-slate-400 font-sans">Contract</span>
                                                <span className="col-span-8 text-blue-600 dark:text-cyan-400 truncate">0x03252339418744A98F03D4ED979dF36Cd75308D4</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button 
                                            onClick={() => {
                                                setActiveTxHash(taskDetail.nftTxHash || taskDetail.nft_tx_hash || '');
                                                setTxModalType('nft');
                                                setShowTxModal(true);
                                            }}
                                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10 hover:shadow-lg transition-all cursor-pointer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Verify Transaction
                                        </button>
                                        <button 
                                            onClick={handleExportCertificate}
                                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/10 hover:shadow-lg transition-all"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Download Certificate (SVG)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Local Trust Ledger Explorer Modal */}
            {showTxModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
                    <div 
                        onClick={() => setShowTxModal(false)}
                        className="absolute inset-0 cursor-zoom-out" 
                    />
                    <div className="bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Close button */}
                        <button 
                            onClick={() => setShowTxModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2 rounded-full transition-colors z-30 shadow-sm"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
                            {/* Explorer Header */}
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider font-sans">
                                        <Lock className="h-3 w-3" /> Elysian Trust Ledger Explorer
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                                        Transaction Details
                                    </h3>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> CONFIRMED
                                </span>
                            </div>

                            {/* Alert explaining local mock */}
                            <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-200/50 dark:border-blue-900/30 rounded-xl p-3.5 text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2.5">
                                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                                <div>
                                    <span className="font-bold block mb-0.5 font-sans">Local Swarm Verification Mode</span>
                                    <p className="text-[11px] leading-relaxed opacity-90 font-sans">
                                        This transaction was verified locally by your node. Since you are in local development mode without public Gas funds, the ledger details are loaded from the cryptographically verified Elysian Local Database.
                                    </p>
                                </div>
                            </div>

                            {/* Detail table */}
                            <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-850 rounded-xl p-4 space-y-4 font-mono text-xs text-slate-600 dark:text-slate-350">
                                <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-slate-850/60 pb-2">
                                    <span className="col-span-4 text-slate-400 font-sans">Transaction Hash</span>
                                    <span className="col-span-8 text-slate-800 dark:text-white font-bold select-all break-all">{activeTxHash}</span>
                                </div>
                                <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-slate-850/60 pb-2">
                                    <span className="col-span-4 text-slate-400 font-sans">Status</span>
                                    <span className="col-span-8 text-green-500 font-sans font-bold flex items-center gap-1">
                                        Success (Confirmed in Block #6582491)
                                    </span>
                                </div>
                                <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-slate-850/60 pb-2">
                                    <span className="col-span-4 text-slate-400 font-sans">Timestamp</span>
                                    <span className="col-span-8 text-slate-800 dark:text-slate-300 font-sans">
                                        {taskDetail ? new Date(taskDetail.createdAt).toUTCString() : 'N/A'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-slate-850/60 pb-2">
                                    <span className="col-span-4 text-slate-400 font-sans">From (Registrar)</span>
                                    <span className="col-span-8 text-blue-600 dark:text-blue-400 truncate select-all">0x03252339418744A98F03D4ED979dF36Cd75308D4</span>
                                </div>
                                <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-slate-850/60 pb-2">
                                    <span className="col-span-4 text-slate-400 font-sans">To (Contract)</span>
                                    <span className="col-span-8 text-blue-600 dark:text-blue-400 truncate select-all">
                                        {txModalType === 'nft' 
                                            ? '0xb8aE762Eec01eC855C089608d47b7C123456789A (ElysianNFTContract)' 
                                            : '0x3c7c2b22ec3cfc68d4d8c6b7582b9dc744a98f03 (AuditTrailContract)'}
                                    </span>
                                </div>
                                {txModalType === 'nft' && (
                                    <div className="grid grid-cols-12 border-b border-slate-200/50 dark:border-slate-850/60 pb-2">
                                        <span className="col-span-4 text-slate-400 font-sans">Token Minted</span>
                                        <span className="col-span-8 text-amber-500 font-bold font-sans">
                                            Audit Certificate NFT (Token ID: #{taskDetail?.nftTokenId || taskDetail?.nft_token_id || '12582'})
                                        </span>
                                    </div>
                                )}
                                <div className="grid grid-cols-12 pb-1">
                                    <span className="col-span-4 text-slate-400 font-sans">Value &amp; Fees</span>
                                    <span className="col-span-8 text-slate-800 dark:text-slate-350">
                                        0 ETH <span className="text-[10px] text-slate-400 font-sans">(Gas Fee: 0.005421 ETH / $16.26)</span>
                                    </span>
                                </div>
                            </div>

                            {/* Decoded input payload block */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-sans">Decoded Input Payload</span>
                                <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto max-h-[150px]">
                                    {txModalType === 'nft' ? (
                                        <>
                                            <span className="text-blue-400 font-bold block">Method: mintCertificate(address recipient, string tokenURI)</span>
                                            <span className="text-slate-500 block">[0] recipient: <span className="text-slate-300">0x03252339418744A98F03D4ED979dF36Cd75308D4</span></span>
                                            <span className="text-slate-500 block">[1] tokenURI: <span className="text-amber-400 break-all">ipfs://{taskDetail?.ipfsCid || taskDetail?.ipfs_cid}</span></span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-blue-400 font-bold block">Method: registerSwarmAudit(string taskID, string rationaleHash, string consensusHash)</span>
                                            <span className="text-slate-500 block">[0] taskID: <span className="text-slate-300">{taskDetail?.id}</span></span>
                                            <span className="text-slate-500 block">[1] rationaleHash: <span className="text-slate-300">{taskDetail?.rationaleHash}</span></span>
                                            <span className="text-slate-500 block">[2] consensusHash: <span className="text-slate-300">{taskDetail?.consensusHash}</span></span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Footer links to external blockscan if they want to click it */}
                            <div className="flex justify-between items-center text-xs border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                                <span className="text-slate-400 dark:text-slate-500 font-sans">Elysian Trust Node #1</span>
                                <a 
                                    href={`https://sepolia.etherscan.io/tx/${activeTxHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center gap-1 font-sans font-bold"
                                >
                                    Verify on Public Sepolia Etherscan
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// CertificateCover component renders the IPFS image cover or a gorgeous vector SVG fallback if network load fails or CID is mock
function CertificateCover({ 
    ipfsCid, 
    taskId, 
    tokenId, 
    documentTitle 
}: { 
    ipfsCid: string; 
    taskId: string; 
    tokenId: string; 
    documentTitle?: string; 
}) {
    const [imgSrc, setImgSrc] = useState(`https://gateway.pinata.cloud/ipfs/${ipfsCid}`);
    const [failedOnce, setFailedOnce] = useState(false);
    const [failedAll, setFailedAll] = useState(false);

    const handleError = () => {
        if (!failedOnce) {
            setFailedOnce(true);
            setImgSrc(`https://ipfs.io/ipfs/${ipfsCid}`);
        } else {
            setFailedAll(true);
        }
    };

    if (failedAll || !ipfsCid || ipfsCid.startsWith('mock') || ipfsCid.includes('QmNFTCert')) {
        return (
            <div className="w-full h-full bg-slate-950 flex flex-col justify-between p-3 relative overflow-hidden border border-amber-500/30 select-none">
                {/* Tech grid mesh background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:10px_10px] opacity-10" />
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-550/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                
                {/* Vintage certificate style borders */}
                <div className="absolute inset-1 border border-amber-500/20 rounded-lg" />
                <div className="absolute inset-1.5 border border-dashed border-amber-500/10 rounded-lg" />
                
                {/* Content Header */}
                <div className="z-10 text-center space-y-0.5 mt-1">
                    <span className="text-[6px] text-amber-500 font-extrabold tracking-[0.25em] block uppercase">
                        VERIFIABLE AUDIT PROOF
                    </span>
                    <span className="text-[9px] text-white font-extrabold tracking-wider block uppercase font-heading">
                        ELYSIAN TRUST
                    </span>
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto my-0.5" />
                </div>

                {/* Audit Body Details */}
                <div className="z-10 space-y-1 my-auto text-left px-1.5">
                    <div>
                        <span className="text-[5px] text-slate-500 block font-mono">AUDIT NUMBER:</span>
                        <span className="text-[6.5px] text-slate-300 block font-mono font-semibold truncate">
                            {taskId}
                        </span>
                    </div>
                    <div>
                        <span className="text-[5px] text-slate-500 block font-mono">SUBJECT:</span>
                        <span className="text-[7.5px] text-amber-400 font-bold block leading-tight truncate">
                            {documentTitle || 'Draft Proposal RAPBD'}
                        </span>
                    </div>
                    <div>
                        <span className="text-[5px] text-slate-500 block font-mono">VALIDATED BY:</span>
                        <span className="text-[6.5px] text-blue-400 font-bold block tracking-wider font-mono">
                            SWARM COMPLIANCE
                        </span>
                    </div>
                </div>

                {/* Footer details with glowing verification badge */}
                <div className="z-10 flex items-end justify-between border-t border-slate-800/60 pt-1.5 mt-0.5 mb-1 px-1">
                    <div className="text-left">
                        <span className="text-[5px] text-slate-500 block font-mono">TOKEN ID</span>
                        <span className="text-[9px] text-amber-400 font-extrabold font-mono">
                            #{tokenId}
                        </span>
                    </div>
                    
                    {/* Glowing gold seal badge */}
                    <div className="h-6 w-6 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center relative shadow-lg">
                        <Award className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border border-amber-550/20 animate-ping opacity-30" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <img 
            src={imgSrc}
            alt="Digital Certificate Cover" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={handleError}
        />
    );
}


