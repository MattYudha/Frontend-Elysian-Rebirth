import React from 'react';
import type { PipelineItem } from '../types';
import { Card, List, Progress, Tag, Typography, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface ActivePipelinesListProps {
    /**
     * Array of pipeline items
     */
    items?: PipelineItem[];

    /**
     * Callback when a pipeline item is clicked
     */
    onClickItem?: (item: PipelineItem) => void;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * ActivePipelinesList - Real-time pipeline processing list
 * 
 * Displays active pipelines with status, progress, and metadata.
 * 
 * @example
 * ```tsx
 * <ActivePipelinesList
 *   items={pipelines}
 *   onClickItem={handlePipelineClick}
 * />
 * ```
 */
export const ActivePipelinesList: React.FC<ActivePipelinesListProps> = ({
    items,
    onClickItem,
    className,
}) => {
    const defaultItems: PipelineItem[] = items || [
        {
            id: 'pipe_001',
            name: 'Customer Support RAG Indexing',
            status: 'processing',
            progress: 67,
            eta: '2 min remaining',
            lastUpdated: new Date(Date.now() - 30000),
        },
        {
            id: 'pipe_002',
            name: 'Product Documentation Update',
            status: 'queued',
            lastUpdated: new Date(Date.now() - 120000),
        },
        {
            id: 'pipe_003',
            name: 'Weekly Knowledge Refresh',
            status: 'completed',
            progress: 100,
            lastUpdated: new Date(Date.now() - 300000),
        },
    ];

    const getStatusIcon = (status: PipelineItem['status']) => {
        switch (status) {
            case 'processing':
                return <SyncOutlined spin style={{ color: '#1677ff' }} />;
            case 'completed':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'failed':
                return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'queued':
            default:
                return <ClockCircleOutlined style={{ color: '#faad14' }} />;
        }
    };

    const getStatusColor = (status: PipelineItem['status']) => {
        switch (status) {
            case 'processing':
                return 'blue';
            case 'completed':
                return 'green';
            case 'failed':
                return 'red';
            case 'queued':
            default:
                return 'orange';
        }
    };

    return (
        <Card
            className={className}
            title="Active Pipelines"
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
        >
            <List
                dataSource={defaultItems}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            cursor: onClickItem ? 'pointer' : 'default',
                            padding: '16px 0',
                            borderBottom: '1px solid #f0f0f0',
                        }}
                        onClick={() => onClickItem?.(item)}
                    >
                        <List.Item.Meta
                            avatar={getStatusIcon(item.status)}
                            title={
                                <Space size={8}>
                                    <Text strong>{item.name}</Text>
                                    <Tag color={getStatusColor(item.status)}>
                                        {item.status.toUpperCase()}
                                    </Tag>
                                </Space>
                            }
                            description={
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        ID: {item.id} • Updated {formatTimeAgo(item.lastUpdated)}
                                    </Text>

                                    {item.status === 'processing' && item.progress !== undefined && (
                                        <div style={{ marginTop: 12 }}>
                                            <Progress
                                                percent={item.progress}
                                                size="small"
                                                status="active"
                                            />
                                            {item.eta && (
                                                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                                                    {item.eta}
                                                </Text>
                                            )}
                                        </div>
                                    )}
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
};

ActivePipelinesList.displayName = 'ActivePipelinesList';
