import type { PipelineStats } from '@/lib/sdk/schemas';
import { Activity, CircleDashed, CheckCircle2, TrendingUp } from 'lucide-react';
import React from 'react';

interface WorkloadHubProps {
    stats: PipelineStats;
}

export const WorkloadHub: React.FC<WorkloadHubProps> = ({ stats }) => {
    // Helpers for sparklines (simulated)
    const Sparkline = ({ type }: { type: 'up' | 'down' | 'flat' }) => {
        const color = type === 'up' ? 'text-emerald-500' : type === 'down' ? 'text-amber-500' : 'text-slate-300';
        const Path = type === 'up'
            ? <path d="M0 20 L 10 20 L 20 10 L 30 15 L 40 5" stroke="currentColor" strokeWidth="2" fill="none" />
            : type === 'down'
                ? <path d="M0 5 L 10 5 L 20 15 L 30 10 L 40 20" stroke="currentColor" strokeWidth="2" fill="none" />
                : <path d="M0 12 L 40 12" stroke="currentColor" strokeWidth="2" fill="none" />;

        return (
            <svg width="40" height="25" className={color} viewBox="0 0 40 25">
                {Path}
            </svg>
        );
    };

    interface StatTileProps {
        label: string;
        value: string | number;
        subtext?: string;
        icon: React.ElementType;
        colorClass: string;
        trend: 'up' | 'down' | 'flat';
    }

    const StatTile = ({ label, value, subtext, icon: Icon, colorClass, trend }: StatTileProps) => (
        <div className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full group">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <Sparkline type={trend} />
            </div>

            <div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">{value}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                    {subtext && <span className="text-[10px] text-slate-400 font-medium">{subtext}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatTile
                label="Antrian"
                value={stats.activeQueue}
                subtext="+12 last hr"
                icon={CircleDashed}
                colorClass="bg-amber-500 text-amber-600"
                trend="up"
            />
            <StatTile
                label="Kecepatan"
                value={stats.processingSpeed}
                subtext="docs / mnt"
                icon={Activity}
                colorClass="bg-blue-500 text-blue-600"
                trend="flat"
            />
            <StatTile
                label="Akurasi"
                value={`${stats.accuracy}%`}
                subtext="Target: 99%"
                icon={CheckCircle2}
                colorClass="bg-emerald-500 text-emerald-600"
                trend="up"
            />
            <StatTile
                label="Kanal Aktif"
                value={Object.values(stats.channelHealth).filter(s => s === 'healthy').length}
                subtext="All systems go"
                icon={TrendingUp}
                colorClass="bg-indigo-500 text-indigo-600"
                trend="flat"
            />
        </div>
    );
};
