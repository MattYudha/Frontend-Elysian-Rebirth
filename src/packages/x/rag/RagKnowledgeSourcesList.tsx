import React from 'react';
import { Card, List, Tag, Progress, Typography, Space, Badge } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface KnowledgeSource {
    id: string;
    name: string;
    type: 'pdf' | 'faq' | 'web' | 'database' | 'other';
    status: 'syncing' | 'ready' | 'error';
    syncProgress?: number;
    embeddingModel: string;
    chunkCount: number;
    lastSync?: Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
}

export interface RagKnowledgeSourcesListProps {
    /**
     * Array of knowledge sources
     */
    sources?: KnowledgeSource[];

    /**
     * Callback when a source is clicked
     */
    onClickSource?: (source: KnowledgeSource) => void;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * RagKnowledgeSourcesList - Knowledge sources inventory display
 * 
 * Shows list of indexed knowledge sources with:
 * - Source name and type
 * - Sync status and progress
 * - Embedding model
 * - Chunk count
 * - Last sync time
 * 
 * @example
 * ```tsx
 * <RagKnowledgeSourcesList
 *   sources={knowledgeSources}
 *   onClickSource={handleSourceClick}
 * />
 * ```
 */
export const RagKnowledgeSourcesList: React.FC<RagKnowledgeSourcesListProps> = ({
    sources,
    onClickSource,
    className,
}) => {
    const defaultSources: KnowledgeSource[] = sources || [
        {
            id: 'src_001',
            name: 'Product Documentation',
            type: 'pdf',
            status: 'ready',
            embeddingModel: 'text-embedding-ada-002',
            chunkCount: 1247,
            lastSync: new Date(Date.now() - 3600000),
        },
        {
            id: 'src_002',
            name: 'Customer FAQ Database',
            type: 'database',
            status: 'syncing',
            syncProgress: 67,
            embeddingModel: 'text-embedding-3-small',
            chunkCount: 543,
            lastSync: new Date(Date.now() - 300000),
        },
        {
            id: 'src_003',
            name: 'Company Website Content',
            type: 'web',
            status: 'ready',
            embeddingModel: 'text-embedding-ada-002',
            chunkCount: 892,
            lastSync: new Date(Date.now() - 7200000),
        },
    ];

    const getStatusIcon = (status: KnowledgeSource['status']) => {
        switch (status) {
            case 'ready':
                return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />;
            case 'syncing':
                return <SyncOutlined spin style={{ color: '#1677ff', fontSize: 20 }} />;
            case 'error':
                return <WarningOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />;
        }
    };

    const getTypeIcon = (_type: KnowledgeSource['type']) => {
        return <FileTextOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
    };

    const getTypeColor = (type: KnowledgeSource['type']) => {
        switch (type) {
            case 'pdf':
                return 'red';
            case 'faq':
                return 'blue';
            case 'web':
                return 'green';
            case 'database':
                return 'purple';
            default:
                return 'default';
        }
    };

    const formatTimeAgo = (date: Date): string => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <Card
            className={className}
            title="Knowledge Sources"
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
        >
            <List
                dataSource={defaultSources}
                renderItem={(source) => (
                    <List.Item
                        style={{
                            cursor: onClickSource ? 'pointer' : 'default',
                            padding: '16px 0',
                            borderBottom: '1px solid #f0f0f0',
                        }}
                        onClick={() => onClickSource?.(source)}
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge dot={source.status === 'syncing'} status="processing">
                                    {getTypeIcon(source.type)}
                                </Badge>
                            }
                            title={
                                <Space size={8}>
                                    <Text strong>{source.name}</Text>
                                    <Tag color={getTypeColor(source.type)}>
                                        {source.type.toUpperCase()}
                                    </Tag>
                                    {getStatusIcon(source.status)}
                                </Space>
                            }
                            description={
                                <div>
                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            Model: {source.embeddingModel} • {(source.chunkCount || 0).toLocaleString()} chunks
                                        </Text>

                                        {source.lastSync && (
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Last synced: {formatTimeAgo(source.lastSync)}
                                            </Text>
                                        )}

                                        {source.status === 'syncing' && source.syncProgress !== undefined && (
                                            <div style={{ marginTop: 8 }}>
                                                <Progress
                                                    percent={source.syncProgress}
                                                    size="small"
                                                    status="active"
                                                />
                                            </div>
                                        )}
                                    </Space>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

RagKnowledgeSourcesList.displayName = 'RagKnowledgeSourcesList';
