"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
    UploadCloud, CheckCircle2, AlertCircle, Loader2, X, FileText, 
    ExternalLink, ChevronRight, Play, Database, ShieldAlert, Award, FileSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface BulkQueueItem {
    id: string; // Postgres document UUID
    file: File;
    status: 'idle' | 'uploading' | 'parsing' | 'running_swarm' | 'completed' | 'failed';
    progress: number; // 0 to 100
    error?: string;
    taskId?: string; // Swarm task UUID
    anomaliesCount?: number; // anomalies flagged by Swarm
    txHash?: string; // Sepolia TX Hash
    nftTokenId?: string; // NFT Token ID if minted
    ipfsCid?: string; // IPFS CID if minted
}

interface BulkImportModalProps {
    open: boolean;
    onClose: () => void;
    onSelectDocument: (docId: string) => void;
    onRefreshDocuments?: () => void;
}

const CONCURRENCY_LIMIT = 3;

export function BulkImportModal({ open, onClose, onSelectDocument, onRefreshDocuments }: BulkImportModalProps) {
    const [queue, setQueue] = useState<BulkQueueItem[]>([]);
    const processingRef = useRef<Set<string>>(new Set());

    // Clean up queue state when opening/closing
    useEffect(() => {
        if (!open) {
            setQueue([]);
            processingRef.current.clear();
        }
    }, [open]);

    // Handle Drop Files
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newItems: BulkQueueItem[] = acceptedFiles.map(file => ({
            id: crypto.randomUUID(),
            file,
            status: 'idle',
            progress: 0
        }));
        setQueue(prev => [...prev, ...newItems]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt', '.md'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: 15 * 1024 * 1024 // 15MB
    });

    const updateItemState = (tempId: string, patch: Partial<BulkQueueItem>) => {
        setQueue(prev => prev.map(item => item.id === tempId ? { ...item, ...patch } : item));
    };

    // Helper for direct S3 XMLHttpRequest Upload
    const uploadToS3 = (url: string, file: File, onProgress: (pct: number) => void): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
            
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    onProgress(Math.round((event.loaded / event.total) * 100));
                }
            };
            
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error(`Direct S3 upload returned status ${xhr.status}`));
            };
            
            xhr.onerror = () => reject(new Error('Network error during direct upload'));
            xhr.send(file);
        });
    };

    // Processing Orchestrator for a single item
    const processItem = async (item: BulkQueueItem) => {
        const tempId = item.id;
        try {
            // Stage 1: Uploading
            updateItemState(tempId, { status: 'uploading', progress: 5 });

            // A. Get Presigned S3 URL
            const presignRes = await fetch(`/api/proxy/documents/presign?filename=${encodeURIComponent(item.file.name)}`);
            if (!presignRes.ok) throw new Error(`Presign API error: status ${presignRes.status}`);
            const presignData = await presignRes.json();
            const { presigned_url, object_key } = presignData;

            // B. Direct upload to S3/MinIO
            updateItemState(tempId, { progress: 15 });
            await uploadToS3(presigned_url, item.file, (pct) => {
                updateItemState(tempId, { progress: 15 + Math.round(pct * 0.6) }); // maps upload to 15-75%
            });

            // C. Confirm upload to Postgres / MongoDB Staging
            updateItemState(tempId, { progress: 80 });
            const confirmRes = await fetch(`/api/proxy/documents/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: item.file.name,
                    object_key: object_key,
                    category: 'laporan'
                })
            });
            if (!confirmRes.ok) throw new Error(`Confirm API error: status ${confirmRes.status}`);
            const confirmData = await confirmRes.json();
            const documentId = confirmData.document_id;

            // Update item with actual DB UUID and transition to parsing state
            updateItemState(tempId, { id: documentId, status: 'parsing', progress: 85 });

            // Stage 2: Track text parsing progress (Polling RAG text endpoint)
            let extractedText = '';
            let isParsed = false;
            for (let i = 0; i < 40; i++) { // poll up to 2 minutes
                await new Promise(r => setTimeout(r, 3000));
                try {
                    const rawRes = await fetch(`/api/proxy/documents/${documentId}/raw`);
                    if (rawRes.ok) {
                        const rawData = await rawRes.json();
                        if (rawData.raw_text && rawData.raw_text.trim() !== '') {
                            extractedText = rawData.raw_text;
                            isParsed = true;
                            break;
                        }
                    }
                } catch (e) {
                    // Ignore transient errors and continue polling
                }
            }

            if (!isParsed) {
                throw new Error("Text extraction timed out on backend worker.");
            }

            // Stage 3: Parse Budget Line Items client-side via Regex to run Swarm debater
            updateItemState(documentId, { progress: 90 });
            const itemPattern = /([a-zA-Z0-9\s]+?)\s*:\s*Rp\s*([0-9.,]+)/gi;
            const parsedItems: any[] = [];
            let match;
            let index = 1;

            // Dynamic location/region detection
            let region = "Jakarta";
            const regionMatch = /(?:wilayah|daerah|lokasi|region)\s*:\s*([a-zA-Z\s]+)/i.exec(extractedText);
            if (regionMatch && regionMatch[1]) {
                region = regionMatch[1].trim();
            } else {
                const textLower = extractedText.toLowerCase();
                if (textLower.includes("purbalingga")) region = "Purbalingga";
                else if (textLower.includes("bandung")) region = "Bandung";
                else if (textLower.includes("surabaya")) region = "Surabaya";
            }

            while ((match = itemPattern.exec(extractedText)) !== null) {
                const name = match[1].trim();
                const priceStr = match[2].replace(/[.,]/g, '');
                const price = parseFloat(priceStr);
                if (name && !isNaN(price)) {
                    // Extract Quantity if written e.g. "5 Laptop" or "Laptop (5 unit)"
                    let qty = 1;
                    const qtyMatchBefore = new RegExp(`(\\d+)\\s+${name}`, 'i').exec(extractedText);
                    const qtyMatchAfter = new RegExp(`${name}\\s*\\((\\d+)\\s*(?:unit|pcs)?\\)`, 'i').exec(extractedText);
                    if (qtyMatchBefore) qty = parseInt(qtyMatchBefore[1], 10);
                    else if (qtyMatchAfter) qty = parseInt(qtyMatchAfter[1], 10);

                    let department = "Umum";
                    if (extractedText.toLowerCase().includes("kominfo")) department = "Kominfo";

                    parsedItems.push({
                        item_id: `ITM-00${index}`,
                        name: name,
                        requested_price: price,
                        qty: qty,
                        quantity: qty,
                        department: department,
                        metadata: { region }
                    });
                    index++;
                }
            }

            // If no budget items found, complete review directly as clean
            if (parsedItems.length === 0) {
                updateItemState(documentId, { 
                    status: 'completed', 
                    progress: 100, 
                    anomaliesCount: 0 
                });
                processingRef.current.delete(tempId);
                onRefreshDocuments?.();
                return;
            }

            // Stage 4: Trigger AI Swarm Review & Poll Consensus Results
            updateItemState(documentId, { status: 'running_swarm', progress: 92 });
            const swarmRes = await fetch('/api/proxy/swarm/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ document_id: documentId, items: parsedItems })
            });
            if (!swarmRes.ok) throw new Error("Failed to trigger Swarm Review API.");
            const swarmData = await swarmRes.json();
            const taskId = swarmData.task_id;

            updateItemState(documentId, { taskId, progress: 95 });

            // Poll Swarm Consensus Task status
            let isSwarmDone = false;
            let finalTaskData: any = null;
            for (let j = 0; j < 60; j++) { // poll up to 3 minutes
                await new Promise(r => setTimeout(r, 3000));
                try {
                    const taskRes = await fetch(`/api/proxy/swarm/tasks/${taskId}`);
                    if (taskRes.ok) {
                        const taskJson = await taskRes.json();
                        if (taskJson.status === 'success' && taskJson.data) {
                            const task = taskJson.data;
                            if (task.status === 'COMPLETED' || task.status === 'FAILED') {
                                isSwarmDone = true;
                                finalTaskData = task;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    // Ignore transient errors and continue polling
                }
            }

            if (!isSwarmDone) {
                throw new Error("Swarm consensus debate timed out.");
            }

            if (finalTaskData.status === 'FAILED') {
                throw new Error("Swarm AI consensus debate failed.");
            }

            // Extract results and anomalies count
            const rawResults = finalTaskData.results;
            let parsedResults: any[] = [];
            if (rawResults) {
                parsedResults = typeof rawResults === 'string'
                    ? JSON.parse(rawResults)
                    : rawResults;
            }
            const anomalies = parsedResults.filter(r => r.status === 'FLAGGED').length;

            updateItemState(documentId, {
                status: 'completed',
                progress: 100,
                anomaliesCount: anomalies,
                txHash: finalTaskData.blockchain_tx || '',
                nftTokenId: finalTaskData.nft_token_id || '',
                ipfsCid: finalTaskData.ipfs_cid || ''
            });

            processingRef.current.delete(tempId);
            onRefreshDocuments?.();

        } catch (error: any) {
            console.error("Orchestrator failed for file:", item.file.name, error);
            updateItemState(item.id, { 
                status: 'failed', 
                progress: 100, 
                error: error.message || 'Proses gagal' 
            });
            processingRef.current.delete(tempId);
        }
    };

    // Concurrency Worker Manager loop
    useEffect(() => {
        if (!open || queue.length === 0) return;

        const activeCount = queue.filter(item => 
            item.status === 'uploading' || 
            item.status === 'parsing' || 
            item.status === 'running_swarm'
        ).length;

        if (activeCount >= CONCURRENCY_LIMIT) return;

        // Find next idle item
        const nextIdleItem = queue.find(item => item.status === 'idle' && !processingRef.current.has(item.id));
        if (nextIdleItem) {
            processingRef.current.add(nextIdleItem.id);
            processItem(nextIdleItem);
        }
    }, [queue, open]);

    // Metrics Summary calculations
    const stats = {
        total: queue.length,
        uploading: queue.filter(i => i.status === 'uploading').length,
        parsing: queue.filter(i => i.status === 'parsing').length,
        debating: queue.filter(i => i.status === 'running_swarm').length,
        completed: queue.filter(i => i.status === 'completed').length,
        failed: queue.filter(i => i.status === 'failed').length,
        clean: queue.filter(i => i.status === 'completed' && i.anomaliesCount === 0).length,
        flagged: queue.filter(i => i.status === 'completed' && i.anomaliesCount !== undefined && i.anomaliesCount > 0).length,
    };

    const removeFileFromQueue = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
        processingRef.current.delete(id);
    };

    // Grid details for KPI stats widgets
    const statCards = [
        { label: 'Total Files', count: stats.total, color: 'text-slate-700 dark:text-slate-350', border: 'border-slate-200 dark:border-slate-800', dot: 'bg-slate-400' },
        { label: 'Uploading', count: stats.uploading, color: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200/50 dark:border-blue-900/30', dot: 'bg-blue-500', active: stats.uploading > 0 },
        { label: 'Extracting', count: stats.parsing, color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200/50 dark:border-purple-900/30', dot: 'bg-purple-500', active: stats.parsing > 0 },
        { label: 'Swarm AI', count: stats.debating, color: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200/50 dark:border-indigo-900/30', dot: 'bg-indigo-500', active: stats.debating > 0 },
        { label: 'Clean', count: stats.clean, color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200/50 dark:border-emerald-900/30', dot: 'bg-emerald-500' },
        { label: 'Flagged', count: stats.flagged, color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200/50 dark:border-amber-900/30', dot: 'bg-amber-500' },
        { label: 'Failed', count: stats.failed, color: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200/50 dark:border-rose-900/30', dot: 'bg-rose-500' },
    ];

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 !bg-white/95 dark:!bg-slate-950/95 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-[100] transition-all">
                
                {/* Visual Accent Glowing Circles */}
                <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl pointer-events-none" />

                <DialogHeader className="mb-4 relative z-10">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Bulk Document Ingestion & Auto-Analysis
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Unggah banyak file proposal anggaran secara massal. Sistem akan memproses unggahan, mengekstrak isi teks dokumen, dan menjalankan debat audit AI Swarm secara realtime.
                    </DialogDescription>
                </DialogHeader>

                {/* Dropzone Area with Grid Pattern Background */}
                <div
                    {...getRootProps()}
                    style={{ 
                        backgroundImage: 'radial-gradient(circle, rgba(99, 102, 241, 0.09) 1px, transparent 1px)', 
                        backgroundSize: '14px 14px' 
                    }}
                    className={cn(
                        "border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer text-center relative overflow-hidden group mb-5 shrink-0 bg-slate-50/40 dark:bg-slate-900/10",
                        isDragActive 
                            ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-950/15 scale-[1.005] shadow-lg shadow-indigo-500/10" 
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/40 hover:bg-slate-100/40 dark:hover:bg-slate-900/30"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="relative flex flex-col items-center gap-3.5 z-10">
                        <div className={cn(
                            "p-3 rounded-full shadow-sm transition-all duration-300 border",
                            isDragActive 
                                ? "bg-indigo-600 text-white border-transparent scale-110 shadow-indigo-500/20" 
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-500/30 group-hover:scale-105"
                        )}>
                            <UploadCloud className="w-6.5 h-6.5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {isDragActive ? "Lepaskan berkas Anda sekarang!" : "Geser & letakkan berkas proposal anggaran di sini"}
                            </h3>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                Klik untuk memilih berkas. Mendukung PDF, DOCX, TXT, & MD (Hingga 15MB)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metrics Summary KPI Cards */}
                {queue.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4 shrink-0">
                        {statCards.map((card, idx) => (
                            <div 
                                key={idx}
                                className={cn(
                                    "flex flex-col p-2.5 rounded-xl border bg-white/40 dark:bg-slate-900/30 text-center transition-all duration-300 relative overflow-hidden",
                                    card.active ? "shadow-sm border-blue-500/20 bg-blue-50/10 dark:bg-blue-950/5 animate-pulse" : card.border
                                )}
                            >
                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide truncate">
                                    {card.label}
                                </span>
                                <div className="flex items-center justify-center gap-1.5 mt-1">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", card.dot)} />
                                    <span className={cn("font-extrabold text-sm sm:text-base", card.color)}>
                                        {card.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Queue List Area */}
                <div className="flex-1 overflow-y-auto min-h-[220px] space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {queue.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs py-14 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl bg-slate-50/10 dark:bg-slate-900/5">
                            <FileSearch className="h-10 w-10 mb-2.5 opacity-25 text-indigo-500" />
                            Antrean impor kosong. Tarik berkas ke area di atas untuk memulai audit.
                        </div>
                    ) : (
                        queue.map((item) => {
                            const isDone = item.status === 'completed';
                            const isFailed = item.status === 'failed';
                            const isProcessing = !isDone && !isFailed && item.status !== 'idle';
                            const isClean = isDone && item.anomaliesCount === 0;
                            const isFlagged = isDone && item.anomaliesCount !== undefined && item.anomaliesCount > 0;

                            return (
                                <div 
                                    key={item.id} 
                                    className={cn(
                                        "relative flex flex-col p-3.5 rounded-xl border shadow-sm transition-all duration-300 hover:translate-x-0.5 hover:shadow-md",
                                        isFlagged ? "border-amber-200/50 bg-amber-50/10 dark:border-amber-900/20 dark:bg-amber-950/5" :
                                        isClean ? "border-emerald-250 bg-emerald-50/10 dark:border-emerald-900/20 dark:bg-emerald-950/5" :
                                        isFailed ? "border-rose-200/50 bg-rose-50/10 dark:border-rose-900/20 dark:bg-rose-950/5" : 
                                        "border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40"
                                    )}
                                >
                                    {/* Glowing thin progress bar at bottom */}
                                    {isProcessing && (
                                        <div 
                                            className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 shadow-[0_1px_4px_rgba(99,102,241,0.5)]"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    )}

                                    <div className="flex items-center justify-between gap-4 z-10">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Stage Icon */}
                                            <div className={cn(
                                                "p-2 rounded-xl shrink-0 border shadow-sm",
                                                isClean ? "bg-emerald-100/50 text-emerald-600 border-emerald-200/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-transparent" :
                                                isFlagged ? "bg-amber-100/50 text-amber-600 border-amber-200/20 dark:bg-amber-900/20 dark:text-amber-450 dark:border-transparent" :
                                                isFailed ? "bg-rose-100/50 text-rose-600 border-rose-200/20 dark:bg-rose-900/20 dark:text-rose-400 dark:border-transparent" :
                                                "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-transparent"
                                            )}>
                                                {isClean ? <CheckCircle2 className="w-4.5 h-4.5" /> :
                                                 isFlagged ? <ShieldAlert className="w-4.5 h-4.5" /> :
                                                 isFailed ? <AlertCircle className="w-4.5 h-4.5" /> :
                                                 isProcessing ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> :
                                                 <FileText className="w-4.5 h-4.5" />}
                                            </div>
                                            
                                            {/* File Description */}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-xs text-slate-700 dark:text-slate-200 truncate max-w-[280px] sm:max-w-md">
                                                    {item.file.name}
                                                </p>
                                                <div className="flex items-center flex-wrap gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                                                    <span className="text-slate-400 dark:text-slate-600">{(item.file.size / 1024).toFixed(0)} KB</span>
                                                    <span>•</span>
                                                    {item.status === 'idle' && <span>Menunggu antrean...</span>}
                                                    {item.status === 'uploading' && <span className="text-blue-500 font-semibold">Mengunggah ke S3... {item.progress}%</span>}
                                                    {item.status === 'parsing' && <span className="text-purple-500 font-semibold animate-pulse">Mengekstrak teks dokumen...</span>}
                                                    {item.status === 'running_swarm' && <span className="text-indigo-500 font-semibold animate-pulse">Analisis Swarm AI...</span>}
                                                    {isClean && <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">✅ Bebas Anomali</span>}
                                                    {isFlagged && <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">⚠️ Terdeteksi {item.anomaliesCount} Temuan</span>}
                                                    {isFailed && <span className="text-rose-600 dark:text-rose-450 font-semibold">{item.error}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons on the right */}
                                        <div className="flex items-center gap-2 shrink-0 z-20">
                                            {isDone && (
                                                <div className="flex items-center gap-1.5">
                                                    {item.txHash && (
                                                        <a 
                                                            href={`/dashboard/documents/${item.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="h-7 px-2.5 border border-indigo-200 dark:border-indigo-900/40 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg flex items-center gap-1 transition-all shadow-sm"
                                                            title="Verifikasi Bukti Audit di Blockchain"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            <span>Blockchain Verify</span>
                                                        </a>
                                                    )}
                                                    {item.nftTokenId && (
                                                        <span 
                                                            className="h-7 px-2.5 border border-amber-200 dark:border-amber-900/40 text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-50/30 dark:bg-amber-950/20 rounded-lg flex items-center gap-1.5"
                                                            title="NFT Digital Certificate Minted"
                                                        >
                                                            <Award className="h-3.5 w-3.5 text-amber-500" />
                                                            <span>Certificate</span>
                                                        </span>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            onSelectDocument(item.id);
                                                        }}
                                                        className="h-7 px-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border-transparent text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all"
                                                    >
                                                        <span>Buka Editor</span>
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            )}

                                            {!isProcessing && !isDone && (
                                                <button
                                                    onClick={() => removeFileFromQueue(item.id)}
                                                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-900 shrink-0 relative z-10">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="h-9 px-4 text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-white rounded-xl shadow-sm transition-all"
                    >
                        Tutup Panel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
