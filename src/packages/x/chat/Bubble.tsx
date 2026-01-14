'use client';

import React from 'react';
import type { ChatMessage } from '../types';
// Note: AiMarkdown import commented out to avoid circular dependency during build
// import { AiMarkdown } from '@enterprise-ai/x-markdown';
import { Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

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
            className={className}
            style={{
                display: 'flex',
                flexDirection: isUserRole ? 'row-reverse' : 'row',
                gap: 12,
                marginBottom: 24,
                width: '100%',
            }}
        >
            {/* Avatar */}
            <Avatar
                size={40}
                icon={isUserRole ? <UserOutlined /> : <RobotOutlined />}
                style={{
                    flexShrink: 0,
                    backgroundColor: isUserRole ? '#1677ff' : '#52c41a',
                }}
            />

            {/* Message Content */}
            <div
                style={{
                    maxWidth: '70%',
                    minWidth: 100,
                }}
            >
                {/* Bubble */}
                <div
                    style={{
                        padding: '12px 16px',
                        borderRadius: isUserRole ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: isUserRole ? '#e6f7ff' : '#f5f5f5',
                        border: isUserRole ? '1px solid #91d5ff' : '1px solid #d9d9d9',
                    }}
                >
                    {isUserRole ? (
                        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                            {message.content}
                        </div>
                    ) : (
                        <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {message.content}
                        </div>
                    )}
                </div>

                {/* Timestamp */}
                <div
                    style={{
                        marginTop: 4,
                        fontSize: 12,
                        color: 'rgba(0, 0, 0, 0.45)',
                        textAlign: isUserRole ? 'right' : 'left',
                    }}
                >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
};

Bubble.displayName = 'Bubble';
