'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, FolderKanban, Clock, Inbox, Users, Activity, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreateTenantDialog } from './CreateTenantDialog';
import { useState } from 'react';

const NAV_ITEMS = [
    { label: 'Overview', href: '/workstreams', icon: Activity },
    { label: 'Active Pipelines', href: '/workstreams/active', icon: Clock },
    { label: 'Completed', href: '/workstreams/completed', icon: CheckCircle2 },
    { label: 'All Workstreams', href: '/workstreams/all', icon: Inbox },
];

const INITIAL_TENANTS = [
    { name: 'Fintech Mobile App', color: 'bg-blue-500' },
    { name: 'Ecommerce Admin', color: 'bg-orange-500' },
    { name: 'Healthcare Booking', color: 'bg-emerald-500' },
];

export function WorkstreamSidebar() {
    const pathname = usePathname();
    const [tenants, setTenants] = useState(INITIAL_TENANTS);

    const handleAddTenant = (name: string) => {
        // Mocking backend assignment of a color
        const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-cyan-500', 'bg-violet-500', 'bg-fuchsia-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        setTenants(prev => [...prev, { name, color: randomColor }]);
    };

    return (
        <div className="w-64 h-full flex flex-col bg-white/40 dark:bg-[#0B1120]/40 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 overflow-y-auto scrollbar-hide shrink-0 z-10">
            {/* Header */}
            <div className="p-4 pt-6 md:p-6 md:pt-8 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-blue-500" />
                        Mission Control
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI Pipeline Operations</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="px-3 py-2 space-y-1">
                {NAV_ITEMS.map((item) => {
                    // Exact match for Overview (/workstreams), partial match for others
                    const isActive = item.href === '/workstreams'
                        ? pathname === '/workstreams'
                        : pathname.startsWith(item.href);

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group",
                                    isActive
                                        ? "text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="workstream-nav-active"
                                        className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg -z-10"
                                    />
                                )}
                                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                                {item.label}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            {/* Active Tenants / Departments */}
            <div className="mt-6 px-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Tenants</h3>
                    <CreateTenantDialog onAdd={handleAddTenant} />
                </div>
                <div className="space-y-1">
                    {tenants.map((tenant) => (
                        <Link key={tenant.name} href={`/workstreams/tenant/${tenant.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                <div className={cn("h-2 w-2 rounded-full", tenant.color)} />
                                <span className="truncate group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{tenant.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-8 px-4 pb-6">
                <Link href="/workstreams/team-activity" className="block outline-none">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer shadow-sm">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Users className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Team Activity Log</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                </span>
                                4 agents running
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
