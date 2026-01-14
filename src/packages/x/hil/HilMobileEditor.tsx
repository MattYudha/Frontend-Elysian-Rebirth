'use client';

import React, { useState } from 'react';
import { Card, Button, Space, Typography, Tabs, Badge } from 'antd';
import { FileTextOutlined, EditOutlined, HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export interface HilMobileEditorProps {
    /**
     * Document title
     */
    title: string;

    /**
     * Project metadata
     */
    project: {
        name: string;
        type: string;
    };

    /**
     * Source document info
     */
    sourceMeta: {
        filename: string;
        snippet?: string;
    };

    /**
     * Initial editor content
     */
    initialContent: string;

    /**
     * Version history entries
     */
    versions?: Array<{
        id: string;
        type: 'ai' | 'human';
        title: string;
        timestamp: Date;
    }>;

    /**
     * Callback when content changes
     */
    onChangeContent: (value: string) => void;

    /**
     * AI action callbacks
     */
    onAiRewrite?: () => void;
    onAiSummarize?: () => void;
    onAiTranslate?: () => void;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * HilMobileEditor - Mobile-optimized SOP editor with tabbed interface
 * 
 * Features:
 * - Mode switch: Original PDF vs AI Draft
 * - SOP title + project meta
 * - Tabbed interface (Editor / Workflow / Files / Settings)
 * - Version history
 * - Floating AI action menu
 * 
 * @example
 * ```tsx
 * <HilMobileEditor
 *   title="Safety Operating Procedure"
 *   project={{ name: "Manufacturing SOP Update", type: "Quality Assurance" }}
 *   sourceMeta={{ filename: "safety-sop-v2.pdf" }}
 *   initialContent={content}
 *   onChangeContent={handleChange}
 * />
 * ```
 */
export const HilMobileEditor: React.FC<HilMobileEditorProps> = ({
    title,
    project,
    sourceMeta,
    initialContent,
    versions = [],
    onChangeContent,
    onAiRewrite,
    onAiSummarize,
    onAiTranslate,
    className,
}) => {
    const [content, setContent] = useState(initialContent);
    const [viewMode, setViewMode] = useState<'original' | 'draft'>('draft');

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChangeContent(newContent);
    };

    return (
        <div className={className} style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{ padding: 16, backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ marginBottom: 12 }}>
                    <Title level={5} style={{ margin: 0 }}>
                        {title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {project.name} • {project.type}
                    </Text>
                </div>

                {/* Mode Toggle */}
                <Button.Group style={{ width: '100%' }}>
                    <Button
                        style={{ width: '50%' }}
                        type={viewMode === 'original' ? 'primary' : 'default'}
                        onClick={() => setViewMode('original')}
                        icon={<FileTextOutlined />}
                    >
                        Original PDF
                    </Button>
                    <Button
                        style={{ width: '50%' }}
                        type={viewMode === 'draft' ? 'primary' : 'default'}
                        onClick={() => setViewMode('draft')}
                        icon={<EditOutlined />}
                    >
                        AI Draft
                    </Button>
                </Button.Group>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Tabs defaultActiveKey="editor" style={{ backgroundColor: '#fff' }}>
                    {/* Editor Tab */}
                    <TabPane
                        tab={
                            <span>
                                <EditOutlined /> Editor
                            </span>
                        }
                        key="editor"
                    >
                        <div style={{ padding: 16 }}>
                            {/* Source Mapping */}
                            {viewMode === 'draft' && (
                                <Card size="small" style={{ marginBottom: 16, backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }}>
                                    <Text strong style={{ fontSize: 12 }}>
                                        📄 Source Document:
                                    </Text>
                                    <Paragraph style={{ margin: '8px 0 0 0', fontSize: 12 }} ellipsis={{ rows: 2 }}>
                                        {sourceMeta.filename}
                                        {sourceMeta.snippet && `: "${sourceMeta.snippet}"`}
                                    </Paragraph>
                                </Card>
                            )}

                            {/* Editor */}
                            {viewMode === 'draft' ? (
                                <div>
                                    <textarea
                                        value={content}
                                        onChange={handleContentChange}
                                        placeholder="Edit AI-generated draft..."
                                        style={{
                                            width: '100%',
                                            minHeight: 400,
                                            padding: 12,
                                            fontSize: 14,
                                            lineHeight: 1.8,
                                            border: '1px solid #d9d9d9',
                                            borderRadius: 8,
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                        }}
                                    />

                                    {/* AI Actions */}
                                    <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {onAiRewrite && (
                                            <Button size="small" onClick={onAiRewrite}>
                                                ✨ Rewrite
                                            </Button>
                                        )}
                                        {onAiSummarize && (
                                            <Button size="small" onClick={onAiSummarize}>
                                                📝 Summarize
                                            </Button>
                                        )}
                                        {onAiTranslate && (
                                            <Button size="small" onClick={onAiTranslate}>
                                                🌐 Translate
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 40 }}>
                                    <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                                    <div style={{ marginTop: 16 }}>
                                        <Text type="secondary">
                                            PDF Preview: {sourceMeta.filename}
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabPane>

                    {/* Version History Tab */}
                    <TabPane
                        tab={
                            <span>
                                <HistoryOutlined />
                                <Badge count={versions.length} offset={[10, 0]} size="small">
                                    History
                                </Badge>
                            </span>
                        }
                        key="history"
                    >
                        <div style={{ padding: 16 }}>
                            <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                {versions.length > 0 ? (
                                    versions.map((version) => (
                                        <Card key={version.id} size="small">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Text strong style={{ fontSize: 13 }}>
                                                        {version.type === 'ai' ? '🤖' : '👤'} {version.title}
                                                    </Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        {version.timestamp.toLocaleString()}
                                                    </Text>
                                                </div>
                                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <Card size="small">
                                        <Text type="secondary">No version history yet</Text>
                                    </Card>
                                )}
                            </Space>
                        </div>
                    </TabPane>

                    {/* Files Tab */}
                    <TabPane
                        tab={
                            <span>
                                <FileTextOutlined /> Files
                            </span>
                        }
                        key="files"
                    >
                        <div style={{ padding: 16 }}>
                            <Card size="small">
                                <FileTextOutlined /> {sourceMeta.filename}
                            </Card>
                        </div>
                    </TabPane>
                </Tabs>
            </div>

            {/* Bottom Action Bar */}
            <div style={{ padding: 16, backgroundColor: '#fff', borderTop: '1px solid #f0f0f0' }}>
                <Button type="primary" block size="large">
                    Save & Continue
                </Button>
            </div>
        </div>
    );
};

HilMobileEditor.displayName = 'HilMobileEditor';
