'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, ArrowRight, Sparkles, HelpCircle, BookOpen, Layers, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface GettingStartedWidgetProps {
    onOpenWorkflow?: () => void;
}

export function GettingStartedWidget({ onOpenWorkflow }: GettingStartedWidgetProps) {
    const router = useRouter();
    const [progress, setProgress] = useState({
        step1: false,
        step2: false,
        step3: false,
        step4: false
    });

    useEffect(() => {
        // Read progress states from localStorage
        const checkProgress = () => {
            const step1 = localStorage.getItem('elysian_progress_step1') === 'completed';
            const step2 = localStorage.getItem('elysian_progress_step2') === 'completed' || localStorage.getItem('elysian_editor_last_active') !== null;
            const step3 = localStorage.getItem('elysian_progress_step3') === 'completed';
            const step4 = localStorage.getItem('elysian_progress_step4') === 'completed';

            setProgress({ step1, step2, step3, step4 });
        };

        checkProgress();
        // Set up event listener or interval to poll changes
        const interval = setInterval(checkProgress, 2000);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            id: 'step1',
            title: 'Unggah Regulasi Daerah',
            description: 'Unggah dokumen PDF regulasi/perda APBD sebagai acuan kepatuhan RAG.',
            icon: BookOpen,
            buttonText: 'Unggah Regulasi',
            onClick: () => {
                localStorage.setItem('elysian_progress_step1', 'completed');
                router.push('/knowledge');
            }
        },
        {
            id: 'step2',
            title: 'Muat Draf Anggaran Contoh',
            description: 'Buka Smart Editor and muat draf anggaran hardware Dinas Kominfo 2026 secara instan.',
            icon: Sparkles,
            buttonText: 'Buka Editor',
            onClick: () => {
                localStorage.setItem('elysian_progress_step2', 'completed');
                router.push('/editor');
            }
        },
        {
            id: 'step3',
            title: 'Mulai AI Swarm Review',
            description: 'Simulasikan perdebatan otonom 3 Agen AI (Auditor, Pengawas, Manager) untuk konsensus audit.',
            icon: Layers,
            buttonText: 'Jalankan Swarm',
            onClick: () => {
                localStorage.setItem('elysian_progress_step3', 'completed');
                router.push('/editor');
            }
        },
        {
            id: 'step4',
            title: 'Pantau Heatmap Anomali',
            description: 'Lihat persebaran daerah dengan anomali markup tertinggi di Indonesia pada peta Nemesis.',
            icon: Map,
            buttonText: 'Lihat Heatmap',
            onClick: () => {
                localStorage.setItem('elysian_progress_step4', 'completed');
                const element = document.getElementById('regional-heatmap');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else {
                    router.push('/dashboard');
                }
            }
        }
    ];

    const completedCount = Object.values(progress).filter(Boolean).length;
    const progressPercent = Math.round((completedCount / steps.length) * 100);

    return (
        <Card className="tour-getting-started border-blue-200/50 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/15 dark:from-[#0B1120] dark:to-blue-950/5 p-5 shadow-lg relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/2.5 blur-3xl rounded-full pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
                        <HelpCircle className="h-4.5 w-4.5 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-1.5">
                            Langkah Awal Penggunaan
                            {onOpenWorkflow && (
                                <button 
                                    onClick={onOpenWorkflow}
                                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline bg-blue-500/10 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200/20"
                                >
                                    Lihat Alur Kerja →
                                </button>
                            )}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Selesaikan langkah berikut untuk memahami platform
                        </p>
                    </div>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/30">
                    {progressPercent}%
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden mb-5">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-650 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Step list */}
            <div className="space-y-4">
                {steps.map((step, idx) => {
                    const isCompleted = progress[step.id as keyof typeof progress];
                    const Icon = step.icon;

                    return (
                        <div 
                            key={step.id}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-xl border transition-all duration-300",
                                isCompleted 
                                    ? "bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/40 opacity-70"
                                    : "bg-white dark:bg-slate-950 border-slate-100 dark:border-blue-950/30 shadow-sm hover:shadow-md"
                            )}
                        >
                            {/* Checkbox Icon */}
                            <button 
                                onClick={() => {
                                    const nextState = !isCompleted;
                                    localStorage.setItem(`elysian_progress_${step.id}`, nextState ? 'completed' : 'pending');
                                    setProgress(prev => ({ ...prev, [step.id]: nextState }));
                                }}
                                className="mt-0.5 text-blue-600 dark:text-blue-400 focus:outline-none shrink-0"
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 fill-blue-500 text-white dark:fill-blue-600" />
                                ) : (
                                    <Circle className="h-5 w-5 text-slate-300 dark:text-slate-700" />
                                )}
                            </button>

                            {/* Details */}
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <Icon className={cn("h-3.5 w-3.5", isCompleted ? "text-slate-400" : "text-blue-500")} />
                                    <span className={cn(
                                        "text-xs font-bold",
                                        isCompleted ? "text-slate-500 dark:text-slate-500 line-through font-medium" : "text-slate-800 dark:text-slate-200"
                                    )}>
                                        {idx + 1}. {step.title}
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {step.description}
                                </p>
                                
                                {!isCompleted && (
                                    <Button
                                        size="sm"
                                        onClick={step.onClick}
                                        className="h-7 px-2.5 mt-2 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-900 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[10px] rounded-lg gap-1 transition-all"
                                    >
                                        <span>{step.buttonText}</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
