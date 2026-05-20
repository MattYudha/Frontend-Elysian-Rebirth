"use client";

import { useState } from "react"
import { addDays, differenceInDays, format, isWithinInterval, startOfWeek } from "date-fns"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, GitBranch, Rocket, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export interface TimelineTask {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
}

type TimelineGanttProps = {
    tasks: TimelineTask[];
    onTaskClick?: (taskId: string) => void;
    isLoading?: boolean;
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n))
}

const STATUS_STYLES: Record<string, { bar: string; dot: string }> = {
    processing: { bar: "from-blue-500 to-cyan-400", dot: "bg-blue-500" },
    completed:  { bar: "from-emerald-500 to-teal-400", dot: "bg-emerald-500" },
    failed:     { bar: "from-rose-500 to-rose-400", dot: "bg-rose-500" },
    queued:     { bar: "from-amber-400 to-orange-400", dot: "bg-amber-400" },
    draft:      { bar: "from-slate-400 to-slate-500", dot: "bg-slate-400" },
};

function getStatusStyle(status: string) {
    return STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.draft;
}

// ─────────────────────── Empty State ───────────────────────
function TimelineEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 gap-5">
            {/* Animated illustration */}
            <div className="relative flex items-center justify-center">
                {/* Outer glow ring */}
                <div className="absolute h-24 w-24 rounded-full bg-blue-500/8 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute h-16 w-16 rounded-full bg-blue-500/10 border border-blue-500/20" />
                {/* Icon */}
                <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/15 to-blue-500/10 flex items-center justify-center border border-blue-500/25 shadow-inner">
                    <GitBranch className="h-6 w-6 text-blue-400" />
                </div>
            </div>

            {/* Text */}
            <div className="text-center max-w-xs">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No Pipelines Yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Build your first workflow to see executions plotted here on the timeline in real time.
                </p>
            </div>

            {/* Ghost bars — visual preview */}
            <div className="w-full max-w-lg space-y-2.5 mt-1">
                {[
                    { w: "60%", left: "0%", label: "Data Ingestion" },
                    { w: "35%", left: "25%", label: "Model Training" },
                    { w: "50%", left: "10%", label: "RAG Pipeline" },
                ].map(({ w, left, label }) => (
                    <div key={label} className="grid grid-cols-[120px_1fr] gap-3 items-center opacity-30">
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate text-right font-medium">{label}</span>
                        <div className="relative h-6 rounded bg-slate-100 dark:bg-slate-800/80">
                            <div
                                className="absolute h-full rounded bg-gradient-to-r from-blue-400/60 to-cyan-400/60"
                                style={{ left, width: w }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <a
                href="/workflow"
                className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-sm shadow-blue-500/30 transition-all hover:shadow-md hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
                <Rocket className="h-3.5 w-3.5" />
                Create Your First Pipeline
                <ArrowRight className="h-3.5 w-3.5" />
            </a>
        </div>
    );
}

// ─────────────────────── Loading State ───────────────────────
function TimelineLoadingState() {
    return (
        <div className="p-4 space-y-3">
            <Skeleton className="h-10 w-full rounded-lg" />
            {[...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-[180px_1fr] gap-2">
                    <Skeleton className="h-9 rounded-lg" />
                    <Skeleton className="h-9 rounded-lg" style={{ opacity: 1 - i * 0.15 }} />
                </div>
            ))}
        </div>
    );
}

// ─────────────────────── Main Component ───────────────────────
export function TimelineGantt({ tasks, onTaskClick, isLoading }: TimelineGanttProps) {
    const [rangeStart, setRangeStart] = useState<Date | null>(null)
    const [viewMode, setViewMode] = useState<"week" | "month">("week")

    const today = new Date()

    const minDate = tasks.length > 0 ? tasks.reduce((acc, t) => (t.startDate < acc ? t.startDate : acc), tasks[0].startDate) : today
    const maxDate = tasks.length > 0 ? tasks.reduce((acc, t) => (t.endDate > acc ? t.endDate : acc), tasks[0].endDate) : today
    const minWeekStart = startOfWeek(minDate, { weekStartsOn: 1 })
    const maxWeekStart = startOfWeek(maxDate, { weekStartsOn: 1 })

    const effectiveRangeStart = rangeStart ?? startOfWeek(today, { weekStartsOn: 1 })
    const currentWeekStart = startOfWeek(effectiveRangeStart, { weekStartsOn: 1 })

    const clampToRange = (date: Date) => {
        if (tasks.length === 0) return date
        if (date.getTime() < minWeekStart.getTime()) return minWeekStart
        if (date.getTime() > maxWeekStart.getTime()) return maxWeekStart
        return date
    }

    const daysLength = viewMode === "week" ? 7 : 30;
    const days = (() => {
        const start = startOfWeek(effectiveRangeStart, { weekStartsOn: 1 })
        return Array.from({ length: daysLength }).map((_, i) => addDays(start, i))
    })()

    const monthLabel = format(days[0], "MMMM yyyy")

    const todayInRange = isWithinInterval(today, { start: days[0], end: addDays(days[days.length - 1], 1) })
    const todayIndex = todayInRange
        ? clamp(differenceInDays(today, days[0]), 0, days.length - 1)
        : -1

    const handlePrevious = () => {
        setRangeStart((prev) => {
            const base = prev ?? startOfWeek(today, { weekStartsOn: 1 })
            return clampToRange(addDays(base, -daysLength))
        })
    }

    const handleNext = () => {
        setRangeStart((prev) => {
            const base = prev ?? startOfWeek(today, { weekStartsOn: 1 })
            return clampToRange(addDays(base, daysLength))
        })
    }

    const handleToday = () => {
        setRangeStart(startOfWeek(today, { weekStartsOn: 1 }))
    }

    const rangeStartDate = days[0]
    const rangeEndDate = addDays(days[days.length - 1], 1)
    const hasTasksInRange = tasks.some((t) => t.startDate < rangeEndDate && t.endDate >= rangeStartDate)

    const canGoPrevious = tasks.length > 0 && currentWeekStart.getTime() > minWeekStart.getTime()
    const canGoNext = tasks.length > 0 && currentWeekStart.getTime() < maxWeekStart.getTime()

    return (
        <section>
            {/* ── Section Title ── */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-base font-semibold text-slate-800 dark:text-slate-50 flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-400" />
                    Pipeline Timeline
                </h2>
                {tasks.length > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-full font-medium">
                        {tasks.length} pipeline{tasks.length > 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className="rounded-2xl shadow-sm overflow-hidden glass-obsidian">
                {/* ── Loading ── */}
                {isLoading && <TimelineLoadingState />}

                {/* ── Empty (no pipelines at all) ── */}
                {!isLoading && tasks.length === 0 && <TimelineEmptyState />}

                {/* ── Content ── */}
                {!isLoading && tasks.length > 0 && (
                    <div className="w-full min-w-[640px] overflow-x-auto">
                        {/* Header Row */}
                        <div className="grid grid-cols-[200px_1fr] border-b border-blue-100/50 dark:border-blue-900/30">
                            {/* Left: label */}
                            <div className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-r border-blue-100/50 dark:border-blue-900/30 bg-white/30 dark:bg-slate-900/40 flex items-center">
                                Pipeline
                            </div>
                            {/* Right: nav controls */}
                            <div className="px-4 py-2 bg-white/30 dark:bg-slate-900/40 flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 min-w-[80px]">{monthLabel}</span>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                        onClick={handlePrevious}
                                        disabled={!canGoPrevious}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-3 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium"
                                        onClick={handleToday}
                                    >
                                        Today
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                        onClick={handleNext}
                                        disabled={!canGoNext}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

                                    <Select value={viewMode} onValueChange={(v: "week" | "month") => setViewMode(v)}>
                                        <SelectTrigger className="h-8 text-xs border-blue-100/50 dark:border-blue-900/30 bg-white/60 dark:bg-slate-800/60 w-[90px] text-slate-700 dark:text-slate-200 rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="week">1 Week</SelectItem>
                                            <SelectItem value="month">1 Month</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                                                <Calendar className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <CalendarUI
                                                mode="single"
                                                selected={effectiveRangeStart}
                                                onSelect={(date) => {
                                                    if (date) setRangeStart(startOfWeek(date, { weekStartsOn: 1 }))
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        {/* Day labels */}
                        <div className="grid grid-cols-[200px_1fr] border-b border-blue-100/30 dark:border-blue-900/20 bg-white/10 dark:bg-slate-900/20">
                            <div className="border-r border-blue-100/50 dark:border-blue-900/30" />
                            <div
                                className="grid px-4 py-1.5 gap-0"
                                style={{ gridTemplateColumns: `repeat(${days.length}, minmax(2.5rem, 1fr))` }}
                            >
                                {days.map((d) => {
                                    const isToday = format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                                    return (
                                        <div key={d.toISOString()} className="flex flex-col items-center text-[10px] leading-tight">
                                            <span className={cn("font-medium", isToday ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500")}>
                                                {format(d, "EEE")}
                                            </span>
                                            <span className={cn(
                                                "text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full",
                                                isToday
                                                    ? "bg-cyan-500 text-white"
                                                    : "text-slate-700 dark:text-slate-300"
                                            )}>
                                                {format(d, "d")}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Task rows */}
                        <div className="relative">
                            {/* Today vertical line */}
                            {todayIndex >= 0 && (
                                <div
                                    className="absolute top-0 bottom-0 w-[2px] bg-cyan-400/70 dark:bg-cyan-500/70 z-20 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                                    style={{ left: `calc(200px + 1rem + (${todayIndex + 0.5} / ${days.length}) * (100% - 200px - 2rem))` }}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Empty view (no tasks in this date range) */}
                            {!hasTasksInRange && (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                        <Calendar className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No pipelines in this date range</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Try navigating to a different week or use the date picker</p>
                                    </div>
                                </div>
                            )}

                            {/* Tasks */}
                            {tasks.map((t, rowIdx) => {
                                const startOffset = differenceInDays(t.startDate, days[0])
                                const endOffset = differenceInDays(t.endDate, days[0])
                                const totalDays = days.length
                                const leftPct = clamp((startOffset / totalDays) * 100, 0, 100)
                                const rightPct = clamp((endOffset / totalDays) * 100, 0, 100)
                                const minWidthPct = (1 / totalDays) * 100
                                const widthPct = clamp(rightPct - leftPct + minWidthPct, minWidthPct, 100)
                                const styles = getStatusStyle(t.status)

                                return (
                                    <div
                                        key={t.id}
                                        className={cn(
                                            "grid grid-cols-[200px_1fr] relative group cursor-pointer",
                                            rowIdx < tasks.length - 1 && "border-b border-blue-50/50 dark:border-blue-900/20"
                                        )}
                                        onClick={() => onTaskClick?.(t.id)}
                                    >
                                        {/* Pipeline name */}
                                        <div className="px-4 py-2 flex items-center gap-2 border-r border-blue-100/50 dark:border-blue-900/30 group-hover:bg-slate-50/60 dark:group-hover:bg-slate-800/40 transition-colors h-12">
                                            <div className={cn("h-2 w-2 rounded-full shrink-0", styles.dot)} />
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{t.name}</span>
                                        </div>

                                        {/* Gantt bar area */}
                                        <div className="relative px-4 h-12 flex items-center group-hover:bg-slate-50/40 dark:group-hover:bg-slate-800/30 transition-colors">
                                            {/* Column grid lines */}
                                            <div className="absolute inset-0 grid px-4 pointer-events-none" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(2.5rem, 1fr))` }}>
                                                {Array.from({ length: days.length }).map((_, i) => (
                                                    <div key={i} className="h-full border-l border-slate-100/50 dark:border-slate-800/40 first:border-l-0" />
                                                ))}
                                            </div>

                                            {/* Bar */}
                                            <div
                                                className={cn(
                                                    "absolute h-6 rounded-lg bg-gradient-to-r shadow-sm hover:shadow-md hover:scale-y-110 transition-all z-10 flex items-center px-2 overflow-hidden",
                                                    styles.bar
                                                )}
                                                style={{
                                                    left: `calc(${leftPct}% + 16px)`,
                                                    width: `max(calc(${widthPct}% - 32px), 48px)`
                                                }}
                                                title={`${t.name} · ${t.status}`}
                                            >
                                                <span className="text-[10px] text-white font-semibold truncate drop-shadow-sm pointer-events-none">
                                                    {t.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
