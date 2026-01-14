import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { FileTextOutlined, ApiOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

export interface StatData {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    suffix?: string;
    prefix?: string;
    valueStyle?: React.CSSProperties;
}

export interface QuickStatsProps {
    /**
     * Array of statistics to display
     */
    stats?: StatData[];

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * QuickStats - Quick metrics display cards
 * 
 * Displays key metrics in a responsive grid layout with icons.
 * 
 * @example
 * ```tsx
 * <QuickStats stats={[
 *   { title: 'Documents', value: 1234, icon: <FileTextOutlined /> },
 *   { title: 'API Calls', value: 89012, icon: <ApiOutlined /> },
 * ]} />
 * ```
 */
export const QuickStats: React.FC<QuickStatsProps> = ({ stats, className }) => {
    const defaultStats: StatData[] = stats || [
        {
            title: 'Documents Indexed',
            value: 1234,
            icon: <FileTextOutlined style={{ fontSize: 32, color: '#1677ff' }} />,
        },
        {
            title: 'API Calls (24h)',
            value: 45678,
            icon: <ApiOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
        },
        {
            title: 'Error Rate',
            value: 0.12,
            suffix: '%',
            icon: <WarningOutlined style={{ fontSize: 32, color: '#faad14' }} />,
            valueStyle: { color: '#faad14' },
        },
        {
            title: 'Success Rate',
            value: 99.88,
            suffix: '%',
            icon: <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
            valueStyle: { color: '#52c41a' },
        },
    ];

    return (
        <div className={className}>
            <Row gutter={[16, 16]}>
                {defaultStats.map((stat, index) => (
                    <Col key={index} xs={24} sm={12} lg={6}>
                        <Card
                            style={{
                                borderRadius: 12,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            }}
                        >
                            <Statistic
                                title={stat.title}
                                value={stat.value}
                                prefix={stat.icon}
                                suffix={stat.suffix}
                                valueStyle={{ fontSize: 28, fontWeight: 600, ...stat.valueStyle }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

QuickStats.displayName = 'QuickStats';
