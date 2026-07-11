'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Protected } from '@/components/auth/Protected';
import { useAuthStore } from '@/store/authStore';
import { useTenant } from '@/contexts/TenantContext';
import { getDocumentRaw } from '@/services/rag.service';
import { blockchainService, SwarmTaskDetail, VerificationResult } from '@/services/blockchain.service';
import { 
    ShieldCheck, 
    ShieldAlert, 
    FileText, 
    ExternalLink, 
    Loader2, 
    ArrowLeft, 
    Copy, 
    Check, 
    Info, 
    Database, 
    Cpu,
    AlignLeft,
    Hash,
    Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function DocumentViewerPage({ params }: { params: { id: string } }) {
    return (
        <Protected>
            <DocumentViewerContent documentId={params.id} />
        </Protected>
    );
}

function DocumentViewerContent({ documentId }: { documentId: string }) {
    const accessToken = useAuthStore((s) => s.accessToken) || '';
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    // States
    const [rawText, setRawText] = useState('');
    const [dbHash, setDbHash] = useState('');
    const [computedHash, setComputedHash] = useState('');
    const [isHashValid, setIsHashValid] = useState<boolean | null>(null);
    const [loadingDoc, setLoadingDoc] = useState(true);

    // Blockchain States
    const [swarmTask, setSwarmTask] = useState<SwarmTaskDetail | null>(null);
    const [verifyingBlockchain, setVerifyingBlockchain] = useState(false);
    const [blockchainResult, setBlockchainResult] = useState<VerificationResult | null>(null);
    const [verificationError, setVerificationError] = useState('');

    // Highlight text fragment state
    const [highlightTerm, setHighlightTerm] = useState('');

    // Copy states
    const [copiedHash, setCopiedHash] = useState(false);
    const [copiedDoc, setCopiedDoc] = useState(false);

    // UI state
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    // References
    const textPaneRef = useRef<HTMLPreElement>(null);

    // Load Document Raw Text and metadata
    const loadDocument = async () => {
        if (!tenantId || !accessToken) return;
        setLoadingDoc(true);
        try {
            const res = await getDocumentRaw(accessToken, tenantId, documentId);
            setRawText(res.raw_text);
            setDbHash(res.hash);

            // Compute client-side SHA-256 hash
            const computed = await computeSHA256(res.raw_text);
            setComputedHash(computed);
            
            const hashesMatch = computed.toLowerCase() === res.hash.toLowerCase();
            setIsHashValid(hashesMatch);

            if (hashesMatch) {
                toast.success('Integritas dokumen valid. Cocok dengan database.');
            } else {
                toast.error('Peringatan: Hash dokumen tidak cocok! Dokumen terindikasi dimodifikasi.');
            }
        } catch (err: any) {
            console.error('Failed to load raw document:', err);
            toast.error(err.message || 'Gagal mengambil isi dokumen utuh.');
        } finally {
            setLoadingDoc(false);
        }
    };

    // Retrieve Swarm Task and execute on-chain validation
    const loadSwarmTaskAndVerify = async () => {
        if (!accessToken || !tenantId) return;
        setVerifyingBlockchain(true);
        setVerificationError('');
        try {
            // Find task associated with this document
            const tasksRes = await fetch(`/api/proxy/swarm/tasks?document_id=${documentId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'X-Tenant-ID': tenantId
                }
            });
            if (!tasksRes.ok) {
                throw new Error('Gagal memeriksa riwayat swarm audit.');
            }
            const json = await tasksRes.json();
            if (json.status === 'success' && json.data && json.data.length > 0) {
                const task = json.data[0];
                setSwarmTask(task);

                // If task exists, run blockchain verification using the taskId
                if (task.status === 'COMPLETED' && (task.blockchain_status === 'VERIFIED' || task.blockchain_tx)) {
                    const verification = await blockchainService.verify(task.id);
                    setBlockchainResult(verification);
                }
            } else {
                setSwarmTask(null);
            }
        } catch (err: any) {
            console.error('Blockchain verification failed:', err);
            setVerificationError(err.message || 'Gagal memverifikasi keabsahan blockchain.');
        } finally {
            setVerifyingBlockchain(false);
        }
    };

    // Calculate SHA-256 client-side using Web Cryptography API
    const computeSHA256 = async (message: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Parse URL text fragment hash
    useEffect(() => {
        const parseHashFragment = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#:~:text=')) {
                const term = decodeURIComponent(hash.substring(9));
                setHighlightTerm(term);
            } else {
                setHighlightTerm('');
            }
        };

        parseHashFragment();
        window.addEventListener('hashchange', parseHashFragment);
        return () => window.removeEventListener('hashchange', parseHashFragment);
    }, []);

    // Load data on init
    useEffect(() => {
        loadDocument();
        loadSwarmTaskAndVerify();
    }, [documentId, tenantId, accessToken]);

    // Handle scroll-to-highlight element
    useEffect(() => {
        if (!loadingDoc && rawText && highlightTerm) {
            // Wait slightly for DOM update
            const timer = setTimeout(() => {
                const highlightEl = document.querySelector('.scroll-target');
                if (highlightEl) {
                    highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [loadingDoc, rawText, highlightTerm]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedHash(true);
        toast.success('Hash copied to clipboard.');
        setTimeout(() => setCopiedHash(false), 2000);
    };

    const copyDocumentText = () => {
        if (!rawText) return;
        navigator.clipboard.writeText(rawText);
        setCopiedDoc(true);
        toast.success('Isi dokumen disalin ke clipboard.');
        setTimeout(() => setCopiedDoc(false), 2500);
    };

    // Render document lines with optional line numbers
    const renderDocumentContent = () => {
        if (!rawText) return null;

        if (!showLineNumbers && !highlightTerm) {
            // Fast path: raw HTML with highlight only
            const tempDiv = document.createElement('div');
            tempDiv.innerText = rawText;
            const escaped = tempDiv.innerHTML;
            return (
                <pre
                    ref={textPaneRef}
                    className="flex-1 p-6 text-[12.5px] leading-7 font-mono whitespace-pre-wrap break-words select-text"
                    dangerouslySetInnerHTML={{ __html: escaped }}
                />
            );
        }

        const lines = rawText.split('\n');
        const escapedTerm = highlightTerm
            ? highlightTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            : null;
        const highlightRegex = escapedTerm ? new RegExp(`(${escapedTerm})`, 'gi') : null;

        return (
            <div ref={textPaneRef as any} className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-[12px] leading-7 font-mono">
                    <tbody>
                        {lines.map((line, i) => {
                            let lineContent: React.ReactNode = line || '\u00A0';
                            if (highlightRegex && highlightTerm && line) {
                                const parts = line.split(highlightRegex);
                                lineContent = parts.map((part, pi) =>
                                    highlightRegex.test(part) ? (
                                        <mark
                                            key={pi}
                                            className={cn(
                                                'bg-amber-200/80 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200',
                                                'px-0.5 rounded-sm border border-amber-300/60 dark:border-amber-600/40',
                                                'font-semibold scroll-target'
                                            )}
                                        >
                                            {part}
                                        </mark>
                                    ) : (
                                        <span key={pi}>{part}</span>
                                    )
                                );
                            }
                            return (
                                <tr
                                    key={i}
                                    className="group hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors"
                                >
                                    {showLineNumbers && (
                                        <td className="select-none w-12 shrink-0 pr-4 pl-5 text-right text-[10px] text-slate-400 dark:text-slate-600 border-r border-slate-200/60 dark:border-slate-700/40 align-top pt-0.5">
                                            {i + 1}
                                        </td>
                                    )}
                                    <td className="pl-4 pr-6 py-0 whitespace-pre-wrap break-words align-top text-slate-800 dark:text-slate-200">
                                        {lineContent}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6 w-full pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/80 pb-5">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/documents/qa-gate">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900/80">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-650 dark:from-white dark:to-slate-350 bg-clip-text text-transparent flex items-center gap-3">
                            Document Audit Trail
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                            Verifikasi keaslian dan integritas dokumen secara kriptografis menggunakan blockchain dan ledger lokal.
                        </p>
                    </div>
                </div>
            </div>

            {loadingDoc ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Memuat dokumen dan menghitung SHA-256...</p>
                </div>
            ) : (
                <div className={cn("grid grid-cols-1 gap-8 items-stretch", isExpanded ? "lg:grid-cols-12" : "lg:grid-cols-12")}>
                    {/* Left Panel: Verification Controls (5/12 width) — hidden when expanded */}
                    <div className={cn("flex flex-col space-y-6", isExpanded ? "hidden" : "lg:col-span-5")}>
                        {/* 1. Local Database Integrity Card */}
                        <Card className="border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Database className="h-4.5 w-4.5 text-blue-500" />
                                    Integritas Dokumen Off-Chain
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Verifikasi integritas teks mentah terhadap pencatatan sidik jari digital (hash) di PostgreSQL.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-900 rounded-lg text-xs font-mono">
                                    <div>
                                        <span className="text-slate-450 dark:text-slate-500 block text-[9px] uppercase tracking-wider">Database Record Hash (SHA-256)</span>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <span className="truncate break-all font-semibold text-slate-800 dark:text-slate-200">{dbHash || 'N/A'}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(dbHash)}>
                                                {copiedHash ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-200 dark:border-slate-900/60 pt-2 mt-2">
                                        <span className="text-slate-450 dark:text-slate-500 block text-[9px] uppercase tracking-wider">Client-Side Calculated Hash</span>
                                        <span className="block mt-1 font-semibold text-blue-600 dark:text-blue-400 break-all">{computedHash}</span>
                                    </div>
                                </div>

                                <div className={`p-3.5 rounded-lg border flex gap-3 ${
                                    isHashValid === null
                                        ? 'bg-slate-50/40 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400'
                                        : isHashValid
                                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-850 dark:text-emerald-400'
                                            : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-850 dark:text-red-400'
                                }`}>
                                    {isHashValid === null ? (
                                        <>
                                            <Loader2 className="h-5 w-5 text-slate-500 shrink-0 mt-0.5 animate-spin" />
                                            <div className="text-xs leading-normal">
                                                <p className="font-bold">Menghitung Integritas...</p>
                                                <p className="opacity-80 mt-1">Memproses sidik jari digital (hash) dokumen mentah...</p>
                                            </div>
                                        </>
                                    ) : isHashValid ? (
                                        <>
                                            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
                                            <div className="text-xs leading-normal">
                                                <p className="font-bold">Integritas Terverifikasi</p>
                                                <p className="opacity-80 mt-1">Isi dokumen utuh 100% identik dengan data terdaftar di PostgreSQL. Tidak ada modifikasi ilegal terdeteksi.</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldAlert className="h-5 w-5 text-red-650 dark:text-red-500 shrink-0 mt-0.5" />
                                            <div className="text-xs leading-normal">
                                                <p className="font-bold">Peringatan: Manipulasi Terdeteksi</p>
                                                <p className="opacity-80 mt-1">Hash teks mentah tidak sesuai dengan rekaman database. Dokumen terindikasi dimodifikasi secara ilegal di luar sistem audit.</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. On-Chain Verification Card */}
                        <Card className="border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Cpu className="h-4.5 w-4.5 text-emerald-600" />
                                    Web3 Trust Layer Provenance
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Memeriksa keabsahan konsensus AI Swarm Audit di Blockchain Ethereum Sepolia.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {verifyingBlockchain ? (
                                    <div className="flex flex-col items-center justify-center py-8 gap-2 text-xs">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                        <span className="text-slate-500 animate-pulse">Menghubungi Sepolia node RPC...</span>
                                    </div>
                                ) : verificationError ? (
                                    <div className="p-3 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4" />
                                        <span>{verificationError}</span>
                                    </div>
                                ) : !swarmTask ? (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center text-xs text-slate-500 space-y-2">
                                        <Info className="h-6 w-6 mx-auto opacity-40" />
                                        <p className="font-bold">Belum Ada Riwayat Swarm Audit</p>
                                        <p className="opacity-80">Dokumen ini belum pernah melewati audit evaluasi multi-agen. Jalankan Swarm Review di editor terlebih dahulu.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5 text-xs font-mono p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-900 rounded-lg">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Task ID:</span>
                                                <span className="font-semibold">{swarmTask.id.slice(0, 18)}...</span>
                                            </div>
                                            <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-900/60 pt-1.5 mt-1.5">
                                                <span className="text-slate-400">Consensus:</span>
                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{swarmTask.status}</span>
                                            </div>
                                            {blockchainResult && (
                                                <>
                                                    <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-900/60 pt-1.5 mt-1.5">
                                                        <span className="text-slate-400">Block:</span>
                                                        <span>{blockchainResult.blockNumber || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex flex-col border-t border-slate-200/50 dark:border-slate-900/60 pt-1.5 mt-1.5">
                                                        <span className="text-slate-400">On-chain Rationale Hash:</span>
                                                        <span className="truncate break-all font-semibold mt-0.5 text-[10px]">{blockchainResult.onChainRationaleHash}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {blockchainResult ? (
                                            <div className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 text-emerald-850 dark:text-emerald-400 rounded-lg flex gap-3 text-xs leading-normal">
                                                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold">On-Chain Consensus Match</p>
                                                    <p className="opacity-80 mt-1">Data keputusan audit ini terbukti valid dan tersegel secara kriptografis di blockchain Sepolia.</p>
                                                    {swarmTask.blockchainTx && (
                                                        <a 
                                                            href={`https://sepolia.etherscan.io/tx/${swarmTask.blockchainTx}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 mt-2 text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                                        >
                                                            <span>Lihat di Etherscan</span>
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-3.5 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/40 text-amber-850 dark:text-amber-400 rounded-lg flex gap-3 text-xs leading-normal">
                                                <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-bold">Pending Commit / Uncommitted</p>
                                                    <p className="opacity-80 mt-1">Audit selesai tapi transaksi penyegelan belum dicatat di blockchain, atau sedang dalam antrean sinkronisasi.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Full Original Document Viewer (7/12 width) */}
                    <div className={cn("flex", isExpanded ? "lg:col-span-12" : "lg:col-span-7")}>
                        <div
                            className={cn(
                                'flex flex-col w-full overflow-hidden rounded-2xl border shadow-xl',
                                'border-slate-200/70 dark:border-slate-700/50',
                                'bg-white/70 dark:bg-[#0D1629]/80',
                                'backdrop-blur-2xl',
                                isExpanded ? 'h-[85vh]' : 'h-[650px]',
                            )}
                            style={{
                                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.08), 0 1px 0 rgba(255,255,255,0.1) inset',
                            }}
                        >
                            {/* ── Liquid Glass Header ── */}
                            <div
                                className={cn(
                                    'relative shrink-0 px-5 py-3.5 flex items-center justify-between gap-4',
                                    'border-b border-slate-200/70 dark:border-slate-700/40',
                                    // liquid glass gradient
                                    'bg-gradient-to-r from-white/90 via-blue-50/60 to-indigo-50/50',
                                    'dark:from-slate-900/90 dark:via-blue-950/40 dark:to-indigo-950/30',
                                    'backdrop-blur-xl',
                                )}
                            >
                                {/* Shimmer accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 dark:via-blue-500/30 to-transparent" />

                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Icon badge */}
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 shrink-0">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 leading-tight">
                                            Full Original Document Viewer
                                        </h3>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                                            Teks mentah terverifikasi kriptografis untuk audit manual
                                        </p>
                                    </div>
                                </div>

                                {/* Toolbar actions */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {/* Word count badge */}
                                    {rawText && (
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] font-mono px-2 py-0.5 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 hidden sm:flex"
                                        >
                                            {rawText.split('\n').length} baris
                                        </Badge>
                                    )}

                                    {/* Line numbers toggle */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowLineNumbers(!showLineNumbers)}
                                        className={cn(
                                            'h-7 px-2.5 text-[11px] gap-1.5 rounded-lg font-medium transition-colors',
                                            showLineNumbers
                                                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        )}
                                        title="Toggle line numbers"
                                    >
                                        <Hash className="h-3.5 w-3.5" />
                                        <span className="hidden sm:inline">No.</span>
                                    </Button>

                                    {/* Copy all */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={copyDocumentText}
                                        className="h-7 px-2.5 text-[11px] gap-1.5 rounded-lg font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                        title="Salin seluruh dokumen"
                                    >
                                        {copiedDoc ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                        <span className="hidden sm:inline">{copiedDoc ? 'Disalin!' : 'Salin'}</span>
                                    </Button>

                                    {/* Expand */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="h-7 w-7 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                        title={isExpanded ? 'Perkecil' : 'Perbesar'}
                                    >
                                        <Maximize2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* ── Highlight Alert Banner ── */}
                            {highlightTerm && (
                                <div className="shrink-0 px-5 py-2 flex items-center gap-2 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-800/40">
                                    <div className="p-0.5 rounded bg-amber-400/20 dark:bg-amber-500/20">
                                        <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                    </div>
                                    <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300">
                                        Menyorot: <span className="font-mono font-bold">&quot;{highlightTerm}&quot;</span>
                                    </span>
                                </div>
                            )}

                            {/* ── Document Body ── */}
                            <div
                                className={cn(
                                    'flex-1 overflow-hidden flex flex-col',
                                    // Light mode: clean off-white parchment feel
                                    'bg-slate-50/80 dark:bg-[#080E1C]/90',
                                )}
                            >
                                {/* Subtle inner top shadow for depth */}
                                <div className="h-3 shrink-0 bg-gradient-to-b from-slate-200/30 dark:from-black/20 to-transparent pointer-events-none" />

                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                                    {rawText ? renderDocumentContent() : (
                                        <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400 dark:text-slate-600">
                                            <AlignLeft className="h-10 w-10 opacity-30" />
                                            <p className="text-sm font-medium">Tidak ada konten dokumen</p>
                                        </div>
                                    )}
                                </div>

                                {/* Subtle inner bottom shadow */}
                                <div className="h-3 shrink-0 bg-gradient-to-t from-slate-200/30 dark:from-black/20 to-transparent pointer-events-none" />
                            </div>

                            {/* ── Footer status bar ── */}
                            <div className="shrink-0 px-5 py-2 flex items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-900/50">
                                <div className="flex items-center gap-2">
                                    {isHashValid === true && (
                                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="h-3 w-3" />
                                            Hash Valid
                                        </span>
                                    )}
                                    {isHashValid === false && (
                                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-red-500 dark:text-red-400">
                                            <ShieldAlert className="h-3 w-3" />
                                            Hash Mismatch
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">
                                    {rawText ? `${rawText.length.toLocaleString()} karakter` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
