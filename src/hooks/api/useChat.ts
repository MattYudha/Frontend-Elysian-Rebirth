import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as sdk from '@/lib/sdk';
import type { ChatMessage } from '@/lib/sdk/schemas';
import { toast } from 'sonner';

// Key Factory
export const chatKeys = {
    all: ['chat'] as const,
    history: () => [...chatKeys.all, 'history'] as const,
};

export const useChat = () => {
    const queryClient = useQueryClient();

    // 1. Send Message Mutation (with Optimistic UI)
    const sendMessageMutation = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            return await sdk.chat.sendMessage(message);
        },
        onMutate: async ({ message }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: chatKeys.history() });

            // Snapshot previous value
            const previousMessages = queryClient.getQueryData<ChatMessage[]>(chatKeys.history());

            // Create optimistic message
            const optimisticUserMessage: ChatMessage = {
                id: `temp-${Date.now()}`,
                role: 'user',
                content: message,
                timestamp: new Date(),
            };

            // Optimistically update to the new value
            queryClient.setQueryData<ChatMessage[]>(chatKeys.history(), (old) => {
                const existing = old || [];
                return [...existing, optimisticUserMessage];
            });

            // Return context with snapshotted value
            return { previousMessages };
        },
        onError: (err, _newTodo, context) => {
            // Rollback on error
            if (context?.previousMessages) {
                queryClient.setQueryData(chatKeys.history(), context.previousMessages);
            }
            toast.error("Failed to send message: " + (err instanceof Error ? err.message : "Unknown error"));
        },
        onSuccess: (data) => {
            // Replace optimistic updates with real data?
            // Since mock returns just the response, we need to make sure we keep the user message too.
            // When success happens, we receive the AI message.
            // So we should append the AI message to the list.

            queryClient.setQueryData<ChatMessage[]>(chatKeys.history(), (old) => {
                const existing = old || [];
                // In a real implementation we might replace the temp ID with real ID, 
                // but for now we just append the assistant response.
                return [...existing, data];
            });
        },
    });

    // 2. Clear History (Optional, for debugging)
    const clearHistory = () => {
        queryClient.setQueryData(chatKeys.history(), []);
    };

    return {
        messages: queryClient.getQueryData<ChatMessage[]>(chatKeys.history()) || [],
        sendMessage: sendMessageMutation.mutate,
        isSending: sendMessageMutation.isPending,
        clearHistory
    };
};
