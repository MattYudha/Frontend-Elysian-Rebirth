import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { useConversations, useCreateConversation, useDeleteConversation } from '@/queries/chat.queries';
import { cn } from '@/lib/utils';

interface ChatSidebarContentProps {
    selectedSessionId: string | null;
    onSelectChat: (id: string) => void;
}

export function ChatSidebarContent({ selectedSessionId, onSelectChat }: ChatSidebarContentProps) {
    const { data: conversations = [], isLoading } = useConversations();
    const createMutation = useCreateConversation();
    const deleteMutation = useDeleteConversation();

    const handleNewChat = () => {
        createMutation.mutate(undefined, {
            onSuccess: (data) => {
                onSelectChat(data.id);
            }
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/20 dark:border-blue-900/30 flex items-center justify-between">
                <span className="font-semibold text-sm tracking-wide text-slate-700 dark:text-slate-200">Riwayat Percakapan</span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleNewChat}
                    disabled={createMutation.isPending}
                    className="h-8 w-8 hover:bg-white/40 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300"
                >
                    <MessageSquarePlus className="h-4 w-4" />
                </Button>
            </div>
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="text-xs text-slate-400 p-2">Loading history...</div>
                    ) : conversations.length === 0 ? (
                        <div className="text-xs text-slate-400 p-2">No history. Start a conversation!</div>
                    ) : (
                        conversations.map((chat) => (
                            <div 
                                key={chat.id} 
                                className={cn(
                                    "group flex items-center justify-between rounded-lg pr-2 transition-all duration-200",
                                    selectedSessionId === chat.id
                                        ? "bg-blue-50/50 dark:bg-blue-950/20"
                                        : "hover:bg-white/40 dark:hover:bg-slate-800/40"
                                )}
                            >
                                <button
                                    onClick={() => onSelectChat(chat.id)}
                                    className={cn(
                                        "flex-1 text-left px-3 py-2 text-sm transition-colors truncate font-medium",
                                        selectedSessionId === chat.id
                                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                    )}
                                >
                                    {chat.title}
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(chat.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition-opacity"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/20 dark:border-blue-900/30 mt-auto">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Online</span>
                </div>
            </div>
        </div>
    );
}
