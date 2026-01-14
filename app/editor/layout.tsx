'use client';

import { Sidebar } from '@/components/Sidebar';

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-hidden flex flex-col">
                    {children}
                </div>
            </main>
        </div>
    );
}
