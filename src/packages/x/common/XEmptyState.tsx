import React from 'react';
import { Empty, Button } from 'antd';
import {
    InboxOutlined,
    FileTextOutlined,
    MessageOutlined,
    DatabaseOutlined,
    NodeIndexOutlined,
} from '@ant-design/icons';

export interface XEmptyStateProps {
    /**
     * Empty state type/context
     */
    type?: 'chat' | 'documents' | 'knowledge' | 'workflow' | 'generic';

    /**
     * Custom icon
     */
    icon?: React.ReactNode;

    /**
     * Title text
     */
    title?: string;

    /**
     * Description text
     */
    description?: string;

    /**
     * Primary action button
     */
    action?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };

    /**
     * Secondary action
     */
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * XEmptyState - Standardized empty state display
 * 
 * Provides context-aware empty states for different scenarios.
 * 
 * @example
 * ```tsx
 * <XEmptyState
 *   type="chat"
 *   action={{
 *     label: "Start New Chat",
 *     onClick: handleNewChat,
 *     icon: <MessageOutlined />
 *   }}
 * />
 * ```
 */
export const XEmptyState: React.FC<XEmptyStateProps> = ({
    type = 'generic',
    icon,
    title,
    description,
    action,
    secondaryAction,
    className,
}) => {
    const getDefaultConfig = () => {
        switch (type) {
            case 'chat':
                return {
                    icon: <MessageOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />,
                    title: 'No messages yet',
                    description: 'Start a conversation to see your chat history here.',
                };
            case 'documents':
                return {
                    icon: <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />,
                    title: 'No documents found',
                    description: 'Upload documents to get started with AI processing.',
                };
            case 'knowledge':
                return {
                    icon: <DatabaseOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />,
                    title: 'No knowledge sources',
                    description: 'Add knowledge sources to enable RAG capabilities.',
                };
            case 'workflow':
                return {
                    icon: <NodeIndexOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />,
                    title: 'No workflows created',
                    description: 'Create your first workflow to automate AI tasks.',
                };
            default:
                return {
                    icon: <InboxOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />,
                    title: 'No data',
                    description: 'Get started by adding some content.',
                };
        }
    };

    const defaultConfig = getDefaultConfig();

    return (
        <div
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                padding: 40,
            }}
        >
            <Empty
                image={icon || defaultConfig.icon}
                imageStyle={{
                    height: 80,
                }}
                description={
                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#262626' }}>
                            {title || defaultConfig.title}
                        </div>
                        <div style={{ fontSize: 14, color: '#8c8c8c' }}>
                            {description || defaultConfig.description}
                        </div>
                    </div>
                }
            >
                {action && (
                    <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            icon={action.icon}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                        {secondaryAction && (
                            <Button onClick={secondaryAction.onClick}>
                                {secondaryAction.label}
                            </Button>
                        )}
                    </div>
                )}
            </Empty>
        </div>
    );
};

XEmptyState.displayName = 'XEmptyState';
