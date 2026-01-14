import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage, Attachment } from '../types';

export interface UseChatOptions {
    /**
     * Initial messages
     */
    initialMessages?: ChatMessage[];

    /**
     * Auto-scroll on new messages
     */
    autoScroll?: boolean;

    /**
     * Max message history
     */
    maxHistory?: number;

    /**
     * Callback when message is sent
     */
    onSend?: (message: string, attachments?: Attachment[]) => void;
}

export interface UseChatReturn {
    /**
     * Current messages
     */
    messages: ChatMessage[];

    /**
     * Add a message
     */
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;

    /**
     * Add user message
     */
    sendMessage: (content: string, attachments?: Attachment[]) => void;

    /**
     * Add AI response
     */
    addAiResponse: (content: string) => void;

    /**
     * Clear all messages
     */
    clearMessages: () => void;

    /**
     * Whether chat is at bottom (for auto-scroll)
     */
    isAtBottom: boolean;

    /**
     * Scroll to bottom
     */
    scrollToBottom: () => void;

    /**
     * Messages container ref
     */
    messagesContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * useChat - Hook for managing chat state
 * 
 * Provides utilities for chat message management, auto-scroll, and history.
 * 
 * @example
 * ```tsx
 * const { messages, sendMessage, addAiResponse, messagesContainerRef } = useChat({
 *   onSend: async (content) => {
 *     const response = await aiClient.chat(content);
 *     addAiResponse(response);
 *   }
 * });
 * 
 * <div ref={messagesContainerRef}>
 *   {messages.map(msg => <Bubble key={msg.id} message={msg} />)}
 * </div>
 * <Sender onSend={sendMessage} />
 * ```
 */
export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
    const {
        initialMessages = [],
        autoScroll = true,
        maxHistory = 100,
        onSend,
    } = options;

    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
        };

        setMessages((prev) => {
            const updated = [...prev, newMessage];
            return updated.slice(-maxHistory);
        });
    }, [maxHistory]);

    const sendMessage = useCallback((content: string, attachments?: Attachment[]) => {
        addMessage({
            role: 'user',
            content,
            metadata: attachments ? { attachments } : undefined,
        });

        onSend?.(content, attachments);
    }, [addMessage, onSend]);

    const addAiResponse = useCallback((content: string) => {
        addMessage({
            role: 'assistant',
            content,
        });
    }, [addMessage]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, []);

    // Auto-scroll effect
    useEffect(() => {
        if (autoScroll && isAtBottom) {
            scrollToBottom();
        }
    }, [messages, autoScroll, isAtBottom, scrollToBottom]);

    // Track if user is at bottom
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const atBottom = scrollHeight - scrollTop - clientHeight < 50;
            setIsAtBottom(atBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    return {
        messages,
        addMessage,
        sendMessage,
        addAiResponse,
        clearMessages,
        isAtBottom,
        scrollToBottom,
        messagesContainerRef,
    };
};
