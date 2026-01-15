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

// Enterprise Types
export type IngestionChannel = 'whatsapp' | 'email' | 'web_upload' | 'mobile_scan';
export type DocumentStage = 'ingest' | 'ocr' | 'verify' | 'ledger' | 'archive';
export type UserRole = 'owner' | 'manager' | 'admin';
export type ExecutionStatus = 'none' | 'pending_review' | 'executed' | 'automated';

export interface RagSource {
    id: string;
    name: string;
    type: 'pdf' | 'docx' | 'txt' | 'csv' | 'scanned_img';
    size: number;
    uploadedAt: Date;

    // Pipeline State
    channel: IngestionChannel;
    stage: DocumentStage;
    status: 'queued' | 'processing' | 'indexing' | 'ready' | 'failed';
    errorReason?: string;

    // Assignment & Audit
    assignedTo?: string; // User ID
    ledgerId?: string; // Linked transaction ID like "TRX-2024-001"
    confidenceScore: number; // 0-1

    // Intelligence Layer
    metadata?: {
        documentType?: 'Financial Report' | 'Invoice' | 'Contract' | 'Faktur' | 'Laporan Keuangan' | 'Technical Spec' | 'Unknown';
        period?: string;
        keyMetrics?: {
            label: string;
            value: string;
            trend?: 'up' | 'down' | 'neutral';
            trendValue?: string;
        }[];
        summary?: string;
    };

    // Action & Value Layer
    suggestedActions: {
        label: string;
        actionId: string;
        style: 'primary' | 'ghost' | 'danger';
        icon?: string;
    }[];
    executionStatus: ExecutionStatus;
    executionResult?: string;

    valueMetrics?: {
        moneySaved?: number;
        timeSavedMinutes?: number;
    };

    entities: { type: 'supplier' | 'client' | 'project'; name: string }[];
    insights: { type: 'risk' | 'trend' | 'opportunity'; text: string }[];

    auditLog: { action: string; user: string; timestamp: Date }[];
}

export interface PipelineStats {
    activeQueue: number;
    processingSpeed: number; // docs/min
    accuracy: number; // %
    channelHealth: Record<IngestionChannel, 'healthy' | 'degraded' | 'offline'>;
    moneySavedTotal: number;
    timeSavedTotalHrs: number;
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
    // Pipeline & Ops endpoints
    async getPipelineStats(): Promise<PipelineStats> {
        await delay(600);
        return {
            activeQueue: 142,
            processingSpeed: 24,
            accuracy: 98.2,
            channelHealth: {
                whatsapp: 'healthy',
                email: 'healthy',
                web_upload: 'healthy',
                mobile_scan: 'healthy',
            },
            moneySavedTotal: 15400000,
            timeSavedTotalHrs: 12.5,
        };
    },

    // Chat endpoints
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async postChatMessage(message: string, _conversationId?: string): Promise<ChatMessage> {
        await delay(1000);

        // Mock response
        return {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `Ini adalah respon simulasi untuk: "${message}". Di production, ini akan memanggil API LLM backend Go.`,
            timestamp: new Date(),
            thoughts: [
                'Menganalisis pertanyaan user...',
                'Mengambil konteks relevan...',
                'Menghasilkan jawaban...',
            ],
        };
    },

    // RAG endpoints
    async getRagSources(): Promise<RagSource[]> {
        await delay(800);

        return [
            {
                id: 'src-101',
                name: 'INV-2024-001_Acme.pdf',
                type: 'pdf',
                size: 245678,
                uploadedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
                channel: 'email',
                stage: 'verify',
                status: 'ready',
                confidenceScore: 0.85,
                metadata: {
                    documentType: 'Faktur',
                    period: 'Jan 2024',
                    summary: 'Biaya server bulanan berulang',
                    keyMetrics: [{ label: 'Total', value: 'Rp 4.500.000' }]
                },
                suggestedActions: [
                    { label: 'Post ke Buku Besar', actionId: 'post_ledger', style: 'primary' },
                    { label: 'Ingatkan Approval', actionId: 'remind_mgr', style: 'ghost' }
                ],
                executionStatus: 'pending_review',
                entities: [{ type: 'supplier', name: 'Acme Cloud Services' }],
                insights: [{ type: 'risk', text: 'Jumlah 10% lebih tinggi dari rata-rata' }],
                auditLog: [{ action: 'Masuk via Email', user: 'System', timestamp: new Date() }],
            },
            {
                id: 'src-102',
                name: 'WhatsApp Image 2024-01-15...jpg',
                type: 'scanned_img',
                size: 1540000,
                uploadedAt: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
                channel: 'whatsapp',
                stage: 'ocr',
                status: 'processing',
                confidenceScore: 0.0,
                suggestedActions: [],
                executionStatus: 'none',
                entities: [],
                insights: [],
                auditLog: [{ action: 'Diterima dari +62812...', user: 'System', timestamp: new Date() }],
                valueMetrics: { timeSavedMinutes: 5 } // Estimated
            },
            {
                id: 'src-103',
                name: 'Q3_Financial_Projections.xlsx',
                type: 'csv', // representing spreadsheet
                size: 45000,
                uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
                channel: 'web_upload',
                stage: 'archive',
                status: 'ready',
                confidenceScore: 0.99,
                metadata: {
                    documentType: 'Laporan Keuangan',
                    keyMetrics: [
                        { label: 'Pendapatan', value: 'Rp 1.2M', trend: 'up', trendValue: '+12%' },
                        { label: 'Opex', value: 'Rp 400jt', trend: 'down', trendValue: '-5%' }
                    ]
                },
                suggestedActions: [],
                executionStatus: 'executed',
                executionResult: 'Terintegrasi ke Dashboard',
                entities: [{ type: 'project', name: 'Expansion Q3' }],
                insights: [{ type: 'opportunity', text: 'Pengurangan Opex konfirmasi strategi efisiensi' }],
                auditLog: [],
                valueMetrics: { moneySaved: 5000000 }
            }
        ];
    },

    async uploadRagSource(file: File): Promise<RagSource> {
        await delay(1500);
        return {
            id: `src-${Date.now()}`,
            name: file.name,
            type: 'pdf', // mock
            size: file.size,
            uploadedAt: new Date(),
            channel: 'web_upload',
            stage: 'ingest',
            status: 'queued',
            confidenceScore: 0,
            suggestedActions: [],
            executionStatus: 'none',
            entities: [],
            insights: [],
            auditLog: [{ action: 'Diunggah manual', user: 'Admin', timestamp: new Date() }]
        };
    },

    async executeSourceAction(sourceId: string, actionId: string): Promise<{ success: boolean, message: string }> {
        await delay(1200);
        return { success: true, message: `Aksi ${actionId} selesai untuk ${sourceId}` };
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
