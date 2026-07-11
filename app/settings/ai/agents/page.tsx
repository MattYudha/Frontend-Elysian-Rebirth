'use client';

import { Button } from '@/components/ui/button';
import {
    Bot, CheckCircle2, FileEdit, ShieldCheck, Zap,
    Plus, MessageSquare, Briefcase, UserCog, Loader2, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQueryState } from 'nuqs';
import { AgentConfigSlideOver } from '@/components/settings/ai/AgentConfigSlideOver';
import { Suspense } from 'react';
import { useAgents, useCreateAgent, useDeleteAgent } from '@/queries/agent.queries';

function AgentsContent() {
    const [, setAgentId] = useQueryState('agent');
    const { data: dbAgents = [], isLoading } = useAgents();
    const createMutation = useCreateAgent();
    const deleteMutation = useDeleteAgent();

    const capabilityHighlights = [
        { id: "planning", label: "Plan work and break it into tasks with clear owners.", icon: CheckCircle2 },
        { id: "review", label: "Review specs and docs for gaps before execution.", icon: ShieldCheck },
        { id: "updates", label: "Draft status updates and summaries for the team.", icon: FileEdit },
        { id: "automation", label: "Run checks and workflows with approval guardrails.", icon: Zap },
    ];

    const handleCreateCustomAgent = () => {
        createMutation.mutate({
            name: "Custom Agent " + (dbAgents.length + 1),
            description: "A custom specialist to automate tasks and run checks inside the workspace.",
            model_used: "MiniMax-M2.5",
            status: "active",
        }, {
            onSuccess: (newAgent) => {
                setAgentId(newAgent.id);
            }
        });
    };

    const moreAgents = [
        {
            id: "create",
            title: "Create a custom agent",
            description: "Design a specialist with your tools, rules, and API connections.",
            icon: Plus,
            variant: "create",
            onClick: handleCreateCustomAgent,
        },
        {
            id: "spec-writer",
            title: "Product spec writer",
            description: "Turns ideas into structured specs, milestones, and acceptance criteria.",
            icon: FileEdit,
            variant: "default",
        },
        {
            id: "qa-tester",
            title: "QA tester",
            description: "Finds regressions, drafts test plans, and highlights risks.",
            icon: ShieldCheck,
            variant: "default",
        },
        {
            id: "ui-reviewer",
            title: "UI reviewer",
            description: "Audits UI for consistency, accessibility, and polish.",
            icon: Zap,
            variant: "default",
        },
        {
            id: "release",
            title: "Release manager",
            description: "Builds release notes, launch checklists, and stakeholder updates.",
            icon: Briefcase,
            variant: "default",
        },
        {
            id: "support",
            title: "Customer support drafts",
            description: "Writes empathetic replies with product-aware context.",
            icon: MessageSquare,
            variant: "default",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Agents Teammates</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Create specialized AI teammates to plan, write, review, and ship work alongside you.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Your team */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Your team</h4>
                    <Button variant="outline" size="sm" className="hidden sm:flex">Manage agents</Button>
                </div>

                {isLoading ? (
                    <div className="text-sm text-slate-500 py-4 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span>Loading team agents...</span>
                    </div>
                ) : dbAgents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 p-8 text-center space-y-4">
                        <p className="text-sm text-slate-500">No active agents in this workspace yet.</p>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleCreateCustomAgent}
                            disabled={createMutation.isPending}
                        >
                            <Plus className="h-4 w-4 mr-1" /> Seed Default Agent
                        </Button>
                    </div>
                ) : (
                    dbAgents.map(agent => {
                        return (
                            <div key={agent.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-5">
                                <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <Bot className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-base font-semibold text-slate-900 dark:text-white">{agent.name}</span>
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                                    {agent.status || "active"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                                                {agent.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this agent?')) {
                                                    deleteMutation.mutate(agent.id);
                                                }
                                            }}
                                            disabled={deleteMutation.isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">View activity</Button>
                                        <Button
                                            size="sm"
                                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => setAgentId(agent.id)}
                                        >
                                            Open agent
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {capabilityHighlights.map((cap) => {
                                        const CapIcon = cap.icon;
                                        return (
                                            <div key={cap.id} className="flex items-start gap-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-[#0B1120] px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                                    <CapIcon className="h-3.5 w-3.5" />
                                                </span>
                                                <span className="leading-snug">{cap.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* More Agents */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">More agents</h4>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">Browse all</Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {moreAgents.map((agent) => {
                        const AgentIcon = agent.icon;
                        const isCreate = agent.variant === "create";

                        return (
                            <button
                                key={agent.id}
                                onClick={agent.onClick}
                                disabled={isCreate && createMutation.isPending}
                                className={cn(
                                    "flex flex-col gap-3 rounded-2xl border px-5 py-5 text-left transition-all duration-200 group h-full",
                                    isCreate
                                        ? "border-dashed border-blue-300 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-700/60"
                                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] hover:border-blue-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md"
                                )}
                            >
                                <span className={cn(
                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                                    isCreate
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                )}>
                                    {isCreate && createMutation.isPending ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <AgentIcon className="h-5 w-5" />
                                    )}
                                </span>
                                <div className="space-y-1.5 mt-2">
                                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">{agent.title}</h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                        {agent.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Quick actions</h4>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-2 text-slate-600 dark:text-slate-300">
                        <UserCog className="h-4 w-4" /> Manage agents
                    </Button>
                    <Button variant="outline" className="gap-2 text-slate-600 dark:text-slate-300">
                        <Zap className="h-4 w-4" /> Connect tools
                    </Button>
                </div>
            </div>

            {/* Deep-Linked Overlay */}
            <AgentConfigSlideOver />
        </div>
    );
}

export default function AgentsPage() {
    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                Loading agents...
            </div>
        }>
            <AgentsContent />
        </Suspense>
    );
}
