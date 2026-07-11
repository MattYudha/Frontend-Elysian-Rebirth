'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrendingUp, ShieldCheck, Cpu, Banknote } from 'lucide-react';

interface MetricStatCardProps {
  title: string;
  value: string;
  change: string;
  type?: 'docs' | 'compliance' | 'workers' | 'savings' | string;
}

export default function MetricStatCard({ title, value, change, type }: MetricStatCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'docs':
        return <TrendingUp className="h-5 w-5 text-sky-400" />;
      case 'compliance':
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      case 'workers':
        return <Cpu className="h-5 w-5 text-purple-400" />;
      case 'savings':
        return <Banknote className="h-5 w-5 text-amber-400" />;
      default:
        return null;
    }
  };

  const getChangeStyles = () => {
    if (change.includes('+') || change.includes('Secured') || change.includes('Prevented') || change.includes('Parallel')) {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    return 'text-slate-500 dark:text-slate-400';
  };

  return (
    <GlassCard className="relative overflow-hidden p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/70 dark:bg-[#0B1120]/60 border border-slate-200/60 dark:border-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
      {/* Light Mode Cloud Accent */}
      <div className="absolute inset-0 bg-[url('/assets/images/elysian_clouds.png')] bg-cover bg-center opacity-[0.15] dark:hidden pointer-events-none mix-blend-multiply" />
      
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 shrink-0">
          {getIcon()}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          {value}
        </h3>
        <p className={`text-xs font-medium ${getChangeStyles()}`}>
          {change}
        </p>
      </div>
    </GlassCard>
  );
}
