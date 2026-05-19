'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { ElysianTextLogo } from '@/components/ui/elysian-logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "Selamat Datang di Masa Depan",
        subtitle: "ELYSIAN INTELLIGENCE SITE",
        description: "Platform AI Enterprise yang dirancang untuk mengotomasi alur kerja kompleks dan meningkatkan efisiensi bisnis Anda secara radikal.",
        icon: <Zap className="w-12 h-12 text-blue-500" />,
        color: "from-blue-600/20 to-indigo-600/20",
        accent: "bg-blue-500"
    },
    {
        id: 2,
        title: "Knowledge Base Terpusat",
        subtitle: "SMART INDEXING",
        description: "Upload dokumen Anda, biarkan AI mempelajarinya. Dapatkan jawaban instan dan analisis mendalam berdasarkan data internal perusahaan Anda.",
        icon: <Sparkles className="w-12 h-12 text-cyan-500" />,
        color: "from-cyan-600/20 to-blue-600/20",
        accent: "bg-cyan-500"
    },
    {
        id: 3,
        title: "Otomasi Tanpa Batas",
        subtitle: "WORKFLOW ENGINE",
        description: "Bangun pipeline otomatis yang menghubungkan data, asisten AI, dan sistem Anda dalam satu alur kerja yang cerdas dan efisien.",
        icon: <ShieldCheck className="w-12 h-12 text-emerald-500" />,
        color: "from-emerald-600/20 to-teal-600/20",
        accent: "bg-emerald-500"
    }
];

export const WelcomeScreen = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { completeWelcome, skipWelcome } = useOnboardingStore();

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-slate-50 dark:bg-[#060D18] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500"
        >
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] transition-colors duration-1000 ${slides[currentSlide].color}`} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} 
                />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
                {/* Logo Section */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12"
                >
                    <ElysianTextLogo className="scale-125" />
                </motion.div>

                {/* Content Section */}
                <div className="relative w-full min-h-[400px] flex flex-col items-center text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-6 p-4 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl ring-1 ring-slate-200 dark:ring-white/10 shadow-2xl">
                                {slides[currentSlide].icon}
                            </div>
                            
                            <motion.span 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs font-black tracking-[0.3em] uppercase text-blue-500 mb-3"
                            >
                                {slides[currentSlide].subtitle}
                            </motion.span>
                            
                            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                                {slides[currentSlide].title}
                            </h2>
                            
                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                                {slides[currentSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Slide Indicators */}
                <div className="flex gap-3 mb-12">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleDotClick(i)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'}`}
                        />
                    ))}
                </div>

                {/* Action Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-6 w-full max-w-xs"
                >
                    <Button 
                        onClick={completeWelcome}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg group shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]"
                    >
                        Mulai Setup <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <button 
                        onClick={skipWelcome}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                        Lewati ke Dashboard
                    </button>
                </motion.div>
            </div>

            {/* Bottom Credits */}
            <div className="absolute bottom-8 opacity-20">
                <p className="text-[10px] text-slate-900 dark:text-white tracking-widest uppercase">Elysian Corp &copy; 2026 • Advanced Intelligence Engine</p>
            </div>
        </motion.div>
    );
};
