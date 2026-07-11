/**
 * Action Center / Human-in-the-Loop Layout
 * Follows Phase 6 Unified Canvas principles and Phase 7 Responsive Master-Detail pattern.
 */
'use client';

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

export default function ActionCenterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[100dvh] w-full relative z-0 overflow-hidden bg-slate-50/50 dark:bg-[#060D18]">
            <ElysianGrid />

            <Sidebar />

            <main className="flex-1 min-w-0 flex flex-col h-full relative overflow-hidden">
                {/* Transparent Navbar for Unified Canvas vibe */}
                <div className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <DashboardNavbar staticMode={true} />
                </div>

                <div id="main-scroll-container" className="flex-1 overflow-hidden relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
