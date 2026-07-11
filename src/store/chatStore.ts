/**
 * chatStore.ts — Client-only UI state for chat
 *
 * Server state (messages) is now managed by React Query:
 *   - useMessages(conversationId) → fetches messages
 *   - useSendMessage() → sends with optimistic update
 *
 * This store only manages ephemeral UI state.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
    currentConversationId: string | null;
    selectedMode: 'agent' | 'planning' | 'images' | 'workflow';
    sidebarOpen: boolean;
    draftMessage: string | null;

    setConversationId: (id: string | null) => void;
    setSelectedMode: (mode: ChatState['selectedMode']) => void;
    setSidebarOpen: (open: boolean) => void;
    setDraftMessage: (message: string | null) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            currentConversationId: null,
            selectedMode: 'agent',
            sidebarOpen: false,
            draftMessage: null,

            setConversationId: (id) => set({ currentConversationId: id }),
            setSelectedMode: (mode) => set({ selectedMode: mode }),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setDraftMessage: (message) => set({ draftMessage: message }),
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                // Only persist specific fields if needed, or all. 
                // Persisting draftMessage is good for page reloads.
                selectedMode: state.selectedMode,
                sidebarOpen: state.sidebarOpen,
                draftMessage: state.draftMessage
            }),
        }
    )
);
