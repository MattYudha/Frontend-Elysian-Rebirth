'use client';

import { Sidebar } from '@/components/Sidebar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
