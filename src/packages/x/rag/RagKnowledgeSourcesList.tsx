import React from 'react';
import { Card, List, Tag, Progress, Typography, Space, Badge } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, SyncOutlined, WarningOutlined } from '@ant-design/icons';
import { cn } from '../../../lib/utils';

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
            className={cn("shadow-sm rounded-xl overflow-hidden", className)}
            title="Knowledge Sources"
        >
            {/* Desktop View */}
            <div className="hidden md:block">
                <List
                    dataSource={defaultSources}
                    renderItem={(source) => (
                        <List.Item
                            className={cn(
                                "py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors",
                                onClickSource && "cursor-pointer"
                            )}
                            onClick={() => onClickSource?.(source)}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Badge dot={source.status === 'syncing'} status="processing">
                                        {getTypeIcon(source.type)}
                                    </Badge>
                                }
                                title={
                                    <div className="flex items-center gap-2">
                                        <Text strong>{source.name}</Text>
                                        <Tag color={getTypeColor(source.type)}>
                                            {source.type.toUpperCase()}
                                        </Tag>
                                        {getStatusIcon(source.status)}
                                    </div>
                                }
                                description={
                                    <div className="w-full">
                                        <div className="flex flex-col gap-1 w-full">
                                            <Text type="secondary" className="text-xs">
                                                Model: {source.embeddingModel} • {(source.chunkCount || 0).toLocaleString()} chunks
                                            </Text>

                                            {source.lastSync && (
                                                <Text type="secondary" className="text-xs">
                                                    Last synced: {formatTimeAgo(source.lastSync)}
                                                </Text>
                                            )}

                                            {source.status === 'syncing' && source.syncProgress !== undefined && (
                                                <div className="mt-2 w-full max-w-xs">
                                                    <Progress
                                                        percent={source.syncProgress}
                                                        size="small"
                                                        status="active"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden space-y-4">
                {defaultSources.map((source) => (
                    <div
                        key={source.id}
                        className={cn(
                            "group p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors",
                            onClickSource && "cursor-pointer active:scale-[0.98]"
                        )}
                        onClick={() => onClickSource?.(source)}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(source.type)}
                                <Tag color={getTypeColor(source.type)} className="m-0">
                                    {source.type.toUpperCase()}
                                </Tag>
                            </div>
                            {getStatusIcon(source.status)}
                        </div>

                        <div className="font-semibold text-sm mb-2 line-clamp-2">
                            {source.name}
                        </div>

                        <div className="text-xs text-gray-500 flex flex-col gap-1 mb-3">
                            <span>{(source.chunkCount || 0).toLocaleString()} chunks</span>
                            <span>{source.embeddingModel}</span>
                        </div>

                        {source.status === 'syncing' && source.syncProgress !== undefined && (
                            <Progress
                                percent={source.syncProgress}
                                size="small"
                                status="active"
                                showInfo={false}
                                className="mb-0"
                            />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

RagKnowledgeSourcesList.displayName = 'RagKnowledgeSourcesList';
