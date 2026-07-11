'use client';

import { AuditLogEntry } from "@/types/admin";
import { AuditDiffViewer } from "@/components/admin/audit/AuditDiffViewer";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ghost, MapPin, Monitor } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const MOCK_LOGS: AuditLogEntry[] = [
    {
        id: "log_001",
        actor: { name: "Budi Santoso", email: "budi@acme.com", role: "Manager", impersonatorName: "Super Admin" },
        action: "UPDATE_LIMIT",
        resource: "Subscription Plan",
        timestamp: "2024-03-10T08:32:00Z", // UTC
        ipAddress: "103.25.1.42",
        location: "Jakarta, ID",
        status: "Success",
        changes: {
            before: { limit: 1000, plan: "Free" },
            after: { limit: 50000, plan: "Pro" }
        }
    },
    {
        id: "log_002",
        actor: { name: "System", email: "bot@elysian.com", role: "System" },
        action: "AUTO_SUSPEND",
        resource: "Tenant: Umbrella Corp",
        timestamp: "2024-03-09T14:15:00Z",
        ipAddress: "Internal",
        location: "AWS-East",
        status: "Success",
        changes: {
            before: { status: "Active" },
            after: { status: "Suspended", reason: "Payment Failed" }
        }
    },
    {
        id: "log_003",
        actor: { name: "Sarah Connor", email: "sarah@cyberdyne.ai", role: "Admin" },
        action: "DELETE_MODEL",
        resource: "Cyberdyne-T800-v1",
        timestamp: "2024-03-08T09:00:00Z",
        ipAddress: "192.168.1.1",
        location: "Los Angeles, US",
        status: "Failure"
    }
];

export default function AuditLogsPage() {
    // Determine User's Timezone for display
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-ID', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
        }).format(date);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Forensic Audit Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400">Trace every action. Immutable security records.</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                    Viewing in: {userTimeZone}
                </Badge>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/50">
                <Table className="compact-table">
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow className="border-slate-200 dark:border-white/5">
                            <TableHead className="text-slate-500 dark:text-slate-400">Timestamp</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Actor</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Action</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Resource</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Context (IP/Loc)</TableHead>
                            <TableHead className="text-right text-slate-500 dark:text-slate-400">Evidence</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_LOGS.map(log => (
                            <TableRow key={log.id} className="border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                                {/* Timezone Critical Display */}
                                <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400">
                                    {formatDate(log.timestamp)}
                                </TableCell>

                                {/* Actor with Impersonator Warning */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900 dark:text-slate-200">{log.actor.name}</span>
                                            {log.actor.impersonatorName && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Badge variant="destructive" className="h-5 px-1 bg-amber-600 hover:bg-amber-700 text-[10px] gap-1">
                                                                <Ghost className="h-3 w-3" />
                                                                IMPERSONATED
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Real Actor: <b>{log.actor.impersonatorName}</b> using Ghost Mode</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                        <span className="text-xs text-slate-500 dark:text-slate-500">{log.actor.email}</span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant={log.status === 'Success' ? 'secondary' : 'destructive'} className="text-[10px] mr-2">
                                        {log.status.toUpperCase()}
                                    </Badge>
                                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{log.action}</span>
                                </TableCell>

                                <TableCell className="text-sm text-slate-600 dark:text-slate-500">{log.resource}</TableCell>

                                <TableCell>
                                    <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Monitor className="h-3 w-3" /> {log.ipAddress}
                                        </div>
                                        {log.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {log.location}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    {log.changes ? (
                                        <AuditDiffViewer log={log} />
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">No data diff</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
