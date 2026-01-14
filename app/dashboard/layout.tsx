'use client';

import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-[url('/dashboard-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 bg-white/70 backdrop-blur-sm">
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
