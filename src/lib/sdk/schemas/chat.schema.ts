import { z } from 'zod';

export const ChatMessageSchema = z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.date(),
    thoughts: z.array(z.string()).optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ConversationSchema = z.object({
    id: z.string(),
    title: z.string(),
    messages: z.array(ChatMessageSchema),
    updatedAt: z.date(),
});

export type Conversation = z.infer<typeof ConversationSchema>;
