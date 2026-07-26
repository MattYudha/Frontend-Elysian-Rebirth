import { create } from 'zustand';

interface DemoStore {
    isDemoMode: boolean;
    toggleDemoMode: () => void;
    setDemoMode: (val: boolean) => void;
}

export const useDemoStore = create<DemoStore>((set) => ({
    isDemoMode: true, // Default to true for presentation & video recording readiness
    toggleDemoMode: () => set((state) => ({ isDemoMode: !state.isDemoMode })),
    setDemoMode: (val: boolean) => set({ isDemoMode: val }),
}));
