"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
    SlidersHorizontal,
    List,
    KanbanSquare,
    BarChart,
    Indent,
    ChevronsUpDown,
    ListMinus,
    Globe,
    Loader2,
    User,
    Tag,
    Type,
    Calendar,
    Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewOptionsState = {
    viewType: "list" | "board" | "timeline"
    tasks: "indented" | "collapsed" | "flat"
    ordering: "manual" | "alphabetical" | "date"
    showAbsentParent: boolean
    showClosedProjects: boolean
    groupBy: "none" | "status" | "assignee" | "tags"
    properties: string[]
}

interface ViewOptionsPopoverProps {
    options: ViewOptionsState
    onChange: (options: ViewOptionsState) => void
    allowedViewTypes?: string[]
}

export function ViewOptionsPopover({ options, onChange, allowedViewTypes }: ViewOptionsPopoverProps) {
    const [tasksOpen, setTasksOpen] = useState(false)
    const [orderingOpen, setOrderingOpen] = useState(false)
    const [groupByOpen, setGroupByOpen] = useState(false)

    const viewTypes = [
        { id: "list", label: "List", icon: List },
        { id: "board", label: "Board", icon: KanbanSquare },
        { id: "timeline", label: "Timeline", icon: BarChart },
    ].filter((type) => !allowedViewTypes || allowedViewTypes.includes(type.id))

    const taskOptions = [
        { id: "indented", label: "Indented", icon: Indent },
        { id: "collapsed", label: "Collapsed", icon: ChevronsUpDown },
        { id: "flat", label: "Flat", icon: ListMinus },
    ]

    const orderingOptions = [
        { id: "manual", label: "Manual" },
        { id: "alphabetical", label: "Alphabetical" },
        { id: "date", label: "Date" },
    ]

    const groupByOptions = [
        { id: "none", label: "None", icon: Globe },
        { id: "status", label: "Status", icon: Loader2, count: "4 status" },
        { id: "assignee", label: "Assignee", icon: User, count: "1 active" },
        { id: "tags", label: "Tags", icon: Tag, count: "4 tags" },
    ]

    const propertyOptions = [
        { id: "title", label: "Title", icon: Type },
        { id: "status", label: "Status", icon: Loader2 },
        { id: "assignee", label: "Assignee", icon: User },
        { id: "dueDate", label: "Due date", icon: Calendar },
    ]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 rounded-lg border border-blue-100/50 dark:border-blue-900/30 px-3 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200">
                    <SlidersHorizontal className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">View</span>
                </Button>
            </PopoverTrigger>
            {/* Elysian Glassmorphism Popover Container */}
            <PopoverContent className="w-80 rounded-xl p-0 border border-blue-100/50 dark:border-blue-900/30 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl glass-obsidian" align="end">
                <div className="p-4">
                    {/* View Type Tabs */}
                    <div className="flex rounded-xl p-1 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                        {viewTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => onChange({ ...options, viewType: type.id as ViewOptionsState['viewType'] })}
                                className={cn(
                                    "flex flex-1 flex-col items-center gap-1 rounded-lg py-2.5 text-xs font-medium transition-all duration-200 shadow-none",
                                    options.viewType === type.id
                                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-black/5 dark:ring-white/5 scale-[1.02]"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-700/50",
                                )}
                            >
                                <type.icon className={cn("h-5 w-5 mb-0.5", options.viewType === type.id ? "text-blue-500" : "")} />
                                {type.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 space-y-4">
                        {/* Tasks Dropdown */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tasks</span>
                            <Popover open={tasksOpen} onOpenChange={setTasksOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 rounded-lg border-blue-100/60 dark:border-blue-900/40 px-3 bg-white/50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
                                    >
                                        {taskOptions.find((o) => o.id === options.tasks)?.icon && <Indent className="h-4 w-4 text-blue-400" />}
                                        {taskOptions.find((o) => o.id === options.tasks)?.label}
                                        <ChevronsUpDown className="h-3 w-3 text-slate-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 rounded-xl p-1 border-blue-100/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl glass-obsidian" align="end">
                                    {taskOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                onChange({ ...options, tasks: option.id as ViewOptionsState['tasks'] })
                                                setTasksOpen(false)
                                            }}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300",
                                                options.tasks === option.id && "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400",
                                            )}
                                        >
                                            <option.icon className={cn("h-4 w-4", options.tasks === option.id ? "text-blue-500" : "text-slate-400")} />
                                            {option.label}
                                        </button>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Ordering Dropdown */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordering</span>
                            <Popover open={orderingOpen} onOpenChange={setOrderingOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 rounded-lg border-blue-100/60 dark:border-blue-900/40 px-3 bg-white/50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
                                    >
                                        <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                                        {orderingOptions.find((o) => o.id === options.ordering)?.label}
                                        <ChevronsUpDown className="h-3 w-3 text-slate-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-36 rounded-xl p-1 border-blue-100/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl glass-obsidian" align="end">
                                    {orderingOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                onChange({ ...options, ordering: option.id as ViewOptionsState['ordering'] })
                                                setOrderingOpen(false)
                                            }}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-600 dark:text-slate-300",
                                                options.ordering === option.id && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Show absent parent */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show absent parent</span>
                            <Switch
                                checked={options.showAbsentParent}
                                onCheckedChange={(checked) => onChange({ ...options, showAbsentParent: checked })}
                                className="data-[state=checked]:bg-blue-500"
                            />
                        </div>

                        {/* Show closed projects */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show closed pipelines</span>
                            <Switch
                                checked={options.showClosedProjects}
                                onCheckedChange={(checked) => onChange({ ...options, showClosedProjects: checked })}
                                className="data-[state=checked]:bg-blue-500"
                            />
                        </div>

                        {/* Group by */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Group by</span>
                            <Popover open={groupByOpen} onOpenChange={setGroupByOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-2 rounded-lg border-blue-100/60 dark:border-blue-900/40 px-3 bg-white/50 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm"
                                    >
                                        <Globe className="h-4 w-4 text-indigo-400" />
                                        {groupByOptions.find((o) => o.id === options.groupBy)?.label}
                                        <ChevronsUpDown className="h-3 w-3 text-slate-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-44 rounded-xl p-1 border-blue-100/50 dark:border-blue-900/30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl glass-obsidian" align="end">
                                    {groupByOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => {
                                                onChange({ ...options, groupBy: option.id as ViewOptionsState['groupBy'] })
                                                setGroupByOpen(false)
                                            }}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300",
                                                options.groupBy === option.id && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400",
                                            )}
                                        >
                                            <option.icon className={cn("h-4 w-4", options.groupBy === option.id ? "text-indigo-500" : "text-slate-400")} />
                                            <span className="flex-1 text-left">{option.label}</span>
                                            {option.count && <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{option.count}</span>}
                                        </button>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Properties */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Properties</span>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {propertyOptions.map((prop) => (
                                    <button
                                        key={prop.id}
                                        onClick={() => {
                                            const newProps = options.properties.includes(prop.id)
                                                ? options.properties.filter((p) => p !== prop.id)
                                                : [...options.properties, prop.id]
                                            onChange({ ...options, properties: newProps })
                                        }}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                                            options.properties.includes(prop.id)
                                                ? "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/20"
                                                : "border-slate-200/60 dark:border-slate-700 bg-white/40 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                                        )}
                                    >
                                        <prop.icon className={cn("h-3.5 w-3.5", options.properties.includes(prop.id) ? "text-blue-500" : "text-slate-400")} />
                                        {prop.label}
                                    </button>
                                ))}
                                <button className="flex items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-600 px-2.5 py-1.5 text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 pb-1">
                        <div className="flex items-center gap-1 group cursor-pointer">
                            <span className="flex items-center gap-1.5 text-[13px] font-medium text-blue-600 group-hover:underline">
                                <Globe className="h-3.5 w-3.5" />
                                Set default
                            </span>
                            <span className="text-[13px] text-slate-400">for everyone</span>
                        </div>
                        <button className="text-[13px] font-medium text-slate-500 hover:text-slate-700 hover:underline transition-colors">
                            Reset
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
