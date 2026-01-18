"use client";

import React from 'react';
import { Layout, Typography } from 'antd';
import {
    UserGuideCard
} from '@/components/dashboard/DashboardWidgets';
import { TryElysianWidget } from '@/components/dashboard/PromoWidgets';
import { QuestWidget } from '@/components/dashboard/QuestWidget';
import { TokenUsageChart } from '@/components/dashboard/TokenUsageChart';
import { ActivePipelinesList } from './ActivePipelinesList';
import { QuickStats } from './QuickStats';
import { BusinessNeedsSection } from '@/components/dashboard/BusinessNeeds';
import { DynamicBreadcrumb } from '@/components/layout/DynamicBreadcrumb';

const { Content } = Layout;
const { Title, Text } = Typography;

export interface DashboardShellProps {
    children?: React.ReactNode;
}

export const DashboardShell = ({ children }: DashboardShellProps) => {
    if (children) return <Layout>{children}</Layout>;

    return (
        <Layout className="min-h-screen bg-transparent">
            <Content className="p-4 md:p-6 lg:p-8 bg-zinc-50/50 dark:bg-zinc-950">
                <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* 1. Header Section (MVP Style) */}
                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-2">
                        <div>
                            <DynamicBreadcrumb />
                            <div className="mt-2">
                                <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>
                                    Dashboard
                                </Title>
                                <Text className="text-zinc-500">
                                    Monitor token usage and pipeline status.
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* 2. THE MAIN GRID LAYOUT */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* === LEFT COLUMN (MAIN - 8 Columns) === */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Row A: Hero Token Chart (Usage Focus) */}
                            {/* Removed fixed height constraint and double padding/borders. Using the component's internal Card style or wrapping cleanly. */}
                            <div className="w-full">
                                <TokenUsageChart />
                            </div>

                            {/* Row B: Quick Stats Row */}
                            <QuickStats />

                            {/* Row C: Pipelines Table */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50">
                                    <div>
                                        <h3 className="font-bold text-zinc-800 dark:text-zinc-100">Live Pipelines</h3>
                                        <p className="text-xs text-zinc-500">Active processing tasks</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        <span className="relative flex h-2 w-2">
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        Operational
                                    </div>
                                </div>
                                <ActivePipelinesList />
                            </div>
                        </div>

                        {/* === RIGHT COLUMN (SIDEBAR - 4 Columns) === */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* 1. Try Elysian (Onboarding Focus) */}
                            <TryElysianWidget />

                            {/* 2. Quest Widget */}
                            <QuestWidget />

                            {/* 3. Helper / Guide */}
                            <div className="sticky top-6">
                                <UserGuideCard />

                                <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
                                    <p className="text-xs text-zinc-400 font-medium">Alpha v0.9.1</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 3. BOTTOM SECTION: Business Needs */}
                    <div className="border-t border-zinc-200 dark:border-zinc-800 mt-2">
                        <BusinessNeedsSection />
                    </div>

                </div>
            </Content>
        </Layout>
    );
};

DashboardShell.displayName = 'DashboardShell';
