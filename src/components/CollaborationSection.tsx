'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Layers, Zap, FileText, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function CollaborationSection() {
    const { t } = useTranslation();

    return (
        <section className="py-16 lg:py-32 bg-slate-50 dark:bg-slate-950 relative border-t border-slate-200/60 dark:border-slate-800/60">
            {/* Background Gradients */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 dark:bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 dark:bg-indigo-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="max-w-3xl mb-24 mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-blue-600" />
                        <span className="text-blue-600 font-semibold tracking-wide text-sm uppercase">{t.landing.collaboration.badge}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6 md:mb-8 tracking-tight"
                    >
                        {t.landing.collaboration.title1} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t.landing.collaboration.title2}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="text-lg sm:text-xl lg:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-light"
                    >
                        {t.landing.collaboration.description}
                    </motion.p>
                </div>

                {/* Unified Layout: Mobile Slider / Desktop Grid */}
                <div className="flex md:grid md:grid-cols-12 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* Card 1: Project Overview (Span 7) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        className="col-span-1 md:col-span-7 min-w-[88vw] md:min-w-0 snap-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12 border border-white dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden group relative flex flex-col justify-between h-[500px] md:h-[600px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/50 dark:to-blue-900/10 -z-10" />

                        <div className="mb-10 relative z-10 block">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 ring-4 ring-blue-50/50 dark:ring-blue-900/10">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{t.landing.collaboration.cards.project.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md">
                                {t.landing.collaboration.cards.project.desc}
                            </p>
                        </div>

                        <div className="relative w-full flex-grow mt-4 rounded-t-2xl border-x border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 shadow-sm overflow-hidden group-hover:translate-y-[-10px] transition-transform duration-500">
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
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                        className="col-span-1 md:col-span-5 min-w-[88vw] md:min-w-0 snap-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-12 border border-white dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden group relative flex flex-col justify-between h-[500px] md:h-[600px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-amber-50/30 dark:from-slate-900 dark:via-slate-900/50 dark:to-amber-900/10 -z-10" />

                        <div className="mb-10 relative z-10 block">
                            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 ring-4 ring-amber-50/50 dark:ring-amber-900/10">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">{t.landing.collaboration.cards.updates.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                                {t.landing.collaboration.cards.updates.desc}
                            </p>
                        </div>

                        <div className="relative w-full flex-grow mt-4 rounded-t-2xl border-x border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 shadow-sm overflow-hidden group-hover:translate-y-[-10px] transition-transform duration-500">
                            <Image
                                src="/assets/collab/updates.png"
                                alt="Project Updates UI"
                                fill
                                className="object-cover object-top"
                            />
                        </div>
                    </motion.div>

                    {/* Bottom Card: Collaborative Docs (Full Width / Span 12) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                        className="col-span-1 md:col-span-12 min-w-[88vw] md:min-w-0 snap-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 lg:p-14 border border-white dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden group relative flex flex-col md:flex-row gap-8 md:gap-16 items-center min-h-[500px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900/50 dark:to-emerald-900/10 -z-10" />

                        <div className="w-full md:w-1/3 flex flex-col justify-center relative z-10">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 ring-4 ring-emerald-50/50 dark:ring-emerald-900/10">
                                <FileText className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{t.landing.collaboration.cards.workflow.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
                                {t.landing.collaboration.cards.workflow.desc}
                            </p>

                            <button className="group/btn flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-base py-3 px-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm w-fit">
                                <span>{t.landing.collaboration.cards.workflow.cta}</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="w-full md:w-2/3 relative h-[300px] md:h-[450px]">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 to-transparent rounded-2xl border border-slate-200/60 p-2 overflow-hidden shadow-sm rotate-1 hover:rotate-0 transition-transform duration-700 ease-out origin-bottom-right">
                                <motion.div
                                    className="relative w-full h-full bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md"
                                >
                                    <Image
                                        src="/demo-rag-query.gif"
                                        alt="Collaborative Docs UI"
                                        fill
                                        className="object-cover object-top"
                                        unoptimized
                                    />

                                    {/* Overlay Gradient for Fade effect at bottom */}
                                    <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-slate-900 dark:via-slate-900/40" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div >
        </section >
    );
}
