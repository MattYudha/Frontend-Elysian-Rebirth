'use client';

import React from 'react';
import { Layout, Typography } from 'antd';
import { QuickStats } from './QuickStats';
import { KnowledgeHealthCard } from './KnowledgeHealthCard';
import { ActivePipelinesList } from './ActivePipelinesList';

const { Content } = Layout;
const { Title } = Typography;

export interface DashboardShellProps {
    /**
     * Dashboard title
     */
    title?: string;

    /**
     * Children components (for custom layouts)
     */
    children?: React.ReactNode;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * DashboardShell - Main dashboard layout container
 * 
 * Provides a structured layout for the enterprise AI dashboard
 * with stats, knowledge health, and active pipelines.
 * 
 * @example
 * ```tsx
 * <DashboardShell title="AI Control Center">
 *   <QuickStats />
 *   <KnowledgeHealthCard />
 *   <ActivePipelinesList />
 * </DashboardShell>
 * ```
 */
export const DashboardShell: React.FC<DashboardShellProps> = ({
    title = 'Enterprise AI Control Center',
    children,
    className,
}) => {
    if (children) {
        return (
            <Layout className={className} style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <Content style={{ padding: 24 }}>
                    <Title level={2} style={{ marginBottom: 24 }}>
                        {title}
                    </Title>
                    {children}
                </Content>
            </Layout>
        );
    }

    // Default layout
    return (
        <Layout className={className} style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Content style={{ padding: 24 }}>
                <Title level={2} style={{ marginBottom: 24 }}>
                    {title}
                </Title>

                {/* Quick Stats */}
                <div style={{ marginBottom: 24 }}>
                    <QuickStats />
                </div>

                {/* Knowledge Health & Active Pipelines */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
                    <KnowledgeHealthCard />
                    <ActivePipelinesList />
                </div>
            </Content>
        </Layout>
    );
};

DashboardShell.displayName = 'DashboardShell';
