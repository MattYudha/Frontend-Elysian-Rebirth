'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/primitives/button';
import { Progress } from '@/ui/progress';
import {
    Info,
    ChevronRight,
    FileText,
    Users,
    Send,
    UserPlus,
    CheckCircle2,
    ArrowUpRight,
    CreditCard,
    BookOpen,
    UploadCloud,
    Search
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// --- 1. Top Financial Cards ---

export function TotalBalanceCard() {
    return (
        <div className="rounded-xl overflow-hidden shadow-lg flex flex-col justify-between h-full bg-gradient-to-r from-[#7cb342] to-[#1e88e5] text-white relative min-h-[180px]">
            {/* Main Content */}
            <div className="p-5 relative z-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                    <span className="font-semibold text-sm">Total Saldo Aktif</span>
                    <Info className="h-4 w-4 cursor-pointer" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight mb-2">Rp - - - - -</h2>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
                    <Button className="bg-[#c0ca33] hover:bg-[#afb42b] text-green-900 font-bold shadow-md rounded-full px-6 transition-transform hover:scale-105">
                        Terima Pembayaran
                    </Button>
                </div>
                {/* Mobile Button visual adjustment */}
                <div className="md:hidden mt-4">
                    <Button size="sm" className="bg-[#c0ca33] hover:bg-[#afb42b] text-green-900 font-bold shadow-md rounded-full px-4 w-full">
                        Terima Pembayaran
                    </Button>
                </div>
            </div>

            {/* Footer Section */}
            <div className="bg-black/10 backdrop-blur-sm border-t border-white/10 p-3 px-5 flex justify-between items-center text-xs sm:text-sm relative z-10">
                <div className="flex items-center gap-2">
                    <span className="font-medium opacity-90">Dana Sedang Diproses</span>
                    <Info className="h-3 w-3 opacity-70" />
                </div>
                <span className="font-bold tracking-wide">Rp -- --</span>
            </div>

            {/* Texture/Noise overlay if needed, or subtle gradient accents */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}

export function FinancialSummaryCard({
    title,
    value,
    actionText,
    stats
}: {
    title: string,
    value: string,
    actionText: string,
    stats: { label: string, value: number, color: string }[]
}) {
    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl h-full flex flex-col justify-between overflow-hidden">
            <CardContent className="p-5 flex flex-col h-full relative">
                {/* Refresh Icon Absolute top right */}
                <div className="absolute top-5 right-5 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors">
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full opacity-50" />
                </div>

                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-semibold text-xs sm:text-sm">{title}</span>
                        <Info className="h-3 w-3 cursor-pointer hover:text-blue-500" />
                    </div>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{value}</h3>
                </div>

                <hr className="border-slate-100 mb-4" />

                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-500 mb-6 gap-2">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col gap-1 items-start">
                            <span className={`${stat.color} font-bold`}>{stat.value}</span>
                            <span className="opacity-80">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto text-right">
                    <Link href="#" className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline">
                        {actionText}
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

// --- 2. Onboarding Progress Card ---
export function OnboardingCard() {
    const [progress, setProgress] = useState(25);

    const steps = [
        { title: 'Upload Dokumen', description: 'Simpan data dokumen Anda', icon: UploadCloud, action: 'Upload', completed: true },
        { title: 'Analisa AI', description: 'Ekstrak data otomatis', icon: Search, action: 'Analisa', completed: false },
        { title: 'Validasi Data', description: 'Konfirmasi hasil ekstraksi', icon: CheckCircle2, action: 'Validasi', completed: false },
        { title: 'Export Data', description: 'Simpan ke database/Excel', icon: FileText, action: 'Export', completed: false },
    ];

    return (
        <Card className="border-0 shadow-lg bg-white rounded-xl overflow-hidden mb-8">
            <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Coba Fitur Elysian Sekarang!</h3>
                        <p className="text-slate-500 text-sm">
                            Gratis akses fitur premium selama 1 bulan untuk mencoba langsung kemudahan otomatisasi dokumen.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <Progress value={progress} className="h-3 bg-slate-100" indicatorClassName="bg-green-500" />
                    <span className="text-sm font-bold text-green-600 min-w-[3rem] text-right">{progress}%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`border rounded-lg p-4 flex flex-col justify-between h-full transition-all hover:shadow-md ${step.completed ? 'bg-green-50/50 border-green-100' : 'bg-white border-slate-200'}`}>
                            <div className="mb-4">
                                <h4 className={`font-bold mb-1 ${step.completed ? 'text-green-700' : 'text-slate-800'}`}>{step.title}</h4>
                                <p className="text-xs text-slate-500">{step.description}</p>
                            </div>

                            {step.completed ? (
                                <div className="mt-auto flex justify-end">
                                    <div className="bg-green-500 rounded-full p-1">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            ) : (
                                <Button variant="outline" size="sm" className="w-full mt-auto border-blue-500 text-blue-600 hover:bg-blue-50">
                                    {step.action}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// --- 3. Business Needs / Feature Cards ---
export function FeatureHighlightCard({
    title,
    subtitle,
    icon: Icon,
    colorClass,
    imageSrc,
    items
}: {
    title: string,
    subtitle: string,
    icon: any,
    colorClass: string,
    imageSrc?: string,
    items?: string[]
}) {
    return (
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white rounded-xl h-full overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">{title}</h3>
                        <p className="text-xs text-slate-500">{subtitle}</p>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center py-6 min-h-[160px]">
                    {imageSrc ? (
                        <div className="relative w-40 h-40">
                            <Image
                                src={imageSrc}
                                alt={title}
                                fill
                                className="object-contain drop-shadow-xl"
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-tr ${colorClass} opacity-10`}></div>
                            <Icon className={`h-12 w-12 ${colorClass.replace('bg-', 'text-')} opacity-50`} />
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-4 text-center">
                    <p className="text-xs text-slate-400 mb-4 px-4">
                        Kelola dokumen Anda dengan mudah dan cepat.
                    </p>
                    <Button variant="ghost" className={`w-full group ${colorClass.replace('bg-', 'text-')} hover:bg-slate-50`}>
                        Mulai Sekarang <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}


// --- 4. Promo Sidebar Card ---
export function PromoCard() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-blue-800">ELYSIAN</span>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">PRO</span>
            </div>

            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Promo Awal Tahun</h3>
            <p className="text-sm text-slate-600 mb-4">
                Khusus pengguna baru! Dapatkan diskon 50% untuk bulan pertama berlangganan paket Enterprise.
            </p>

            <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm mb-4 text-center">
                <span className="text-3xl font-bold text-blue-600">50%</span>
                <span className="block text-xs text-slate-400 uppercase font-bold mt-1">OFF</span>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30">
                Klaim Sekarang
            </Button>
            <p className="text-[10px] text-center text-slate-400 mt-2">Berlaku s/d 31 Jan 2026</p>
        </div>
    );
}

// --- 5. User Guide Card ---
export function UserGuideCard() {
    return (
        <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-800">Panduan Pengguna Baru</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                    <Link href="#" className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                        <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700">Langkah Awal Pakai Elysian</h4>
                            <p className="text-xs text-slate-500 mt-1">Pelajari cara dasar upload dan ekstraksi dokumen.</p>
                        </div>
                    </Link>
                    <Link href="#" className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                        <CreditCard className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700">Cara Berlangganan (Billing)</h4>
                            <p className="text-xs text-slate-500 mt-1">Metode pembayaran dan upgrade paket.</p>
                        </div>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
