'use client';

import React, { useEffect } from 'react';
import { useDemoStore } from '@/store/demoStore';
import { PlayCircle, ShieldCheck } from 'lucide-react';

export function DemoToggleBadge() {
    const { isDemoMode, toggleDemoMode } = useDemoStore();

    // Keyboard shortcut: Ctrl + Shift + D to toggle Demo Mode instantly
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                toggleDemoMode();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleDemoMode]);

    return (
        <button
            onClick={toggleDemoMode}
            type="button"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
                isDemoMode
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:bg-slate-800/80'
            }`}
            title="Klik atau tekan Ctrl+Shift+D untuk mentoggle Demo Mode (Recording Mode)"
        >
            <span className="relative flex h-2 w-2">
                {isDemoMode && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isDemoMode ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
            <span className="flex items-center gap-1.5">
                {isDemoMode ? <PlayCircle className="h-3.5 w-3.5 text-emerald-400" /> : <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />}
                {isDemoMode ? 'DEMO MODE: ON' : 'LIVE API MODE'}
            </span>
        </button>
    );
}
