import { z } from 'zod';

export const ragSourceSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['pdf', 'txt', 'docx', 'md']),
    size: z.number(),
    uploadedAt: z.union([z.string(), z.date()]).transform(val =>
        typeof val === 'string' ? new Date(val) : val
    ),
    status: z.enum(['processing', 'indexed', 'failed']),
    chunkCount: z.number().optional(),
});

export const ragQuerySchema = z.object({
    query: z.string().min(1, 'Query cannot be empty').max(1000, 'Query cannot exceed 1000 characters'),
    topK: z.number().min(1).max(100).optional().default(10),
    filters: z.record(z.string(), z.any()).optional(),
});

export const ragResultSchema = z.object({
    id: z.string(),
    content: z.string(),
    source: z.string(),
    score: z.number(),
    metadata: z.record(z.string(), z.any()),
});

export const ragQueryResponseSchema = z.object({
    results: z.array(ragResultSchema),
    total: z.number(),
    latency: z.number(),
});

export type RagSource = z.infer<typeof ragSourceSchema>;
export type RagQuery = z.infer<typeof ragQuerySchema>;
export type RagResult = z.infer<typeof ragResultSchema>;
export type RagQueryResponse = z.infer<typeof ragQueryResponseSchema>;
