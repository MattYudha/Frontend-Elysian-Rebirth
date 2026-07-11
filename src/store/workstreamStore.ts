import { create } from 'zustand';

export type WorkstreamViewMode = 'board' | 'list' | 'timeline';

interface WorkstreamState {
    activeTenantId: string | null;
    viewMode: WorkstreamViewMode;
    searchQuery: string;

    // Actions
    setActiveTenant: (id: string | null) => void;
    setViewMode: (mode: WorkstreamViewMode) => void;
    setSearchQuery: (query: string) => void;
}

export const useWorkstreamStore = create<WorkstreamState>((set) => ({
    activeTenantId: null,
    viewMode: 'board',
    searchQuery: '',

    setActiveTenant: (id) => set({ activeTenantId: id }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
