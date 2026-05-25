'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, MoveRight, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface GhostwriterWidgetProps {
    suggestion: string | null;
    isLoading: boolean;
    onAccept: () => void;
    onDiscard: () => void;
    isMobile?: boolean;
}

export function GhostwriterWidget({
    suggestion,
    isLoading,
    onAccept,
    onDiscard,
    isMobile = false,
}: GhostwriterWidgetProps) {
    const isVisible = suggestion !== null || isLoading;

    // Keyboard shortcut hint state
    const [showKeyHint, setShowKeyHint] = useState(false);
    useEffect(() => {
        if (suggestion) {
            // Show key hint after 0.8s so the user notices TAB
            const t = setTimeout(() => setShowKeyHint(true), 800);
            return () => clearTimeout(t);
        } else {
            setShowKeyHint(false);
        }
    }, [suggestion]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="ghostwriter-widget"
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                    className={cn(
                        // Core layout
                        'flex items-center gap-3 rounded-2xl border shadow-2xl backdrop-blur-xl',
                        // Background + border — premium glass look
                        'bg-gradient-to-br from-white/96 via-blue-50/60 to-indigo-50/80',
                        'dark:from-slate-900/96 dark:via-slate-800/80 dark:to-indigo-950/80',
                        'border-blue-200/60 dark:border-blue-500/25',
                        'shadow-blue-500/10 dark:shadow-blue-900/20',
                        // Positioning: fixed to bottom of viewport — never overlaps the typing area
                        isMobile
                            ? 'fixed bottom-20 left-3 right-3 z-[60]' // Above mobile nav
                            : 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-auto max-w-[600px] min-w-[340px]'
                    )}
                    style={{ padding: isMobile ? '12px 14px' : '10px 16px' }}
                    role="status"
                    aria-live="polite"
                    aria-label="Saran AI"
                >
                    {/* Loading state */}
                    {isLoading && !suggestion ? (
                        <div className="flex items-center gap-2.5 text-blue-500 dark:text-blue-400 py-0.5 px-1">
                            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
                                Elysian AI sedang menyusun saran...
                            </span>
                        </div>
                    ) : suggestion ? (
                        <div className="flex items-center gap-3 w-full min-w-0">
                            {/* Icon badge */}
                            <div className="shrink-0 flex items-center gap-1.5">
                                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30">
                                    <Sparkles className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 hidden sm:inline-block">
                                    Saran AI
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-blue-200 dark:bg-blue-700/50 shrink-0" />

                            {/* Suggestion text */}
                            <p className="text-sm text-slate-700 dark:text-slate-200 italic flex-1 min-w-0 truncate font-medium">
                                <span className="text-slate-400 dark:text-slate-500 not-italic font-normal mr-1">…</span>
                                {suggestion}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                {/* Accept button */}
                                <Button
                                    id="ghostwriter-accept-btn"
                                    size="sm"
                                    onClick={onAccept}
                                    className={cn(
                                        'h-7 text-xs font-semibold px-3 gap-1.5',
                                        'bg-gradient-to-r from-blue-600 to-indigo-600',
                                        'hover:from-blue-700 hover:to-indigo-700',
                                        'text-white border-0 shadow-md shadow-blue-500/25',
                                        'rounded-lg transition-all duration-200 hover:scale-105',
                                    )}
                                    title="Terima saran (Tab)"
                                >
                                    <span>Terima</span>
                                    <AnimatePresence>
                                        {showKeyHint && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: 'auto' }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[9px] tracking-tight hidden sm:inline-block overflow-hidden"
                                            >
                                                TAB
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <MoveRight className="h-3 w-3 sm:hidden" />
                                </Button>

                                {/* Dismiss button */}
                                <Button
                                    id="ghostwriter-dismiss-btn"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-slate-400 transition-colors"
                                    onClick={onDiscard}
                                    title="Abaikan saran (Esc)"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
