'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Loader2 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useTenantMembers, useUpdateMemberRole } from '@/queries/tenant.queries';

export default function TeammatesPage() {
    const [inviteRole, setInviteRole] = useState("member");
    const { currentTenant, isLoading: isTenantLoading } = useTenant();
    const { data: teammates = [], isLoading: isMembersLoading } = useTenantMembers(currentTenant?.id || "");
    const updateRoleMutation = useUpdateMemberRole();

    if (isTenantLoading || isMembersLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading teammates...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Teammates</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Invite and manage your teammates to collaborate. You can also assign them to specific AI agents.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Invite Form */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Invite teammates by email"
                            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                            Invite
                        </Button>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden">
                <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <span className="col-span-12 sm:col-span-6">Name</span>
                    <span className="hidden sm:block sm:col-span-3">Status</span>
                    <span className="hidden sm:block sm:col-span-3 text-right">Role</span>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0B1120]">
                    {teammates.map((mate) => {
                        const status = mate.status || 'Active';
                        const initials = mate.name
                            ? mate.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                            : 'U';
                        const role = mate.role || 'member';
                        
                        return (
                            <div key={mate.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="col-span-12 sm:col-span-6 flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                                        <AvatarImage src={mate.avatar} />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col leading-tight gap-1">
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{mate.name}</span>
                                        <span className="text-xs text-slate-500">{mate.email}</span>
                                    </div>
                                </div>

                                {/* Mobile only elements - hidden on sm and up */}
                                <div className="col-span-12 mt-3 flex sm:hidden items-center justify-between text-xs">
                                    <span className={`px-2 py-1 rounded-full ${status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                        {status}
                                    </span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{role}</span>
                                </div>

                                {/* Desktop only elements */}
                                <div className="hidden sm:block sm:col-span-3 text-sm">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                        {status}
                                    </span>
                                </div>
                                <div className="hidden sm:block sm:col-span-3 text-sm text-right">
                                    <Select 
                                        value={role.toLowerCase()} 
                                        onValueChange={(newRole) => {
                                            if (newRole !== role.toLowerCase()) {
                                                updateRoleMutation.mutate({ userId: mate.id, role: newRole });
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-[110px] ml-auto border-transparent hover:border-slate-200 dark:hover:border-slate-700 capitalize">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="owner" disabled={role.toLowerCase() === 'owner'}>Owner</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="member">Member</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
