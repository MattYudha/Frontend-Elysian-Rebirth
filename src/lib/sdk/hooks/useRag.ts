import { useState, useCallback } from 'react';

export interface RagConfig {
    chunkSize: number;
    chunkOverlap: number;
    embeddingModel: string;
    retrievalCount: number;
}

export interface RagSource {
    id: string;
    name: string;
    status: 'syncing' | 'ready' | 'error';
    chunks: number;
}

export interface UseRagOptions {
    /**
     * Initial RAG configuration
     */
    initialConfig?: Partial<RagConfig>;

    /**
     * Initial knowledge sources
     */
    initialSources?: RagSource[];

    /**
     * Callback when config is updated
     */
    onConfigChange?: (config: RagConfig) => void;

    /**
     * Callback when reindex is triggered
     */
    onReindex?: (config: RagConfig) => Promise<void>;
}

export interface UseRagReturn {
    /**
     * Current RAG configuration
     */
    config: RagConfig;

    /**
     * Update configuration
     */
    updateConfig: (updates: Partial<RagConfig>) => void;

    /**
     * Trigger reindexing
     */
    reindex: () => Promise<void>;

    /**
     * Whether reindexing is in progress
     */
    isReindexing: boolean;

    /**
     * Knowledge sources list
     */
    sources: RagSource[];

    /**
     * Add a knowledge source
     */
    addSource: (source: Omit<RagSource, 'id'>) => void;

    /**
     * Remove a knowledge source
     */
    removeSource: (sourceId: string) => void;
}

const defaultConfig: RagConfig = {
    chunkSize: 512,
    chunkOverlap: 0.15,
    embeddingModel: 'text-embedding-ada-002',
    retrievalCount: 5,
};

/**
 * useRag - Hook for managing RAG configuration and knowledge sources
 * 
 * Provides utilities for RAG config management, source tracking, and reindexing.
 * 
 * @example
 * ```tsx
 * const { config, updateConfig, reindex, sources, addSource } = useRag({
 *   onReindex: async (config) => {
 *     await ragClient.reindex(config);
 *   }
 * });
 * 
 * <RagConfigPanel
 *   config={config}
 *   onChange={updateConfig}
 *   onApplyReindex={reindex}
 * />
 * ```
 */
export const useRag = (options: UseRagOptions = {}): UseRagReturn => {
    const {
        initialConfig = {},
        initialSources = [],
        onConfigChange,
        onReindex,
    } = options;

    const [config, setConfig] = useState<RagConfig>({
        ...defaultConfig,
        ...initialConfig,
    });

    const [sources, setSources] = useState<RagSource[]>(initialSources);
    const [isReindexing, setIsReindexing] = useState(false);

    const updateConfig = useCallback((updates: Partial<RagConfig>) => {
        const newConfig = { ...config, ...updates };
        setConfig(newConfig);
        onConfigChange?.(newConfig);
    }, [config, onConfigChange]);

    const reindex = useCallback(async () => {
        setIsReindexing(true);
        try {
            await onReindex?.(config);
        } finally {
            setIsReindexing(false);
        }
    }, [config, onReindex]);

    const addSource = useCallback((source: Omit<RagSource, 'id'>) => {
        const newSource: RagSource = {
            ...source,
            id: `src_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        setSources((prev) => [...prev, newSource]);
    }, []);

    const removeSource = useCallback((sourceId: string) => {
        setSources((prev) => prev.filter((s) => s.id !== sourceId));
    }, []);

    return {
        config,
        updateConfig,
        reindex,
        isReindexing,
        sources,
        addSource,
        removeSource,
    };
};
