'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface PerformanceDataPoint {
  date: string;
  latency: number;
}

interface PerformanceMiniChartProps {
  data?: PerformanceDataPoint[];
}


export default function PerformanceMiniChart({ data = [] }: PerformanceMiniChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-slate-100 dark:bg-slate-900/40 animate-pulse rounded-lg flex items-center justify-center">
        <span className="text-slate-500 text-xs">Loading performance data...</span>
      </div>
    );
  }

  const chartData = data;

  return (
    <div className="h-full w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: '#09090b',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '11px',
            }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [`${value.toFixed(1)} ms`, 'Latency']}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="#38bdf8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#latencyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
