'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, ShieldAlert, Cpu, Database, AlertCircle, Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type ActivityType = 'success' | 'warning' | 'error' | 'processing' | 'info';

interface ActivityLog {
    id: string;
    agentName: string;
    agentAvatar?: string;
    action: string;
    target: string;
    type: ActivityType;
    timestamp: Date;
    metadata?: string;
}

// Generate a large set of mock logs to test performance
const generateMockLogs = (count: number): ActivityLog[] => {
    const agents = [
        { name: 'Data Crawler Alpha', avatar: '' },
        { name: 'Semantic Indexer', avatar: '' },
        { name: 'Summary Engine v2', avatar: '' },
        { name: 'Policy Reviewer', avatar: '' }
    ];

    const actions = [
        { type: 'success' as const, action: 'Successfully ingested', targets: ['150 PDFs', 'User Database', 'API Schema'] },
        { type: 'processing' as const, action: 'Started processing', targets: ['Invoice #4920', 'Marketing Copy', 'Medical Records'] },
        { type: 'warning' as const, action: 'Rate limited by', targets: ['External API (Stripe)', 'GitHub API', 'OpenAI Endpoint'] },
        { type: 'error' as const, action: 'Failed to access', targets: ['Private S3 Bucket', 'Legacy Database', 'Corrupted File'] },
        { type: 'info' as const, action: 'Scaled up compute for', targets: ['Heavy Workload', 'Batch Processing', 'Model Fine-tuning'] }
    ];

    const logs: ActivityLog[] = [];
    let currentTime = new Date();

    for (let i = 0; i < count; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const act = actions[Math.floor(Math.random() * actions.length)];
        const target = act.targets[Math.floor(Math.random() * act.targets.length)];

        // Subtract between 1 to 15 minutes for each subsequent log to create a timeline
        currentTime = new Date(currentTime.getTime() - Math.floor(Math.random() * 15 * 60000));

        logs.push({
            id: `log-${i}-${Date.now()}`,
            agentName: agent.name,
            agentAvatar: agent.avatar,
            action: act.action,
            target: target,
            type: act.type,
            timestamp: currentTime,
            metadata: Math.random() > 0.7 ? `Latency: ${Math.floor(Math.random() * 800)}ms` : undefined
        });
    }

    return logs;
};

const TypeIcon = ({ type }: { type: ActivityType }) => {
    switch (type) {
        case 'success': return <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 className="h-3.5 w-3.5" /></div>;
        case 'error': return <div className="h-6 w-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500"><AlertCircle className="h-3.5 w-3.5" /></div>;
        case 'warning': return <div className="h-6 w-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500"><ShieldAlert className="h-3.5 w-3.5" /></div>;
        case 'processing': return <div className="h-6 w-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500"><Cpu className="h-3.5 w-3.5" /></div>;
        default: return <div className="h-6 w-6 rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-500"><Database className="h-3.5 w-3.5" /></div>;
    }
};

const ITEMS_PER_PAGE = 20;

export function TeamActivityFeed() {
    // Generate 500 logs to simulate a heavy component
    const allLogs = useMemo(() => generateMockLogs(500), []);

    // Pagination State
    const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const visibleLogs = useMemo(() => {
        return allLogs.slice(0, displayedCount);
    }, [allLogs, displayedCount]);

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Fake latency for the "load more" effect
        setTimeout(() => {
            setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, allLogs.length));
            setIsLoadingMore(false);
        }, 600);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Play className="h-5 w-5 text-blue-500" />
                        Live Agent Activity
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Real-time audit log of all operations performed by active AI pipelines.
                    </p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live Tracking
                </div>
            </div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800/60" />

                <div className="space-y-6 relative z-10">
                    <AnimatePresence>
                        {visibleLogs.map((log, index) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index % ITEMS_PER_PAGE * 0.05 }}
                                className="flex gap-4 group"
                            >
                                {/* Timeline Node */}
                                <div className="relative z-10 mt-1">
                                    <TypeIcon type={log.type} />
                                </div>

                                {/* Log Content Card */}
                                <div className="flex-1 rounded-xl p-4 bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-5 w-5 border border-slate-200 dark:border-slate-700">
                                                <AvatarFallback className="text-[9px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                    {log.agentName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                {log.agentName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                        {log.action} <span className="font-semibold text-slate-900 dark:text-white">{log.target}</span>
                                    </div>

                                    {log.metadata && (
                                        <div className="mt-2.5 inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                            {log.metadata}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {displayedCount < allLogs.length && (
                    <div className="flex justify-center mt-8 relative z-10">
                        <Button
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="bg-white dark:bg-[#0B1120] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Loading older logs...
                                </>
                            ) : (
                                'Load More Activity'
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
