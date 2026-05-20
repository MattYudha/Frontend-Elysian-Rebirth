'use client';

import { format } from "date-fns"
import { Calendar, Tag, Database, Cpu, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type AgentTaskStatus = "data_ingestion" | "processing" | "final_review" | "completed";

export type PipelineAgentTask = {
    id: string;
    title: string;
    description?: string;
    status: AgentTaskStatus;
    model: string; // e.g., GPT-4o, Claude 3.5 Sonnet
    tokensUsed: number;
    startDate?: Date;
    tag?: string;
};

type AgentTaskCardProps = {
    task: PipelineAgentTask;
    isDragging?: boolean;
};

const getStatusIcon = (status: AgentTaskStatus) => {
    switch (status) {
        case "data_ingestion": return <Database className="h-3.5 w-3.5 text-blue-500" />;
        case "processing": return <Cpu className="h-3.5 w-3.5 text-amber-500" />;
        case "final_review": return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
        default: return <Database className="h-3.5 w-3.5 text-slate-500" />;
    }
}

export function AgentTaskCard({ task, isDragging }: AgentTaskCardProps) {
    return (
        <div
            className={cn(
                "group relative border bg-white dark:bg-[#0B1120] rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing",
                isDragging ? "border-blue-400 dark:border-blue-500 shadow-lg opacity-50 rotate-2 scale-105" : "border-slate-200/80 dark:border-slate-800 hover:border-blue-300/80 dark:hover:border-blue-800"
            )}
        >
            {/* Top row: badge + model */}
            <div className="flex items-center justify-between">
                <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold tracking-wider uppercase bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 rounded-lg px-2"
                >
                    {task.tag || "Core Task"}
                </Badge>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{task.model}</span>
                </div>
            </div>

            {/* Middle row: Title */}
            <div className="flex items-start gap-3 mt-1">
                {getStatusIcon(task.status)}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom row: chips */}
            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                {/* Tokens chip */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Tag className="h-3 w-3" />
                    <span>{(task.tokensUsed / 1000).toFixed(1)}k tokens</span>
                </div>

                {/* Date chip */}
                {task.startDate && !isNaN(new Date(task.startDate).getTime()) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-auto">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(task.startDate), "MMM d")}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
