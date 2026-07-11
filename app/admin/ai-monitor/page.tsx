"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Database, DollarSign, Activity, AlertTriangle } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";

// Mock Data for Charts (Keep existing data)
const LATENCY_DATA = [
    { time: "00:00", openai: 450, deepseek: 320, mistral: 280 },
    { time: "04:00", openai: 480, deepseek: 340, mistral: 290 },
    { time: "08:00", openai: 620, deepseek: 450, mistral: 310 }, // Spike at peak
    { time: "12:00", openai: 580, deepseek: 410, mistral: 300 },
    { time: "16:00", openai: 500, deepseek: 380, mistral: 295 },
    { time: "20:00", openai: 460, deepseek: 330, mistral: 285 },
];

const COST_DATA = [
    { name: "Acme", cost: 124.50 },
    { name: "Cyberdyne", cost: 89.20 },
    { name: "Wayne Ent", cost: 245.00 },
    { name: "Umbrella", cost: 12.00 },
];

export default function AIMonitorPage() {
    return (
        <div className="space-y-6 text-slate-900 dark:text-slate-100">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                    AI/RAG Observability
                </h1>
                <p className="text-slate-500 dark:text-slate-400">Monitor vector indexing, LLM latency, and token consumption.</p>
            </div>

            {/* 1. High Level Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <GlassCard className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Vector DB Indexing</h3>
                        <Database className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">1.2M</div>
                        <p className="text-xs text-slate-500">
                            docs indexed (Pinecone)
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Indexing Latency (p99)</h3>
                        <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">840ms</div>
                        <p className="text-xs text-slate-500">
                            +120ms vs yesterday
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Est. Cost (Today)</h3>
                        <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">$428.50</div>
                        <p className="text-xs text-slate-500">
                            Projected $12,500 / month
                        </p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/10">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Token Suspicion</h3>
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-500">2 Events</div>
                        <p className="text-xs text-red-600/70 dark:text-red-400/70">
                            Potential infinite loop detected
                        </p>
                    </div>
                </GlassCard>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 2. Latency Chart */}
                <GlassCard variant="solid" className="p-6 col-span-1">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">LLM Provider Latency</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Response time in ms (6h window)</p>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={LATENCY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="openai" stroke="#10a37f" strokeWidth={2} name="OpenAI (GPT-4)" dot={false} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="deepseek" stroke="#3b82f6" strokeWidth={2} name="Deepseek v3" dot={false} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="mistral" stroke="#a855f7" strokeWidth={2} name="Mistral" dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* 3. Cost Chart */}
                <GlassCard variant="solid" className="p-6 col-span-1">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cost by Tenant (Top 4)</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Daily spend aggregation</p>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={COST_DATA} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} unit="$" tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fbbf24' }}
                                />
                                <Bar dataKey="cost" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* 4. Token Leak Detector */}
            <GlassCard variant="solid" className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Token Leak / Rapid Fire Patterns</h3>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20">Live Detection</Badge>
                </div>
                <div className="space-y-4">
                    <div className="p-4 border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 rounded-lg flex items-start gap-4">
                        <div className="bg-rose-100 dark:bg-rose-500/20 p-2 rounded-full">
                            <Activity className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-rose-700 dark:text-rose-200">Tenant: Umbrella Corp</h4>
                                <span className="text-xs text-rose-500 dark:text-rose-400/70">2 mins ago</span>
                            </div>
                            <p className="text-sm mt-1 text-rose-600 dark:text-rose-300">
                                Warning: Spike of <b>450 requests/min</b> on logic-chain workflow.
                                Typical baseline: 12 req/min.
                            </p>
                            <div className="mt-3 flex gap-2">
                                <Button size="sm" variant="destructive" className="h-7 text-xs bg-rose-600 hover:bg-rose-700 border-0">
                                    Block API Key
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-600 dark:text-rose-300 hover:text-rose-900 dark:hover:text-white hover:bg-rose-100 dark:hover:bg-rose-500/20">
                                    View Trace
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 rounded-lg flex items-center justify-center text-sm text-slate-500">
                        No other anomalies detected.
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
