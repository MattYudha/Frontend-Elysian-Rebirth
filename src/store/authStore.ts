import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/sdk/schemas/auth.schema';
import { clearQueryCache } from '@/components/providers/QueryProvider';

interface AuthState {
    user: Pick<User, 'id' | 'name' | 'email' | 'avatar' | 'role'> | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoadingSession: boolean;
    login: (user: Pick<User, 'id' | 'name' | 'email' | 'avatar' | 'role'>, accessToken?: string) => void;
    logout: () => void;
    setLoadingSession: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoadingSession: false, // Default false to enable tenant queries on reload
            login: (user, accessToken) => {
                set({ user, accessToken: accessToken || null, isAuthenticated: true, isLoadingSession: false });
                clearQueryCache();
            },
            logout: () => {
                set({ user: null, accessToken: null, isAuthenticated: false, isLoadingSession: false });
                clearQueryCache();
            },
            setLoadingSession: (isLoadingSession) => set({ isLoadingSession }),
        }),
        {
            name: 'elysian-auth-storage', // localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
