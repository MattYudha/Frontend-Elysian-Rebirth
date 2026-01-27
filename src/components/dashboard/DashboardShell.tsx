'use client';

import React from 'react';
import { Home } from 'lucide-react';
import { TokenUsageChart } from './TokenUsageChart';
import { TryElysianWidget } from './PromoWidgets';
import { QuestWidget } from './QuestWidget';
import { DashboardStats } from './DashboardStats';
import { ActivePipelinesList } from './ActivePipelinesList';
import { BusinessNeedsSection } from './BusinessNeeds';
import { OnboardingWidget } from '@/components/onboarding/OnboardingWidget';
import { useTranslation } from '@/hooks/useTranslation';
import { useDashboardStats } from '@/queries/dashboard.queries';

interface DashboardStatsData {
    docs?: number;
    apiCalls?: number;
    errorRate?: number;
    successRate?: number;
}

export function DashboardShell({ stats: _initialStats }: { stats: DashboardStatsData | null }) {
    const { t } = useTranslation();
    const { data: stats, isLoading } = useDashboardStats();

    // Use dummy data if still loading but show real stats once fetched
    const displayStats = stats || {
        docs: 0,
        apiCalls: 0,
        errorRate: 0,
        successRate: 0
    };

    return (
        <>
            <OnboardingWidget />
            <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-4 md:space-y-6 lg:space-y-8">
                {/* Header */}
                <div id="dashboard-header" className="pt-2 md:pt-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Home className="w-4 h-4" />
                        <span>/</span>
                        <span>{t.dashboard.breadcrumb}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t.dashboard.heading}</h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">{t.dashboard.description}</p>
                </div>

                {/* Top Section: Charts & Promo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Left: Chart */}
                    <div className="lg:col-span-2">
                        <TokenUsageChart />
                    </div>

                    {/* Right: Widgets */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="min-h-[180px] md:min-h-[200px]">
                            <TryElysianWidget />
                        </div>
                        <QuestWidget />
                    </div>
                </div>

                {/* Stats Grid */}
                <DashboardStats
                    docs={displayStats.docs}
                    apiCalls={displayStats.apiCalls}
                    errorRate={displayStats.errorRate}
                    successRate={displayStats.successRate}
                    isLoading={isLoading}
                />

                {/* Active Pipelines Table */}
                <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-4 md:p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg">{t.dashboard.activePipelines}</h3>
                    </div>
                    <ActivePipelinesList />
                </div>

                {/* Bottom: Business Needs */}
                <BusinessNeedsSection />
            </div>
        </>
    );
}

