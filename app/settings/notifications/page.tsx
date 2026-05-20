'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserPreferences, useUpdateUserPreferences } from '@/queries/user.queries';

export default function NotificationsPage() {
    const { data: serverPrefs, isLoading } = useUserPreferences();
    const updatePrefsMutation = useUpdateUserPreferences();

    const [inApp, setInApp] = useState(true);
    const [email, setEmail] = useState(true);
    const [recommended, setRecommended] = useState(true);

    useEffect(() => {
        if (serverPrefs) {
            setEmail(serverPrefs.notifications_enabled);
        }
    }, [serverPrefs]);

    const handleSave = () => {
        updatePrefsMutation.mutate({
            notifications_enabled: email,
        }, {
            onSuccess: () => {
                toast.success("Pengaturan notifikasi disimpan", {
                    description: "Preferensi notifikasi Anda telah diperbarui.",
                });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
                Loading notification preferences...
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Stay in the loop without the noise. Choose where you get updates, and customize which activities trigger notifications.
                </p>
            </div>

            {/* Methods Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Methods</h3>

                <div className="space-y-3">
                    {/* In-app Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B1120]/50 transition-colors">
                        <div className="space-y-0.5">
                            <Label htmlFor="in-app-notifications" className="text-sm font-medium">In-app</Label>
                            <p className="text-xs text-slate-500">Notifications will go into your Inbox</p>
                        </div>
                        <Switch
                            id="in-app-notifications"
                            checked={inApp}
                            onCheckedChange={setInApp}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-400"
                        />
                    </div>

                    {/* Email Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B1120]/50 transition-colors">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications" className="text-sm font-medium">Email</Label>
                            <p className="text-xs text-slate-500">You will receive emails about events</p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={email}
                            onCheckedChange={setEmail}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-400"
                        />
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Recommended Settings Card */}
                    <div
                        onClick={() => setRecommended(true)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${recommended ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B1120]/50 hover:border-blue-300 dark:hover:border-blue-700'}`}
                    >
                        <Label className="text-sm font-medium cursor-pointer mb-2 flex items-center gap-2">
                            <span className={recommended ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>★</span> Recommended settings
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                            Stick with defaults so you never miss an important update and avoid spam.
                        </p>
                    </div>

                    {/* Custom Settings Card */}
                    <div
                        onClick={() => setRecommended(false)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${!recommended ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0B1120]/50 hover:border-blue-300 dark:hover:border-blue-700'}`}
                    >
                        <Label className="text-sm font-medium cursor-pointer mb-2 flex items-center gap-2">
                            <span className={!recommended ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>✎</span> Custom settings
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                            Fine-tune notifications to only receive updates you care about.
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <Button
                    onClick={handleSave}
                    disabled={updatePrefsMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-md shadow-blue-500/20 rounded-md px-6"
                >
                    {updatePrefsMutation.isPending ? "Saving..." : "Save preferences"}
                </Button>
            </div>
        </div>
    );
}
