'use client';

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';
import { WorkstreamSidebar } from '@/components/workstreams/WorkstreamSidebar';
import { WorkstreamMobileNav } from '@/components/workstreams/WorkstreamMobileNav';
import { cn } from '@/lib/utils';

export default function WorkstreamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[100dvh] w-full relative z-0 overflow-hidden bg-slate-50/50 dark:bg-[#060D18]">
            <ElysianGrid />

            {/* Main Application Sidebar (Sticky for Desktop) */}
            <Sidebar />

            {/* Contextual Workstream Sidebar */}
            <div className={cn(
                "hidden lg:flex h-[100dvh] flex-none sticky top-0 z-20"
            )}>
                <WorkstreamSidebar />
            </div>

            <main className="flex-1 min-w-0 flex flex-col h-full relative overflow-hidden">
                {/* Transparent Navbar */}
                <div className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <DashboardNavbar staticMode={true} />
                </div>

                {/* Mobile Contextual Navigation (lg:hidden) */}
                <WorkstreamMobileNav />

                <div id="main-scroll-container" className="flex-1 overflow-y-auto pb-16 md:pb-8 pt-4 md:pt-24 px-4 md:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
