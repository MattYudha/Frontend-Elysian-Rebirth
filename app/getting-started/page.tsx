'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/primitives/button';
import { Progress } from '@/ui/progress';
import { CheckCircle2, Circle, ArrowRight, CreditCard, UploadCloud, Search, FileText } from 'lucide-react';
import { FAQSection } from '@/components/FAQSection';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { Sidebar } from '@/components/Sidebar';
import Image from 'next/image';

// Step Definition
interface Step {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: any;
    isCompleted: boolean;
}

export default function GettingStartedPage() {
    const [activeStep, setActiveStep] = useState(1);

    const steps: Step[] = [
        {
            id: 1,
            title: 'Atur Profil Perusahaan',
            description: 'Lengkapi data perusahaan untuk validasi dokumen otomatis.',
            actionLabel: 'Atur Profil',
            icon: CreditCard, // Using CreditCard as placeholder for "Setup"
            isCompleted: true
        },
        {
            id: 2,
            title: 'Upload Dokumen Pertama',
            description: 'Coba upload invoice atau dokumen PO untuk melihat hasil ekstraksi.',
            actionLabel: 'Upload Dokumen',
            icon: UploadCloud,
            isCompleted: false
        },
        {
            id: 3,
            title: 'Analisa AI Pertama',
            description: 'Biarkan sistem menganalisa dan mengekstrak data kunci.',
            actionLabel: 'Mulai Analisa',
            icon: Search, // Using Search for Analysis
            isCompleted: false
        },
        {
            id: 4,
            title: 'Validasi Hasil Ekstraksi',
            description: 'Review dan perbaiki jika ada data yang kurang tepat.',
            actionLabel: 'Validasi Data',
            icon: CheckCircle2,
            isCompleted: false
        },
        {
            id: 5,
            title: 'Export Data ke Excel',
            description: 'Download hasil ekstraksi yang sudah bersih dan terstruktur.',
            actionLabel: 'Export Data',
            icon: FileText,
            isCompleted: false
        },
    ];

    const completedCount = steps.filter(s => s.isCompleted).length;
    const progressPercent = (completedCount / steps.length) * 100;

    return (
        <div className="min-h-screen flex bg-[#f0f9ff] relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Cloud/Nebula Background */}
                <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-30 mix-blend-overlay fixed" />

                {/* Gradient Orbs */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[120px] mix-blend-multiply" />
            </div>

            {/* Reusing Sidebar for Layout Consistency if needed, or standalone if using Main Layout */}
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-auto relative z-10">
                <div className="max-w-5xl mx-auto w-full p-6 md:p-10">

                    {/* Header */}
                    <div className="mb-10 relative">
                        <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
                            <span className="cursor-pointer hover:text-blue-600 transition-colors">Home</span>
                            <span>/</span>
                            <span className="text-blue-600 font-semibold">Panduan Memulai</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Panduan Memulai</h1>
                        <p className="text-slate-600 mt-2 text-lg max-w-2xl">
                            Ikuti panduan interaktif ini untuk mengenal fitur <span className="text-blue-600 font-semibold">Elysian Intelligence</span> dan manfaatkan semua kemudahannya.
                        </p>
                    </div>

                    {/* Progress Card - Liquid Glass */}
                    <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-8 mb-8 relative overflow-hidden group">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h2 className="font-bold text-xl text-slate-800">Setup & Integrasi Awal</h2>
                                <p className="text-sm text-slate-500 mt-1">Selesaikan langkah ini untuk membuka fitur premium.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-blue-600">{completedCount}/{steps.length}</span>
                                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Langkah Selesai</span>
                            </div>
                        </div>
                        <Progress
                            value={progressPercent}
                            className="h-3 bg-slate-100/50"
                            indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                        />
                    </div>

                    {/* Steps Container - Frosted Glass Panels */}
                    <div className="space-y-4 mb-12">
                        {steps.map((step, index) => {
                            const isActive = activeStep === step.id;
                            const isLast = index === steps.length - 1;

                            return (
                                <div
                                    key={step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    className={`
                                        relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group
                                        ${isActive
                                            ? 'bg-white/80 backdrop-blur-md border-blue-200 shadow-xl shadow-blue-900/5 scale-[1.01]'
                                            : 'bg-white/40 backdrop-blur-sm border-white/40 hover:bg-white/60 hover:shadow-md hover:border-blue-100'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-5 p-6 md:p-8">
                                        {/* Status Icon */}
                                        <div className="mt-1 flex-shrink-0">
                                            {step.isCompleted ? (
                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-4 ring-green-50">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                </div>
                                            ) : isActive ? (
                                                <div className="relative">
                                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 z-10 relative">
                                                        <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                                                </div>
                                            ) : (
                                                <div className="h-8 w-8 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-blue-300 transition-colors">
                                                    <Circle className="h-4 w-4 text-slate-300 group-hover:text-blue-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 relative z-10">
                                            <div className="flex justify-between items-center">
                                                <h3 className={`font-bold text-lg ${step.isCompleted ? 'text-slate-500' : 'text-slate-800'}`}>
                                                    {step.title}
                                                </h3>
                                                {/* Optional: Add chevron if inactive */}
                                                {!isActive && !step.isCompleted && (
                                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                                                )}
                                            </div>

                                            {isActive && (
                                                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                                    <p className="text-slate-600 mb-8 max-w-xl leading-relaxed text-base">
                                                        {step.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl px-8 py-6 text-base font-semibold transition-all hover:scale-105 active:scale-95">
                                                            {step.actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl px-6 py-6">
                                                            Nanti Saja
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Illustration (Only visible when active) */}
                                        {isActive && (
                                            <div className="hidden lg:block relative group-hover:scale-105 transition-transform duration-500">
                                                <div className="w-48 h-32 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden backdrop-blur-sm border border-white/50">
                                                    {/* Decorative Background Icon */}
                                                    <step.icon className="absolute -right-6 -bottom-6 h-32 w-32 text-blue-100/50 rotate-[-15deg]" />

                                                    {/* Foreground Icon with 3D feel */}
                                                    <div className="relative bg-white p-4 rounded-xl shadow-xl shadow-blue-100/50">
                                                        <step.icon className="relative h-12 w-12 text-blue-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* FAQ Section - Clean Version */}
                    <div className="mt-16 relative z-10">
                        <div className="backdrop-blur-lg bg-white/40 border border-white/40 shadow-sm rounded-3xl p-8 md:p-12 text-center">
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-slate-800">Butuh Bantuan Lebih Lanjut?</h3>
                                <p className="text-slate-600 mt-2">Tim support kami siap membantu Anda 24/7</p>
                            </div>
                            <FAQSection />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
