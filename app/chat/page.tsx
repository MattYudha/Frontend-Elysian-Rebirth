import { ChatInterface } from '@/components/chat/ChatInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Elysian Intelligence | Chat',
    description: 'Advanced AI Assistant for Elysian  Platform',
};

export default function ChatPage() {
    return (
        <div className="h-full w-full bg-slate-50 text-slate-900 relative flex flex-col">
            {/* 
               We wrap ChatInterface in a full-height container.
               The ChatInterface handles its own internal scrolling and layout.
            */}
            <ChatInterface />
        </div>
    );
}
