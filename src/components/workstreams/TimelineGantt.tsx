'use client';

import { useState } from "react"
import { addDays, differenceInDays, format, isWithinInterval, startOfWeek, subDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, Calendar, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export type AgentTaskStatus = "pending" | "ingesting" | "processing" | "reviewing" | "completed" | "failed";

export type TimelineAgentTask = {
    id: string;
    name: string;
    status: AgentTaskStatus;
    startDate: Date;
    endDate: Date;
    progressPct: number; // 0 to 100
};

type TimelineGanttProps = {
    tasks: TimelineAgentTask[];
};

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

export function TimelineGantt({ tasks }: TimelineGanttProps) {
    const [rangeStart, setRangeStart] = useState<Date | null>(null)

    if (tasks.length === 0) {
        return (
            <section className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Pipelines Runtime</h2>
                </div>
                <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-[#0B1120]/40 backdrop-blur-sm text-sm text-slate-500 dark:text-slate-400">
                    <p>No active tasks in the current pipeline.</p>
                </div>
            </section>
        )
    }

    const today = new Date();

    // Calculate dynamic range based on data or default to current week
    const minDate = tasks.reduce((acc, t) => (t.startDate < acc ? t.startDate : acc), tasks[0].startDate)
    const maxDate = tasks.reduce((acc, t) => (t.endDate > acc ? t.endDate : acc), tasks[0].endDate)
    const minWeekStart = startOfWeek(minDate, { weekStartsOn: 1 })
    const maxWeekStart = startOfWeek(maxDate, { weekStartsOn: 1 })

    const effectiveRangeStart = rangeStart ?? startOfWeek(today, { weekStartsOn: 1 })
    const currentWeekStart = startOfWeek(effectiveRangeStart, { weekStartsOn: 1 })

    const clampToRange = (date: Date) => {
        // Allow browsing a bit past the min/max dates for UX padding
        const paddedMin = subDays(minWeekStart, 7);
        const paddedMax = addDays(maxWeekStart, 7);
        if (date.getTime() < paddedMin.getTime()) return paddedMin
        if (date.getTime() > paddedMax.getTime()) return paddedMax
        return date
    }

    const days = (() => {
        const start = startOfWeek(effectiveRangeStart, { weekStartsOn: 1 })
        return Array.from({ length: 7 }).map((_, i) => addDays(start, i))
    })()

    const monthLabel = format(days[0], "MMMM yyyy")

    const todayInRange = isWithinInterval(today, { start: days[0], end: addDays(days[days.length - 1], 1) })
    const todayIndex = todayInRange
        ? clamp(differenceInDays(today, days[0]), 0, days.length - 1)
        : -1;

    const handlePrevious = () => setRangeStart((prev) => clampToRange(addDays(prev ?? currentWeekStart, -7)))
    const handleNext = () => setRangeStart((prev) => clampToRange(addDays(prev ?? currentWeekStart, 7)))
    const handleToday = () => setRangeStart(startOfWeek(today, { weekStartsOn: 1 }))

    const rangeStartDate = days[0]
    const rangeEndDate = addDays(days[days.length - 1], 1)

    const hasTasksInRange = tasks.some((t) => t.startDate < rangeEndDate && t.endDate >= rangeStartDate)

    const getStatusColors = (status: AgentTaskStatus) => {
        switch (status) {
            case "ingesting":
            case "processing":
            case "reviewing":
                // Elysian Blue Gradient + Glow effect for active states
                return "bg-gradient-to-r from-blue-500/80 to-cyan-400/80 border-blue-400 dark:border-blue-500 shadow-[0_0_15px_rgba(56,189,248,0.4)] text-white";
            case "completed":
                return "bg-emerald-500/20 dark:bg-emerald-500/20 border-emerald-500/50 text-emerald-700 dark:text-emerald-300";
            case "failed":
                return "bg-red-500/20 dark:bg-red-500/20 border-red-500/50 text-red-700 dark:text-red-300";
            default:
                return "bg-slate-200/50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400";
        }
    }

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active Pipelines Runtime</h2>

                <div className="flex items-center gap-1 bg-white/40 dark:bg-slate-900/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-500" onClick={handlePrevious}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-sm" onClick={handleToday}>
                        Today
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-500" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-[#0B1120]/30 backdrop-blur-xl shadow-sm">
                <div className="w-full min-w-[600px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[200px_1fr] md:grid-cols-[240px_1fr]">
                        <div className="px-4 py-3 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 uppercase">
                            Pipeline Name
                        </div>
                        <div className="flex flex-col border-b border-slate-200/60 dark:border-slate-800/60">
                            <div className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-slate-900/30">
                                {monthLabel}
                            </div>
                            <div className="grid border-t border-slate-200/30 dark:border-slate-800/30" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(3rem, 1fr))` }}>
                                {days.map((d) => {
                                    const isToday = todayIndex === differenceInDays(d, days[0]);
                                    return (
                                        <div key={d.toISOString()} className={cn(
                                            "flex flex-col items-center justify-center py-2 text-[10px] leading-4 border-r border-slate-200/30 dark:border-slate-800/30 last:border-r-0",
                                            isToday ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400"
                                        )}>
                                            <span className="uppercase">{format(d, "EEE")}</span>
                                            <span className={cn("text-xs mt-0.5", isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300")}>{format(d, "d")}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-slate-200/60 dark:bg-slate-800/60" />

                    {/* Timeline Body */}
                    <div className="relative">
                        {/* Current Time Indicator Line */}
                        {todayIndex >= 0 && (
                            <div
                                className="absolute top-0 bottom-0 w-[2px] bg-blue-500/50 dark:bg-blue-400/50 z-20 pointer-events-none"
                                style={{ left: `calc(240px + ${(todayIndex / days.length) * 100}% + ${100 / days.length / 2}%)`, boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}
                                aria-hidden="true"
                            >
                                <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                            </div>
                        )}

                        {!hasTasksInRange && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-[#0B1120]/50 backdrop-blur-sm min-h-[100px]">
                                <div className="rounded-lg bg-white dark:bg-slate-900 px-4 py-2 text-xs text-slate-500 shadow-sm border border-slate-200 dark:border-slate-800">
                                    No tasks running in this timeframe
                                </div>
                            </div>
                        )}

                        {tasks.map((t, rowIdx) => {
                            const startOffset = differenceInDays(t.startDate, days[0]);
                            const endOffset = differenceInDays(t.endDate, days[0]);

                            const totalDays = days.length;
                            const leftPct = clamp((startOffset / totalDays) * 100, 0, 100);
                            const rightPct = clamp((endOffset / totalDays) * 100, 0, 100);
                            const minWidthPct = (1 / totalDays) * 100;
                            const widthPct = clamp(rightPct - leftPct + minWidthPct, minWidthPct, 100);

                            const isActive = ["ingesting", "processing", "reviewing"].includes(t.status);

                            return (
                                <div key={t.id} className="grid grid-cols-[200px_1fr] md:grid-cols-[240px_1fr] group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <div className="px-4 py-4 text-xs font-medium text-slate-700 dark:text-slate-200 border-r border-slate-200/60 dark:border-slate-800/60 truncate flex items-center gap-2">
                                        <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isActive ? "bg-blue-500 animate-pulse" : "bg-slate-300 dark:bg-slate-600")} />
                                        <span className="truncate">{t.name}</span>
                                    </div>
                                    <div className="relative px-0 py-2">
                                        {/* Background Grid Lines */}
                                        <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(3rem, 1fr))` }}>
                                            {Array.from({ length: days.length }).map((_, i) => (
                                                <div key={i} className="border-r border-slate-200/20 dark:border-slate-800/30 last:border-r-0" />
                                            ))}
                                        </div>

                                        {/* Gantt Bar with Smooth Linear CSS Transisions for Progress */}
                                        <div
                                            className={cn(
                                                "absolute top-1/2 -translate-y-1/2 h-8 rounded-lg border px-3 flex items-center overflow-hidden transition-all duration-700 ease-linear",
                                                getStatusColors(t.status)
                                            )}
                                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                                            title={`${t.name} - ${Math.round(t.progressPct)}%`}
                                        >
                                            <span className="relative z-10 text-[11px] font-semibold truncate mix-blend-plus-lighter">{t.name}</span>

                                            {/* Progress Fill Background (Smooth CSS Transition) */}
                                            {isActive && (
                                                <div
                                                    className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-1000 ease-linear"
                                                    style={{ width: `${t.progressPct}%` }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {rowIdx < tasks.length - 1 ? <Separator className="col-span-2 bg-slate-200/40 dark:bg-slate-800/40" /> : null}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
