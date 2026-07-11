'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Sparkles, BookOpen, PenTool, Bot, 
    ShieldAlert, Award, ArrowRight, Lightbulb 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ElysianWorkflowDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ElysianWorkflowDrawer({ isOpen, onClose }: ElysianWorkflowDrawerProps) {
    const router = useRouter();

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle Escape key closure
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const workflowSteps = [
        {
            title: "1. Unggah Regulasi Daerah (RAG Ingestion)",
            description: "Unggah dokumen PDF Perda/regulasi APBD di menu **Knowledge Base** sebagai acuan kepatuhan hukum.",
            details: "AI openViking parser memecah dokumen, menyamarkan data sensitif (NIK/NPWP), dan menghasilkan representasi vektor ke Qdrant/pgvector.",
            icon: BookOpen,
            color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            linkText: "Buka Knowledge Base",
            linkUrl: "/knowledge"
        },
        {
            title: "2. Susun Draf Anggaran di Smart Editor",
            description: "Gunakan **Document Editor** untuk membuat draf RAPBD baru atau memuat draf anggaran Dinas Kominfo 2026.",
            details: "Tulis draf dalam format teks atau tabel belanja modal (server, laptop, jasa) untuk dianalisis oleh AI.",
            icon: PenTool,
            color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
            linkText: "Buka Editor",
            linkUrl: "/editor"
        },
        {
            title: "3. Jalankan AI Swarm Review",
            description: "Klik tombol **\"Run Swarm Review\"** di editor untuk memulai debat otonom multi-agent.",
            details: "Tiga agen AI (Auditor, Compliance, Manager) melakukan negosiasi otonom. Auditor mencari kesenjangan harga pada **Indeks Kop-Mart**, Compliance memverifikasi kecocokan AD/ART, dan Manager mengambil konsensus.",
            icon: Bot,
            color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
            linkText: "Mulai Simulasi Swarm",
            linkUrl: "/editor"
        },
        {
            title: "4. Tinjau & Lakukan Intervensi (QA Gate)",
            description: "Buka halaman **QA Gate** atau **Action Center** untuk melihat item anggaran yang ditandai anomali.",
            details: "Anda dapat memberikan keputusan override manual & justifikasi tertulis. Aksi ini secara asinkron memperbarui **Swarm Memory Pack** agar AI mempelajari kebijakan khusus tersebut untuk audit di masa mendatang.",
            icon: ShieldAlert,
            color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
            linkText: "Buka Action Center",
            linkUrl: "/action-center"
        },
        {
            title: "5. Komitmen Blockchain & Sertifikat NFT",
            description: "Kunci laporan audit di blockchain **EVM Sepolia Testnet** agar immutable (tahan manipulasi).",
            details: "Status kueri dikirim on-chain secara otomatis, dan sistem menerbitkan **Sertifikat Audit Digital (NFT ERC-721)** berbasis IPFS sebagai bukti kepatuhan mutlak BPK.",
            icon: Award,
            color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            linkText: "Buka Blockchain Verify",
            linkUrl: "/blockchain/verify"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
                        onClick={onClose}
                        aria-label="Close guide drawer"
                    />

                    {/* Drawer Content */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 26, stiffness: 210 }}
                        className="relative flex h-full w-full max-w-lg flex-col border-l border-blue-500/10 bg-white/95 dark:bg-[#070e1c]/95 backdrop-blur-xl shadow-2xl z-10"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-blue-950/30 px-6 py-5 bg-gradient-to-r from-blue-500/5 to-transparent">
                            <div className="flex flex-col gap-1 min-w-0 pr-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                                    Panduan Alur Kerja Elysian
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Ikuti langkah-langkah di bawah ini untuk mengoperasikan platform dengan benar.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                                onClick={onClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Content Steps */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
                            {/* Intro Tip Box */}
                            <div className="p-4 rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 text-xs text-slate-650 dark:text-slate-350 leading-relaxed space-y-1.5 shadow-sm">
                                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                                    <Lightbulb className="h-4 w-4" /> Sinergi Terintegrasi
                                </span>
                                <p>
                                    Elysian menggabungkan AI Swarm otonom, database standar harga <strong>Kop-Mart</strong>, dan validitas hukum berbasis <strong>Blockchain</strong> ke dalam satu aliran terintegrasi penuh.
                                </p>
                            </div>

                            {/* Workflow Step Loop */}
                            <div className="space-y-6 relative before:absolute before:inset-y-3 before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/60 before:via-purple-500/60 before:to-amber-500/30">
                                {workflowSteps.map((step, idx) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={idx} className="relative flex gap-4 pl-1 group">
                                            {/* Icon bullet */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border z-10 transition-transform duration-300 group-hover:scale-105 shadow-sm",
                                                step.color
                                            )}>
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            {/* Details card */}
                                            <div className="space-y-1.5 flex-1 bg-white/40 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-shadow">
                                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                                                    {step.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-650 dark:text-slate-300 leading-normal font-medium">
                                                    {step.description}
                                                </p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/40">
                                                    {step.details}
                                                </p>
                                                
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        onClose();
                                                        router.push(step.linkUrl);
                                                    }}
                                                    className="h-6 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 hover:bg-transparent flex items-center gap-1.5"
                                                >
                                                    <span>{step.linkText}</span>
                                                    <ArrowRight className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t border-slate-100 dark:border-blue-950/30 flex justify-end gap-2.5 bg-slate-50/50 dark:bg-slate-950/20">
                            <Button variant="outline" size="sm" onClick={onClose}>
                                Tutup Panduan
                            </Button>
                            <Button 
                                size="sm" 
                                className="bg-blue-600 text-white hover:bg-blue-700 font-bold"
                                onClick={() => {
                                    onClose();
                                    router.push('/editor');
                                }}
                            >
                                Mulai Tulis Anggaran
                            </Button>
                        </div>
                    </motion.aside>
                </div>
            )}
        </AnimatePresence>
    );
}
