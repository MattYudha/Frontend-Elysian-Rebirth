'use client';

import React, { useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { FileTextOutlined, EditOutlined, EyeOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface HilEditorProps {
    /**
     * Document title
     */
    title: string;

    /**
     * Source document metadata
     */
    sourceMeta: {
        filename: string;
        page?: number;
        section?: string;
    };

    /**
     * Initial editor content
     */
    initialContent: string;

    /**
     * Callback when content changes
     */
    onChangeContent: (value: string) => void;

    /**
     * Callback when document is approved
     */
    onApprove?: () => void;

    /**
     * AI action callbacks
     */
    onAiRewrite?: () => void;
    onAiTranslate?: () => void;
    onAiSummarize?: () => void;

    /**
     * Custom class name
     */
    className?: string;
}

export type ViewMode = 'pdf' | 'split' | 'editor';

/**
 * HilSplitEditor - Desktop-focused split view editor for human-in-the-loop document editing
 * 
 * Features:
 * - Toggle between PDF / Split / Editor only views
 * - PDF preview pane (top)
 * - Rich text editor pane (bottom)
 * - Floating AI action buttons
 * 
 * @example
 * ```tsx
 * <HilSplitEditor
 *   title="Product Documentation Review"
 *   sourceMeta={{ filename: "product-guide.pdf", page: 5 }}
 *   initialContent={content}
 *   onChangeContent={handleContentChange}
 *   onApprove={handleApprove}
 * />
 * ```
 */
export const HilSplitEditor: React.FC<HilEditorProps> = ({
    title,
    sourceMeta,
    initialContent,
    onChangeContent,
    onApprove,
    onAiRewrite,
    onAiTranslate,
    onAiSummarize,
    className,
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [content, setContent] = useState(initialContent);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChangeContent(newContent);
    };

    const showPdf = viewMode === 'pdf' || viewMode === 'split';
    const showEditor = viewMode === 'editor' || viewMode === 'split';

    return (
        <div className={className} style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={4} style={{ margin: 0 }}>
                            {title}
                        </Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Source: {sourceMeta?.filename || 'Unknown'}
                            {sourceMeta?.page && ` • Page ${sourceMeta.page}`}
                            {sourceMeta?.section && ` • ${sourceMeta.section}`}
                        </Text>
                    </div>

                    <Space>
                        {/* View Mode Toggle */}
                        <Button.Group>
                            <Button
                                icon={<EyeOutlined />}
                                type={viewMode === 'pdf' ? 'primary' : 'default'}
                                onClick={() => setViewMode('pdf')}
                            >
                                PDF Only
                            </Button>
                            <Button
                                icon={<SwapOutlined />}
                                type={viewMode === 'split' ? 'primary' : 'default'}
                                onClick={() => setViewMode('split')}
                            >
                                Split View
                            </Button>
                            <Button
                                icon={<EditOutlined />}
                                type={viewMode === 'editor' ? 'primary' : 'default'}
                                onClick={() => setViewMode('editor')}
                            >
                                Editor Only
                            </Button>
                        </Button.Group>

                        {onApprove && (
                            <Button type="primary" onClick={onApprove}>
                                Approve & Publish
                            </Button>
                        )}
                    </Space>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* PDF Preview Pane */}
                {showPdf && (
                    <div
                        style={{
                            flex: viewMode === 'split' ? 1 : 'auto',
                            borderBottom: viewMode === 'split' ? '2px solid #f0f0f0' : 'none',
                            backgroundColor: '#fafafa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 24,
                            overflow: 'auto',
                        }}
                    >
                        <Card style={{ maxWidth: 800, width: '100%' }}>
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
                                <div style={{ marginTop: 16 }}>
                                    <Text type="secondary">
                                        PDF Preview: {sourceMeta?.filename || 'Unknown'}
                                    </Text>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        (PDF viewer integration would be implemented here using libraries like react-pdf or pdfjs)
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Editor Pane */}
                {showEditor && (
                    <div
                        style={{
                            flex: 1,
                            padding: 24,
                            backgroundColor: '#ffffff',
                            overflow: 'auto',
                            position: 'relative',
                        }}
                    >
                        <Card>
                            <textarea
                                value={content}
                                onChange={handleContentChange}
                                placeholder="Start editing..."
                                style={{
                                    width: '100%',
                                    minHeight: viewMode === 'split' ? 300 : 500,
                                    padding: 16,
                                    fontSize: 14,
                                    lineHeight: 1.8,
                                    border: '1px solid #d9d9d9',
                                    borderRadius: 8,
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                }}
                            />

                            {/* Floating AI Actions */}
                            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {onAiRewrite && (
                                    <Button size="small" onClick={onAiRewrite}>
                                        ✨ AI Rewrite
                                    </Button>
                                )}
                                {onAiTranslate && (
                                    <Button size="small" onClick={onAiTranslate}>
                                        🌐 Translate
                                    </Button>
                                )}
                                {onAiSummarize && (
                                    <Button size="small" onClick={onAiSummarize}>
                                        📝 Summarize
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

HilSplitEditor.displayName = 'HilSplitEditor';
