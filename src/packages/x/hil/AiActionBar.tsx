import React from 'react';
import { Button, Space, Dropdown, type MenuProps } from 'antd';
import { EditOutlined, TranslationOutlined, FileTextOutlined, MoreOutlined } from '@ant-design/icons';

export interface AiActionBarProps {
    /**
     * Callback for AI Rewrite action
     */
    onRewrite?: () => void;

    /**
     * Callback for AI Translate action
     */
    onTranslate?: () => void;

    /**
     * Callback for AI Summarize action
     */
    onSummarize?: () => void;

    /**
     * Additional custom actions
     */
    moreActions?: MenuProps['items'];

    /**
     * Whether actions are disabled
     */
    disabled?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * AiActionBar - Floating AI action buttons for document editing
 * 
 * Provides quick access to AI-powered editing actions:
 * - Rewrite
 * - Translate
 * - Summarize
 * - More (custom actions)
 * 
 * @example
 * ```tsx
 * <AiActionBar
 *   onRewrite={handleRewrite}
 *   onTranslate={handleTranslate}
 *   onSummarize={handleSummarize}
 *   moreActions={[
 *     { key: 'grammar', label: 'Fix Grammar' },
 *     { key: 'expand', label: 'Expand' },
 *   ]}
 * />
 * ```
 */
export const AiActionBar: React.FC<AiActionBarProps> = ({
    onRewrite,
    onTranslate,
    onSummarize,
    moreActions,
    disabled = false,
    className,
}) => {
    const defaultMoreActions: MenuProps['items'] = moreActions || [
        {
            key: 'grammar',
            label: 'Fix Grammar',
            icon: <EditOutlined />,
        },
        {
            key: 'expand',
            label: ' Expand Text',
            icon: <EditOutlined />,
        },
        {
            key: 'simplify',
            label: 'Simplify',
            icon: <EditOutlined />,
        },
    ];

    return (
        <div
            className={className}
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
            }}
        >
            <Space.Compact>
                {onRewrite && (
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={onRewrite}
                        disabled={disabled}
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        ✨ Rewrite
                    </Button>
                )}

                {onTranslate && (
                    <Button
                        type="primary"
                        icon={<TranslationOutlined />}
                        onClick={onTranslate}
                        disabled={disabled}
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        🌐 Translate
                    </Button>
                )}

                {onSummarize && (
                    <Button
                        type="primary"
                        icon={<FileTextOutlined />}
                        onClick={onSummarize}
                        disabled={disabled}
                        style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        📝 Summarize
                    </Button>
                )}

                {defaultMoreActions && defaultMoreActions.length > 0 && (
                    <Dropdown menu={{ items: defaultMoreActions }} placement="topRight">
                        <Button
                            type="primary"
                            icon={<MoreOutlined />}
                            disabled={disabled}
                            style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            }}
                        >
                            More
                        </Button>
                    </Dropdown>
                )}
            </Space.Compact>
        </div>
    );
};

AiActionBar.displayName = 'AiActionBar';
