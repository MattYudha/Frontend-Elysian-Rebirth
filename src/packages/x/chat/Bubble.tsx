'use client';

import React from 'react';
import type { ChatMessage } from '../types';
// Note: AiMarkdown import commented out to avoid circular dependency during build
// import { AiMarkdown } from '@enterprise-ai/x-markdown';
import { Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { cn } from '../../../lib/utils';


export interface BubbleProps {
    /**
     * Message to display
     */
    message: ChatMessage;

    /**
     * Whether the message is from the current user
     */
    isUser?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * Bubble - Chat message bubble component
 * 
 * Displays a single chat message with avatar and formatted content.
 * Uses AiMarkdown for rendering AI responses with rich formatting.
 * 
 * @example
 * ```tsx
 * <Bubble message={chatMessage} isUser={message.role === 'user'} />
 * ```
 */
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
            <Avatar
                size={40}
                icon={isUserRole ? <UserOutlined /> : <RobotOutlined />}
                className={cn("flex-shrink-0", isUserRole ? "bg-primary" : "bg-success")}
            />

            {/* Message Content */}
            <div className="max-w-[70%] min-w-[100px]">
                {/* Bubble */}
                <div
                    className={cn(
                        "p-3.5 border",
                        isUserRole
                            ? "rounded-t-2xl rounded-bl-2xl rounded-br-sm bg-blue-50 border-blue-200"
                            : "rounded-t-2xl rounded-br-2xl rounded-bl-sm bg-gray-50 border-gray-200"
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
                        "mt-1 text-xs text-gray-400",
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
