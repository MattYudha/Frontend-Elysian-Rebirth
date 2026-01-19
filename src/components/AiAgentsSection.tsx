'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Bot,
    Code2,
    Terminal,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Wand2,
    Search,
    Command,
    Loader2
} from 'lucide-react';
import Image from 'next/image';

const AGENTS = [
    {
        id: 'analyst',
        name: 'Data Analyst AI',
        role: 'Financial Insights',
        icon: <TrendingIcon className="w-5 h-5 text-blue-500" />,
        color: 'bg-blue-50 text-blue-600',
        ring: 'ring-blue-100',
        avatar: '/assets/avatars/analyst.png'
    },
    {
        id: 'editor',
        name: 'Content Editor',
        role: 'SEO & Copywriting',
        icon: <Wand2 className="w-5 h-5 text-purple-500" />,
        color: 'bg-purple-50 text-purple-600',
        ring: 'ring-purple-100',
        avatar: '/assets/avatars/editor.png'
    },
    {
        id: 'compliance',
        name: 'Compliance Bot',
        role: 'Legal & Audit',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        color: 'bg-emerald-50 text-emerald-600',
        ring: 'ring-emerald-100',
        avatar: '/assets/avatars/compliance.png'
    },
    {
        id: 'coder',
        name: 'Dev Assistant',
        role: 'Code Review',
        icon: <Code2 className="w-5 h-5 text-amber-500" />,
        color: 'bg-amber-50 text-amber-600',
        ring: 'ring-amber-100',
        avatar: '/assets/avatars/dev.png'
    }
];

function TrendingIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}

export function AiAgentsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto cycle through agents
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % AGENTS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600"
                    >
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span>Elysian Neural Network</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6"
                    >
                        Delegasikan tugas ke <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Agents Spesialis.</span>
                    </motion.h2>
                    <p className="text-xl text-slate-500 max-w-2xl">
                        Pilih agent yang tepat untuk setiap pekerjaan. Dari analis data hingga auditor keamanan, semua siap bekerja 24/7.
                    </p>
                </div>

                {/* The "Command Palette" Visual */}
                <div className="relative max-w-2xl mx-auto min-h-[400px]">
                    {/* Shadow & Glow */}
                    <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full transform scale-150" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden ring-1 ring-slate-900/5"
                    >
                        {/* Header: "Assign to..." */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-white/50">
                            <div className="w-4 h-4 text-slate-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <span className="text-slate-400 text-base font-medium">Assign to...</span>
                            <div className="ml-auto flex gap-2">
                                <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 font-mono text-[10px] font-medium text-slate-500">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>

                        {/* List */}
                        <div className="p-2 space-y-1">
                            {AGENTS.map((agent, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <motion.div
                                        key={agent.id}
                                        className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer ${isActive
                                                ? 'bg-blue-50/80 shadow-sm ring-1 ring-blue-100'
                                                : 'hover:bg-slate-50'
                                            }`}
                                        onClick={() => setActiveIndex(index)}
                                    >
                                        {/* Avatar / Icon */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${isActive ? agent.color : 'bg-slate-100 text-slate-500'}`}>
                                            {agent.icon}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <h4 className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {agent.name}
                                                </h4>
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                                    Agent
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {agent.role}
                                            </p>
                                        </div>

                                        {/* Checkmark for Active */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="check"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-blue-600"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Footer Status */}
                        <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                <span>Processing context...</span>
                            </div>
                            <span>4 Agents available</span>
                        </div>
                    </motion.div>

                    {/* Floating Context Cards (Decorations) */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -right-12 top-20 bg-white rounded-xl shadow-lg border border-slate-100 p-4 hidden md:block"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold text-slate-700">Financial Audit</span>
                        </div>
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full mb-1" />
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-12 bottom-32 bg-white rounded-xl shadow-lg border border-slate-100 p-4 hidden md:block"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-semibold text-slate-700">Code Analysis</span>
                        </div>
                        <div className="h-1.5 w-32 bg-slate-100 rounded-full mb-1" />
                        <div className="h-1.5 w-20 bg-slate-100 rounded-full" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
