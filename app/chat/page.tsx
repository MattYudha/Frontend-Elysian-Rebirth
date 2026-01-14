'use client';

import { Protected } from '@/components/Protected';
import Image from 'next/image';
import { Button } from '@/ui/primitives/button';
import { Input } from '@/ui/primitives/input';
import { MessageSquare, ArrowRight, Send, User, Bot } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ChatSkeleton } from '@/components/LoadingSkeletons';

export default function ChatPage() {
    const [isChatActive, setIsChatActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Halo! Saya Elysian AI Assistant. Ada yang bisa saya bantu terkait dokumen atau data Anda hari ini?' }
    ]);

    useEffect(() => {
        const lastActive = localStorage.getItem('elysian_chat_last_active');
        if (lastActive) {
            const timeDiff = Date.now() - parseInt(lastActive, 10);
            if (timeDiff < 86400000) { // 24 hours
                setIsChatActive(true);
            }
        }
        // Artificial delay for skeleton demo
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    const handleStartChat = () => {
        setIsChatActive(true);
        localStorage.setItem('elysian_chat_last_active', Date.now().toString());
    };

    if (isLoading) return <ChatSkeleton />;

    return (
        <Protected>
            <div className="flex flex-col h-[calc(100vh-6rem)]">
                {!isChatActive ? (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
                        <div className="relative w-64 h-64 mb-8 animate-float">
                            <Image
                                src="/elysian_empty_chat.png"
                                alt="Start Chat"
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10" />
                        </div>

                        <div className="max-w-md space-y-4">
                            <h1 className="text-2xl font-bold text-slate-900">Mulai Percakapan Baru</h1>
                            <p className="text-slate-500">
                                Tanyakan apa saja kepada asisten AI kami. Dapatkan jawaban instan untuk kebutuhan dokumen dan data Anda.
                            </p>
                            <Button
                                onClick={handleStartChat}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 shadow-lg shadow-blue-500/25 group"
                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Mulai Chat
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Chat Interface
                    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 animate-in slide-in-from-bottom-5 duration-500">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto space-y-6 p-4 rounded-xl bg-slate-50/50 border border-slate-100 mb-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
                                        {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                    </div>
                                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm ${msg.role === 'assistant' ? 'bg-white border border-slate-100 shadow-sm text-slate-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none shadow-md'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="relative">
                            <Input
                                placeholder="Ketik pesan Anda disini..."
                                className="pr-12 py-6 rounded-full border-slate-200 shadow-lg shadow-slate-200/50 focus-visible:ring-blue-500"
                            />
                            <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700">
                                <Send className="h-4 w-4 text-white" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Protected>
    );
}
