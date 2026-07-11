import { create } from 'zustand';

interface SettingsUiState {
    // Map of pathname to dirty status (e.g. {'/settings/ai/agents': true})
    dirtyMap: Record<string, boolean>;

    // Set a specific route's dirty status
    setDirty: (path: string, isDirty: boolean) => void;

    // Check if any route is dirty, or optionally a specific path
    isAnyDirty: () => boolean;
    isPathDirty: (path: string) => boolean;

    // Clear all dirty states (useful on force close or logout)
    clearAllDirty: () => void;

    returnUrl: string;
    setReturnUrl: (url: string) => void;

    // Modal state
    isOpen: boolean;
    activeTab: string;
    openSettings: (tab?: string) => void;
    closeSettings: () => void;
    setActiveTab: (tab: string) => void;
}

export const useSettingsUiStore = create<SettingsUiState>((set, get) => ({
    dirtyMap: {},

    setDirty: (path, isDirty) =>
        set((state) => ({
            dirtyMap: {
                ...state.dirtyMap,
                [path]: isDirty
            }
        })),

    isAnyDirty: () => {
        const { dirtyMap } = get();
        return Object.values(dirtyMap).some(status => status === true);
    },

    isPathDirty: (path) => {
        return !!get().dirtyMap[path];
    },

    clearAllDirty: () => set({ dirtyMap: {} }),

    returnUrl: '/dashboard',
    setReturnUrl: (url) => set({ returnUrl: url }),

    isOpen: false,
    activeTab: 'profile',
    openSettings: (tab) => set({ isOpen: true, activeTab: tab || 'profile' }),
    closeSettings: () => set({ isOpen: false }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
