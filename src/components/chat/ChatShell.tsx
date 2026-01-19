'use client';

import React, { useRef, useEffect } from 'react';
import type { ChatMessage, ThoughtStep, Attachment } from '../../types/x';
import { Bubble } from './Bubble';
import { ThoughtChain } from './ThoughtChain';
import { ThinkIndicator } from './ThinkIndicator';
import { ChatHeader } from './ChatHeader';
import { ChatInputArea } from './ChatInputArea';
import { SpotlightDriver } from '@/components/onboarding/SpotlightDriver';

export interface ChatShellProps {
    messages?: ChatMessage[];
    isThinking?: boolean;
    thoughtSteps?: ThoughtStep[];
    suggestions?: string[];
    onSend: (message: string, attachments?: Attachment[]) => void;
    onSelectSuggestion?: (suggestion: string) => void;
    className?: string;
}

export const ChatShell: React.FC<ChatShellProps> = ({
    messages = [],
    isThinking = false,
    thoughtSteps = [],
    onSend,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking, thoughtSteps]);

    const handleSend = (message: string, files: File[]) => {
        // Convert File[] to Attachment[] mock
        // In a real app, you would upload these files first or read them as data URLs
        const attachments: Attachment[] = files.map(f => ({
            id: Math.random().toString(36).substring(7),
            name: f.name,
            type: f.type,
            size: f.size
        }));

        onSend(message, attachments);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 relative">
            <SpotlightDriver />

            {/* 1. Header (Sticky) */}
            <ChatHeader />

            {/* 2. Chat Canvas (Scrollable) */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                    {/* Empty State / Hero */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 opacity-50">
                            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                                {/* Elysian Logo Placeholder */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg" />
                            </div>
                            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">How can I help you today?</h2>
                        </div>
                    )}

                    {messages.map((message) => (
                        <Bubble key={message.id} message={message} />
                    ))}

                    {/* Thinking/Processing Indicators */}
                    {isThinking && thoughtSteps.length > 0 && (
                        <ThoughtChain thoughts={thoughtSteps.map(s => s.content)} />
                    )}

                    {isThinking && thoughtSteps.length === 0 && (
                        <ThinkIndicator />
                    )}

                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* 3. Floating Input Area */}
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950 pt-10 pb-6 pointer-events-none">
                <div className="pointer-events-auto">
                    <ChatInputArea onSend={handleSend} isLoading={isThinking} />
                </div>
            </div>
        </div>
    );
};
