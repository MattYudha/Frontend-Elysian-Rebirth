"use client";

import { useState } from "react";
import { FeatureFlag } from "@/types/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Globe, Users } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MOCK_FLAGS: FeatureFlag[] = [
    {
        id: "flag_001",
        key: "enable_beta_rag",
        name: "Beta RAG Pipeline",
        description: "Enables new vector retrieval algorithm (HyDE).",
        isEnabled: false,
        scope: "Global"
    },
    {
        id: "flag_002",
        key: "maintenance_mode",
        name: "Maintenance Mode",
        description: "Locks all write operations. Use with caution.",
        isEnabled: false,
        scope: "Global"
    },
    {
        id: "flag_003",
        key: "enterprise_analytics",
        name: "Enterprise Analytics Dashboard",
        description: "Access to advanced chart reports.",
        isEnabled: true,
        scope: "Tenant",
        targetTenants: ["ten_001", "ten_003"]
    }
];

export default function FeatureFlagsPage() {
    const [flags, setFlags] = useState<FeatureFlag[]>(MOCK_FLAGS);
    const [search, setSearch] = useState("");

    const toggleFlag = (id: string, currentState: boolean) => {
        // Optimistic UI Update
        setFlags(prev => prev.map(f => f.id === id ? { ...f, isEnabled: !currentState } : f));

        const flag = flags.find(f => f.id === id);
        const newState = !currentState;

        toast.promise(new Promise(resolve => setTimeout(resolve, 800)), {
            loading: `Updating ${flag?.key}...`,
            success: () => {
                // In real app, this would be a PATCH /api/admin/flags/:id
                return `${flag?.name} is now ${newState ? 'ENABLED' : 'DISABLED'}`;
            },
            error: "Failed to update flag"
        });
    };

    const filteredFlags = flags.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.key.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Feature Flags (LaunchDarkly Lite)</h1>
                    <p className="text-muted-foreground">Real-time feature toggling without deployment.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Create Flag
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Feature Flag</DialogTitle>
                            <DialogDescription>
                                Add a new toggle key to the system. Frontend must implement this key.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="key">Flag Key (camelCase)</Label>
                                <Input id="key" placeholder="e.g. enableNewDashboard" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input id="desc" placeholder="What does this do?" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => toast.success("Flag Created (Mock)")}>Create Flag</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search flags..."
                        className="pl-8 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-white/10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <GlassCard variant="solid" className="rounded-md border-0 overflow-hidden">
                <Table className="compact-table">
                    <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                        <TableRow className="border-slate-200 dark:border-white/5 hover:bg-transparent">
                            <TableHead className="w-[300px] text-slate-500 dark:text-slate-400">Flag Detail</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Scope</TableHead>
                            <TableHead className="text-slate-500 dark:text-slate-400">Targeting</TableHead>
                            <TableHead className="text-right text-slate-500 dark:text-slate-400">State</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFlags.map(flag => (
                            <TableRow key={flag.id} className="border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-slate-900 dark:text-slate-200">{flag.name}</span>
                                        <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded w-fit text-slate-500 dark:text-slate-400 mt-1 border border-slate-200 dark:border-white/5">
                                            {flag.key}
                                        </code>
                                        <span className="text-xs text-slate-500 mt-1">{flag.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="gap-1 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                                        {flag.scope === 'Global' ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                        {flag.scope}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {flag.scope === 'Tenant' && flag.targetTenants ? (
                                        <div className="flex gap-1 flex-wrap">
                                            {flag.targetTenants.map(t => (
                                                <Badge key={t} variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{t}</Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-500 dark:text-slate-600 italic">All Users</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-3">
                                        <span className={`text-xs font-medium ${flag.isEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-600'}`}>
                                            {flag.isEnabled ? 'ON' : 'OFF'}
                                        </span>
                                        <Switch
                                            checked={flag.isEnabled}
                                            onCheckedChange={() => toggleFlag(flag.id, flag.isEnabled)}
                                            className="data-[state=checked]:bg-emerald-500"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </GlassCard>
        </div>
    );
}
