'use client';

import { motion } from 'framer-motion';
import { Terminal, FileText, Bot, Command, Cpu, ArrowUpRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ProductShowcase() {
    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <Cpu className="w-3 h-3" />
                        Power of Elysian
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight"
                    >
                        Satu Platform. <br />
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Tiga Kekuatan Utama.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 leading-relaxed"
                    >
                        Gabungan kekuatan otomatisasi, pemrosesan dokumen cerdas, dan asisten AI dalam satu ekosistem yang mulus.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Card 1: White Terminal / Integration */}
                    <ShowcaseCard delay={0.3} title="Integrasi Developer" bg="bg-white border border-slate-200">
                        <WhiteTerminalAnimation />
                    </ShowcaseCard>

                    {/* Card 2: AI Editor / Document */}
                    <ShowcaseCard delay={0.4} title="Analisis Dokumen (RAG)" bg="bg-white border border-slate-200">
                        <AiEditorAnimation />
                    </ShowcaseCard>

                    {/* Card 3: Analytics Graph */}
                    <ShowcaseCard delay={0.5} title="Wawasan Bisnis" bg="bg-white border border-slate-200">
                        <AnalyticsGraphAnimation />
                    </ShowcaseCard>
                </div>
            </div>
        </section>
    );
}

function ShowcaseCard({ children, title, delay, bg }: { children: React.ReactNode, title: string, delay: number, bg: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={`rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 flex flex-col h-[500px] relative group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ${bg}`}
        >
            <div className="p-6 md:p-8 flex-grow relative z-10 bg-slate-50/30 overflow-hidden flex items-center justify-center">
                {children}
            </div>
            <div className="relative z-10 p-6 md:p-8 bg-white border-t border-slate-100">
                <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm">
                    Teknologi canggih yang bekerja di belakang layar untuk bisnis Anda.
                </p>
            </div>
        </motion.div>
    );
}

// 1. White Theme Terminal Animation
function WhiteTerminalAnimation() {
    return (
        <div className="w-full max-w-[320px] bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden font-mono text-[10px] sm:text-xs">
            {/* Window Controls */}
            <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            {/* Content */}
            <div className="p-4 space-y-2 h-[200px] overflow-hidden text-slate-600">
                <div className="flex gap-2">
                    <span className="text-blue-500 font-bold">$</span>
                    <span className="text-slate-800">npm install @elysian/sdk</span>
                </div>
                <div className="text-slate-400">Installing dependencies...</div>
                <div className="flex gap-2">
                    <span className="text-green-600">✔</span>
                    <span className="text-slate-700">Added 15 packages in 1.2s</span>
                </div>
                <br />
                <div className="flex gap-2">
                    <span className="text-blue-500 font-bold">$</span>
                    <span className="text-slate-800">elysian init --token=***</span>
                </div>
                <div className="text-slate-400">Authenticating...</div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex gap-2 bg-blue-50 p-1.5 rounded text-blue-700 border border-blue-100"
                >
                    <span className="text-blue-600">✔</span>
                    <span className="font-semibold">Connected to Elysian Cloud</span>
                </motion.div>
                <motion.div
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                    className="w-2 h-4 bg-slate-800 inline-block"
                />
            </div>
        </div>
    );
}

// 2. AI Editor Animation
function AiEditorAnimation() {
    return (
        <div className="w-full max-w-[300px] bg-white rounded-lg border border-slate-200 shadow-lg p-6 relative">
            <div className="mb-4 space-y-2">
                <div className="h-4 w-1/3 bg-slate-100 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-2 w-full bg-slate-50 rounded" />
                <div className="h-2 w-full bg-slate-50 rounded" />
                <div className="h-2 w-4/5 bg-slate-50 rounded" />

                {/* Highlighted section */}
                <div className="relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-blue-100/50 rounded"
                    />
                    <div className="h-2 w-full bg-slate-50 rounded relative z-10 mix-blend-multiply" />
                </div>

                <div className="h-2 w-2/3 bg-slate-50 rounded" />
            </div>

            {/* Floating Cursor/Tooltip */}
            <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 2 }}
                className="absolute right-4 top-1/2 bg-white rounded-lg shadow-xl border border-blue-100 p-2 flex items-center gap-2 z-20"
            >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px]">
                    <Bot className="w-3 h-3" />
                </div>
                <div className="text-[10px] font-medium text-slate-600">
                    Rephrasing for clarity...
                </div>
            </motion.div>
        </div>
    );
}

// 3. Analytics Graph Animation
function AnalyticsGraphAnimation() {
    return (
        <div className="w-full max-w-[320px] bg-white rounded-xl border border-slate-200 shadow-lg p-5 flex flex-col justify-between h-[220px]">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Growth</div>
                    <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        +124%
                        <span className="bg-green-100 text-green-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center">
                            <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative h-full w-full flex items-end gap-2">
                {/* Bar Chart Mockup */}
                {[30, 45, 35, 60, 50, 75, 90].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: "backOut" }}
                        className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-blue-500' : 'bg-blue-100'}`}
                    />
                ))}

                {/* Floating Tooltip on Last Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: -40 }} // moved up
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute right-0 top-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg translate-y-[20px]"
                >
                    Record High
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </motion.div>
            </div>
        </div>
    );
}
