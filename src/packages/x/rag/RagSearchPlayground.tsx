'use client';

import React, { useState } from 'react';
import { Card, Input, Button, Space, Typography, Tag, Empty, Spin, Carousel } from 'antd';
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

export interface RetrievedChunk {
    id: string;
    content: string;
    score: number;
    metadata: {
        source: string;
        page?: number;
        section?: string;
        chunkIndex?: number;
    };
}

export interface QAPair {
    id: string;
    question: string;
    answer: string;
    chunks: RetrievedChunk[];
    timestamp: Date;
}

export interface RagSearchPlaygroundProps {
    /**
     * Current search query
     */
    query?: string;

    /**
     * Retrieved context chunks
     */
    retrievedChunks?: RetrievedChunk[];

    /**
     * Q&A history
     */
    qaHistory?: QAPair[];

    /**
     * Callback when search is performed
     */
    onSearch?: (query: string) => void;

    /**
     * Whether search is in progress
     */
    isSearching?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * RagSearchPlayground - RAG search playground with context carousel and Q&A history
 * 
 * Features:
 * - Search input
 * - Retrieved context carousel
 * - Match scores
 * - Q&A history
 * 
 * @example
 * ```tsx
 * <RagSearchPlayground
 *   query={searchQuery}
 *   retrievedChunks={chunks}
 *   onSearch={handleSearch}
 * />
 * ```
 */
export const RagSearchPlayground: React.FC<RagSearchPlaygroundProps> = ({
    query: initialQuery = '',
    retrievedChunks = [],
    qaHistory = [],
    onSearch,
    isSearching = false,
    className,
}) => {
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = () => {
        if (query.trim()) {
            onSearch?.(query.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <Card
            className={className}
            title="RAG Search Playground"
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
        >
            {/* Search Input */}
            <Space.Compact style={{ width: '100%', marginBottom: 24 }}>
                <TextArea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your search query..."
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    disabled={isSearching}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                    loading={isSearching}
                    style={{ height: 'auto' }}
                >
                    Search
                </Button>
            </Space.Compact>

            {/* Retrieved Context Carousel */}
            {isSearching ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">Searching knowledge base...</Text>
                    </div>
                </div>
            ) : retrievedChunks.length > 0 ? (
                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ marginBottom: 12, display: 'block' }}>
                        Retrieved Context ({retrievedChunks.length} chunks)
                    </Text>

                    <Carousel arrows dotPosition="bottom">
                        {retrievedChunks.map((chunk) => (
                            <div key={chunk.id}>
                                <Card
                                    size="small"
                                    style={{
                                        margin: '0 8px',
                                        backgroundColor: '#fafafa',
                                        border: '1px solid #e8e8e8',
                                    }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                        {/* Metadata */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Space size={8}>
                                                <FileTextOutlined />
                                                <Text strong style={{ fontSize: 12 }}>
                                                    {chunk.metadata.source}
                                                </Text>
                                                {chunk.metadata.page && (
                                                    <Tag color="blue">Page {chunk.metadata.page}</Tag>
                                                )}
                                            </Space>
                                            <Tag color="green">
                                                {(chunk.score * 100).toFixed(1)}% match
                                            </Tag>
                                        </div>

                                        {/* Content */}
                                        <Paragraph
                                            ellipsis={{ rows: 4, expandable: true }}
                                            style={{
                                                margin: 0,
                                                fontSize: 13,
                                                lineHeight: 1.6,
                                                backgroundColor: '#ffffff',
                                                padding: 12,
                                                borderRadius: 8,
                                            }}
                                        >
                                            {chunk.content}
                                        </Paragraph>

                                        {/* Chunk Info */}
                                        <Text type="secondary" style={{ fontSize: 11 }}>
                                            Chunk #{chunk.metadata.chunkIndex || 0} • ID: {chunk.id}
                                        </Text>
                                    </Space>
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                </div>
            ) : query && !isSearching ? (
                <Empty
                    description="No results found. Try a different query."
                    style={{ marginBottom: 24 }}
                />
            ) : null}

            {/* Q&A History */}
            {qaHistory.length > 0 && (
                <div>
                    <Text strong style={{ marginBottom: 12, display: 'block' }}>
                        Previous Queries
                    </Text>

                    <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        {qaHistory.slice(0, 3).map((qa) => (
                            <Card key={qa.id} size="small" style={{ backgroundColor: '#f9f9f9' }}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text strong>Q: </Text>
                                    <Text>{qa.question}</Text>
                                </div>
                                <div>
                                    <Text strong>A: </Text>
                                    <Text type="secondary">{qa.answer}</Text>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        {qa.chunks.length} chunks retrieved • {qa.timestamp.toLocaleTimeString()}
                                    </Text>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </div>
            )}
        </Card>
    );
};

RagSearchPlayground.displayName = 'RagSearchPlayground';
