'use client';

import { motion } from 'framer-motion';
import {
    Bot,
    FileText,
    Shield,
    TrendingUp,
    Sparkles,
    Zap,
    Lock
} from 'lucide-react';

export function FloatingBentoGrid() {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000">
            {/* CARD 1: AI Assistant (Left, Floating) */}
            <motion.div
                initial={{ opacity: 0, x: -50, rotate: -5 }}
                animate={{
                    opacity: 1,
                    x: 0,
                    rotate: [-5, -2, -5],
                    y: [0, -15, 0]
                }}
                transition={{
                    duration: 0.8,
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute left-0 top-10 md:left-10 z-20"
            >
                <div className="w-64 bg-white/80 backdrop-blur-xl border border-white/50 p-5 rounded-2xl shadow-xl shadow-blue-500/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">AI Assistant</h3>
                            <p className="text-xs text-slate-500">Always online</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 mb-2">
                            "Buatkan surat jalan untuk Toko Berkah..."
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                            <Sparkles className="w-3 h-3" />
                            <span>Memproses...</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="h-full w-1/2 bg-blue-500 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CARD 2: Analytics (Center/Right, Dominant) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute right-0 top-0 md:right-10 z-30"
            >
                <div className="w-72 bg-[#0F172A] p-6 rounded-2xl shadow-2xl shadow-blue-900/20 border border-slate-700/50 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            +24% Growth
                        </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Analisis Data</h3>
                    <p className="text-sm text-slate-400 mb-4">Omzet Bulan Ini</p>

                    <div className="flex items-end gap-2 h-24 mt-4">
                        {[40, 65, 45, 80, 55, 90].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                            />
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-slate-400">
                        <span>Min</span>
                        <span>Avg</span>
                        <span>Max</span>
                    </div>
                </div>
            </motion.div>

            {/* CARD 3: Security (Bottom, Floating) */}
            <motion.div
                initial={{ opacity: 0, y: 50, rotate: 5 }}
                animate={{
                    opacity: 1,
                    rotate: [5, 2, 5],
                    y: [120, 100, 120]
                }}
                transition={{
                    duration: 0.8, delay: 0.3,
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute bottom-0 left-20 z-10"
            >
                <div className="w-56 bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-3">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-slate-800">Keamanan Bank</h3>
                        <p className="text-[10px] text-slate-500 mt-1">Enkripsi AES-256</p>
                        <div className="mt-3 flex justify-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="text-[10px] text-green-600 font-medium">Protected</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Icons (Particles) */}
            <FloatingParticle icon={<Zap />} color="text-amber-500" x="10%" y="20%" delay={0} />
            <FloatingParticle icon={<Lock />} color="text-cyan-500" x="80%" y="80%" delay={1} />
            <FloatingParticle icon={<TrendingUp />} color="text-emerald-500" x="90%" y="40%" delay={2} />

        </div>
    );
}

function FloatingParticle({ icon, color, x, y, delay }: any) {
    return (
        <motion.div
            className={`absolute ${color} w-8 h-8 opacity-80`}
            style={{ left: x, top: y }}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 45, 0],
                opacity: [0.5, 1, 0.5]
            }}
            transition={{
                duration: 4,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {icon}
        </motion.div>
    )
}
