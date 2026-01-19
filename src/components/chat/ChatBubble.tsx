import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
    role: 'user' | 'assistant' | 'system';
    content: React.ReactNode;
    timestamp?: Date;
    children?: React.ReactNode;
}

export function ChatBubble({ role, content, timestamp, children }: ChatBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={cn("flex gap-4 mb-6", isUser ? "flex-row-reverse" : "flex-row")}>
            <Avatar className={cn("h-8 w-8", isUser ? "bg-blue-600" : "bg-emerald-600")}>
                <AvatarFallback className="text-white bg-transparent">
                    {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </AvatarFallback>
            </Avatar>
            <div className={cn(
                "flex flex-col max-w-[80%]",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm",
                    isUser
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-secondary text-secondary-foreground rounded-tl-sm"
                )}>
                    {children || content}
                </div>
                {timestamp && (
                    <span className="text-xs text-muted-foreground mt-1">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}
