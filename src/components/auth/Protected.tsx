'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function Protected({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Wait for Zustand persist rehydration to complete
        const unsub = useAuthStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        // If already hydrated (e.g. fast localStorage read), set immediately
        if (useAuthStore.persist.hasHydrated()) {
            setIsHydrated(true);
        }

        return unsub;
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        // Whitelist public routes
        const publicRoutes = ['/login', '/register', '/', '/about'];

        if (!isAuthenticated && !publicRoutes.includes(pathname)) {
            // Save intended destination so login can redirect back
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirect_after_login', pathname);
            }
            router.replace('/login');
        }
    }, [isAuthenticated, router, pathname, isHydrated]);

    // Don't render anything until hydration is done (prevents flash)
    if (!isHydrated) return null;

    return <>{children}</>;
}
