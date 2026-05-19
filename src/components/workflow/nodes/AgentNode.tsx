'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from '@/components/ui/';
import { UserCog } from 'lucide-react';
import { NodeStatusBadge } from './NodeStatusBadge';
import { useWorkflowStore } from '../store';
import { cn } from '@/lib/utils';

interface AgentNodeData {
    label: string;
    role?: 'analyst' | 'writer' | 'researcher' | 'support';
    objective?: string;
    tools?: string[];
}

const ROLE_LABELS: Record<string, string> = {
    analyst: 'Analyst',
    writer: 'Writer',
    researcher: 'Researcher',
    support: 'Support Agent',
};

const TOOL_LABELS: Record<string, string> = {
    web_search: 'Web Search',
    calculator: 'Calculator',
    code_executor: 'Code Executor',
};

export function AgentNode({ id, data, selected }: NodeProps<AgentNodeData>) {
    const executionStatus = useWorkflowStore((s) => s.execution.nodeStatus[id]);

    return (
        <div className="relative group font-sans">
            <Handle
                type="target"
                position={Position.Top}
                className="!bg-blue-400 group-hover:!bg-blue-600 w-2 h-2 transition-all rounded-full"
            />

            <Card className={cn(
                'w-[280px] shadow-sm transition-all duration-300 backdrop-blur-md glass-obsidian',
                'bg-white/90 dark:bg-slate-900/40',
                selected
                    ? 'border-blue-500 ring-1 ring-blue-500 shadow-xl'
                    : 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400 hover:shadow-md'
            )}>
                {/* Header */}
                <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                            <UserCog className="h-4 w-4" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-50 leading-none">
                                {data.label || 'AI Agent'}
                            </h3>
                            <p className="text-[10px] font-medium text-blue-400 uppercase tracking-wider mt-1">
                                Autonomous Agent
                            </p>
                        </div>
                    </div>
                    <div className="scale-90 opacity-80">
                        <NodeStatusBadge status={executionStatus} />
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    {/* Role Badge */}
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
                        {data.role ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                {ROLE_LABELS[data.role] || data.role}
                            </span>
                        ) : (
                            <span className="text-[10px] italic text-slate-400">Not configured</span>
                        )}
                    </div>

                    {/* Objective Preview */}
                    {data.objective && (
                        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-md p-2.5 border border-slate-100 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-2 font-mono leading-relaxed">
                                "{data.objective}"
                            </p>
                        </div>
                    )}

                    {/* Tool Chips */}
                    {data.tools && data.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {data.tools.map((tool) => (
                                <span
                                    key={tool}
                                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                >
                                    {TOOL_LABELS[tool] || tool}
                                </span>
                            ))}
                        </div>
                    )}

                    {!data.role && !data.objective && (
                        <p className="text-[10px] text-center italic text-slate-400 py-2">
                            Click to configure agent
                        </p>
                    )}
                </CardContent>
            </Card>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!bg-blue-400 group-hover:!bg-blue-600 w-2 h-2 transition-all rounded-full"
            />
        </div>
    );
}
