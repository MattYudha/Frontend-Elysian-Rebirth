import { z } from 'zod';

export const chatMessageSchema = z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    thoughts: z.array(z.string()).optional(),
    timestamp: z.union([z.string(), z.date()]).transform(val =>
        typeof val === 'string' ? new Date(val) : val
    ),
});

export const sendMessageSchema = z.object({
    message: z.string().min(1, 'Message cannot be empty').max(10000, 'Message cannot exceed 10000 characters'),
    conversationId: z.string().optional(),
    context: z.record(z.string(), z.any()).optional(),
});

export const chatHistorySchema = z.array(chatMessageSchema);

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
