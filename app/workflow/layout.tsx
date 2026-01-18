'use client';

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
            {/* Legacy Sidebar Fixed */}
            <Sidebar />

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Navbar is strictly static here to push content down */}
                <div className="flex-none">
                    <DashboardNavbar staticMode />
                </div>

                <div id="main-scroll-container" className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
