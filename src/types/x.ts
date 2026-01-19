'use client';

/**
 * Core type definitions for components
 * These are duplicated from x-sdk to avoid circular dependencies
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface StreamChunk {
    content: string;
    done: boolean;
}

export interface ThoughtStep {
    id: string;
    title: string;
    content: string;
    status: 'pending' | 'processing' | 'complete' | 'error';
    timestamp: Date;
}

export interface Attachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
    data?: ArrayBuffer | string;
}

export type PipelineStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface PipelineItem {
    id: string;
    name: string;
    status: PipelineStatus;
    progress?: number;
    eta?: string;
    lastUpdated: Date;
    metadata?: Record<string, any>;
}
