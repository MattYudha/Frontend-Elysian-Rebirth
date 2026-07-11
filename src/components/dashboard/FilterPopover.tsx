"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    Filter,
    Loader2,
    Tag,
    User,
    GitMerge, // Used ChartBar previously for Priority, but GitMerge represents Branches/Pipelines better
} from "lucide-react"

export type FilterChip = { key: string; value: string }

type FilterTemp = {
    status: Set<string>
    priority: Set<string>
    tags: Set<string>
    members: Set<string>
}

interface FilterCounts {
    status?: Record<string, number>
    priority?: Record<string, number>
    tags?: Record<string, number>
    members?: Record<string, number>
}

interface FilterPopoverProps {
    initialChips?: FilterChip[]
    onApply: (chips: FilterChip[]) => void
    onClear: () => void
    counts?: FilterCounts
}

export function FilterPopover({ initialChips, onApply, onClear, counts }: FilterPopoverProps) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [active, setActive] = useState<
        "status" | "priority" | "tags" | "members"
    >("status")

    const [temp, setTemp] = useState<FilterTemp>(() => ({
        status: new Set<string>(),
        priority: new Set<string>(),
        tags: new Set<string>(),
        members: new Set<string>(),
    }))

    const [tagSearch, setTagSearch] = useState("")

    // Preselect from chips when opening
    useEffect(() => {
        if (!open) return
        const next: FilterTemp = {
            status: new Set<string>(),
            priority: new Set<string>(),
            tags: new Set<string>(),
            members: new Set<string>(),
        }
        for (const c of initialChips || []) {
            const k = c.key.toLowerCase()
            if (k === "status") next.status.add(c.value.toLowerCase())
            if (k === "priority") next.priority.add(c.value.toLowerCase())
            if (k === "member" || k === "pic" || k === "members") next.members.add(c.value)
            if (k === "tag" || k === "tags") next.tags.add(c.value.toLowerCase())
        }
        setTemp(next)
    }, [open, initialChips])

    const categories = [
        { id: "status", label: "Status", icon: Loader2 },
        { id: "priority", label: "Pipeline Class", icon: GitMerge },
        { id: "tags", label: "Tags", icon: Tag },
        { id: "members", label: "Members", icon: User },
    ] as const

    const statusOptions = [
        { id: "draft", label: "Draft", color: "var(--amber-500)" },
        { id: "queued", label: "Queued", color: "var(--orange-500)" },
        { id: "processing", label: "Processing", color: "var(--blue-500)" },
        { id: "completed", label: "Completed", color: "var(--emerald-500)" },
        { id: "failed", label: "Failed", color: "var(--rose-500)" },
        { id: "archived", label: "Archived", color: "var(--slate-500)" },
    ]

    const priorityOptions = [
        { id: "data-ingestion", label: "Data Ingestion" },
        { id: "model-training", label: "Model Training" },
        { id: "evaluation", label: "Evaluation" },
        { id: "deployment", label: "Deployment" },
    ]

    const memberOptions = [
        { id: "no-member", label: "Unassigned", avatar: undefined },
        { id: "current", label: "Current user", avatar: undefined, hint: "1 pipelines" },
        { id: "admin", label: "Admin User", avatar: "/placeholder-user.jpg", hint: "5 pipelines" },
    ]

    const tagOptions = [
        { id: "llm", label: "LLM" },
        { id: "rag", label: "RAG" },
        { id: "vector-db", label: "Vector DB" },
        { id: "vision", label: "Vision" },
        { id: "experimental", label: "Experimental" },
    ]

    const filteredCategories = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return categories
        return categories.filter((c) => c.label.toLowerCase().includes(q))
    }, [categories, query])

    const toggleSet = (set: Set<string>, v: string) => {
        const n = new Set(set)
        if (n.has(v)) n.delete(v)
        else n.add(v)
        return n
    }

    const handleApply = () => {
        const chips: FilterChip[] = []
        temp.status.forEach((v) => chips.push({ key: "Status", value: capitalize(v) }))
        temp.priority.forEach((v) => chips.push({ key: "Class", value: capitalize(v) }))
        temp.members.forEach((v) => chips.push({ key: "Member", value: v }))
        temp.tags.forEach((v) => chips.push({ key: "Tag", value: v }))
        onApply(chips)
        setOpen(false)
    }

    const handleClear = () => {
        setTemp({
            status: new Set<string>(),
            priority: new Set<string>(),
            tags: new Set<string>(),
            members: new Set<string>(),
        })
        onClear()
    }

    // Handle color fallback since CSS vars might not be perfectly mapped
    const resolveColor = (colorStr: string) => {
        if (colorStr.includes('amber')) return '#f59e0b';
        if (colorStr.includes('orange')) return '#f97316';
        if (colorStr.includes('blue')) return '#3b82f6';
        if (colorStr.includes('emerald')) return '#10b981';
        if (colorStr.includes('rose')) return '#f43f5e';
        if (colorStr.includes('slate')) return '#64748b';
        return '#94a3b8';
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2 rounded-lg border border-blue-100/50 dark:border-blue-900/30 px-3 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200">
                    <Filter className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Filter</span>
                </Button>
            </PopoverTrigger>
            {/* Elysian Glassmorphism Container */}
            <PopoverContent align="start" className="w-[720px] p-0 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden glass-obsidian">
                <div className="grid grid-cols-[240px_minmax(0,1fr)] h-full min-h-[320px]">
                    {/* Left Sidebar */}
                    <div className="flex flex-col border-r border-blue-50/50 dark:border-blue-900/30 bg-slate-50/30 dark:bg-slate-800/20">
                        <div className="p-3 pb-2">
                            <Input
                                placeholder="Search categories..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="h-8 bg-white/60 dark:bg-slate-800/60 border-blue-100/50 dark:border-blue-900/30 text-sm focus-visible:ring-blue-500 focus-visible:ring-offset-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-200"
                            />
                        </div>
                        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
                            {filteredCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group",
                                        active === cat.id
                                            ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200"
                                    )}
                                    onClick={() => setActive(cat.id)}
                                >
                                    <cat.icon className={cn("h-4 w-4", active === cat.id ? "text-blue-500" : "text-slate-400 group-hover:text-blue-400")} />
                                    <span className="flex-1 text-left">{cat.label}</span>
                                    {counts && counts[cat.id as keyof FilterCounts] && (
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                                            active === cat.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {Object.values(counts[cat.id as keyof FilterCounts] as Record<string, number>).reduce(
                                                (a, b) => a + (typeof b === "number" ? b : 0),
                                                0,
                                            )}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="p-4 flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

                            {active === "status" && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">Status</h4>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {statusOptions.map((opt) => {
                                            const isChecked = temp.status.has(opt.id);
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all duration-200 select-none",
                                                        isChecked
                                                            ? "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-800 shadow-sm"
                                                            : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/80"
                                                    )}>
                                                    <span className="h-2.5 w-2.5 rounded-full shadow-inner ring-1 ring-black/10 dark:ring-white/10" style={{ backgroundColor: resolveColor(opt.color) }} />
                                                    <span className={cn("text-sm flex-1 font-medium", isChecked ? "text-blue-900 dark:text-blue-300" : "text-slate-700 dark:text-slate-300")}>{opt.label}</span>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => setTemp((t) => ({ ...t, status: toggleSet(t.status, opt.id) }))}
                                                        className={cn("h-4 w-4 rounded-[4px]", isChecked ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 dark:border-slate-600")}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {active === "priority" && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">Pipeline Class</h4>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {priorityOptions.map((opt) => {
                                            const isChecked = temp.priority.has(opt.id);
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all duration-200 select-none",
                                                        isChecked
                                                            ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200/60 dark:border-indigo-800 shadow-sm"
                                                            : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/80"
                                                    )}
                                                >
                                                    <span className={cn("text-sm flex-1 font-medium", isChecked ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>{opt.label}</span>
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => setTemp((t) => ({ ...t, priority: toggleSet(t.priority, opt.id) }))}
                                                        className={cn("h-4 w-4 rounded-[4px]", isChecked ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 dark:border-slate-600")}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {active === "members" && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">Assignees</h4>
                                    <div className="space-y-2">
                                        {memberOptions.map((m) => {
                                            const isChecked = temp.members.has(m.label);
                                            return (
                                                <label
                                                    key={m.id}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer transition-all duration-200 select-none",
                                                        isChecked
                                                            ? "bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-800 shadow-sm"
                                                            : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/80"
                                                    )}>
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-shrink-0 items-center justify-center overflow-hidden">
                                                        {m.avatar ? (
                                                            <img src={m.avatar} alt={m.label} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="h-3 w-3 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <span className={cn("text-sm flex-1 font-medium", isChecked ? "text-emerald-900 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300")}>{m.label}</span>
                                                    {m.hint && <span className="text-xs text-slate-400 mr-2">{m.hint}</span>}
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => setTemp((t) => ({ ...t, members: toggleSet(t.members, m.label) }))}
                                                        className={cn("h-4 w-4 rounded-[4px]", isChecked ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 dark:border-slate-600")}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {active === "tags" && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-tight">Tags</h4>
                                    <div>
                                        <div className="pb-3">
                                            <Input
                                                placeholder="Search tags..."
                                                value={tagSearch}
                                                onChange={(e) => setTagSearch(e.target.value)}
                                                className="h-9 bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 dark:text-slate-200"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tagOptions
                                                .filter((t) => t.label.toLowerCase().includes(tagSearch.toLowerCase()))
                                                .map((t) => {
                                                    const isChecked = temp.tags.has(t.id);
                                                    return (
                                                        <label
                                                            key={t.id}
                                                            className={cn(
                                                                "flex items-center gap-2 rounded-full border px-3 py-1.5 cursor-pointer transition-all duration-200 select-none shadow-sm",
                                                                isChecked
                                                                    ? "bg-blue-500 border-blue-600 text-white shadow-md ring-2 ring-blue-500/20"
                                                                    : "bg-white/80 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
                                                            )}>
                                                            <span className="text-[13px] font-medium tracking-wide">{t.label}</span>
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isChecked}
                                                                onChange={() => setTemp((s) => ({ ...s, tags: toggleSet(s.tags, t.id) }))}
                                                            />
                                                        </label>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100/80 dark:border-slate-800 pt-4">
                            <button
                                onClick={handleClear}
                                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors px-3 py-1.5 rounded-md"
                            >
                                Clear all filters
                            </button>
                            <Button size="sm" className="h-9 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-900/40 transition-all active:scale-95" onClick={handleApply}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
