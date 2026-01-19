import React from 'react';
import { FileText, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export interface StatData {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
    suffix?: string;
    prefix?: string; // Kept for compatibility but not strictly used in new design if icon passes directly
    valueStyle?: React.CSSProperties;
}

export interface QuickStatsProps {
    stats?: StatData[];
    className?: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats: _stats, className }) => {
    const defaultStats = [
        {
            title: 'Docs Indexed',
            value: '1,234',
            icon: <FileText className="w-5 h-5 text-blue-500" />,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        {
            title: 'API Calls',
            value: '45.6k',
            icon: <Zap className="w-5 h-5 text-amber-500" />,
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-100'
        },
        {
            title: 'Error Rate',
            value: '0.12%',
            icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-100'
        },
        {
            title: 'Success',
            value: '99.8%',
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-100'
        },
    ];

    return (
        <div className={`grid grid-cols-2 gap-3 ${className}`}>
            {defaultStats.map((stat, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${stat.borderColor} ${stat.bgColor} shadow-sm transition-transform hover:scale-105`}
                >
                    <div className="mb-2 p-2 rounded-full bg-white/60 shadow-sm">
                        {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                        {stat.value}
                    </div>
                    <div className="text-xs font-medium text-slate-500 text-center">
                        {stat.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

QuickStats.displayName = 'QuickStats';
