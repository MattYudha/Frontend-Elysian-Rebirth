"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Tenant } from "@/types/admin";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Ghost, ShieldAlert } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useImpersonate } from "@/hooks/useImpersonate";

// Separate component to use hook inside callback
const ImpersonateAction = ({ tenant }: { tenant: Tenant }) => {
    const { impersonate } = useImpersonate();

    return (
        <DropdownMenuItem
            className="text-amber-600 focus:text-amber-700 focus:bg-amber-100 dark:focus:bg-amber-900/20"
            onClick={() => impersonate(tenant.id, tenant.name)}
        >
            <Ghost className="mr-2 h-4 w-4" />
            <span>Impersonate (Ghost Mode)</span>
        </DropdownMenuItem>
    );
};

export const tenantColumns: ColumnDef<Tenant>[] = [
    {
        accessorKey: "name",
        header: "Tenant",
        cell: ({ row }) => {
            const tenant = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-semibold">{tenant.name}</span>
                    <span className="text-xs text-muted-foreground">{tenant.email}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={status === 'Active' ? 'default' : status === 'Suspended' ? 'destructive' : 'secondary'}
                    className="text-xs"
                >
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "tier",
        header: "Plan",
        cell: ({ row }) => <span className="text-sm font-medium">{row.getValue("tier")}</span>,
    },
    {
        accessorKey: "tokenUsage",
        header: "Resource Usage",
        cell: ({ row }) => {
            const usage = row.original.tokenUsage;
            const limit = row.original.tokenLimit;
            const percentage = Math.min(100, (usage / limit) * 100);

            // Color logic
            const barColor = percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-500" : "bg-blue-500";

            return (
                <div className="w-[140px] space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{percentage.toFixed(0)}%</span>
                        <span>{(usage / 1000).toFixed(0)}k tks</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" indicatorClassName={barColor} />
                </div>
            );
        },
    },
    {
        accessorKey: "healthScore",
        header: "Health",
        cell: ({ row }) => {
            const score = row.getValue("healthScore") as number;
            // < 90 is Warning, < 70 is Danger
            const color = score >= 90 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-red-500";
            return (
                <div className={`font-bold ${color}`}>
                    {score}%
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const tenant = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tenant.id)}>
                            Copy Tenant ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Audit Logs</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ImpersonateAction tenant={tenant} />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-100">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Suspend Tenant
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
