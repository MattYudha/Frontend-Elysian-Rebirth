'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check, Loader2 } from 'lucide-react';
import { useSettingsUiStore } from '@/store/ui/settingsStore';
import { useTenant } from '@/contexts/TenantContext';
import { useUpdateTenant } from '@/queries/tenant.queries';

export default function PreferencesPage() {
    const [copied, setCopied] = useState(false);
    const { setDirty } = useSettingsUiStore();
    const { currentTenant, isLoading } = useTenant();
    const updateTenantMutation = useUpdateTenant();

    const [workspaceName, setWorkspaceName] = useState("");
    const workspaceId = currentTenant?.id || "";

    useEffect(() => {
        if (currentTenant) {
            setWorkspaceName(currentTenant.name);
        }
    }, [currentTenant]);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }, [copied]);

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(workspaceId);
            setCopied(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkspaceName(e.target.value);
        const isNameChanged = e.target.value !== (currentTenant?.name || "");
        setDirty('/settings/workspace/preferences', isNameChanged);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading workspace details...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Preferences</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage your workspace details, and set global workspace preferences.
                </p>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Information Section */}
            <section className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-start">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="block font-medium text-slate-900 dark:text-slate-200">Workspace</span>
                        This is the name shown across the workspace.
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-inner font-bold text-xl">
                            {workspaceName.charAt(0).toUpperCase()}
                        </div>
                        <Input
                            value={workspaceName}
                            onChange={handleNameChange}
                            className="max-w-[320px] h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                        />
                    </div>
                </div>
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Keys section */}
            <section className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Keys</h4>
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-start">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        <span className="block font-medium text-slate-900 dark:text-slate-200">Workspace ID</span>
                        Use this ID when connecting integrations.
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative max-w-[320px] w-full">
                            <Input
                                readOnly
                                value={workspaceId}
                                className="font-mono text-sm bg-slate-50 dark:bg-slate-900/50 pr-24 border-slate-200 dark:border-slate-800"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-8 gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                onClick={handleCopyId}
                            >
                                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
                <Button
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    disabled={updateTenantMutation.isPending || workspaceName === (currentTenant?.name || "")}
                    onClick={() => {
                        if (!currentTenant) return;
                        updateTenantMutation.mutate({
                            id: currentTenant.id,
                            data: { name: workspaceName }
                        }, {
                            onSuccess: () => {
                                setDirty('/settings/workspace/preferences', false);
                            }
                        });
                    }}
                >
                    {updateTenantMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}
