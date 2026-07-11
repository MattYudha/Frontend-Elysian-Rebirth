'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const CONSENT_KEY = 'elysian-cookie-consent';

export function CookieConsent() {
    const { t } = useTranslation();
    const [showBanner, setShowBanner] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check if user has already made a choice
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Small delay to avoid jarring appearance on page load
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        setShowBanner(false);
    };

    // Don't render on server or before hydration
    if (!mounted) return null;

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="container mx-auto max-w-6xl">
                        <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-slate-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
                            {/* Ambient Gradients */}
                            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

                            {/* Noise Texture */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            {/* Content */}
                            <div className="relative z-10 p-6 md:p-8">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <Cookie className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                                            {t.landing.cookies.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {t.landing.cookies.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                        <Button
                                            onClick={handleDecline}
                                            variant="outline"
                                            className="h-11 px-6 rounded-xl bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-all"
                                        >
                                            {t.landing.cookies.decline}
                                        </Button>
                                        <Button
                                            onClick={handleAccept}
                                            className="h-11 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
                                        >
                                            {t.landing.cookies.accept}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
