'use client';

import { Protected } from '@/components/Protected';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import {
    ShellLayout as Layout,
    DashboardShell,
    QuickStats,
    KnowledgeHealthCard,
    ActivePipelinesList
} from '@enterprise-ai/x';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardPage() {
    const { t } = useTranslation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [stats, setStats] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pipelines, setPipelines] = useState<any[]>([]);

    useEffect(() => {
        apiClient.getDashboardStats().then(setStats);
        apiClient.getActivePipelines().then(setPipelines);
    }, []);

    return (
        <Protected>
            <Layout
                title={t.dashboard.title}
                subtitle={t.dashboard.subtitle}
                currentPath="/dashboard"
            >
                <DashboardShell>
                    <QuickStats
                        docs={stats?.totalDocs || 0}
                        apiCalls={stats?.totalApiCalls || 0}
                        errorRate={stats?.errorRate || 0}
                    />

                    <KnowledgeHealthCard
                        health={stats?.knowledgeHealth || 0}
                        totalVectors="1.4M"
                        lastSync="Just now"
                    />

                    <ActivePipelinesList pipelines={pipelines} />
                </DashboardShell>
            </Layout>
        </Protected>
    );
}
