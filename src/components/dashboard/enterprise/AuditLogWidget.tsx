'use client';

import { Shield, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AuditLog } from '@/types/api-responses';

interface AuditLogWidgetProps {
    logs: AuditLog[];
    isLoading?: boolean;
}

export function AuditLogWidget({ logs, isLoading }: AuditLogWidgetProps) {
    if (isLoading) {
        return <Skeleton className="h-[400px] w-full rounded-2xl" />;
    }

    const isEmpty = !logs || logs.length === 0;

    return (
        <div className="rounded-2xl shadow-sm overflow-hidden flex flex-col h-full max-h-[500px] glass-obsidian">
            <div className="border-b border-slate-100 dark:border-slate-800/50 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    Security Audit
                </h3>
            </div>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center flex-1 py-10 px-6 gap-4">
                    {/* Animated shield icon */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute h-16 w-16 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center border border-emerald-500/30">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All Clear — No Events</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                            Security audit events will be recorded here as your team takes actions
                        </p>
                    </div>

                    {/* Placeholder rows */}
                    <div className="w-full space-y-2 mt-1">
                        {[80, 65, 72].map((w, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
                                <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 animate-pulse" />
                                <div className="flex-1 space-y-1.5">
                                    <div className={`h-2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse`} style={{ width: `${w}%` }} />
                                    <div className="h-1.5 w-2/5 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1">
                        Monitoring active · Waiting for events
                    </span>
                </div>
            ) : (
                <div className="overflow-y-auto p-0">
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {logs.map((log) => (
                            <li key={log.id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-start gap-3">
                                    {/* Avatar / Status Indicator */}
                                    <div className="relative shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                            {log.user.avatar ? (
                                                <img src={log.user.avatar} alt={log.user.name} className="h-full w-full rounded-full" />
                                            ) : (
                                                log.user.name.charAt(0)
                                            )}
                                        </div>
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#0B1120] flex items-center justify-center",
                                            log.status === 'success' ? "bg-emerald-500" : "bg-rose-500"
                                        )}>
                                            {log.status === 'success' ? (
                                                <CheckCircle className="h-2 w-2 text-white" />
                                            ) : (
                                                <AlertTriangle className="h-2 w-2 text-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-50 truncate">
                                                {log.action}
                                            </p>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            by <span className="font-medium text-slate-700 dark:text-slate-300">{log.user.name}</span>
                                        </p>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 font-mono border border-slate-200 dark:border-slate-700">
                                                {log.target}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="border-t border-slate-100 dark:border-slate-800/50 p-3 bg-slate-50/30 dark:bg-slate-900/30 text-center">
                <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">
                    View Full Audit Log
                </button>
            </div>
        </div>
    );
}
