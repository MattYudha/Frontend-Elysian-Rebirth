'use client';

import { Protected } from '@/components/Protected';
import { ChatShell } from '@/packages/x/chat/ChatShell';
import { useState } from 'react';
import type { ChatMessage } from '@/packages/x/types';

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    const handleSend = (content: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setIsThinking(true);

        // Mock AI Response
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `This is a simulated response to: "${content}". In a real implementation, this would connect to your AI backend.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsThinking(false);
        }, 1500);
    };

    return (
        <Protected pure>
            <ChatShell
                messages={messages}
                isThinking={isThinking}
                onSend={handleSend}
            />
        </Protected>
    );
}
