'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, ShieldAlert, Layers, Cpu, Database, 
    CheckCircle2, AlertCircle, Loader2, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIProcessingPipelineProps {
    progress: number;
    status: 'uploading' | 'completed' | 'done' | 'error';
    error?: string;
}

export function AIProcessingPipeline({ progress, status, error }: AIProcessingPipelineProps) {
    const steps = [
        {
            id: 'parse',
            label: 'Parsing',
            shortLabel: 'Parsing',
            icon: FileText,
            tooltip: 'Extracts raw text, headers, and tables from the document, reconstructing the document structural layout.',
            activeDesc: 'Analyzing layout structures and extracting plain text content...',
            range: [0, 25]
        },
        {
            id: 'pii',
            label: 'PII Shielding',
            shortLabel: 'PII Shield',
            icon: ShieldAlert,
            tooltip: 'Scans the parsed text for sensitive fields (e.g. emails, phone numbers, credentials) and applies privacy masks.',
            activeDesc: 'Executing privacy scan and masking sensitive data fields...',
            range: [26, 50]
        },
        {
            id: 'chunking',
            label: 'Semantic Chunking',
            shortLabel: 'Chunking',
            icon: Layers,
            tooltip: 'Splits text into overlapping semantic blocks to preserve context continuity during retrieval.',
            activeDesc: 'Segmenting text into dense overlapping context windows...',
            range: [51, 75]
        },
        {
            id: 'vectorize',
            label: 'Swarm Vectorization',
            shortLabel: 'Vectorize',
            icon: Cpu,
            tooltip: 'Translates textual chunks into mathematical vectors using deep learning models for cognitive search.',
            activeDesc: 'Generating high-dimensional embeddings and indexing vectors...',
            range: [76, 95]
        },
        {
            id: 'commit',
            label: 'Memory Commit',
            shortLabel: 'Commit',
            icon: Database,
            tooltip: 'Commits vector indices to the Swarm Memory Pack, making new knowledge instantly accessible to all agents.',
            activeDesc: 'Finalizing knowledge integration into Swarm Memory Pack...',
            range: [96, 100]
        }
    ];

    // Find current active step index based on progress and status
    let activeStepIdx = 0;
    if (status === 'completed' || status === 'done') {
        activeStepIdx = steps.length; // all steps completed
    } else if (status === 'error') {
        // Find which step we failed on
        activeStepIdx = steps.findIndex(step => progress >= step.range[0] && progress <= step.range[1]);
        if (activeStepIdx === -1) activeStepIdx = 0;
    } else {
        // Uploading/Processing
        activeStepIdx = steps.findIndex(step => progress >= step.range[0] && progress <= step.range[1]);
        if (activeStepIdx === -1) {
            if (progress > 95) activeStepIdx = 4;
            else activeStepIdx = 0;
        }
    }

    return (
        <div className="mt-3 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-4 animate-in fade-in duration-300">
            {/* Pipeline Header */}
            <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                    AI Cognitive Ingestion Pipeline
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">
                    {status === 'error' ? 'Failed' : status === 'completed' || status === 'done' ? 'Completed' : `${progress}%`}
                </span>
            </div>

            {/* Stepper Timeline */}
            <div className="flex items-center justify-between relative px-2">
                {/* Background Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-slate-250 dark:bg-slate-800 -translate-y-1/2 z-0" />
                
                {/* Active Progress Line */}
                <div 
                    className="absolute top-1/2 left-4 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ 
                        width: `${Math.min(90, Math.max(0, (activeStepIdx / (steps.length - 1)) * 90))}%`,
                        opacity: status === 'error' ? 0.5 : 1
                    }}
                />

                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx < activeStepIdx;
                    const isActive = idx === activeStepIdx && status !== 'error' && status !== 'completed' && status !== 'done';
                    const isFailed = idx === activeStepIdx && status === 'error';
                    const isPending = idx > activeStepIdx;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            {/* Hover tooltip widget */}
                            <div className="group relative flex items-center justify-center">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className={cn(
                                        "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 cursor-help",
                                        isCompleted && "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20",
                                        isActive && "bg-slate-900 border-blue-500 text-blue-400 ring-2 ring-blue-500/20 dark:bg-[#060D18] animate-pulse",
                                        isFailed && "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20",
                                        isPending && "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : isActive ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : isFailed ? (
                                        <AlertCircle className="h-4 w-4" />
                                    ) : (
                                        <Icon className="h-3.5 w-3.5" />
                                    )}
                                </motion.div>

                                {/* Tooltip element */}
                                <div className="absolute bottom-full mb-2 w-56 p-2.5 bg-slate-900 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-350 dark:text-slate-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center">
                                    <div className="font-bold text-slate-100 mb-1">{step.label}</div>
                                    <p className="leading-normal text-slate-400">{step.tooltip}</p>
                                </div>
                            </div>
                            
                            <span className={cn(
                                "text-[9px] mt-1.5 font-medium hidden sm:block",
                                isCompleted && "text-blue-500 dark:text-blue-400 font-semibold",
                                isActive && "text-blue-400 dark:text-blue-400 animate-pulse",
                                isFailed && "text-red-500 font-semibold",
                                isPending && "text-slate-400"
                            )}>
                                {step.shortLabel}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Step Description Card */}
            <div className="bg-white dark:bg-[#060D18] border border-slate-200/60 dark:border-slate-800/80 rounded-lg p-3 text-xs leading-normal">
                <AnimatePresence mode="wait">
                    {status === 'error' ? (
                        <motion.div 
                            key="error-state"
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-start gap-2 text-red-600 dark:text-red-400"
                        >
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                            <div>
                                <span className="font-bold">Pipeline Error:</span>
                                <p className="text-[11px] mt-0.5 text-red-500/90">{error || 'Unknown ingestion exception occurred.'}</p>
                            </div>
                        </motion.div>
                    ) : status === 'completed' || status === 'done' ? (
                        <motion.div 
                            key="completed-state"
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400"
                        >
                            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                            <div>
                                <span className="font-bold">Knowledge Base Indexed:</span>
                                <p className="text-[11px] mt-0.5 text-slate-550 dark:text-slate-400">All chunks have been vectorized and committed to Swarm memory. The database is synchronized.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key={activeStepIdx}
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-start gap-2 text-slate-600 dark:text-slate-300"
                        >
                            <Loader2 className="h-4 w-4 shrink-0 mt-0.5 text-blue-500 animate-spin" />
                            <div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    Stage {activeStepIdx + 1}/5: {steps[activeStepIdx]?.label}
                                </span>
                                <p className="text-[11px] mt-0.5 text-slate-500 dark:text-slate-400">
                                    {steps[activeStepIdx]?.activeDesc}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
