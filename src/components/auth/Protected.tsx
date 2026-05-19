'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Protected is now a lightweight client-side guard.
 * The REAL auth enforcement happens in:
 * 1. middleware.ts (Edge) — checks refresh_token cookie
 * 2. dashboard/layout.tsx (SSR) — refreshes token & hydrates store
 * 
 * This component only handles the edge case where Zustand
 * hasn't hydrated yet from localStorage (prevents flash of empty content).
 */
export function Protected({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Wait for Zustand persist rehydration
        if (useAuthStore.persist?.hasHydrated()) {
            setIsHydrated(true);
        } else {
            const unsub = useAuthStore.persist?.onFinishHydration?.(() => {
                setIsHydrated(true);
            });
            // Safety: if persist isn't configured, just render immediately
            if (!useAuthStore.persist) {
                setIsHydrated(true);
            }
            return unsub;
        }
    }, []);

    // Show nothing until hydration is done (prevents flash)
    if (!isHydrated) return null;

    return <>{children}</>;
}
