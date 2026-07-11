'use client';

import React, { useMemo, useState } from 'react';
import { WorkstreamCard, WorkstreamStatus, WorkstreamCardProps } from './WorkstreamCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

// Shared Mock Data Generator to keep things consistent across views
export const generateMockWorkstreams = (): WorkstreamCardProps[] => {
    return [
        { id: '1', title: 'Fintech Mobile App Redesign', tenant: 'Fintech Mobile App', projectType: 'MVP', duration: '2 weeks', startDate: 'Feb 12, 2026', status: 'active', priority: 'high', progress: 35, tasksCompleted: 1, tasksTotal: 4, assignees: [{ id: 'A', name: 'Alice' }, { id: 'B', name: 'Bob' }] },
        { id: '2', title: 'Internal PM System', tenant: 'Internal Admin', projectType: 'Improvement', duration: '2 weeks', startDate: 'Feb 9, 2026', status: 'active', priority: 'medium', progress: 20, tasksCompleted: 1, tasksTotal: 6, assignees: [{ id: 'C', name: 'Charlie' }] },
        { id: '3', title: 'AI Learning Platform', tenant: 'HealthPlus', projectType: 'Revamp', duration: '3 weeks', startDate: 'Feb 13, 2026', status: 'active', priority: 'urgent', progress: 40, tasksCompleted: 1, tasksTotal: 3, assignees: [{ id: 'A', name: 'Alice' }, { id: 'D', name: 'Dave' }] },
        { id: '4', title: 'Internal CRM System', tenant: 'Acme Corp Internal', projectType: 'New', duration: '—', startDate: 'Feb 20, 2026', status: 'backlog', priority: 'low', progress: 0, tasksCompleted: 0, tasksTotal: 4, assignees: [{ id: 'B', name: 'Bob' }] },

        { id: '5', title: 'Ecommerce website', tenant: 'Shopline Retail', projectType: 'Audit', duration: '1 week', startDate: 'Jan 16, 2026', status: 'completed', priority: 'medium', progress: 100, tasksCompleted: 5, tasksTotal: 5, assignees: [{ id: 'E', name: 'Eve' }, { id: 'F', name: 'Frank' }] },
        { id: '6', title: 'Onboarding Flow A/B Test', tenant: 'HealthPlus', projectType: 'Experiment', duration: '1 week', startDate: 'Jan 13, 2026', status: 'completed', priority: 'high', progress: 100, tasksCompleted: 3, tasksTotal: 3, assignees: [{ id: 'C', name: 'Charlie' }] },
        { id: '7', title: 'Support Center Revamp', tenant: 'Atlas Logistics', projectType: 'Revamp', duration: '2 weeks', startDate: 'Jan 11, 2026', status: 'completed', priority: 'medium', progress: 100, tasksCompleted: 4, tasksTotal: 4, assignees: [{ id: 'A', name: 'Alice' }] },
        { id: '8', title: 'Billing Dashboard Polish', tenant: 'Northwind Bank', projectType: 'Polish', duration: '3 days', startDate: 'Jan 15, 2026', status: 'completed', priority: 'low', progress: 100, tasksCompleted: 2, tasksTotal: 2, assignees: [{ id: 'D', name: 'Dave' }, { id: 'B', name: 'Bob' }] },

        { id: '9', title: 'Marketing Site Refresh', tenant: 'Atlas Logistics', projectType: 'Phase 1', duration: '2 weeks', startDate: 'Feb 3, 2026', status: 'planned', priority: 'medium', progress: 10, tasksCompleted: 0, tasksTotal: 3, assignees: [{ id: 'C', name: 'Charlie' }] },
        { id: '10', title: 'Design System Cleanup', tenant: 'Acme Corp Internal', projectType: 'Refactor', duration: '1 week', startDate: 'Feb 5, 2026', status: 'planned', priority: 'low', progress: 0, tasksCompleted: 0, tasksTotal: 4, assignees: [{ id: 'F', name: 'Frank' }] },
    ];
};

export interface WorkstreamGridViewProps {
    title: string;
    description?: string;
    // Filters applied immediately
    filterStatus?: WorkstreamStatus;
    filterTenantSlug?: string;
}

export function WorkstreamGridView({ title, description, filterStatus, filterTenantSlug }: WorkstreamGridViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Simulate fetching the master list
    const allData = useMemo(() => generateMockWorkstreams(), []);

    // Apply strict props filters first, then user's text search
    const filteredData = useMemo(() => {
        return allData.filter(item => {
            // 1. Props Filters
            if (filterStatus && item.status !== filterStatus) return false;

            if (filterTenantSlug) {
                const normalizedItemTenant = item.tenant.toLowerCase().replace(/\s+/g, '-');
                if (normalizedItemTenant !== filterTenantSlug) return false;
            }

            // 2. Search Filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return item.title.toLowerCase().includes(q) || item.tenant.toLowerCase().includes(q);
            }

            return true;
        });
    }, [allData, filterStatus, filterTenantSlug, searchQuery]);

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        {title}
                        <span className="text-sm px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {filteredData.length}
                        </span>
                    </h1>
                    {description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full sm:w-64 max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search workflows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-400 text-slate-900 dark:text-slate-200"
                        />
                    </div>

                    <Button variant="outline" size="icon" className="shrink-0 border-slate-200 dark:border-slate-800">
                        <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </Button>

                    <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg shrink-0 border border-slate-200 dark:border-slate-700/50">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-1.5 rounded-md transition-colors", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300")}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            {filteredData.length === 0 ? (
                <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-transparent">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No workstreams found</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-500 mt-1">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className={cn(
                        "grid gap-4 md:gap-6",
                        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
                    )}
                >
                    <AnimatePresence>
                        {filteredData.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <WorkstreamCard {...item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
