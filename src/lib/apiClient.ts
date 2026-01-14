// import { http } from './http';

// Mock data utilities
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Types (will be imported from @enterprise-ai/x-sdk in real implementation)
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    thoughts?: string[];
}

export interface RagSource {
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'txt' | 'url';
    size?: number;
    uploadedAt: Date;
    status: 'processing' | 'ready' | 'failed';
}

export interface RagSearchResult {
    id: string;
    content: string;
    source: string;
    score: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>;
}

export interface EditorDocument {
    id: string;
    title: string;
    content: string;
    version: number;
    pdfUrl?: string;
    lastModified: Date;
}

export interface DashboardStats {
    totalDocs: number;
    totalApiCalls: number;
    errorRate: number;
    knowledgeHealth: number;
}

// API Client
export const apiClient = {
    // Chat endpoints
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async postChatMessage(message: string, _conversationId?: string): Promise<ChatMessage> {
        await delay(1000);

        // Mock response
        return {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `This is a mock response to: "${message}". In production, this will call the Go backend LLM API.`,
            timestamp: new Date(),
            thoughts: [
                'Analyzing user query...',
                'Retrieving relevant context...',
                'Generating response...',
            ],
        };
    },

    // RAG endpoints
    async getRagSources(): Promise<RagSource[]> {
        await delay(500);

        return [
            {
                id: 'src-1',
                name: 'Q3_Financials.pdf',
                type: 'pdf',
                size: 2456789,
                uploadedAt: new Date(Date.now() - 86400000),
                status: 'ready',
            },
            {
                id: 'src-2',
                name: 'Meeting_Notes_Oct.docx',
                type: 'docx',
                size: 145678,
                uploadedAt: new Date(Date.now() - 172800000),
                status: 'ready',
            },
            {
                id: 'src-3',
                name: 'Product_Specs.txt',
                type: 'txt',
                size: 89234,
                uploadedAt: new Date(Date.now() - 259200000),
                status: 'processing',
            },
        ];
    },

    async uploadRagSource(file: File): Promise<RagSource> {
        await delay(2000);

        return {
            id: `src-${Date.now()}`,
            name: file.name,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            type: file.name.split('.').pop() as any,
            size: file.size,
            uploadedAt: new Date(),
            status: 'processing',
        };
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async searchRag(query: string, _topK: number = 5): Promise<RagSearchResult[]> {
        await delay(800);

        return [
            {
                id: 'chunk-1',
                content: `Revenue for the third quarter increased by 15% year-over-year, driven primarily by the enterprise segment. This matches query: "${query}"`,
                source: 'Q3_Financials.pdf',
                score: 0.94,
                metadata: { page: 12, section: '4.1' },
            },
            {
                id: 'chunk-2',
                content: 'During the review meeting, the CFO mentioned potential risks in the APAC region due to currency fluctuations.',
                source: 'Meeting_Notes_Oct.docx',
                score: 0.78,
                metadata: { paragraph: 4 },
            },
        ];
    },

    // Editor endpoints
    async getEditorDocument(id: string): Promise<EditorDocument> {
        await delay(600);

        return {
            id,
            title: 'Safety Protocol v4.2',
            content: `# 3.1 Emergency Shutdown Procedures\n\nIn the event of a critical system failure, the operator must immediately engage the manual override switch...`,
            version: 4,
            pdfUrl: '/mock/sop.pdf',
            lastModified: new Date(Date.now() - 120000),
        };
    },

    async saveEditorDocument(id: string, content: string): Promise<EditorDocument> {
        await delay(1000);

        return {
            id,
            title: 'Safety Protocol v4.2',
            content,
            version: 5,
            lastModified: new Date(),
        };
    },

    // Dashboard endpoints
    async getDashboardStats(): Promise<DashboardStats> {
        await delay(400);

        return {
            totalDocs: 1200,
            totalApiCalls: 450,
            errorRate: 0.1,
            knowledgeHealth: 98,
        };
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getActivePipelines(): Promise<any[]> {
        await delay(500);

        return [
            {
                id: 'pipe-2941',
                name: 'Legal Contract Review',
                status: 'processing',
                progress: 45,
                estimatedTimeLeft: '2m',
            },
            {
                id: 'pipe-2942',
                name: 'Q4 Revenue Forecast',
                status: 'queued',
                progress: 0,
            },
            {
                id: 'pipe-2940',
                name: 'Risk Assessment',
                status: 'completed',
                progress: 100,
                completedAt: new Date(Date.now() - 600000),
            },
        ];
    },

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: Date }> {
        return {
            status: 'ok',
            timestamp: new Date(),
        };
    },
};
