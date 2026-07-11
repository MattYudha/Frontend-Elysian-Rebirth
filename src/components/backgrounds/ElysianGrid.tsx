'use client';

import React from 'react';
import { useUiStore } from '@/store/uiStore';

/**
 * Universal Elysian Grid Background
 * - Fixed full-page backdrop with base color + radial glow.
 * - Light mode: extra-soft grid (4.5% opacity) to avoid visual noise.
 * - Dark mode: deep ocean subtle grid (3% opacity).
 * - Grid pattern is on a dedicated overlay div that transitions via opacity (not background-image),
 *   ensuring smooth GPU-composited animation without repaint.
 * - Controlled by useUiStore.isGridVisible (persisted to localStorage).
 */
export function ElysianGrid() {
    const isGridVisible = useUiStore((s) => s.isGridVisible);

    return (
        <div className="fixed inset-0 z-[-10] pointer-events-none w-full h-full overflow-hidden">
            {/* Base Background Color — always visible */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300" />

            {/* Light mode grid — fades in/out via opacity */}
            <div
                aria-hidden="true"
                className={`absolute inset-0 dark:hidden transition-opacity duration-500 ease-out ${isGridVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(15, 23, 42, 0.025) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(15, 23, 42, 0.025) 1.5px, transparent 1.5px)
                    `,
                    backgroundSize: '24px 24px',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                }}
            />

            {/* Dark mode grid — fades in/out via opacity */}
            <div
                aria-hidden="true"
                className={`absolute inset-0 hidden dark:block transition-opacity duration-500 ease-out ${isGridVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(148, 163, 184, 0.02) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(148, 163, 184, 0.02) 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
                }}
            />

            {/* Subtle Radial Glow Top-Center — always visible (not part of grid toggle) */}
            <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/20 dark:bg-blue-600/15 blur-[120px] rounded-[100%] transition-colors duration-300" />
        </div>
    );
}
