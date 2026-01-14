import React from 'react';
import { Card, Progress, Typography, Space } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export interface KnowledgeHealthData {
    synced: number;
    total: number;
    percentage: number;
    status: 'healthy' | 'warning' | 'error';
}

export interface KnowledgeHealthCardProps {
    /**
     * Knowledge health data
     */
    data?: KnowledgeHealthData;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * KnowledgeHealthCard - Knowledge base sync status visualization
 * 
 * Displays a donut/progress chart showing knowledge base sync health.
 * 
 * @example
 * ```tsx
 * <KnowledgeHealthCard
 *   data={{ synced: 850, total: 1000, percentage: 85, status: 'healthy' }}
 * />
 * ```
 */
export const KnowledgeHealthCard: React.FC<KnowledgeHealthCardProps> = ({
    data,
    className,
}) => {
    const healthData: KnowledgeHealthData = data || {
        synced: 934,
        total: 1000,
        percentage: 93.4,
        status: 'healthy',
    };

    const getStatusColor = (status: KnowledgeHealthData['status']) => {
        switch (status) {
            case 'healthy':
                return '#52c41a';
            case 'warning':
                return '#faad14';
            case 'error':
                return '#ff4d4f';
            default:
                return '#1677ff';
        }
    };

    return (
        <Card
            className={className}
            title={
                <Space>
                    <DatabaseOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                    <span>Knowledge Base Health</span>
                </Space>
            }
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <Progress
                    type="circle"
                    percent={healthData.percentage}
                    size={180}
                    strokeColor={getStatusColor(healthData.status)}
                    format={(percent) => (
                        <div>
                            <div style={{ fontSize: 32, fontWeight: 700, color: getStatusColor(healthData.status) }}>
                                {percent}%
                            </div>
                            <div style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)', marginTop: 4 }}>
                                Synced
                            </div>
                        </div>
                    )}
                />

                <div style={{ marginTop: 24 }}>
                    <Text type="secondary">
                        {healthData.synced.toLocaleString()} of {healthData.total.toLocaleString()} documents indexed
                    </Text>
                </div>

                <div style={{ marginTop: 12 }}>
                    <Text strong style={{ color: getStatusColor(healthData.status) }}>
                        {healthData.status.charAt(0).toUpperCase() + healthData.status.slice(1)}
                    </Text>
                </div>
            </div>
        </Card>
    );
};

KnowledgeHealthCard.displayName = 'KnowledgeHealthCard';
