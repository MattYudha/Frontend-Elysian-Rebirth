"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Wallet, Sparkles, BookOpen, ExternalLink,
    ArrowRight, UploadCloud, Download, Gift
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. Total Balance Card (Hero Business Widget) ---
export function TotalBalanceCard() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg h-full flex flex-col justify-between">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <p className="text-emerald-100 text-sm font-medium mb-1">Total Saldo Aktif</p>
                    <h2 className="text-3xl font-bold tracking-tight">Rp 42.500.000</h2>
                </div>
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                    <Wallet className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="relative z-10 mt-6 flex gap-3">
                <Button size="sm" className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold border-0">
                    + Top Up
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white">
                    Riwayat
                </Button>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-emerald-400/20 blur-xl" />
        </div>
    );
}

// --- 2. Financial Summary Card (Statistik Minimalis) ---
export function FinancialSummaryCard() {
    return (
        <div className="grid grid-cols-1 gap-4 h-full">
            {/* Piutang */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <ArrowRight className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium uppercase tracking-wider">Pemasukan (Bulan Ini)</span>
                </div>
                <p className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Rp 12.850.000</p>
            </div>

            {/* Utang/Pengeluaran */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col justify-center shadow-sm">
                <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <ArrowRight className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-medium uppercase tracking-wider">Pengeluaran AI</span>
                </div>
                <p className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Rp 4.200.000</p>
            </div>
        </div>
    );
}

// --- 3. Onboarding Card (Gamification) ---
export function OnboardingCard() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start relative z-10">
                <div className="max-w-[70%]">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">
                        Mulai Perjalanan AI Anda! 🚀
                    </h3>
                    <p className="text-sm text-zinc-500 mb-4">
                        Lengkapi profil dan upload dokumen pertama Anda untuk mendapatkan kredit gratis.
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Progress</span>
                            <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                    </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full">
                    <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none">
                {/* Fallback pattern if image is missing */}
                <div className="w-32 h-32 bg-zinc-900 rounded-full blur-3xl transform translate-x-10 translate-y-10" />
            </div>
        </div>
    );
}

// --- 4. Promo Card (Sidebar Ad) ---
export function PromoCard() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-zinc-900 dark:bg-zinc-950 text-white p-6 border border-zinc-800 shadow-md">
            <div className="relative z-10">
                <div className="inline-block px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase mb-3 border border-yellow-500/30">
                    Promo Awal Tahun
                </div>
                <h3 className="text-lg font-bold mb-2">Upgrade to Pro</h3>
                <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                    Dapatkan akses unlimited RAG, prioritas processing, dan export data tanpa batas.
                </p>
                <Button className="w-full bg-white text-black hover:bg-zinc-200 font-semibold border-0">
                    Klaim Diskon 50%
                </Button>
            </div>

            {/* Abstract Grid Background */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}>
            </div>
        </div>
    );
}

// --- 5. User Guide Card (Sticky Helper) ---
export function UserGuideCard() {
    const guides = [
        { title: "Upload Data", icon: UploadCloud, color: "text-blue-500" },
        { title: "Analisa Dokumen", icon: Sparkles, color: "text-purple-500" },
        { title: "Export Laporan", icon: Download, color: "text-green-500" },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <BookOpen className="w-4 h-4" /> Panduan Cepat
            </h4>
            <div className="space-y-3">
                {guides.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <g.icon className={cn("w-4 h-4", g.color)} />
                            <span className="text-sm text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{g.title}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
}
