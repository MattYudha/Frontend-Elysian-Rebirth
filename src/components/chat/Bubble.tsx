'use client';

import React from 'react';
import type { ChatMessage } from '../../types/x';
import { Avatar, AvatarFallback } from '@/components/ui/';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';


export interface BubbleProps {
    message: ChatMessage;
    isUser?: boolean;
    className?: string;
}

export const Bubble: React.FC<BubbleProps> = ({ message, isUser, className }) => {
    const isUserRole = isUser ?? message.role === 'user';

    return (
        <div
            className={cn(
                "flex gap-3 mb-6 w-full",
                isUserRole ? "flex-row-reverse" : "flex-row",
                className
            )}
        >
            {/* Avatar */}
            <Avatar className={cn("h-10 w-10 border", isUserRole ? "bg-primary/10" : "bg-muted")}>
                {isUserRole ? (
                    <AvatarFallback className="bg-primary text-primary-foreground"><User className="h-5 w-5" /></AvatarFallback>
                ) : (
                    <AvatarFallback className="bg-green-600 text-white"><Bot className="h-5 w-5" /></AvatarFallback>
                )}
            </Avatar>

            {/* Message Content */}
            <div className="max-w-[70%] min-w-[100px]">
                {/* Bubble */}
                <div
                    className={cn(
                        "p-4 border shadow-sm",
                        isUserRole
                            ? "rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-blue-600 text-white border-blue-600"
                            : "rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-card text-card-foreground border-border"
                    )}
                >
                    {isUserRole ? (
                        <div className="text-sm leading-relaxed">
                            {message.content}
                        </div>
                    ) : (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div
                    className={cn(
                        "mt-1.5 text-xs text-muted-foreground",
                        isUserRole ? "text-right" : "text-left"
                    )}
                >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

Bubble.displayName = 'Bubble';
