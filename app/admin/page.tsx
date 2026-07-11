"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Activity, AlertTriangle, CloudLightning, Users, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const SPARKLINE_DATA = [
    { v: 10 }, { v: 15 }, { v: 35 }, { v: 20 }, { v: 45 }, { v: 50 }, { v: 80 }
];

const TRAFFIC_DATA = [
    { time: '00:00', val: 400 }, { time: '04:00', val: 300 }, { time: '08:00', val: 1200 },
    { time: '12:00', val: 1500 }, { time: '16:00', val: 1100 }, { time: '20:00', val: 800 },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        System Overwatch
                        <span className="relative flex h-2 w-2 ml-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time telemetry and anomaly detection.</p>
                </div>
                <div className="p-2 px-3 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-2 shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <AlertTriangle className="h-3 w-3" />
                    <span>High Load: US-East Region</span>
                </div>
            </div>

            {/* Hero Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Active Tenants */}
                <GlassCard className="p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                            +12 <ArrowUpRight className="h-3 w-3 ml-1" />
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">1,248</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Active Tenants</p>
                    </div>
                </GlassCard>

                {/* Card 2: Error Rate */}
                <GlassCard className="p-6 relative group overflow-hidden border-rose-200 dark:border-rose-500/20">
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/10 dark:bg-rose-500/20 blur-2xl rounded-full group-hover:bg-rose-500/20 dark:group-hover:bg-rose-500/30 transition-colors"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-rose-50 dark:bg-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/20">
                            +0.01%
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-rose-600 dark:text-rose-500 tracking-tight">0.04%</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Global Error Rate</p>
                    </div>
                </GlassCard>

                {/* Card 3: Latency */}
                <GlassCard className="p-0 relative overflow-hidden flex flex-col justify-between">
                    <div className="p-6 pb-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <CloudLightning className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">142ms</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">API Latency (p95)</p>
                    </div>
                    <div className="h-16 w-full opacity-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SPARKLINE_DATA}>
                                <defs>
                                    <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} fill="url(#latencyGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Card 4: Tokens */}
                <GlassCard className="p-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CloudLightning className="w-24 h-24 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                            24h
                        </span>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">4.2M</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Tokens Generated</p>
                    </div>
                </GlassCard>
            </div>

            {/* Main Chart Section */}
            <div className="grid gap-6 md:grid-cols-3 h-[400px]">
                <GlassCard className="md:col-span-2 p-6 flex flex-col" variant="transparent">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Live Traffic Topology</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Requests per second (Global)</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-xs text-blue-500 dark:text-blue-400">Live Stream</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TRAFFIC_DATA}>
                                <defs>
                                    <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fill="url(#trafficGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-0 flex flex-col transition-colors duration-300 bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800" variant="solid">
                    <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Security Events</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-auto">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-3 text-sm border-b border-slate-100 dark:border-white/5 pb-3 last:border-0 last:pb-0">
                                <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-rose-500"></div>
                                <div>
                                    <p className="text-slate-800 dark:text-slate-200 font-medium">Suspicious Login Attempt</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">IP 192.168.1.{i}4 • Jakarta</p>
                                </div>
                                <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-600 whitespace-nowrap">2m ago</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
