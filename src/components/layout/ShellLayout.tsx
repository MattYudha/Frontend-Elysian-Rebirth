"use client";

import React from 'react';
import { MobileSidebar } from '@/components/MobileSidebar';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';


export interface ShellLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    topbar?: React.ReactNode;
    className?: string;
}

export const ShellLayout: React.FC<ShellLayoutProps> = ({
    children,
    sidebar,
    topbar,
    className,
}) => {
    const { isOpen } = useSidebar();
    const collapsed = !isOpen;

    return (
        // 1. KUNCI LAYOUT UTAMA SELEBAR & SETINGGI LAYAR (NO BODY SCROLL)
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-zinc-950">

            {/* 2. SIDEBAR (STATIC / STICKY) */}
            {sidebar && (
                <aside
                    className={cn(
                        "hidden md:flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl transition-all duration-300",
                        collapsed ? "w-[80px]" : "w-[280px]"
                    )}
                >
                    {sidebar}
                </aside>
            )}

            {/* Mobile Sidebar Logic (Overlay) - Optional integration */}
            {/* If the passed sidebar handles mobile itself, this might be redundant, but good for fallback */}
            <MobileSidebar />

            {/* 3. MAIN CONTENT AREA (SCROLLABLE) */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Topbar area - Static flow */}
                {topbar && (
                    <div className="flex-shrink-0 z-20 bg-white/50 backdrop-blur-md border-b border-slate-100 dark:border-zinc-800">
                        {topbar}
                    </div>
                )}

                {/* 4. AREA SCROLL SEBENARNYA ADA DI SINI */}
                <main
                    className={cn(
                        "flex-1 overflow-y-auto", // <--- KUNCI: overflow-y-auto
                        className
                    )}
                >
                    {/* Tambahkan max-w agar konten tidak terlalu lebar di layar besar */}
                    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
ShellLayout.displayName = "ShellLayout";
