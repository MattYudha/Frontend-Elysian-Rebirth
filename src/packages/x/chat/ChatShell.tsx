'use client';

import React, { useRef, useEffect } from 'react';
import type { ChatMessage, ThoughtStep, Attachment } from '../types';
import { Card } from 'antd';
import { Bubble } from './Bubble';
import { ThoughtChain } from './ThoughtChain';
import { ThinkIndicator } from './ThinkIndicator';
import { PromptSuggestions } from './PromptSuggestions';
import { Sender } from './Sender';

export interface ChatShellProps {
    /**
     * Array of chat messages
     */
    messages?: ChatMessage[];

    /**
     * Whether the AI is currently thinking/processing
     */
    isThinking?: boolean;

    /**
     * Current thought/reasoning steps
     */
    thoughtSteps?: ThoughtStep[];

    /**
     * Prompt suggestions to display
     */
    suggestions?: string[];

    /**
     * Callback when a message is sent
     */
    onSend: (message: string, attachments?: Attachment[]) => void;

    /**
     * Callback when a suggestion is selected
     */
    onSelectSuggestion?: (suggestion: string) => void;

    /**
     * Custom class name
     */
    className?: string;

    /**
     * Children components (for advanced composition)
     */
    children?: React.ReactNode;
}

/**
 * ChatShell - Main chat container component
 * 
 * Provides a complete chat interface with:
 * - Message list with auto-scroll
 * - Thinking indicators and reasoning chains
 * - Prompt suggestions
 * - Message input (Sender)
 * 
 * Supports composition pattern with ChatShell.Messages and ChatShell.Footer
 * 
 * @example
 * ```tsx
 * <ChatShell
 *   messages={messages}
 *   isThinking={isProcessing}
 *   thoughtSteps={reasoningSteps}
 *   suggestions={['Tell me about AI', 'Explain RAG']}
 *   onSend={handleSendMessage}
 *   onSelectSuggestion={handleSelectSuggestion}
 * />
 * 
 * // Advanced composition
 * <ChatShell onSend={handleSend}>
 *   <ChatShell.Messages>
 *     {messages.map(msg => <Bubble key={msg.id} message={msg} />)}
 *   </ChatShell.Messages>
 *   <ChatShell.Footer>
 *     <PromptSuggestions suggestions={suggestions} onSelect={handleSelect} />
 *     <Sender onSend={handleSend} />
 *   </ChatShell.Footer>
 * </ChatShell>
 * ```
 */
export const ChatShell: React.FC<ChatShellProps> & {
    Messages: typeof MessagesContainer;
    Footer: typeof FooterContainer;
} = ({
    messages = [],
    isThinking = false,
    thoughtSteps = [],
    suggestions = [],
    onSend,
    onSelectSuggestion,
    className,
    children,
}) => {
        const messagesEndRef = useRef<HTMLDivElement>(null);

        // Auto-scroll to bottom when new messages arrive
        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [messages, isThinking]);

        // If using children composition, render children directly
        if (children) {
            return (
                <div className={className} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {children}
                </div>
            );
        }

        // Default rendering
        return (
            <Card
                className={className}
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                bodyStyle={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                }}
            >
                {/* Messages Container */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 24,
                        backgroundColor: '#ffffff',
                    }}
                >
                    {messages.map((message) => (
                        <Bubble key={message.id} message={message} />
                    ))}

                    {/* Thinking/Processing Indicators */}
                    {isThinking && thoughtSteps.length > 0 && (
                        <ThoughtChain steps={thoughtSteps} />
                    )}

                    {isThinking && thoughtSteps.length === 0 && (
                        <ThinkIndicator />
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Footer */}
                <div
                    style={{
                        borderTop: '1px solid #f0f0f0',
                        padding: 16,
                        backgroundColor: '#fafafa',
                    }}
                >
                    {suggestions.length > 0 && (
                        <PromptSuggestions
                            suggestions={suggestions}
                            onSelect={onSelectSuggestion || onSend}
                        />
                    )}

                    <Sender onSend={onSend} />
                </div>
            </Card>
        );
    };

/**
 * MessagesContainer - Container for message list (composition API)
 */
const MessagesContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24,
                backgroundColor: '#ffffff',
            }}
        >
            {children}
        </div>
    );
};

/**
 * FooterContainer - Container for footer elements (composition API)
 */
const FooterContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            style={{
                borderTop: '1px solid #f0f0f0',
                padding: 16,
                backgroundColor: '#fafafa',
            }}
        >
            {children}
        </div>
    );
};

ChatShell.Messages = MessagesContainer;
ChatShell.Footer = FooterContainer;
ChatShell.displayName = 'ChatShell';
MessagesContainer.displayName = 'ChatShell.Messages';
FooterContainer.displayName = 'ChatShell.Footer';
