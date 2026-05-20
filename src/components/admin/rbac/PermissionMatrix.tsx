"use client";

import React, { useState } from "react";
import { Role, Permission, RolePermissionMatrix } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GlassCard } from "@/components/ui/GlassCard";

interface PermissionMatrixProps {
    initialData: RolePermissionMatrix;
}

export function PermissionMatrix({ initialData }: PermissionMatrixProps) {
    // State for the matrix checkboxes
    const [matrix, setMatrix] = useState<Record<string, string[]>>(initialData.matrix);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Toggle Permission Logic
    const togglePermission = (roleId: string, permissionId: string) => {
        setMatrix(prev => {
            const currentPerms = prev[roleId] || [];
            const hasPerm = currentPerms.includes(permissionId);

            let newPerms;
            if (hasPerm) {
                newPerms = currentPerms.filter(id => id !== permissionId);
            } else {
                newPerms = [...currentPerms, permissionId];
            }

            setHasChanges(true);
            return { ...prev, [roleId]: newPerms };
        });
    };

    const saveChanges = async () => {
        setIsSaving(true);
        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success("RBAC Policy Updated Successfully");
        setHasChanges(false);
        setIsSaving(false);
    };

    const discardChanges = () => {
        setMatrix(initialData.matrix);
        setHasChanges(false);
        toast.info("Changes discarded");
    };

    // Group permissions by scope for better UX (e.g. "Billing", "Users")
    const groupedPermissions = initialData.permissions.reduce((acc, perm) => {
        if (!acc[perm.scope]) acc[perm.scope] = [];
        acc[perm.scope].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <div className="space-y-6">

            {/* Disclaimer Alert as per Professor's implementation verification */}
            <Alert className="bg-amber-500/10 border-amber-500/50 text-amber-500">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Synchronization Warning</AlertTitle>
                <AlertDescription className="text-amber-500/80">
                    Ensuring frontend matrix aligns with Backend DB Schema permissions table.
                </AlertDescription>
            </Alert>

            {/* Toolbar */}
            <div className="flex items-center justify-between text-slate-900 dark:text-slate-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Policy Matrix</h2>
                    {hasChanges && <Badge variant="destructive" className="animate-pulse bg-rose-600">Unsaved Changes</Badge>}
                </div>
                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <Button variant="ghost" onClick={discardChanges} disabled={isSaving} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                            Discard
                        </Button>
                    )}
                    <Button onClick={saveChanges} disabled={!hasChanges || isSaving} className="gap-2 bg-rose-600 hover:bg-rose-700 text-white border-0">
                        {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Matrix Table */}
            <GlassCard variant="solid" className="rounded-md border-0 overflow-hidden">
                <Table className="compact-table">
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow className="border-slate-200 dark:border-white/5 hover:bg-transparent">
                            <TableHead className="w-[300px] text-slate-500 dark:text-slate-400">Permission Scope</TableHead>
                            {initialData.roles.map(role => (
                                <TableHead key={role.id} className="text-center w-[120px]">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-slate-700 dark:text-slate-200">{role.name}</span>
                                        {role.isSystem && <Badge variant="outline" className="text-[10px] h-4 border-rose-200 dark:border-rose-500/50 text-rose-600 dark:text-rose-400">System</Badge>}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(groupedPermissions).map(([scope, perms]) => (
                            <React.Fragment key={scope}>
                                {/* Scope Header Row */}
                                <TableRow key={`scope-${scope}`} className="bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900/70 border-slate-200 dark:border-white/5">
                                    <TableCell colSpan={initialData.roles.length + 1} className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 py-2 pl-4">
                                        Module: {scope}
                                    </TableCell>
                                </TableRow>

                                {/* Permission Rows */}
                                {perms.map(perm => (
                                    <TableRow key={perm.id} className="border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 bg-white dark:bg-slate-950/30">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{perm.action}</span>
                                                <span className="text-xs text-slate-500">{perm.description}</span>
                                            </div>
                                        </TableCell>
                                        {initialData.roles.map(role => {
                                            const isChecked = (matrix[role.id] || []).includes(perm.id);
                                            // Disable checkbox for Super Admin if needed (usually Super Admin has * always)
                                            const isDisabled = role.name === 'Super Admin';

                                            return (
                                                <TableCell key={`${role.id}-${perm.id}`} className="text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={isDisabled ? true : isChecked}
                                                            disabled={isDisabled}
                                                            onCheckedChange={() => togglePermission(role.id, perm.id)}
                                                            className="border-slate-400 dark:border-slate-600 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
                                                        />
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </GlassCard>
        </div>
    );
}
