'use client';

import { motion } from 'framer-motion';
import {
    Search,
    Bell,
    Plus,
    MoreHorizontal,
    Filter,
    LayoutGrid,
    List,
    Users,
    CheckCircle2,
    Circle,
    Clock,
    Paperclip,
    MessageSquare,
    ChevronDown
} from 'lucide-react';

export function HeroDashboardPreview() {
    return (
        <div className="w-[1200px] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden select-none">
            {/* Top Bar */}
            <div className="h-16 border-b border-slate-100 flex items-center px-6 justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                            E
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">Elysian</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200 mx-2" />
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <span className="text-slate-800">Product Roadmap</span>
                        <ChevronDown className="w-3 h-3" />
                    </div>
                </div>

                {/* Center Tabs */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md shadow-sm text-sm font-medium text-slate-700">
                        <LayoutGrid className="w-4 h-4 text-blue-500" />
                        <span>Board</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                        <List className="w-4 h-4" />
                        <span>List</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
                        <Users className="w-4 h-4" />
                        <span>Team</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-400 text-sm">
                        <Search className="w-4 h-4" />
                        <span>Search...</span>
                        <kbd className="ml-2 text-[10px] font-sans bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
                    </div>
                    <div className="relative">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white shadow-sm" />
                </div>
            </div>

            {/* Sub Header */}
            <div className="h-12 border-b border-slate-100 flex items-center px-6 justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1.5 shadow-sm">
                        <Filter className="w-3 h-3" />
                        Filter
                    </div>
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1.5 shadow-sm">
                        <Users className="w-3 h-3" />
                        Assignee
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 z-${10 - i}`}>
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                        <Plus className="w-3 h-3" />
                        New Item
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="p-6 grid grid-cols-4 gap-6 bg-slate-50/30 min-h-[600px]">

                {/* Column: Backlog */}
                <KanbanColumn
                    title="Backlog"
                    count={12}
                    color="bg-slate-200"
                    items={[
                        { title: "Research AI Competitors", tag: "Strategy", tagColor: "bg-purple-100 text-purple-700", priority: "Low" },
                        { title: "Update Documentation", tag: "Docs", tagColor: "bg-slate-100 text-slate-600", priority: "Medium" },
                        { title: "Fix Mobile Navigation", tag: "Bug", tagColor: "bg-red-100 text-red-600", priority: "High" },
                    ]}
                />

                {/* Column: In Progress */}
                <KanbanColumn
                    title="In Progress"
                    count={4}
                    color="bg-blue-500"
                    items={[
                        {
                            title: "Implement Auth Flow",
                            tag: "Feature",
                            tagColor: "bg-blue-100 text-blue-700",
                            priority: "High",
                            subtitle: "Integrating Clerk auth...",
                            active: true
                        },
                        { title: "Design System V2", tag: "Design", tagColor: "bg-pink-100 text-pink-700", priority: "Medium" },
                    ]}
                />

                {/* Column: Review */}
                <KanbanColumn
                    title="In Review"
                    count={2}
                    color="bg-amber-500"
                    items={[
                        { title: "Landing Page Hero", tag: "Frontend", tagColor: "bg-cyan-100 text-cyan-700", priority: "High" },
                        { title: "API Rate Limiting", tag: "Backend", tagColor: "bg-indigo-100 text-indigo-700", priority: "High" },
                        { title: "User Onboarding Flow", tag: "UX", tagColor: "bg-orange-100 text-orange-700", priority: "Medium" }
                    ]}
                />

                {/* Column: Done */}
                <KanbanColumn
                    title="Done"
                    count={24}
                    color="bg-green-500"
                    items={[
                        { title: "Setup Project Repo", tag: "DevOps", tagColor: "bg-slate-100 text-slate-600", priority: "Low", completed: true },
                        { title: "Database Schema Draft", tag: "Database", tagColor: "bg-teal-100 text-teal-700", priority: "Medium", completed: true },
                        { title: "Install Dependencies", tag: "Setup", tagColor: "bg-slate-100 text-slate-600", priority: "Low", completed: true }
                    ]}
                />

            </div>
        </div>
    );
}

function KanbanColumn({ title, count, color, items }: any) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="font-semibold text-sm text-slate-700">{title}</span>
                    <span className="text-xs text-slate-400 font-medium bg-slate-100 px-1.5 py-0.5 rounded-full">{count}</span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex flex-col gap-3">
                {items.map((item: any, i: number) => (
                    <div key={i} className={`p-4 rounded-xl border transition-all cursor-pointer group ${item.active ? 'bg-white shadow-lg shadow-blue-500/10 border-blue-200 ring-1 ring-blue-100' : 'bg-white border-slate-200/60 shadow-sm hover:border-blue-200 hover:shadow-md'}`}>
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                                {item.tag}
                            </span>
                            {item.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                                <Circle className="w-4 h-4 text-slate-300" />
                            )}
                        </div>
                        <h4 className={`text-sm font-semibold mb-1 ${item.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                            {item.title}
                        </h4>
                        {item.subtitle && <p className="text-xs text-slate-500 mb-3">{item.subtitle}</p>}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-slate-400">
                                <div className="flex items-center gap-1 text-[10px]">
                                    <Paperclip className="w-3 h-3" />
                                    <span>2</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px]">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>4</span>
                                </div>
                            </div>
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border border-white" />
                        </div>
                    </div>
                ))}

                {/* Ghost Card */}
                <div className="h-10 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
}
