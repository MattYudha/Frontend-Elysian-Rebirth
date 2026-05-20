/**
 * src/services/chat.service.ts
 *
 * Chat Service Layer - Integrated with backend database
 */

import { http } from '@/lib/http';

export interface Conversation {
    id: string;
    title: string;
    lastMessage?: string;
    updatedAt: string;
    createdAt: string;
    messageCount: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    conversationId: string;
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
}

function mapBackendSession(session: any): Conversation {
    return {
        id: session.id,
        title: session.title,
        createdAt: session.created_at,
        updatedAt: session.created_at,
        messageCount: 0,
    };
}

function mapBackendMessage(msg: any): ChatMessage {
    return {
        id: msg.id,
        role: msg.sender_role === 'model' ? 'assistant' : 'user',
        content: msg.message_content,
        timestamp: msg.created_at,
        conversationId: msg.session_id,
    };
}

/**
 * Fetch all conversations (chat sessions)
 * Endpoint: GET /api/v1/chat/sessions
 */
export async function fetchConversations(): Promise<Conversation[]> {
    const response = await http.get<{ status: string; data: any[] }>('/api/v1/chat/sessions');
    const sessions = response.data || [];
    return sessions.map(mapBackendSession);
}

/**
 * Fetch messages for a conversation session
 * Endpoint: GET /api/v1/chat/sessions/:id/messages
 */
export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await http.get<{ status: string; data: any[] }>(
        `/api/v1/chat/sessions/${conversationId}/messages`
    );
    const messages = response.data || [];
    return messages.map(mapBackendMessage);
}

/**
 * Send a message to a session and trigger LLM generation
 * Endpoint: POST /api/v1/chat/sessions/:id/messages
 */
export async function sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    const response = await http.post<{ status: string; data: any }>(
        `/api/v1/chat/sessions/${payload.conversationId}/messages`,
        { message: payload.content }
    );
    return mapBackendMessage(response.data);
}

/**
 * Create a new conversation session
 * Endpoint: POST /api/v1/chat/sessions
 */
export async function createConversation(title?: string): Promise<Conversation> {
    const response = await http.post<{ status: string; data: any }>(
        '/api/v1/chat/sessions',
        { title: title || 'New Chat Session' }
    );
    return mapBackendSession(response.data);
}

/**
 * Delete a conversation session
 * Endpoint: DELETE /api/v1/chat/sessions/:id
 */
export async function deleteConversation(conversationId: string): Promise<void> {
    await http.delete(`/api/v1/chat/sessions/${conversationId}`);
}
export { deleteConversation as deleteSession };
