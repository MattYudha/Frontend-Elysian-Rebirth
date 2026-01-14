'use client';

import React, { useState } from 'react';
import { Drawer, Input, Button, Space, Typography, Card, Divider, Tag, Spin } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

export interface RagQueryResponse {
    query: string;
    answer: string;
    sources: string[];
    chunks: Array<{
        content: string;
        score: number;
        source: string;
    }>;
    timestamp: Date;
}

export interface RagQueryPlaygroundDrawerProps {
    /**
     * Whether the drawer is open
     */
    open: boolean;

    /**
     * Callback when drawer is closed
     */
    onClose: () => void;

    /**
     * Latest RAG query response
     */
    lastResponse?: RagQueryResponse;

    /**
     *Callback when a query is submitted
     */
    onSubmitQuery?: (query: string) => void;

    /**
     * Whether a query is being processed
     */
    isProcessing?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * RagQueryPlaygroundDrawer - Bottom drawer for RAG query testing
 * 
 * Features:
 * - Query input
 * - Generated answer display
 * - Source attribution
 * - Retrieved chunks preview
 * 
 * @example
 * ```tsx
 * <RagQueryPlaygroundDrawer
 *   open={drawerOpen}
 *   onClose={handleClose}
 *   onSubmitQuery={handleQuery}
 *   lastResponse={response}
 * />
 * ```
 */
export const RagQueryPlaygroundDrawer: React.FC<RagQueryPlaygroundDrawerProps> = ({
    open,
    onClose,
    lastResponse,
    onSubmitQuery,
    isProcessing = false,
    className,
}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = () => {
        if (query.trim() && !isProcessing) {
            onSubmitQuery?.(query.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Drawer
            className={className}
            title="RAG Query Playground"
            placement="bottom"
            height="70vh"
            open={open}
            onClose={onClose}
            closeIcon={<CloseOutlined />}
            extra={
                <Button type="text" onClick={onClose}>
                    Close
                </Button>
            }
        >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Query Input */}
                <Card style={{ marginBottom: 24 }}>
                    <Space.Compact style={{ width: '100%' }}>
                        <TextArea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask a question to test RAG retrieval and generation..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            disabled={isProcessing}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            loading={isProcessing}
                            disabled={!query.trim()}
                            style={{ height: 'auto' }}
                        >
                            Query
                        </Button>
                    </Space.Compact>
                </Card>

                {/* Processing Indicator */}
                {isProcessing && (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 16 }}>
                            <Text type="secondary">Retrieving context and generating answer...</Text>
                        </div>
                    </div>
                )}

                {/* Response Display */}
                {lastResponse && !isProcessing && (
                    <div>
                        {/* Query */}
                        <Card style={{ marginBottom: 16, backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }}>
                            <Text strong>Your Question:</Text>
                            <Paragraph style={{ margin: '8px 0 0 0', fontSize: 15 }}>
                                {lastResponse.query}
                            </Paragraph>
                        </Card>

                        {/* Answer */}
                        <Card style={{ marginBottom: 16 }}>
                            <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                                ✓ Generated Answer:
                            </Text>
                            <Divider style={{ margin: '12px 0' }} />
                            <Paragraph style={{ fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                                {lastResponse.answer}
                            </Paragraph>

                            {/* Sources */}
                            <Divider style={{ margin: '16px 0 12px 0' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                <strong>Sources:</strong> {lastResponse.sources.join(', ')}
                            </Text>
                        </Card>

                        {/* Retrieved Chunks */}
                        <Card title="Retrieved Context Chunks">
                            <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                {lastResponse.chunks.map((chunk, index) => (
                                    <Card
                                        key={index}
                                        size="small"
                                        style={{ backgroundColor: '#fafafa' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text strong style={{ fontSize: 12 }}>
                                                {chunk.source}
                                            </Text>
                                            <Tag color="green">
                                                {(chunk.score * 100).toFixed(1)}% relevance
                                            </Tag>
                                        </div>
                                        <Paragraph
                                            ellipsis={{ rows: 3, expandable: true }}
                                            style={{
                                                margin: 0,
                                                fontSize: 13,
                                                color: '#595959',
                                            }}
                                        >
                                            {chunk.content}
                                        </Paragraph>
                                    </Card>
                                ))}
                            </Space>
                        </Card>

                        {/* Metadata */}
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                Response generated at {lastResponse.timestamp.toLocaleTimeString()} •
                                {lastResponse.chunks.length} chunks retrieved
                            </Text>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
};

RagQueryPlaygroundDrawer.displayName = 'RagQueryPlaygroundDrawer';
