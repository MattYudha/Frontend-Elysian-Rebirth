'use client';

import { Protected } from '@/components/auth/Protected';
import { ChatShell } from '@/components/chat/ChatShell';
import { useChat } from '@/hooks/api/useChat';

export default function ChatPage() {
    const { messages, sendMessage, isSending } = useChat();

    const handleSend = (content: string) => {
        sendMessage({ message: content });
    };

    return (
        <Protected>
            <ChatShell
                messages={messages}
                isThinking={isSending}
                onSend={handleSend}
            />
        </Protected>
    );
}
