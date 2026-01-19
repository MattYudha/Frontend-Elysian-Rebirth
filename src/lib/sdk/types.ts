/**
 * Core type definitions for the Enterprise AI SDK
 */

/**
 * AI Message role
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * AI Chat Message
 */
export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

/**
 * Streaming chunk for AI responses
 */
export interface StreamChunk {
    content: string;
    done: boolean;
    metadata?: Record<string, unknown>;
}

/**
 * AI Model Configuration
 */
export interface ModelConfig {
    model: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

/**
 * Thought step in reasoning chain
 */
export interface ThoughtStep {
    id: string;
    title: string;
    content: string;
    status: 'pending' | 'processing' | 'complete' | 'error';
    timestamp: Date;
}

/**
 * Attachment file
 */
export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
    data?: ArrayBuffer | string;
}

/**
 * RAG Document chunk
 */
export interface RagChunk {
    id: string;
    content: string;
    score: number;
    metadata: {
        source: string;
        page?: number;
        section?: string;
        chunkIndex?: number;
    };
}

/**
 * RAG Query result
 */
export interface RagQueryResult {
    query: string;
    chunks: RagChunk[];
    answer?: string;
    sources: string[];
}

/**
 * RAG Configuration
 */
export interface RagConfig {
    chunkSize: number;
    chunkOverlap: number;
    embeddingModel: string;
    retrievalCount?: number;
}

/**
 * Workflow node types
 */
export type WorkflowNodeType = 'input' | 'knowledge' | 'llm' | 'export' | 'custom';

/**
 * Workflow node status
 */
export type WorkflowNodeStatus = 'idle' | 'running' | 'complete' | 'error';

/**
 * Workflow node configuration
 */
export interface WorkflowNodeConfig {
    id: string;
    type: WorkflowNodeType;
    label: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;
    status?: WorkflowNodeStatus;
}

/**
 * Workflow edge/connection
 */
export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    animated?: boolean;
    style?: Record<string, unknown>;
}

/**
 * Pipeline status
 */
export type PipelineStatus = 'queued' | 'processing' | 'completed' | 'failed';

/**
 * Pipeline item
 */
export interface PipelineItem {
    id: string;
    name: string;
    status: PipelineStatus;
    progress?: number;
    eta?: string;
    lastUpdated: Date;
    metadata?: Record<string, unknown>;
}

/**
 * Knowledge source
 */
export interface KnowledgeSource {
    id: string;
    name: string;
    type: 'pdf' | 'faq' | 'web' | 'database' | 'other';
    status: 'syncing' | 'ready' | 'error';
    syncProgress?: number;
    embeddingModel: string;
    chunkCount: number;
    lastSync?: Date;
    metadata?: Record<string, unknown>;
}

/**
 * Version history entry
 */
export interface VersionHistoryEntry {
    id: string;
    version: number;
    type: 'ai' | 'human';
    title: string;
    timestamp: Date;
    author?: string;
    changes?: string;
}
