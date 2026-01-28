import { z } from 'zod';

export const IngestionChannelSchema = z.enum(['whatsapp', 'email', 'web_upload', 'mobile_scan']);
export const DocumentStageSchema = z.enum(['ingest', 'ocr', 'verify', 'ledger', 'archive']);
export const ExecutionStatusSchema = z.enum(['none', 'pending_review', 'executed', 'automated']);

export const RagSourceSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['pdf', 'docx', 'txt', 'csv', 'scanned_img', 'url', 'md']),
    size: z.number(),
    uploadedAt: z.date(),

    // Pipeline State
    channel: IngestionChannelSchema,
    stage: DocumentStageSchema,
    status: z.enum(['queued', 'processing', 'indexing', 'ready', 'failed', 'uploading']),
    errorReason: z.string().optional(),

    // Assignment & Audit
    assignedTo: z.string().optional(),
    ledgerId: z.string().optional(),
    confidenceScore: z.number(),

    // Intelligence Layer
    metadata: z.object({
        documentType: z.enum(['Financial Report', 'Invoice', 'Contract', 'Faktur', 'Laporan Keuangan', 'Technical Spec', 'Unknown']).optional(),
        period: z.string().optional(),
        keyMetrics: z.array(z.object({
            label: z.string(),
            value: z.string(),
            trend: z.enum(['up', 'down', 'neutral']).optional(),
            trendValue: z.string().optional(),
        })).optional(),
        summary: z.string().optional(),
    }).optional(),

    // Action & Value Layer
    suggestedActions: z.array(z.object({
        label: z.string(),
        actionId: z.string(),
        style: z.enum(['primary', 'ghost', 'danger']),
        icon: z.string().optional(),
    })),
    executionStatus: ExecutionStatusSchema,
    executionResult: z.string().optional(),

    valueMetrics: z.object({
        moneySaved: z.number().optional(),
        timeSavedMinutes: z.number().optional(),
    }).optional(),

    entities: z.array(z.object({
        type: z.enum(['supplier', 'client', 'project']),
        name: z.string(),
    })),
    insights: z.array(z.object({
        type: z.enum(['risk', 'trend', 'opportunity']),
        text: z.string(),
    })),

    auditLog: z.array(z.object({
        action: z.string(),
        user: z.string(),
        timestamp: z.date(),
    })),
});

export type RagSource = z.infer<typeof RagSourceSchema>;

export const PipelineLoaderSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['queued', 'processing', 'completed', 'failed']),
    progress: z.number(),
    estimatedTimeLeft: z.string().optional(),
    completedAt: z.date().optional(),
});

// ... existing code ...
export type PipelineLoader = z.infer<typeof PipelineLoaderSchema>;

export const RagSearchResultSchema = z.object({
    id: z.string(),
    content: z.string(),
    source: z.string(),
    score: z.number(),
    metadata: z.record(z.string(), z.any()),
});

export type RagSearchResult = z.infer<typeof RagSearchResultSchema>;

export const EditorDocumentSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.any(),
    version: z.number(),
    pdfUrl: z.string().optional(),
    lastModified: z.date(),
});

export type EditorDocument = z.infer<typeof EditorDocumentSchema>;
