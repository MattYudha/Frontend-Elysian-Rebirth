import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorDocument } from '@/lib/sdk/schemas';
import { createEncryptedIdbStorage } from '@/lib/storage-engine';

// Enterprise Storage Engine
const storage = createEncryptedIdbStorage<unknown>({
    key: 'elysian-editor',
    secret: 'elysian-local-secret-key-v1' // In prod, use env var
});

export interface Snapshot {
    id: string;
    name: string;
    timestamp: number;
    content: unknown;
    version: number;
}

interface EditorState {
    currentDocument: EditorDocument | null;
    isDirty: boolean;
    autosaveEnabled: boolean;
    lastSynced: number | null;
    localDraftVersion: number;
    snapshots: Snapshot[];

    setDocument: (doc: EditorDocument) => void;
    updateContent: (content: unknown) => void;
    setDirty: (dirty: boolean) => void;
    setAutosave: (enabled: boolean) => void;
    markSynced: () => void;
    createSnapshot: (name?: string) => void;
    restoreSnapshot: (snapshotId: string) => void;
}

export const useEditorStore = create<EditorState>()(
    persist(
        (set, get) => ({
            currentDocument: null,
            isDirty: false,
            autosaveEnabled: true,
            lastSynced: null,
            localDraftVersion: 0,
            snapshots: [],

            setDocument: (doc) => set({
                currentDocument: doc,
                isDirty: false,
                localDraftVersion: doc.version
            }),

            updateContent: (content) =>
                set((state) => ({
                    currentDocument: state.currentDocument
                        ? { ...state.currentDocument, content }
                        : null,
                    isDirty: true,
                    localDraftVersion: state.localDraftVersion + 1
                })),

            setDirty: (dirty) => set({ isDirty: dirty }),
            setAutosave: (enabled) => set({ autosaveEnabled: enabled }),
            markSynced: () => set({ isDirty: false, lastSynced: Date.now() }),

            createSnapshot: (name) => {
                const state = get();
                if (!state.currentDocument) return;

                const newSnapshot: Snapshot = {
                    id: crypto.randomUUID(),
                    name: name || `Version ${state.localDraftVersion}`,
                    timestamp: Date.now(),
                    content: state.currentDocument.content,
                    version: state.localDraftVersion
                };

                set((state) => ({
                    snapshots: [newSnapshot, ...state.snapshots],
                    lastSynced: Date.now(),
                    isDirty: false // Snapshots count as a "save"
                }));
            },

            restoreSnapshot: (snapshotId) => {
                set((state) => {
                    const snapshot = state.snapshots.find(s => s.id === snapshotId);
                    if (!snapshot || !state.currentDocument) return state;

                    return {
                        currentDocument: {
                            ...state.currentDocument,
                            content: snapshot.content
                        },
                        localDraftVersion: snapshot.version + 1, // Forking a new version
                        isDirty: true
                    };
                })
            }
        }),
        {
            name: 'elysian-editor-storage',
            storage, // Async IndexedDB
            partialize: (state) => ({
                // We persist the document draft so we can recover it
                currentDocument: state.currentDocument,
                isDirty: state.isDirty,
                autosaveEnabled: state.autosaveEnabled,
                lastSynced: state.lastSynced,
                localDraftVersion: state.localDraftVersion,
                snapshots: state.snapshots
            }),
        }
    )
);
