"use client";

import React, { useState } from 'react';
import type { PipelineItem } from '../../types/x';
import { Clock, CheckCircle, Loader2, XCircle, Trash2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Progress } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useWorkflows } from '@/queries/workflow.queries';
import { useDeleteWorkflow } from '@/mutations/workflow.mutations';
import { TimelineGantt } from '@/components/dashboard/TimelineGantt';
import { PipelineBoard } from '@/components/dashboard/PipelineBoard';
import { ViewOptionsPopover, type ViewOptionsState } from './ViewOptionsPopover';
import { FilterPopover, type FilterChip } from './FilterPopover';

export interface ActivePipelinesListProps {
    className?: string;
    onPipelineClick?: (id: string) => void;
}

export const ActivePipelinesList: React.FC<ActivePipelinesListProps> = ({
    className,
    onPipelineClick,
}) => {
    // Connect to Data Layer (TanStack Query)
    const { data: pipelines, isLoading } = useWorkflows();
    const deleteMutation = useDeleteWorkflow();
    const { toast } = useToast();
    const [selectedPipeline, setSelectedPipeline] = useState<PipelineItem | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [viewOptions, setViewOptions] = useState<ViewOptionsState>({
        viewType: "timeline",
        tasks: "flat",
        ordering: "date",
        showAbsentParent: false,
        showClosedProjects: true,
        groupBy: "none",
        properties: ["status", "assignee", "dueDate"],
    });
    const [filterChips, setFilterChips] = useState<FilterChip[]>([]);

    const formatTimeAgo = (date: Date | string | undefined): string => {
        if (!date) return '';
        const d = new Date(date);
        const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast({
                    title: "Pipeline deleted",
                    description: "The pipeline has been removed from the queue.",
                });
            },
            onError: (_err) => {
                toast({
                    title: "Delete failed",
                    description: "Could not sync with server.",
                    variant: "destructive"
                });
            }
        });
    };

    const getStatusIcon = (status: PipelineItem['status']) => {
        switch (status) {
            case 'processing': return <Loader2 className="animate-spin text-blue-500 h-4 w-4" />;
            case 'completed': return <CheckCircle className="text-green-500 h-4 w-4" />;
            case 'failed': return <XCircle className="text-red-500 h-4 w-4" />;
            case 'queued': default: return <Clock className="text-orange-500 h-4 w-4" />;
        }
    };

    const getStatusBadgeVariant = (status: PipelineItem['status']) => {
        switch (status) {
            case 'processing': return 'default'; // Blueish
            case 'completed': return 'outline'; // Or green if we had success variant, outline works
            case 'failed': return 'destructive';
            case 'queued': default: return 'secondary';
        }
    };

    // Helper to get custom classes for colors since Shadcn badges are limited variants
    const getStatusBadgeClass = (status: PipelineItem['status']) => {
        switch (status) {
            case 'completed': return 'text-green-600 border-green-200 hover:bg-green-50';
            case 'queued': return 'text-orange-600 bg-orange-50 hover:bg-orange-100';
            default: return '';
        }
    };

    const columns: ColumnDef<PipelineItem>[] = [
        {
            accessorKey: "name",
            header: "Pipeline Name",
            cell: ({ row }) => (
                <div className="font-medium whitespace-nowrap min-w-[180px]">
                    {row.original.name}
                    <div className="text-xs text-muted-foreground md:hidden">
                        {row.original.id}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-[120px]">
                    {getStatusIcon(row.original.status)}
                    <Badge variant={getStatusBadgeVariant(row.original.status)} className={cn("uppercase", getStatusBadgeClass(row.original.status))}>
                        {row.original.status}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "progress",
            header: "Progress",
            cell: ({ row }) => {
                const status = row.original.status;
                const progress = row.original.progress;

                if (status === 'processing' && progress !== undefined) {
                    return (
                        <div className="w-[120px] space-y-1">
                            <Progress value={progress} className="h-2" />
                            {row.original.eta && (
                                <div className="text-xs text-muted-foreground text-right">
                                    {row.original.eta}
                                </div>
                            )}
                        </div>
                    );
                }
                return status === 'completed' ? <span className="text-green-600 text-sm">Completed</span> : <span className="text-muted-foreground text-sm">-</span>;
            },
        },
        {
            accessorKey: "lastUpdated",
            header: "Last Updated",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground whitespace-nowrap min-w-[100px]">
                    {formatTimeAgo(row.original.lastUpdated)}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click trigger
                            handleDelete(row.original.id);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];

    // Assuming ganttTasks is derived from pipelines or another source
    // Filter pipelines first based on text search and status chips
    const filteredPipelines = pipelines?.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const statusChips = filterChips.filter(c => c.key === "Status").map(c => c.value.toLowerCase());
        const matchesStatus = statusChips.length === 0 || statusChips.includes(p.status.toLowerCase());
        return matchesSearch && matchesStatus;
    }) || [];

    const ganttTasks = filteredPipelines.map(p => {
        const start = p.createdAt ? new Date(p.createdAt) : p.lastUpdated ? new Date(p.lastUpdated) : new Date();
        // Fallback ETA: If no ETA exists, draft/queued pipelines get a default +2 days duration to appear visually on the Gantt
        const end = p.eta ? new Date(p.eta) : new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000);

        return {
            id: p.id,
            name: p.name,
            startDate: start,
            endDate: end,
            progress: p.progress,
            status: p.status,
        };
    });

    return (
        <div className={cn("flex flex-col space-y-4 w-full", className)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between pb-2 border-b border-blue-100/50 dark:border-blue-900/30">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-50 tracking-tight">Pipeline Activity</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <Input
                            placeholder="Search pipelines..."
                            className="h-9 w-full sm:w-[220px] pl-8 text-xs bg-white/60 dark:bg-[#0B1120]/60 border-blue-100/50 dark:border-blue-900/30 rounded-lg shadow-sm focus-visible:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <FilterPopover
                        initialChips={filterChips}
                        onApply={setFilterChips}
                        onClear={() => setFilterChips([])}
                    />
                    <ViewOptionsPopover
                        options={viewOptions}
                        onChange={setViewOptions}
                        allowedViewTypes={["list", "board", "timeline"]}
                    />
                </div>
            </div>

            <div className="w-full">
                {viewOptions.viewType === 'timeline' && (
                    <div className="pipeline-gantt-container animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <TimelineGantt tasks={ganttTasks} onTaskClick={(taskId: string) => onPipelineClick?.(taskId)} isLoading={isLoading} />
                    </div>
                )}
                {viewOptions.viewType === 'list' && (
                    <div className="rounded-xl border border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm p-1 animate-in fade-in slide-in-from-bottom-2 duration-500 glass-obsidian">
                        <DataTable columns={columns} data={filteredPipelines as unknown as PipelineItem[]} />
                    </div>
                )}
                {viewOptions.viewType === 'board' && (
                    <div className="pipeline-board-container rounded-xl border border-blue-100/50 dark:border-blue-900/30 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm p-4 min-h-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500 glass-obsidian">
                        <PipelineBoard pipelines={filteredPipelines} onPipelineClick={onPipelineClick} />
                    </div>
                )}
            </div>
        </div>
    );
};

ActivePipelinesList.displayName = 'ActivePipelinesList';
