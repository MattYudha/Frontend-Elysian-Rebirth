import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RagSource } from '@/lib/sdk/schemas';

interface RagState {
    sources: RagSource[];
    chunkSize: number;
    overlap: number;
    embeddingModel: string;
    lastQuery: string;
    setSources: (sources: RagSource[]) => void;
    addSource: (source: RagSource) => void;
    setChunkSize: (size: number) => void;
    setOverlap: (overlap: number) => void;
    setEmbeddingModel: (model: string) => void;
    setLastQuery: (query: string) => void;
}

export const useRagStore = create<RagState>()(
    persist(
        (set) => ({
            sources: [],
            chunkSize: 512,
            overlap: 50,
            embeddingModel: 'text-embedding-3-small',
            lastQuery: '',
            setSources: (sources) => set({ sources }),
            addSource: (source) =>
                set((state) => ({
                    sources: [...state.sources, source],
                })),
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
