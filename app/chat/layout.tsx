import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[100dvh] w-full overflow-hidden relative z-0 bg-slate-50/50 dark:bg-[#060D18]">
            <ElysianGrid />

            <Sidebar />

            <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden p-4 md:p-6 lg:p-8 relative">
                {/* Elevated Surface Container (Option B) */}
                <div className="flex-1 flex flex-col bg-white/60 dark:bg-[#0B1120]/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 shadow-xl rounded-2xl md:rounded-3xl overflow-hidden relative">
                    {/* Contained Navbar */}
                    <div className="flex-none border-b border-slate-200/50 dark:border-slate-800/50 relative z-20">
                        <DashboardNavbar staticMode={true} />
                    </div>

                    <div id="main-scroll-container" className="flex-1 overflow-hidden relative">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
