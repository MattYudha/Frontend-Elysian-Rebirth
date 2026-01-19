'use client';

import React from 'react';
import { Home } from 'lucide-react';
import { TokenUsageChart } from './TokenUsageChart';
import { TryElysianWidget } from './PromoWidgets';
import { QuestWidget } from './QuestWidget';
import { DashboardStats } from './DashboardStats';
import { ActivePipelinesList } from './ActivePipelinesList';
import { BusinessNeedsSection } from './BusinessNeeds';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DashboardShell({ stats: _stats }: { stats: any }) {
    // We ignore the passed stats for now as they are placeholders and use realistic mock data
    // to match the screenshot design requested by the user.

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Home className="w-4 h-4" />
                    <span>/</span>
                    <span>Dashboard</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Monitor token usage and pipeline status.</p>
            </div>

            {/* Top Section: Charts & Promo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Chart */}
                <div className="lg:col-span-2">
                    <TokenUsageChart />
                </div>

                {/* Right: Widgets */}
                <div className="space-y-6">
                    <div className="h-[200px]">
                        <TryElysianWidget />
                    </div>
                    <QuestWidget />
                </div>
            </div>

            {/* Stats Grid */}
            <DashboardStats
                docs={1234}
                apiCalls={45600}
                errorRate={0.12}
                successRate={99.8}
            />

            {/* Active Pipelines Table */}
            <div className="rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-6">
                <div className="mb-6">
                    <h3 className="font-bold text-lg">Active Pipelines</h3>
                </div>
                <ActivePipelinesList />
            </div>

            {/* Bottom: Business Needs */}
            <BusinessNeedsSection />
        </div>
    );
}

