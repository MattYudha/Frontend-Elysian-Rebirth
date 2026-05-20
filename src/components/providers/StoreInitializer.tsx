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
        // Hydrate from SSR if we have a fresh access token, or the client is not authenticated.
        // This ensures the client-side store stays synchronized with the fresh SSR token.
        if (accessToken || !useAuthStore.getState().isAuthenticated) {
            useAuthStore.getState().login(user, accessToken);
            useAuthStore.getState().setLoadingSession(false);
        }
        initialized.current = true;
    }

    // It renders nothing. It strictly operates on memory.
    return null;
}
