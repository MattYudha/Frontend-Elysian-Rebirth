'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { getOnboardingSteps } from '@/config/onboarding';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Z_INDEX } from '@/config/zIndex';

// Premium "Smooth Flow" Celebration Component
const CelebrationOverlay = ({ onComplete }: { onComplete: () => void }) => {
    // Smooth Particle System (Flows like liquid/silk)
    const particles = Array.from({ length: 90 }).map((_, i) => {
        const spreadX = (Math.random() - 0.5) * 60;
        const lift = Math.random() * 35 + 25;

        return {
            id: i,
            xStart: '50vw',
            yStart: '60vh',
            xEnd: `${50 + spreadX}vw`,
            yPeak: `${50 - lift}vh`,
            yEnd: '120vh',
            rotation: Math.random() * 360,
            delay: Math.random() * 0.3,
            size: Math.random() * 5 + 3,
            color: ['bg-blue-500', 'bg-cyan-400', 'bg-sky-500', 'bg-white'][Math.floor(Math.random() * 4)],
            shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-[2px]',
        };
    });

    useEffect(() => {
        const timer = setTimeout(onComplete, 5500); // Slightly longer for the shimmer to play out
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
                zIndex: 9999,
                backdropFilter: 'blur(16px)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center"
        >
            {/* Smooth Particles */}
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
                    transition={{
                        duration: 3.5,
                        delay: p.delay,
                        times: [0, 0.3, 0.8, 1],
                        ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className={`absolute ${p.color} ${p.shape} shadow-sm opacity-80`}
                    style={{ width: p.size, height: p.size }}
                />
            ))}

            <div className="text-center relative z-10 px-4 mt-[-6vh]">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.2,
                        duration: 1.2,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                >
                    {/* Welcome Text WITH SHIMMER ANIMATION */}
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 font-heading drop-shadow-sm">
                        <motion.span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #1d4ed8, #06b6d4, #e0f2fe, #06b6d4, #1d4ed8)', // Blue -> Cyan -> White -> Cyan -> Blue
                                backgroundSize: '200% auto',
                            }}
                            animate={{
                                backgroundPosition: ['0% center', '200% center']
                            }}
                            transition={{
                                duration: 3,
                                ease: "linear",
                                repeat: Infinity,
                            }}
                        >
                            WELCOME.
                        </motion.span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center gap-5"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />

                    <p className="text-2xl md:text-3xl font-bold tracking-[0.25em] uppercase text-slate-800">
                        ELYSIAN READY
                    </p>

                    <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                        Sistem kecerdasan Anda telah aktif.<br />
                        <span className="text-blue-700 font-semibold">Siap mendukung keputusan strategis.</span>
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
        showWelcome,
        dismissWelcome,
        nextStep,
        close,
        hasSeenOnboardingAt,
        open,
        syncProgress,
        getStepNumber
    } = useOnboardingStore();

    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const { toast } = useToast();

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Get appropriate steps based on device
    const steps = getOnboardingSteps(isMobile);
    const stepNumber = getStepNumber();
    const currentStepData = steps[stepNumber - 1];

    // All hooks MUST be called before any conditional returns
    useEffect(() => {
        setIsMounted(true);
        syncProgress();
        if (!isCompleted && !hasSeenOnboardingAt) open();
    }, [hasSeenOnboardingAt, isCompleted, open, syncProgress]);

    useEffect(() => {
        if (!isOpen || !currentStepData) return;
        const updatePosition = () => {
            if (currentStepData?.targetId) {
                const el = document.getElementById(currentStepData.targetId);
                if (el) {
                    setTargetRect(el.getBoundingClientRect());
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
            }
            setTargetRect(null);
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);
        const timeout = setTimeout(updatePosition, 500);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
            clearTimeout(timeout);
        };
    }, [stepNumber, isOpen, currentStepData]);

    const handleClose = () => {
        close();
        toast({
            title: "Panduan ditutup sementara",
            description: "Anda bisa melanjutkannya kapan saja melalui menu 'Panduan Memulai' di sidebar.",
            action: (
                <Button variant="outline" size="sm" onClick={() => open()} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    Lanjut
                </Button>
            ),
        });
    };

    // Now safe to do conditional returns after all hooks
    if (!isMounted || !currentStepData) return null;

    if (showWelcome) {
        return (
            <AnimatePresence>
                <CelebrationOverlay onComplete={dismissWelcome} />
            </AnimatePresence>
        );
    }

    if (isCompleted) return null;

    // Smart positioning logic
    const getCardPosition = () => {
        if (isMobile) {
            // Mobile: Bottom sheet style (centered horizontally, at the bottom)
            return {
                bottom: 16,
                left: '50%',
                width: 'calc(100vw - 2rem)'
            };
        }

        if (!targetRect) {
            // Default: Bottom right corner
            return { bottom: 24, right: 24 };
        }

        const cardWidth = 420; // max width from className
        const cardHeight = 300; // estimated
        const padding = 24;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Try right side first
        if (targetRect.right + padding + cardWidth < viewportWidth) {
            return {
                top: Math.max(padding, Math.min(targetRect.top, viewportHeight - cardHeight - padding)),
                left: targetRect.right + padding
            };
        }

        // Try left side
        if (targetRect.left - cardWidth - padding > 0) {
            return {
                top: Math.max(padding, Math.min(targetRect.top, viewportHeight - cardHeight - padding)),
                right: viewportWidth - targetRect.left + padding
            };
        }

        // Try bottom
        if (targetRect.bottom + padding + cardHeight < viewportHeight) {
            return {
                top: targetRect.bottom + padding,
                left: Math.max(padding, Math.min(targetRect.left, viewportWidth - cardWidth - padding))
            };
        }

        // Fallback: Bottom right
        return { bottom: padding, right: padding };
    };

    const cardPosition = getCardPosition();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark Overlay with Cutout (NO BLUR) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ zIndex: Z_INDEX.backdrop }}
                        className="fixed inset-0 pointer-events-none overflow-hidden"
                    >
                        <svg className="w-full h-full">
                            <defs>
                                <mask id="spotlight-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    {targetRect && (
                                        <rect
                                            x={targetRect.left - 8}
                                            y={targetRect.top - 8}
                                            width={targetRect.width + 16}
                                            height={targetRect.height + 16}
                                            rx="16"
                                            fill="black"
                                        />
                                    )}
                                </mask>
                            </defs>
                            <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="rgba(0,0,0,0.75)"
                                mask="url(#spotlight-mask)"
                                className="transition-all duration-300 ease-in-out"
                            />
                        </svg>

                        {/* Glowing Border Around Highlighted Element */}
                        {targetRect && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    left: targetRect.left - 8,
                                    top: targetRect.top - 8,
                                    width: targetRect.width + 16,
                                    height: targetRect.height + 16,
                                    border: '3px solid #3b82f6',
                                    borderRadius: '16px',
                                    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1)',
                                    pointerEvents: 'none',
                                    transition: 'all 0.3s ease-in-out'
                                }}
                                className="animate-pulse"
                            />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: isMobile ? '-50%' : 0 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: isMobile ? '-50%' : 0,
                            ...cardPosition
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            position: 'fixed',
                            zIndex: Z_INDEX.onboarding,
                        }}
                        className="w-[calc(100vw-2rem)] max-w-[420px] pointer-events-auto"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/20 border border-white/40 dark:border-slate-700 backdrop-blur-3xl">

                            <div className="p-6 pt-6">
                                <div className="flex justify-between items-center mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {steps.map((s, idx) => (
                                                <div
                                                    key={s.id}
                                                    className={`w-1.5 h-1.5 rounded-full ${idx + 1 === stepNumber ? 'bg-blue-600' : idx + 1 < stepNumber ? 'bg-blue-200' : 'bg-slate-200'}`}
                                                />
                                            ))}
                                        </div>
                                        {currentStepData.label && (
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-2">
                                                {currentStepData.label}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={handleClose}
                                            title="Ingatkan nanti"
                                            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-md transition-all"
                                        >
                                            <HelpCircle size={16} />
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            title="Tutup"
                                            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-md transition-all"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-[19px] font-bold text-slate-900 dark:text-white mb-2 font-heading leading-tight">
                                        {currentStepData.title}
                                    </h3>
                                    <p className="text-[14px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {currentStepData.description}
                                    </p>

                                    {currentStepData.outcome && (
                                        <div className="mt-4 flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                            <p className="text-xs font-medium text-emerald-800 leading-snug">
                                                <span className="font-bold">Outcome:</span> {currentStepData.outcome}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-5 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={handleClose}
                                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        Ingatkan Nanti
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => nextStep()}
                                            className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/5 hover:shadow-blue-900/10 hover:-translate-y-0.5 transition-all"
                                        >
                                            {stepNumber === steps.length ? "Selesai" : currentStepData.ctaLabel}
                                            {stepNumber === steps.length ? <CheckCircle2 size={16} /> : <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};