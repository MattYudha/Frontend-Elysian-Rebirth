import { ChatMessageSchema, type ChatMessage } from '../schemas';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chat = {
    sendMessage: async (message: string, _conversationId?: string): Promise<ChatMessage> => {
        await delay(1000);

        const mockResponse = {
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

        // Runtime Validation
        return ChatMessageSchema.parse(mockResponse);
    },
};
