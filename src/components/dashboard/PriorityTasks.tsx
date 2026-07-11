'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Calendar, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
    id: string;
    type: 'pipeline' | 'knowledge' | 'chat' | 'system';
    title: string;
    description: string;
    timestamp: string;
    status?: string;       // e.g. "3/4 completed"
    progress?: number;     // 0-100
}

export interface PriorityTasksProps {
    activities: ActivityItem[];
    isLoading: boolean;
}

function CircularProgress({ percentage, color }: { percentage: number; color: string }) {
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                />
                <circle
                    cx="12"
                    cy="12"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={cn(color, "transition-all duration-500")}
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

export function PriorityTasks({ activities, isLoading }: PriorityTasksProps) {
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <div className="space-y-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Fallback/Mock Data if empty
    const displayItems = activities.length > 0 ? activities.map(a => ({
        ...a,
        progress: a.type === 'pipeline' ? 75 : a.type === 'knowledge' ? 100 : 25,
        color: a.type === 'pipeline' ? 'text-blue-500' : a.type === 'knowledge' ? 'text-cyan-500' : 'text-sky-400'
    })) : [
        {
            id: '1',
            title: 'Follow-ups',
            description: 'AI reminders for client follow-ups and check-ins.',
            timestamp: 'Apr 1',
            status: '3/4 completed',
            progress: 75,
            color: 'text-blue-500'
        },
        {
            id: '2',
            title: 'Contract Review',
            description: 'AI review and approval of contracts.',
            timestamp: 'Apr 1',
            status: '1/2 completed',
            progress: 50,
            color: 'text-sky-400'
        },
        {
            id: '3',
            title: 'Invoices',
            description: 'Notify customers about payment.',
            timestamp: 'Apr 2',
            status: '1/5 paid',
            progress: 20,
            color: 'text-indigo-400'
        },
        {
            id: '4',
            title: 'View new offers',
            description: 'A quick response to an offer increases trust.',
            timestamp: 'Apr 2',
            status: '3/4 paid',
            progress: 75,
            color: 'text-blue-600'
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Priority tasks</h3>
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                    See all
                </button>
            </div>

            <div className="space-y-8">
                {displayItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 group cursor-pointer">
                        {/* Circular Progress */}
                        <div className="flex-shrink-0 mt-1">
                            <CircularProgress percentage={item.progress || 0} color={item.color || 'text-blue-500'} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{item.timestamp}</span>
                                </div>
                                {item.status && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Sun className="w-3.5 h-3.5" />
                                        <span>{item.status}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                                {item.description}
                            </p>
                        </div>

                        {/* Action */}
                        <div className="flex-shrink-0 self-center hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
