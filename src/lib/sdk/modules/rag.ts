import { RagSourceSchema, RagSearchResultSchema, EditorDocumentSchema, type RagSource, type RagSearchResult, type EditorDocument } from '../schemas';
import { z } from 'zod';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const rag = {
    getSources: async (): Promise<RagSource[]> => {
        await delay(800);

        const mockData = [
            {
                id: 'src-101',
                name: 'INV-2024-001_Acme.pdf',
                type: 'pdf',
                size: 245678,
                uploadedAt: new Date(Date.now() - 1000 * 60 * 5),
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
            // ... more mock items can be added here
        ];

        return z.array(RagSourceSchema).parse(mockData);
    },

    search: async (query: string): Promise<RagSearchResult[]> => {
        await delay(800);
        const mockData = [
            {
                id: 'chunk-1',
                content: `Revenue for the third quarter increased by 15% year-over-year. Matches: "${query}"`,
                source: 'Q3_Financials.pdf',
                score: 0.94,
                metadata: { page: 12, section: '4.1' },
            }
        ];
        return z.array(RagSearchResultSchema).parse(mockData);
    },

    getEditorDocument: async (id: string): Promise<EditorDocument> => {
        await delay(600);
        const mockData = {
            id,
            title: 'Safety Protocol v4.2',
            content: `# 3.1 Emergency Shutdown Procedures\n\nIn the event of a critical system failure...`,
            version: 4,
            pdfUrl: '/mock/sop.pdf',
            lastModified: new Date(),
        };
        return EditorDocumentSchema.parse(mockData);
    },

    /**
     * Frontend-only mock for processing document text.
     * In the real backend, this would:
     * 1. Receive text
     * 2. Generate Embeddings (OpenAI/Cohere)
     * 3. Store in Vector DB (Pinecone/Milvus)
     */
    processDocument: async (documentId: string, text: string): Promise<{ success: boolean; message: string }> => {
        console.log(`[RAG-SDK] Processing document ${documentId}...`);
        console.log(`[RAG-SDK] Extracted Text Length: ${text.length} characters`);

        // Simulating network delay for AI processing
        await delay(2000);

        if (text.length < 50) {
            return {
                success: false,
                message: "Teks terlalu pendek untuk dianalisis. Mohon tulis lebih banyak."
            };
        }

        return {
            success: true,
            message: "Dokumen berhasil dikirim ke pipeline RAG. AI akan mempelajarinya."
        };
    },

    /**
     * Enterprise Asynchronous Upload Flow (Step 1)
     */
    uploadDocument: async (file: File, category: string, tenantId: string): Promise<{ success: boolean; documentId?: string; message: string }> => {
        // Build FormData for multipart upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('category', category);

        // Simulate sending to backend and getting an HTTP 202 Accepted
        await delay(800); 
        
        return {
            success: true,
            documentId: `doc-${Date.now()}`,
            message: "HTTP 202 Accepted: Document queued for processing."
        };
    },

    /**
     * Enterprise Polling mechanism (Step 2)
     */
    pollDocumentStatus: async (documentId: string, elapsedMs: number): Promise<{ status: 'PENDING' | 'PARSING' | 'VECTORIZING' | 'COMPLETED' | 'FAILED', progress: number }> => {
        // Simulate a real backend processing pipeline based on time elapsed instead of random jumps
        await delay(200);

        if (elapsedMs < 3000) {
            return { status: 'PENDING', progress: 15 };
        } else if (elapsedMs < 7000) {
            return { status: 'PARSING', progress: 45 };
        } else if (elapsedMs < 12000) {
            return { status: 'VECTORIZING', progress: 80 };
        } else {
            return { status: 'COMPLETED', progress: 100 };
        }
    },

    /**
     * Enterprise RAG Evaluator (Phase 3)
     */
    evaluateGuardrails: async (text: string) => {
        await delay(1200); // Simulate network and Gemini Semantic Analysis

        // FDS Hackathon strict rule matching
        if (text.includes("25.000.000") || text.toLowerCase().includes("25 juta")) {
            return {
                isAnomaly: true,
                reason: "Terindikasi Mark-up Anggaran. Harga yang diajukan melebih batas regulasi Pengadaan IT.",
                quote: 'Ref: "DUMMY_POJK_Standar_Harga.md (Bab 2.1)"\n\n"Batas Maksimum Harga Satuan: Rp 15.000.000. Pengajuan di atas batas maksimal harus ditandai sebagai FRAUD WARNING."'
            };
        }

        return { isAnomaly: false };
    }
};
