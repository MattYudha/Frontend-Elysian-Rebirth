'use client';

import { useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/lib/sdk/schemas/auth.schema';

interface StoreInitializerProps {
    user: Pick<User, 'id' | 'name' | 'email' | 'avatar' | 'role'>;
    accessToken?: string;
}

/**
 * StoreInitializer is strictly a vessel intended to catch user data 
 * fetched by a Server Component (SSR) and immediately inject it into 
 * the singleton Zustand memory store during the initial Client Component mount.
 * 
 * This obliterates the Client-Side Waterfall by rendering the UI fully authenticated on Frame 1.
 */
export function StoreInitializer({ user, accessToken }: StoreInitializerProps) {
    const initialized = useRef(false);

    if (!initialized.current) {
        // HANYA sinkronisasi data dari SSR jika kita memiliki accessToken nyata dan valid.
        // Jangan pernah menimpa sesi klien yang aktif di localStorage dengan mock user fallback!
        if (accessToken) {
            useAuthStore.getState().login(user, accessToken);
            useAuthStore.getState().setLoadingSession(false);
        } else if (!useAuthStore.getState().isAuthenticated) {
            // Jika klien sama sekali belum terautentikasi dan tidak ada session, 
            // set loading session ke false agar query data tidak tersumbat.
            useAuthStore.getState().setLoadingSession(false);
        }
        initialized.current = true;
    }

    // It renders nothing. It strictly operates on memory.
    return null;
}
