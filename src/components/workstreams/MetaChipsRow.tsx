import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

import { TrendingUp, TrendingDown } from "lucide-react";

export type MetaChip = {
    label?: string;
    value: string | ReactNode;
    icon?: ReactNode;
    trend?: {
        text: string;
        direction: 'up' | 'down';
    };
};

type MetaChipsRowProps = {
    items: MetaChip[];
    className?: string;
};

// Use React.memo to prevent re-renders when tokens tick up quickly
export const MetaChipsRow = React.memo(function MetaChipsRow({ items, className }: MetaChipsRowProps) {
    return (
        <div className={cn("flex flex-wrap items-center gap-3", className)}>
            {items.map((item, idx) => (
                <div key={`${item.label || 'chip'}-${idx}`} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/60 dark:bg-[#0B1120]/80 border border-slate-200/50 dark:border-slate-800/60 backdrop-blur-md shadow-sm transition-all hover:bg-white/80 dark:hover:bg-[#0B1120] hover:shadow-md">
                        {item.icon ? <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">{item.icon}</span> : null}
                        <div className="flex flex-col">
                            {item.label && <span className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-0.5">{item.label}</span>}
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-none">
                                    {item.value}
                                </span>
                                {item.trend && (
                                    <span className={cn(
                                        "flex items-center gap-0.5 text-[10px] font-semibold px-1 py-0.5 rounded-md",
                                        item.trend.direction === 'up'
                                            ? "text-emerald-700 bg-emerald-100/50 dark:text-emerald-400 dark:bg-emerald-950/30"
                                            : "text-amber-700 bg-amber-100/50 dark:text-amber-400 dark:bg-amber-950/30"
                                    )}>
                                        {item.trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {item.trend.text}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});
