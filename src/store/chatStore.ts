import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/lib/sdk/schemas';

interface ChatState {
    messages: ChatMessage[];
    currentConversationId: string | null;
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    setConversationId: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            currentConversationId: null,
            addMessage: (message) =>
                set((state) => ({
                    messages: [...state.messages, message],
                })),
            clearMessages: () => set({ messages: [] }),
            setConversationId: (id) => set({ currentConversationId: id }),
        }),
        {
            name: 'chat-storage',
        }
    )
);
