import { z } from 'zod';

export const DashboardStatsSchema = z.object({
    totalDocs: z.number(),
    totalApiCalls: z.number(),
    errorRate: z.number(),
    knowledgeHealth: z.number(),

    // Pipeline Stats (Merged for Dashboard)
    activePipelines: z.number().optional(),
    processingSpeed: z.number().optional(),
    activeQueue: z.number().optional(),
    accuracy: z.number().optional(),
    moneySavedTotal: z.number().optional(),
    timeSavedTotalHrs: z.number().optional(),
    channelHealth: z.record(z.string(), z.enum(['healthy', 'degraded', 'down'])).optional(),
});


export const PipelineStatsSchema = z.object({
    activePipelines: z.number().optional(),
    processingSpeed: z.number(),
    activeQueue: z.number(),
    accuracy: z.number(),
    moneySavedTotal: z.number(),
    timeSavedTotalHrs: z.number(),
    channelHealth: z.record(z.string(), z.enum(['healthy', 'degraded', 'down'])),
});

export type PipelineStats = z.infer<typeof PipelineStatsSchema>;

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
