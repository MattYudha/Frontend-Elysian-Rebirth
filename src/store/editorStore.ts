import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorDocument } from '@/lib/sdk/schemas';

interface EditorState {
    currentDocument: EditorDocument | null;
    isDirty: boolean;
    autosaveEnabled: boolean;
    setDocument: (doc: EditorDocument) => void;
    updateContent: (content: string) => void;
    setDirty: (dirty: boolean) => void;
    setAutosave: (enabled: boolean) => void;
}

export const useEditorStore = create<EditorState>()(
    persist(
        (set) => ({
            currentDocument: null,
            isDirty: false,
            autosaveEnabled: true,
            setDocument: (doc) => set({ currentDocument: doc, isDirty: false }),
            updateContent: (content) =>
                set((state) => ({
                    currentDocument: state.currentDocument
                        ? { ...state.currentDocument, content }
                        : null,
                    isDirty: true,
                })),
            setDirty: (dirty) => set({ isDirty: dirty }),
            setAutosave: (enabled) => set({ autosaveEnabled: enabled }),
        }),
        {
            name: 'editor-storage',
            partialize: (state) => ({
                autosaveEnabled: state.autosaveEnabled,
            }),
        }
    )
);
