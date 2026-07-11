import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User, Folder, CheckCircle2, Clock, Inbox, CircleDashed } from 'lucide-react';
import { motion } from 'framer-motion';

export type WorkstreamStatus = 'active' | 'completed' | 'planned' | 'backlog';
export type WorkstreamPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkstreamCardProps {
    id: string;
    title: string;
    tenant: string;
    projectType?: string;
    duration: string;
    startDate: string;
    status: WorkstreamStatus;
    priority: WorkstreamPriority;
    progress: number;
    tasksCompleted: number;
    tasksTotal: number;
    assignees: { id: string; name: string; avatar?: string }[];
}

const statusConfig = {
    active: { icon: CircleDashed, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/20' },
    completed: { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/20' },
    planned: { icon: Calendar, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-500/20' },
    backlog: { icon: Inbox, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-500/20' },
};

const priorityBars = {
    low: [true, false, false],
    medium: [true, true, false],
    high: [true, true, true],
    urgent: [true, true, true], // Same visual bars as high, but might add a color tint later
};

import Link from 'next/link';

export const WorkstreamCard = React.memo(({
    id,
    title,
    tenant,
    projectType,
    duration,
    startDate,
    status,
    priority,
    progress,
    tasksCompleted,
    tasksTotal,
    assignees
}: WorkstreamCardProps) => {
    const config = statusConfig[status];

    return (
        <Link href={`/workstreams/${id}`} className="block outline-none">
            <motion.div
                whileHover={{ y: -2 }}
                className="group relative flex flex-col p-4 rounded-xl h-full bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-sm dark:shadow-none"
            >
                {/* Top Row: Folder Icon & Status Badge */}
                <div className="flex items-center justify-between mb-3">
                    <Folder className="h-5 w-5 text-slate-400/80 group-hover:text-blue-400 transition-colors duration-300" />
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", config.bg, config.color, config.border)}>
                        <div className={cn("h-1.5 w-1.5 rounded-full bg-current", status === 'active' && "animate-pulse")} />
                        <span className="capitalize">{status}</span>
                    </div>
                </div>

                {/* Title & Tenant Info */}
                <div className="flex-1 mb-5">
                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-1.5 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        {title}
                    </h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>{tenant}</span>
                        <span className="text-slate-600">•</span>
                        {projectType && (
                            <>
                                <span>{projectType}</span>
                                <span className="text-slate-600">•</span>
                            </>
                        )}
                        <span>{duration}</span>
                    </p>
                </div>

                {/* Start Date & Priority */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{startDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                            {priorityBars[priority].map((isActive, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "h-2 w-1 rounded-sm",
                                        isActive ? "bg-slate-400" : "bg-slate-700",
                                        priority === 'urgent' && isActive && "bg-amber-500"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="capitalize">{priority}</span>
                    </div>
                </div>

                {/* Progress & Assignees */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                        {/* Minimal Circular Progress mimicking reference */}
                        <div className="relative flex items-center justify-center h-8 w-8">
                            <svg className="h-8 w-8 -rotate-90 transform" viewBox="0 0 36 36">
                                <circle
                                    cx="18" cy="18" r="15"
                                    className="fill-none stroke-slate-200 dark:stroke-slate-800"
                                    strokeWidth="3"
                                />
                                <circle
                                    cx="18" cy="18" r="15"
                                    className={cn("fill-none stroke-current", status === 'completed' ? 'text-blue-500' : 'text-slate-400 dark:text-slate-300')}
                                    strokeWidth="3"
                                    strokeDasharray="100"
                                    strokeDashoffset={100 - progress}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-[9px] font-bold text-slate-600 dark:text-slate-300">{progress}%</span>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Inbox className="h-3.5 w-3.5" />
                            <span>{tasksCompleted} / {tasksTotal} Tasks</span>
                        </div>
                    </div>

                    {/* Avatar Group */}
                    <div className="flex -space-x-2">
                        {assignees.slice(0, 3).map((assignee, i) => (
                            <Avatar key={assignee.id} className="h-6 w-6 border border-white dark:border-slate-800 shadow-sm relative z-0 hover:z-10 hover:scale-110 transition-transform">
                                {assignee.avatar ? (
                                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500/50 to-cyan-500/50 text-[10px] text-white">
                                        {assignee.name.charAt(0)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        ))}
                        {assignees.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 font-medium z-0">
                                +{assignees.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
});

WorkstreamCard.displayName = 'WorkstreamCard';
