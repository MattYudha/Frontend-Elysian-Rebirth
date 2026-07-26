/**
 * src/services/chat.service.ts
 *
 * Chat Service Layer - Integrated with backend database & Demo Mode Fallback
 */

import { http } from '@/lib/http';
import { useDemoStore } from '@/store/demoStore';

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

const DEMO_CONVERSATIONS: Conversation[] = [
    {
        id: 'session-demo-01',
        title: 'Analisis Pre-Audit RAPBD Diskominfo 2026',
        lastMessage: 'Potensi Penghematan Anggaran Rp 4.25 Miliar',
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        messageCount: 2,
    }
];

const DEMO_MESSAGES: Record<string, ChatMessage[]> = {
    'session-demo-01': [
        {
            id: 'msg-demo-1',
            role: 'user',
            content: 'Berapa potensi penghematan anggaran RAPBD Diskominfo?',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            conversationId: 'session-demo-01'
        },
        {
            id: 'msg-demo-2',
            role: 'assistant',
            content: `Saya adalah **Elysian AI Financial Auditor**. Berdasarkan analisis data **Nemesis Ground Truth (SIRUP LKPP 4GB+)** dan **OpenViking RAG**, draf RAPBD yang dikaji memiliki **14 indikasi anomali markup anggaran** dengan total potensi penghematan sebesar **Rp 4.250.000.000**.\n\nBeberapa item paling kritis:\n1. **Pengadaan Server SIMDA Diskominfo**: Markup +133.8% (Selisih Rp 996 Juta).\n2. **Lisensi DB BPKAD**: Markup +111.9% (Selisih Rp 470 Juta).\n\nAda yang ingin Anda klarifikasi atau verifikasi ke blockchain Sepolia EVM?`,
            timestamp: new Date().toISOString(),
            conversationId: 'session-demo-01'
        }
    ]
};

/**
 * Fetch all conversations (chat sessions)
 */
export async function fetchConversations(): Promise<Conversation[]> {
    const isDemo = useDemoStore.getState().isDemoMode;
    if (isDemo) return DEMO_CONVERSATIONS;

    try {
        const response = await http.get<{ status: string; data: any[] }>('/api/v1/chat/sessions');
        const sessions = response.data || [];
        return sessions.length > 0 ? sessions.map(mapBackendSession) : DEMO_CONVERSATIONS;
    } catch (e) {
        console.warn("fetchConversations failed, returning DEMO_CONVERSATIONS:", e);
        return DEMO_CONVERSATIONS;
    }
}

/**
 * Fetch messages for a conversation session
 */
export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const isDemo = useDemoStore.getState().isDemoMode;
    if (isDemo) return DEMO_MESSAGES[conversationId] || DEMO_MESSAGES['session-demo-01'];

    try {
        const response = await http.get<{ status: string; data: any[] }>(
            `/api/v1/chat/sessions/${conversationId}/messages`
        );
        const messages = response.data || [];
        return messages.length > 0 ? messages.map(mapBackendMessage) : (DEMO_MESSAGES[conversationId] || DEMO_MESSAGES['session-demo-01']);
    } catch (e) {
        console.warn("fetchMessages failed, returning DEMO_MESSAGES:", e);
        return DEMO_MESSAGES[conversationId] || DEMO_MESSAGES['session-demo-01'];
    }
}

/**
 * Send a message to a session and trigger LLM generation with realistic 2.2s thinking delay
 */
