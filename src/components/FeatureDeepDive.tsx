'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function FeatureDeepDive() {
    const { t } = useTranslation();

    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Soft background mesh for depth */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="max-w-2xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-blue-400" />
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">{t.landing.deepDive.badge}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6"
                    >
                        {t.landing.deepDive.title1} <br />
                        <span className="text-slate-400 dark:text-slate-500">{t.landing.deepDive.title2}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500 dark:text-slate-400"
                    >
                        {t.landing.deepDive.description}
                    </motion.p>
                </div>

                {/* Grid Layout - Linear Style */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                    {/* Card 1: Cycles / Workflows */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 md:p-8 border border-blue-100 dark:border-blue-800 shadow-xl shadow-blue-500/5 h-auto md:h-[400px] flex flex-col relative overflow-hidden group"
                    >
                        <div className="mb-6 md:mb-8 relative z-10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.landing.deepDive.cards.cycles.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.landing.deepDive.cards.cycles.desc}</p>
                        </div>

                        {/* Graph Animation */}
                        <div className="flex-grow relative w-full h-[200px] md:h-auto">
                            <CyclesGraphAnimation />
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </motion.div>

                    {/* Card 2: Triage / Smart Inbox */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-purple-50 dark:bg-purple-900/10 rounded-3xl p-6 md:p-8 border border-purple-100 dark:border-purple-800 shadow-xl shadow-purple-500/5 h-auto md:h-[400px] flex flex-col relative overflow-hidden group"
                    >
                        <div className="mb-6 md:mb-8 relative z-10">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.landing.deepDive.cards.inbox.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.landing.deepDive.cards.inbox.desc}</p>
                        </div>

                        {/* Inbox Animation */}
                        <div className="flex-grow relative w-full px-0 md:px-4">
                            <SmartInboxAnimation />
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-bl from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </motion.div>
                </div>

                {/* Bottom Card: Global Insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="w-full bg-cyan-50 dark:bg-cyan-900/10 rounded-3xl p-6 md:p-8 border border-cyan-100 dark:border-cyan-800 shadow-xl shadow-cyan-500/5 h-[400px] md:h-[500px] flex flex-col relative overflow-hidden group"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 relative z-10">
                        <div className="max-w-md">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.landing.deepDive.cards.insights.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.landing.deepDive.cards.insights.desc}</p>
                        </div>
                        <button className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                            {t.landing.deepDive.cards.insights.action} <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Large Chart Animation */}
                    <div className="flex-grow w-full relative">
                        <InsightsChartAnimation />
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>

            </div>
        </section>
    );
}

// --- Animation Components ---

function CyclesGraphAnimation() {
    return (
        <div className="relative w-full h-full flex items-end px-4 pb-4">
            {/* Axes */}
            <div className="absolute left-0 bottom-4 top-0 w-px bg-slate-100 dark:bg-slate-800" />
            <div className="absolute left-0 bottom-4 right-0 h-px bg-slate-100 dark:bg-slate-800" />

            {/* Curves */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Path 1: Predicted */}
                <motion.path
                    d="M0,150 C50,140 100,100 150,110 C200,120 250,80 300,60 C350,40 400,50 450,20"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                />
                {/* Path 2: Actual (Animated) */}
                <motion.path
                    d="M0,150 C50,145 100,120 150,100 C200,80 250,90 300,50 C350,10 400,20 450,10"
                    fill="url(#blueGradient)"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />
            </svg>

            {/* Floating Label */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
                className="absolute top-1/4 right-1/4 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-lg flex flex-col items-center z-10"
            >
                <div className="text-[10px] text-slate-400 uppercase font-bold">Velocity</div>
                <div className="text-lg font-bold text-slate-800 dark:text-white">42 pts</div>
            </motion.div>
        </div>
    );
}

function SmartInboxAnimation() {
    const items = [
        { id: 1, title: 'Bug report: Login failure', user: 'Tom', time: '2m' },
        { id: 2, title: 'Feature: Dark mode toggle', user: 'Sarah', time: '15m' },
        { id: 3, title: 'Update: API Documentation', user: 'Mike', time: '1h' },
    ];

    return (
        <div className="relative w-full h-full pb-4 md:pb-0">
            <div className="space-y-3">
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate pr-2">{item.title}</div>
                                <div className="text-xs text-slate-400 truncate">By {item.user} • {item.time}</div>
                            </div>
                        </div>
                        {/* Hover Actions - Hidden on very small screens if needed, or adjust layout */}
                        <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 flex-shrink-0">
                            <div className="text-[10px] md:text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">Accept</div>
                            <div className="hidden sm:block text-[10px] md:text-xs text-slate-400 hover:text-red-500 transition-colors">Decline</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Interaction Cursor Simulation */}
            <motion.div
                animate={{
                    x: [100, 250, 250, 100],
                    y: [10, 50, 50, 10],
                    opacity: [0, 1, 0, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute top-0 left-0 pointer-events-none"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="#3b82f6" stroke="white" strokeWidth="1" />
                </svg>
            </motion.div>
        </div>
    );
}

function InsightsChartAnimation() {
    return (
        <div className="w-full h-full relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-6 gap-x-12">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-full w-px bg-slate-100 dark:bg-slate-800 border-r border-dashed border-slate-200 dark:border-slate-700" />
                ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-4 gap-y-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-px bg-slate-100 dark:bg-slate-800 border-b border-dashed border-slate-200 dark:border-slate-700" />
                ))}
            </div>

            {/* Scatter Plot Dots */}
            {Array.from({ length: 40 }).map((_, i) => {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 80 + 10;
                const size = Math.random() * 6 + 4;
                const delay = Math.random() * 2;

                return (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${i % 3 === 0 ? 'bg-blue-500' : 'bg-cyan-400'}`}
                        style={{
                            left: `${randomX}%`,
                            top: `${randomY}%`,
                            width: size,
                            height: size,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 0.6 }}
                        viewport={{ once: true }}
                        transition={{ delay, duration: 0.5 }}
                        whileHover={{ scale: 2, opacity: 1, zIndex: 10 }}
                    />
                )
            })}

            {/* Trend Line */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                <motion.path
                    d="M0,80 Q200,90 400,50 T800,20"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 3 }}
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(59,130,246,0.3))' }}
                />
            </svg>
        </div>
    );
}
