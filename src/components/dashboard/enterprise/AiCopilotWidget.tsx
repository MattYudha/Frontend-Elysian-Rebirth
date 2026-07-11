'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { usePriorityQueue } from '@/queries/dashboard.queries';

interface AiCopilotWidgetProps {
    activeAlertsCount?: number;
}

export function AiCopilotWidget({ activeAlertsCount }: AiCopilotWidgetProps = {}) {
    const router = useRouter();
    const user = useAuthStore(state => state.user);
    const setDraftMessage = useChatStore(state => state.setDraftMessage);
    const [input, setInput] = useState('');
    const { data: priorityQueueData } = usePriorityQueue();

    const count = activeAlertsCount !== undefined ? activeAlertsCount : (priorityQueueData ?? []).length;

    const handleSend = () => {
        if (!input.trim()) return;
        setDraftMessage(input);
        router.push('/chat');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="relative flex h-full min-h-[400px] lg:min-h-[600px] flex-col overflow-hidden rounded-2xl shadow-sm glass-obsidian">
            {/* Light Mode Cloud Accent */}
            <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.15] dark:hidden pointer-events-none mix-blend-multiply" />
            
            {/* Header */}
            <div className="relative z-10 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">Elysian Copilot</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Always on. Ready to help.</p>
                    </div>
                </div>
            </div>

            {/* Content / Greeting */}
            <div className="relative z-10 flex-1 p-5">
                <div className="mb-6">
                    <h2 className="bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                        Good Afternoon, {user?.name?.split(' ')[0] || 'User'}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {count === 0 
                            ? "I've analyzed your pipelines. Everything is operational. How can I assist you today?"
                            : `I've analyzed your pipelines. ${count} task${count > 1 ? 's' : ''} require attention. How can I assist you today?`}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                    {['Analyze token usage', 'Check failed pipelines', 'Draft a new workflow'].map((action) => (
                        <button
                            key={action}
                            onClick={() => {
                                setDraftMessage(action);
                                router.push('/chat');
                            }}
                            className="group flex w-full items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/50 p-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
                                {action}
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Footer */}
            <div className="relative z-10 mt-auto border-t border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-[#0B1120]/80 p-4">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Copilot anything..."
                        className="w-full rounded-xl border border-transparent dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-3.5 pl-4 pr-12 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0B1120] focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 p-1.5 text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
