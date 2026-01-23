import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Sparkles } from 'lucide-react';

interface ChatBubbleProps {
    role: 'user' | 'assistant' | 'system';
    content: React.ReactNode;
    timestamp?: Date;
    children?: React.ReactNode;
}

export function ChatBubble({ role, content, timestamp, children }: ChatBubbleProps) {
    const isUser = role === 'user';
    const isSystem = role === 'system';

    if (isSystem) {
        return (
            <div className="flex justify-center my-4">
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {content}
                </span>
            </div>
        );
    }

    return (
        <div className={cn(
            "flex w-full gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "flex-row-reverse" : "flex-row"
        )}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <Avatar className={cn(
                    "h-8 w-8 border shadow-sm",
                    isUser ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"
                )}>
                    <AvatarFallback className={cn(
                        "text-xs font-semibold",
                        isUser ? "text-blue-700 bg-blue-50" : "text-blue-600 bg-white"
                    )}>
                        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 fill-blue-600" />}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Content Column */}
            <div className={cn(
                "flex flex-col max-w-[85%] md:max-w-[75%]",
                isUser ? "items-end" : "items-start"
            )}>
                {/* Name & Badge (AI only) */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                        <span className="text-xs font-semibold text-slate-700">Elysian Assistant</span>
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-xs tracking-wider">
                            AI
                        </span>
                    </div>
                )}

                {/* Bubble */}
                <div className={cn(
                    "relative px-4 py-3 md:px-5 md:py-3.5 text-sm shadow-sm backdrop-blur-md transition-all",
                    isUser
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-blue-500/10 hover:shadow-blue-500/20"
                        : "bg-white/80 border border-white/60 text-slate-700 rounded-2xl rounded-tl-sm shadow-slate-200/50 hover:bg-white/90"
                )}>
                    {children || (
                        <div className="leading-relaxed whitespace-pre-wrap">
                            {content}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                {timestamp && (
                    <span className={cn(
                        "text-[10px] text-slate-400 mt-1.5",
                        isUser ? "mr-1" : "ml-1"
                    )}>
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}
