'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function Protected({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Rehydrate store on mount
        useAuthStore.persist.rehydrate();
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        // Whitelist public routes
        const publicRoutes = ['/login', '/register', '/', '/about'];

        if (!isAuthenticated && !publicRoutes.includes(pathname)) {
            router.replace('/login');
        }
    }, [isAuthenticated, router, pathname, isClient]);

    // Don't render protected content until client-side hydration check is done
    if (!isClient) return null;

    return <>{children}</>;
}
