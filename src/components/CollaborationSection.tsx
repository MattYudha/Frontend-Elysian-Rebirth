'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Layers, Zap, FileText, ArrowRight } from 'lucide-react';

export function CollaborationSection() {
    return (
        <section className="py-32 bg-slate-50 relative border-t border-slate-200/60">
            {/* Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="max-w-3xl mb-24 mt-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-blue-600" />
                        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">Power your workflow</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight"
                    >
                        Kolaborasi Tim <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tanpa Batas.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-light"
                    >
                        Satu platform terintegrasi untuk menyatukan ide, eksekusi, dan hasil. Tinggalkan silo, mulai berkolaborasi dengan cara yang benar.
                    </motion.p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">

                    {/* Card 1: Project Overview (Span 7) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-7 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-12 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden group relative flex flex-col justify-between h-[600px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 -z-10" />

                        <div className="mb-10 relative z-10 block">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 ring-4 ring-blue-50/50">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Project Management</h3>
                            <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                                Konsolidasi milestone, tugas, dan deadline dalam satu visual dashboard yang intuitif.
                            </p>
                        </div>

                        <div className="relative w-full flex-grow mt-4 rounded-t-2xl border-x border-t border-slate-200/60 bg-slate-50/50 shadow-sm overflow-hidden group-hover:translate-y-[-10px] transition-transform duration-500">
                            <Image
                                src="/assets/collab/overview.png"
                                alt="Project Overview UI"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </motion.div>

                    {/* Card 2: Project Updates (Span 5) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="col-span-1 md:col-span-5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-12 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden group relative flex flex-col justify-between h-[600px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-amber-50/30 -z-10" />

                        <div className="mb-10 relative z-10 block">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 ring-4 ring-amber-50/50">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Status Updates</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Otomatisasi laporan progres. Hemat waktu meeting dengan update asinkronus.
                            </p>
                        </div>

                        <div className="relative w-full flex-grow mt-4 rounded-t-2xl border-x border-t border-slate-200/60 bg-slate-50/50 shadow-sm overflow-hidden group-hover:translate-y-[-10px] transition-transform duration-500">
                            <Image
                                src="/assets/collab/updates.png"
                                alt="Project Updates UI"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Card: Collaborative Docs (Full Width) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden group relative flex flex-col md:flex-row gap-16 items-center min-h-[500px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 -z-10" />

                    <div className="w-full md:w-1/3 flex flex-col justify-center relative z-10">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 ring-4 ring-emerald-50/50">
                            <FileText className="w-7 h-7" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Dokumen Hidup</h3>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8">
                            Dokumentasi yang berkembang seiring proyek. Komentar inline, @mention, dan editing real-time yang mulus.
                        </p>

                        <button className="group/btn flex items-center gap-2 text-slate-900 font-semibold text-base py-3 px-6 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm w-fit">
                            <span>Coba Editor</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="w-full md:w-2/3 relative h-[450px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent rounded-2xl border border-slate-200/60 p-2 overflow-hidden shadow-sm rotate-1 hover:rotate-0 transition-transform duration-700 ease-out origin-bottom-right">
                            <motion.div
                                className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-md"
                            >
                                <Image
                                    src="/assets/collab/docs.png"
                                    alt="Collaborative Docs UI"
                                    fill
                                    className="object-cover object-top"
                                />

                                {/* Overlay Gradient for Fade effect at bottom */}
                                <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/40 to-transparent" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
