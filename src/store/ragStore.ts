/**
 * ragStore.ts — Client-only UI configuration for RAG
 *
 * Server state (sources) is managed by React Query via useRagSources() hook.
 * This store only manages local configuration preferences.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RagState {
    chunkSize: number;
    overlap: number;
    embeddingModel: string;
    lastQuery: string;

    setChunkSize: (size: number) => void;
    setOverlap: (overlap: number) => void;
    setEmbeddingModel: (model: string) => void;
    setLastQuery: (query: string) => void;
}

export const useRagStore = create<RagState>()(
    persist(
        (set) => ({
            chunkSize: 512,
            overlap: 50,
            embeddingModel: 'text-embedding-3-small',
            lastQuery: '',

            setChunkSize: (size) => set({ chunkSize: size }),
            setOverlap: (overlap) => set({ overlap }),
            setEmbeddingModel: (model) => set({ embeddingModel: model }),
            setLastQuery: (query) => set({ lastQuery: query }),
        }),
        {
            name: 'rag-storage',
        }
    )
);
