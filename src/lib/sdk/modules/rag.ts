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
    }
};
