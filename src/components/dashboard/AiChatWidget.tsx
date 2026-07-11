'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, Sparkles, Clock, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AiChatWidgetProps {
    userName?: string;
    isLoading?: boolean;
}

export function AiChatWidget({ userName = 'User', isLoading = false }: AiChatWidgetProps) {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');

    const handleSend = () => {
        if (!prompt.trim()) return;
        router.push(`/chat?q=${encodeURIComponent(prompt)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    if (isLoading) {
        return <Skeleton className="h-full w-full rounded-3xl" />;
    }

    const quickActions = [
        { icon: MessageSquare, label: 'Text Assistance', color: 'text-blue-500', bg: 'bg-blue-50 group-hover:bg-blue-100' },
        { icon: Zap, label: 'Process Automation', color: 'text-cyan-500', bg: 'bg-cyan-50 group-hover:bg-cyan-100' },
        { icon: Clock, label: 'Schedule Optimization', color: 'text-sky-500', bg: 'bg-sky-50 group-hover:bg-sky-100' },
        { icon: Sparkles, label: 'Smart Response', color: 'text-indigo-500', bg: 'bg-indigo-50 group-hover:bg-indigo-100' },
    ];

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            {/* Header Greeting */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">
                        Hi, {userName}
                    </h3>
                    <span className="animate-wave text-lg">👋</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    How can I help you?
                </h2>
            </div>

            {/* Model Tabs */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar relative z-10">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 ring-1 ring-blue-100 dark:ring-blue-800">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    LoopAI
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
                    <Bot className="w-4 h-4" />
                    GPT Chat
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
                    <Zap className="w-4 h-4" />
                    Deep Seek
                </button>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-3 mb-auto relative z-10">
                {quickActions.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => router.push(`/chat?q=${encodeURIComponent(action.label)}`)}
                        className="flex flex-col items-start p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all text-left group"
                    >
                        <div className={cn("p-2.5 rounded-xl mb-3 transition-colors duration-300", action.bg)}>
                            <action.icon className={cn("w-5 h-5", action.color)} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Input Area */}
            <div className="mt-6 relative z-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700 p-1.5 pl-5 flex items-center transition-all focus-within:bg-white focus-within:shadow-md focus-within:border-blue-200 focus-within:ring-2 focus-within:ring-blue-50">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask something..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 h-10 w-full"
                    />
                    <Button
                        onClick={handleSend}
                        size="icon"
                        className={cn(
                            "rounded-full w-10 h-10 shrink-0 transition-all duration-300 shadow-none",
                            prompt.trim()
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                                : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-100"
                        )}
                    >
                        {prompt.trim() ? <Send className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
