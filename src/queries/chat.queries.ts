/**
 * src/queries/chat.queries.ts
 *
 * Chat Query Layer
 * Responsibilities:
 * - Define Query Keys (Hierarchical & Deterministic)
 * - Wrap useQuery / useMutation
 * - Configure Cache Policy
 * - Connect Service Layer
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    deleteConversation,
    type SendMessagePayload,
    type ChatMessage,
} from '@/services/chat.service';
import { toast } from 'sonner';
import { useTenant } from '@/contexts/TenantContext';

// Enterprise Query Key Factory
export const chatKeys = {
    all: ['chat'] as const,
    conversations: (tenantId: string) => [...chatKeys.all, tenantId, 'conversations'] as const,
    messages: (tenantId: string, conversationId: string) => [...chatKeys.all, tenantId, 'messages', conversationId] as const,
};

/**
 * useConversations — List all conversations
 * Policy: staleTime 30s, refetchOnWindowFocus
 */
export function useConversations() {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: chatKeys.conversations(tenantId),
        queryFn: fetchConversations,
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        enabled: !!tenantId,
    });
}

/**
 * useMessages — Messages for a specific conversation
 * Policy: staleTime 10s (messages change frequently during active chat)
 */
export function useMessages(conversationId: string | null) {
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useQuery({
        queryKey: chatKeys.messages(tenantId, conversationId!),
        queryFn: () => fetchMessages(conversationId!),
        enabled: !!conversationId && !!tenantId,
        staleTime: 10_000,
    });
}

/**
 * useSendMessage — Send a message with optimistic update
 */
export function useSendMessage() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
        onMutate: async (payload) => {
            // Cancel outgoing refetches
            if (payload.conversationId) {
                await queryClient.cancelQueries({
                    queryKey: chatKeys.messages(tenantId, payload.conversationId),
                });
            }

            // Optimistic message
            const optimisticMessage: ChatMessage = {
                id: `optimistic-${Date.now()}`,
                role: 'user',
                content: payload.content,
                timestamp: new Date().toISOString(),
                conversationId: payload.conversationId || '',
            };

            if (payload.conversationId) {
                const previousMessages = queryClient.getQueryData<ChatMessage[]>(
                    chatKeys.messages(tenantId, payload.conversationId)
                );
                queryClient.setQueryData<ChatMessage[]>(
                    chatKeys.messages(tenantId, payload.conversationId),
                    (old = []) => [...old, optimisticMessage]
                );
                return { previousMessages, conversationId: payload.conversationId };
            }

            return {};
        },
        onError: (_error, _payload, context) => {
            // Rollback optimistic update
            if (context?.previousMessages && context.conversationId) {
                queryClient.setQueryData(
                    chatKeys.messages(tenantId, context.conversationId),
                    context.previousMessages
                );
            }
            toast.error('Failed to send message. Please try again.');
        },
        onSuccess: (_data, payload) => {
            // Invalidate to get server-confirmed data
            if (payload.conversationId) {
                queryClient.invalidateQueries({
                    queryKey: chatKeys.messages(tenantId, payload.conversationId),
                });
            }
            // Refresh conversations list (new message updates lastMessage)
            queryClient.invalidateQueries({ queryKey: chatKeys.conversations(tenantId) });
        },
    });
}

/**
 * useCreateConversation — Create a new conversation
 */
export function useCreateConversation() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (title?: string) => createConversation(title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.conversations(tenantId) });
        },
    });
}

export function useDeleteConversation() {
    const queryClient = useQueryClient();
    const { currentTenant } = useTenant();
    const tenantId = currentTenant?.id || '';

    return useMutation({
        mutationFn: (conversationId: string) => deleteConversation(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.conversations(tenantId) });
        },
    });
}
