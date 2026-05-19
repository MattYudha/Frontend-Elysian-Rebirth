'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/';
import { Progress } from '@/components/ui/';
import { CheckCircle2, Circle, ArrowRight, CreditCard, UploadCloud, Search, FileText } from 'lucide-react';
import { FAQSection } from '@/components/FAQSection';
import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';

// Step Definition
interface Step {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: React.ElementType;
    isCompleted: boolean;
}

import { useOnboardingStore } from '@/store/useOnboardingStore';

export default function GettingStartedPage() {
    const { 
        getTourProgress, 
        resetOnboarding, 
        open, 
        isCompleted 
    } = useOnboardingStore();
    
    const [activeStep, setActiveStep] = useState(1);
    const { current, total, percent } = getTourProgress();

    const steps: Step[] = [
        {
            id: 1,
            title: 'Atur Profil Perusahaan',
            description: 'Lengkapi data perusahaan untuk validasi dokumen otomatis.',
            actionLabel: 'Atur Profil',
            icon: CreditCard,
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
            icon: Search,
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
        <div className="flex min-h-screen w-full bg-[#f0f9ff] dark:bg-[#0B1120]">
            {/* Ambient Background Elements (Fixed) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-30 dark:opacity-10 mix-blend-overlay fixed" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            {/* Sticky Sidebar */}
            <div className="hidden md:block sticky top-0 h-screen flex-none z-30">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen relative z-10 w-full min-w-0">
                {/* Floating Navbar */}
                <DashboardNavbar />

                <div id="main-scroll-container" className="flex-1 overflow-y-auto px-6 md:px-10 py-6 pb-16 pt-24">
                    <div className="max-w-5xl mx-auto w-full">

                        {/* Header */}
                        <div className="mb-10 relative">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2 text-sm font-medium">
                                <span className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</span>
                                <span>/</span>
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">Panduan Memulai</span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Panduan Memulai</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg max-w-2xl">
                                Ikuti panduan interaktif ini untuk mengenal fitur <span className="text-blue-600 dark:text-blue-400 font-semibold">Elysian Intelligence</span> dan manfaatkan semua kemudahannya.
                            </p>
                        </div>

                        {/* Progress Card */}
                        <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-2xl p-8 mb-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div>
                                    <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Setup & Integrasi Awal</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selesaikan langkah ini untuk membuka fitur premium.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {isCompleted ? total : current-1}/{total}
                                    </span>
                                    <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Langkah Selesai</span>
                                </div>
                            </div>
                            <Progress
                                value={isCompleted ? 100 : percent}
                                className="h-3 bg-slate-100/50"
                                indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                            />
                            
                            <div className="mt-8 flex gap-4">
                                <Button 
                                    onClick={() => open()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                                >
                                    {isCompleted ? 'Mulai Ulang Tour' : 'Lanjutkan Tour'}
                                </Button>
                                <Button 
                                    variant="outline"
                                    onClick={() => resetOnboarding()}
                                    className="text-slate-500 border-slate-200"
                                >
                                    Reset Semua Data Onboarding
                                </Button>
                            </div>
                        </div>

                        {/* Steps Container */}
                        <div className="space-y-4 mb-12">
                            {steps.map((step) => {
                                const isActive = activeStep === step.id;

                                return (
                                    <div
                                        key={step.id}
                                        onClick={() => setActiveStep(step.id)}
                                        className={`
                                            relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group
                                            ${isActive
                                                ? 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-blue-200 dark:border-blue-900/50 shadow-xl shadow-blue-900/5 dark:shadow-blue-900/20 scale-[1.01]'
                                                : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-white/40 dark:border-slate-800 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/40'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-5 p-6 md:p-8">
                                            <div className="mt-1 flex-shrink-0">
                                                {step.isCompleted ? (
                                                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center ring-4 ring-green-50 dark:ring-green-900/20">
                                                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                ) : isActive ? (
                                                    <div className="relative">
                                                        <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 z-10 relative">
                                                            <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                                                        </div>
                                                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors">
                                                        <Circle className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-300 dark:group-hover:text-blue-500" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 relative z-10">
                                                <div className="flex justify-between items-center">
                                                    <h3 className={`font-bold text-lg ${step.isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                                        {step.title}
                                                    </h3>
                                                    {!isActive && !step.isCompleted && (
                                                        <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                                                    )}
                                                </div>

                                                {isActive && (
                                                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                                        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl leading-relaxed text-base">
                                                            {step.description}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-900/20 rounded-xl px-8 py-6 text-base font-semibold transition-all hover:scale-105 active:scale-95">
                                                                {step.actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl px-6 py-6">
                                                                Nanti Saja
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {isActive && (
                                                <div className="hidden lg:block relative group-hover:scale-105 transition-transform duration-500">
                                                    <div className="w-48 h-32 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden backdrop-blur-sm border border-white/50 dark:border-slate-700">
                                                        <step.icon className="absolute -right-6 -bottom-6 h-32 w-32 text-blue-100/50 dark:text-slate-700 rotate-[-15deg]" />
                                                        <div className="relative bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xl shadow-blue-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                                                            <step.icon className="relative h-12 w-12 text-blue-500 dark:text-blue-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* FAQ Section */}
                        <div className="mt-16 relative z-10">
                            <div className="backdrop-blur-lg bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-sm rounded-3xl p-8 md:p-12 text-center">
                                <div className="mb-10">
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Butuh Bantuan Lebih Lanjut?</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mt-2">Tim support kami siap membantu Anda 24/7</p>
                                </div>
                                <FAQSection />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
