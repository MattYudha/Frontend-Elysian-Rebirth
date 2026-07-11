import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
    isGridVisible: boolean;
    toggleGrid: () => void;
    setGridVisible: (visible: boolean) => void;
}

export const useUiStore = create<UiState>()(
    persist(
        (set) => ({
            isGridVisible: true, // Default to true so it shows up out-of-the-box
            toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),
            setGridVisible: (visible: boolean) => set({ isGridVisible: visible }),
        }),
        {
            name: 'elysian-ui-storage', // unique name for localStorage
        }
    )
);
