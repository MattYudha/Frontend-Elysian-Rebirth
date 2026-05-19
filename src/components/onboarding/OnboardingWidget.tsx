'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { getOnboardingSteps } from '@/config/onboarding';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Z_INDEX } from '@/config/zIndex';
import { usePathname } from 'next/navigation';

// Premium "Smooth Flow" Celebration Component
const CelebrationOverlay = ({ onComplete }: { onComplete: () => void }) => {
    const particles = Array.from({ length: 90 }).map((_, i) => ({
        id: i,
        xStart: '50vw',
        yStart: '60vh',
        xEnd: `${50 + (Math.random() - 0.5) * 60}vw`,
        yPeak: `${50 - (Math.random() * 35 + 25)}vh`,
        yEnd: '120vh',
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
        size: Math.random() * 5 + 3,
        color: ['bg-blue-500', 'bg-cyan-400', 'bg-sky-500', 'bg-white'][Math.floor(Math.random() * 4)],
        shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-[2px]',
    }));

    useEffect(() => {
        const timer = setTimeout(onComplete, 5500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 9999, backdropFilter: 'blur(16px)' }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center p-4 bg-slate-900/80 dark:bg-[#060D18]/80"
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: p.xStart, y: p.yStart, opacity: 0, scale: 0.2 }}
                    animate={{
                        x: [p.xStart, p.xEnd, p.xEnd],
                        y: [p.yStart, p.yPeak, p.yEnd],
                        opacity: [0, 1, 1, 0],
                        rotate: [0, p.rotation * 0.5, p.rotation],
                        scale: [0.2, 1, 0.8, 0]
                    }}
                    transition={{ duration: 3.5, delay: p.delay, times: [0, 0.3, 0.8, 1], ease: [0.25, 0.1, 0.25, 1] }}
                    className={`absolute ${p.color} ${p.shape} shadow-lg`}
                    style={{ width: p.size, height: p.size }}
                />
            ))}

            <div className="text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                        READY. <span className="text-blue-500">SET.</span> <span className="text-cyan-400">GO!</span>
                    </h1>
                    <div className="h-1.5 w-32 bg-blue-600 mx-auto rounded-full mb-8 shadow-[0_0_20px_rgba(37,99,235,0.8)]" />
                    <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                        Anda telah menyelesaikan setup awal. <br />
                        <span className="text-white font-bold italic tracking-wide">Selamat datang di ekosistem Elysian Intelligence.</span>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export const OnboardingWidget = () => {
    const {
        isOpen,
        isCompleted,
        showCelebration,
        dismissCelebration,
        nextStep,
        close,
        open,
        getStepNumber,
        getTourProgress,
        currentPhase
    } = useOnboardingStore();

    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const { toast } = useToast();
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const steps = getOnboardingSteps(isMobile);
    const stepNumber = getStepNumber();
    const currentStepData = steps[stepNumber - 1];
    const { percent } = getTourProgress();

    // Only highlight elements that exist on the current page — NEVER navigate away
    useEffect(() => {
        if (currentPhase !== 'tour' || !isOpen || !currentStepData) return;
        
        const updatePosition = () => {
            const el = document.getElementById(currentStepData.targetId || '');
            if (el) {
                setTargetRect(el.getBoundingClientRect());
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Element not on this page — show card without spotlight
                setTargetRect(null);
            }
        };

        // NO router.push here — we never force navigation
        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        const timeout = setTimeout(updatePosition, 300);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            clearTimeout(timeout);
        };
    }, [stepNumber, isOpen, currentStepData, currentPhase, pathname]);

    const handleClose = () => {
        close();
        toast({
            title: "Tour dihentikan",
            description: "Akses panduan kapan saja dari page Getting Started.",
            action: <Button variant="outline" size="sm" onClick={open}>Lanjutkan</Button>,
        });
    };

    if (!isMounted || currentPhase !== 'tour' || isCompleted) return null;

    if (showCelebration) {
        return <CelebrationOverlay onComplete={dismissCelebration} />;
    }

    if (!isOpen || !currentStepData) return null;

    // Check if current step's target element exists on this page
    const isTargetOnPage = !!targetRect;
    const needsNavigation = currentStepData.navigateTo && pathname !== currentStepData.navigateTo;

    const getCardPosition = () => {
        if (isMobile) return { bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)' };
        if (!targetRect) return { bottom: 24, right: 24 };

        const cardWidth = 420;
        const cardHeight = 220;
        const padding = 24;
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        // Try Right
        if (targetRect.right + padding + cardWidth < vw) {
            return { top: Math.max(padding, Math.min(targetRect.top, vh - cardHeight - padding)), left: targetRect.right + padding };
        }
        // Try Left
        if (targetRect.left - cardWidth - padding > 0) {
            return { top: Math.max(padding, Math.min(targetRect.top, vh - cardHeight - padding)), right: vw - targetRect.left + padding };
        }
        // Try Bottom
        if (targetRect.bottom + padding + cardHeight < vh) {
            return { top: targetRect.bottom + padding, left: Math.max(padding, Math.min(targetRect.left, vw - cardWidth - padding)) };
        }
        // Fallback
        return { bottom: padding, right: padding };
    };

    const cardPos = getCardPosition();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ zIndex: Z_INDEX.backdrop }}
                className="fixed inset-0 pointer-events-none"
            >
                <svg className="w-full h-full">
                    <mask id="tour-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect x={targetRect.left - 8} y={targetRect.top - 8} width={targetRect.width + 16} height={targetRect.height + 16} rx="12" fill="black" />
                        )}
                    </mask>
                    <rect x="0" y="0" width="100%" height="100%" fill="rgba(6, 13, 24, 0.75)" mask="url(#tour-mask)" />
                </svg>

                {targetRect && (
                    <motion.div
                        layoutId="onboarding-indicator"
                        style={{
                            position: 'absolute',
                            left: targetRect.left - 8,
                            top: targetRect.top - 8,
                            width: targetRect.width + 16,
                            height: targetRect.height + 16,
                            border: '2px solid #3b82f6',
                            borderRadius: '12px',
                            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.4)',
                        }}
                        className="animate-pulse"
                    />
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, ...cardPos }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 pointer-events-auto overflow-hidden w-full max-w-[380px]"
                style={{ zIndex: Z_INDEX.onboarding }}
            >
                {/* Header Highlight */}
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${percent}%` }} 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500" 
                    />
                </div>

                <div className="p-5 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                                {stepNumber}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {currentStepData.label || 'GUIDE'}
                            </span>
                        </div>
                        <button onClick={handleClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                            {currentStepData.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {currentStepData.description}
                        </p>

                        {/* Show navigation hint if target is on another page */}
                        {needsNavigation && !isTargetOnPage && (
                            <div className="flex gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                                <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                    Klik menu <strong>{currentStepData.title.replace(/[^\w\s]/g, '').trim()}</strong> di sidebar untuk melihat fitur ini
                                </p>
                            </div>
                        )}

                        {currentStepData.outcome && isTargetOnPage && (
                            <div className="flex gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 italic">
                                    &quot; {currentStepData.outcome} &quot;
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            Elysian Tour System 1.0
                        </span>
                        <Button 
                            onClick={nextStep}
                            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-xl h-10 px-6 font-bold shadow-lg transition-transform hover:-translate-y-0.5"
                        >
                            <span className="hidden sm:inline">{stepNumber === steps.length ? 'Selesaikan' : currentStepData.ctaLabel}</span>
                            <span className="sm:hidden">{stepNumber === steps.length ? 'Selesai' : 'Lanjut'}</span>
                            {stepNumber === steps.length ? <CheckCircle2 className="ml-2 w-4 h-4" /> : <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
