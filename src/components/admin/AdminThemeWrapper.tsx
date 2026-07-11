'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function AdminThemeWrapper({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Prevent hydration mismatch by rendering a safe default (or empty)
        // DEFAULT TO LIGHT MODE as requested by user
        return <div className="min-h-screen bg-slate-50">{children}</div>;
    }

    const isDark = resolvedTheme === 'dark';

    return (
        <div
            className={cn(
                "flex w-full min-h-screen font-sans transition-colors duration-300",
                isDark ? "admin-obsidian-theme obsidian-mesh-bg bg-slate-950 text-slate-100 selection:bg-rose-500/30" : "bg-slate-50 text-slate-900 selection:bg-blue-100"
            )}
        >
            {children}
        </div>
    );
}
