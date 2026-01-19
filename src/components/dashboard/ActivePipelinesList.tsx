"use client";

import React, { useState } from 'react';
import type { PipelineItem } from '../../types/x';
import { Clock, CheckCircle, Loader2, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Progress } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import { useWorkflowStore } from '@/store/workflowStore';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/';
import { PipelineDetailDrawer } from '@/components/dashboard/PipelineDetailDrawer';

export interface ActivePipelinesListProps {
    className?: string;
}

export const ActivePipelinesList: React.FC<ActivePipelinesListProps> = ({
    className,
}) => {
    // Connect to global store
    const { pipelines, deletePipelineOptimistic, restorePipelines } = useWorkflowStore();
    const { toast } = useToast();
    const [selectedPipeline, setSelectedPipeline] = useState<PipelineItem | null>(null);

    const formatTimeAgo = (date: Date): string => {
        const d = new Date(date);
        const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const handleDelete = async (id: string) => {
        // 1. SNAPSHOT & OPTIMISTIC UPDATE
        const previousState = deletePipelineOptimistic(id);

        // 2. USER FEEDBACK
        toast({
            title: "Pipeline deleted",
            description: "The pipeline has been removed from the queue.",
            action: (
                <ToastAction
                    altText="Undo"
                    onClick={() => restorePipelines(previousState)}
                >
                    Undo
                </ToastAction>
            ),
        });

        // 3. SERVER SYNC (Simulated)
        try {
            // Simulate API latency
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });
        } catch {
            // 4. ROLLBACK ON FAILURE
            restorePipelines(previousState);
            toast({
                title: "Delete failed",
                description: "Could not sync with server. State restored.",
                variant: "destructive"
            });
        }
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
                <div className="font-medium">
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
                <div className="flex items-center gap-2">
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
                <div className="text-sm text-muted-foreground">
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

    return (
        <>
            <div className={cn("overflow-hidden rounded-xl bg-background", className)}>
                <DataTable
                    columns={columns}
                    data={pipelines || []}
                    onRowClick={(row) => setSelectedPipeline(row.original)}
                />
            </div>

            <PipelineDetailDrawer
                pipeline={selectedPipeline}
                open={!!selectedPipeline}
                onOpenChange={(open) => !open && setSelectedPipeline(null)}
            />
        </>
    );
};

ActivePipelinesList.displayName = 'ActivePipelinesList';