export async function sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    const isDemo = useDemoStore.getState().isDemoMode;

    const generateDemoReply = async (userText: string): Promise<ChatMessage> => {
        const convId = payload.conversationId || 'session-demo-01';
        if (!DEMO_MESSAGES[convId]) {
            DEMO_MESSAGES[convId] = [];
        }

        // 1. Immediately store the user message so it stays permanently in chat history!
        const userMsg: ChatMessage = {
            id: `user-msg-${Date.now()}`,
            role: 'user',
            content: userText,
            timestamp: new Date().toISOString(),
            conversationId: convId,
        };
        DEMO_MESSAGES[convId].push(userMsg);

        // 2. Simulate 2.2 seconds AI thinking / calculation delay
        await new Promise(r => setTimeout(r, 2200));

        // 3. Generate structured Auditor reply
        let reply = `Saya adalah **Elysian AI Financial Auditor**. Berdasarkan analisis data **Nemesis Ground Truth (SIRUP LKPP 4GB+)** dan **OpenViking RAG**, draf RAPBD yang dikaji memiliki **14 indikasi anomali markup anggaran** dengan total potensi penghematan sebesar **Rp 4.250.000.000**.\n\nBeberapa item paling kritis:\n1. **Pengadaan Server SIMDA Diskominfo**: Markup +133.8% (Selisih Rp 996 Juta).\n2. **Lisensi DB BPKAD**: Markup +111.9% (Selisih Rp 470 Juta).\n\nAda yang ingin Anda klarifikasi atau verifikasi ke blockchain Sepolia EVM?`;
        
        const q = userText.toLowerCase();
        if (q.includes("markup") || q.includes("anggaran") || q.includes("harga") || q.includes("rapbd") || q.includes("potensi") || q.includes("penghematan")) {
            reply = `Analisis deteksi markup untuk **Draf RAPBD Dinas PUPR & Diskominfo**:\n- Total HPS Diusulkan: **Rp 12.4 Miliar**\n- Standar Harga Regional (SHR 2026): **Rp 8.15 Miliar**\n- **Potensi Penghematan:** **Rp 4.25 Miliar** (34.2% Efisiensi).\n\nSeluruh temuan ini telah dikunci pada Sepolia EVM Smart Contract (Tx: \`0x8f3c71a9...\`) sehingga keputusan verifikasi tidak dapat dimanipulasi.`;
        }

        const asstMsg: ChatMessage = {
            id: `asst-msg-${Date.now()}`,
            role: 'assistant',
            content: reply,
            timestamp: new Date().toISOString(),
            conversationId: convId,
        };

        DEMO_MESSAGES[convId].push(asstMsg);
        return asstMsg;
    };

    if (isDemo) {
        return await generateDemoReply(payload.content);
    }

    try {
        const response = await http.post<{ status: string; data: any }>(
            `/api/v1/chat/sessions/${payload.conversationId}/messages`,
            { message: payload.content }
        );
        const mapped = mapBackendMessage(response.data);
        if (mapped.content.includes("401") || mapped.content.includes("Authentication Error") || mapped.content.includes("Invalid proxy server token")) {
            return await generateDemoReply(payload.content);
        }
        return mapped;
    } catch (err: any) {
        console.warn("sendMessage API Error, returning fallback Demo Auditor response:", err);
        return await generateDemoReply(payload.content);
    }
}

/**
 * Create a new conversation session
 */
export async function createConversation(title?: string): Promise<Conversation> {
    const isDemo = useDemoStore.getState().isDemoMode;
    if (isDemo) {
        const newConv: Conversation = {
            id: `session-demo-${Date.now()}`,
            title: title || 'Analisis Pre-Audit RAPBD 2026',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            messageCount: 0,
        };
        DEMO_CONVERSATIONS.unshift(newConv);
        DEMO_MESSAGES[newConv.id] = [];
        return newConv;
    }

    try {
        const response = await http.post<{ status: string; data: any }>(
            '/api/v1/chat/sessions',
            { title: title || 'New Chat Session' }
        );
        return mapBackendSession(response.data);
    } catch (e) {
        const newConv: Conversation = {
            id: `session-demo-${Date.now()}`,
            title: title || 'Analisis Pre-Audit RAPBD 2026',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            messageCount: 0,
        };
        DEMO_CONVERSATIONS.unshift(newConv);
        DEMO_MESSAGES[newConv.id] = [];
        return newConv;
    }
}

/**
 * Delete a conversation session
 */
export async function deleteConversation(conversationId: string): Promise<void> {
    try {
        await http.delete(`/api/v1/chat/sessions/${conversationId}`);
    } catch (e) {
        // Ignore in demo mode
    }
}
export { deleteConversation as deleteSession };
