import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
    name: string;
    email: string;
    avatar: string | null; // Base64 string
    phone: string;
    bio?: string;
}

interface UserState {
    profile: UserProfile;
    security: {
        lastLogin: string;
        is2FAEnabled: boolean;
    };
    // Actions
    updateProfile: (data: Partial<UserProfile>) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: {
                name: 'Guest User',
                email: 'guest@elysian.app',
                avatar: null,
                phone: '',
                bio: 'Passionate about building great user experiences.',
            },
            security: {
                lastLogin: new Date().toISOString(),
                is2FAEnabled: false,
            },
            updateProfile: (data) =>
                set((state) => ({
                    profile: { ...state.profile, ...data },
                })),
            logout: () =>
                set({
                    profile: { name: '', email: '', avatar: null, phone: '' },
                }),
        }),
        {
            name: 'elysian-user-storage',
            storage: createJSONStorage(() => localStorage), // Client-side storage
            skipHydration: true, // PENTING: Mencegah mismatch server/client
        }
    )
);
