'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low' | string;
  timestamp: string;
  type?: string;
}

interface LiveAlertsListProps {
  alerts?: AlertItem[];
}

export default function LiveAlertsList({ alerts = [] }: LiveAlertsListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-slate-100 dark:bg-slate-950/20 animate-pulse flex flex-col gap-3 py-2">
        <div className="h-10 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-[90%]" />
        <div className="h-10 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-[95%]" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-3">
          <Info className="h-6 w-6 text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">All systems compliant</p>
        <p className="text-xs text-slate-500 mt-1">No compliance violations or anomalies detected.</p>
      </div>
    );
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/30',
          text: 'text-red-900 dark:text-red-400',
          badgeBg: 'bg-red-100 dark:bg-red-500/20 text-red-900 dark:text-red-300',
          dot: 'bg-red-600 dark:bg-red-500',
          icon: <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />,
        };
      case 'medium':
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/30',
          text: 'text-amber-900 dark:text-amber-400',
          badgeBg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300',
          dot: 'bg-amber-600 dark:bg-amber-500',
          icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
        };
      case 'low':
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/30',
          text: 'text-blue-900 dark:text-sky-400',
          badgeBg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-900 dark:text-sky-300',
          dot: 'bg-blue-600 dark:bg-sky-500',
          icon: <Info className="h-4 w-4 text-blue-600 dark:text-sky-400" />,
        };
    }
  };

  return (
    <div className="space-y-3 max-h-full overflow-y-auto pr-1 no-scrollbar">
      {alerts.map((alert) => {
        const styles = getPriorityStyles(alert.priority);
        return (
          <div
            key={alert.id}
            className={`p-3 rounded-xl border transition-all duration-300 backdrop-blur-sm flex items-start gap-3 ${styles.bg}`}
          >
            {/* Status pulsing dot */}
            <span className="flex h-2 w-2 relative mt-1.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`}></span>
            </span>

            {/* Content info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${styles.text}`}>
                  {alert.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {alert.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                {alert.description}
              </p>
              {alert.type && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${styles.badgeBg}`}>
                    {alert.type}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
