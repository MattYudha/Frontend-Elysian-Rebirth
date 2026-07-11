'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCallback, useEffect } from 'react';

export default function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const onDismiss = useCallback(() => {
        router.back();
    }, [router]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onDismiss();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onDismiss]);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onDismiss}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Content Container */}
                <motion.div
                    layoutId="auth-card-login"
                    className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {/* Close Button */}
                    <button
                        onClick={onDismiss}
                        className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-50"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
