'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, Smartphone, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUpdatePassword } from '@/queries/user.queries';

export default function SecurityPage() {
    const router = useRouter();
    const { logout } = useUserStore();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const updatePasswordMutation = useUpdatePassword();

    const handleChange = (field: string, value: string) => {
        setPasswords(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.new.length < 8) {
            toast.error("Password baru minimal 8 karakter");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error("Konfirmasi password tidak cocok");
            return;
        }

        updatePasswordMutation.mutate({
            old_password: passwords.current,
            new_password: passwords.new,
        }, {
            onSuccess: () => {
                // Clear session logic
                setTimeout(() => {
                    logout();
                    toast.info("Logging out...");
                    router.push('/login');
                }, 2000);
            }
        });
    };

    return (
        <div className="w-full">

            {/* Layout: Stack on Mobile/Tablet, Row on Desktop (xl) to prevent horizontal scrolling */}
            <div className="flex flex-col xl:flex-row gap-8">

                {/* Main Content: Password & 2FA */}
                <div className="flex-1 min-w-0 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign in & Security</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage your password and account protection settings.</p>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white dark:bg-[#0B1120]/60 p-6 md:p-8 border border-slate-200 dark:border-blue-900/30 rounded-2xl shadow-sm glass-obsidian">
                        <div className="flex items-center gap-2 pb-6 border-b border-slate-100 dark:border-blue-900/30 mb-6">
                            <Key className="w-5 h-5 text-blue-500" />
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Password Configuration</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
                            <div className="space-y-2">
                                <Label htmlFor="current" className="text-xs text-slate-500 uppercase font-semibold">Current Password</Label>
                                <Input
                                    id="current"
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => handleChange('current', e.target.value)}
                                    className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new" className="text-xs text-slate-500 uppercase font-semibold">New Password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => handleChange('new', e.target.value)}
                                        className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg"
                                        placeholder="Min. 8 chars"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm" className="text-xs text-slate-500 uppercase font-semibold">Confirm</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => handleChange('confirm', e.target.value)}
                                        className="h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-900/50 rounded-lg"
                                        placeholder="Re-enter"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button 
                                    type="submit" 
                                    disabled={updatePasswordMutation.isPending}
                                    className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20"
                                >
                                    {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* 2FA Card */}
                    <div className="p-6 md:p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-start gap-5 glass-obsidian">
                        <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl text-blue-600 dark:text-blue-300 flex-shrink-0">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Two-Factor Authentication</h3>
                                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                Secure your account with an extra layer of protection via SMS or Authenticator app. We recommend enabling this for higher security score.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Context Panel: Security Score & History */}
                <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
                    <div className="sticky top-6 space-y-6">
                        {/* Security Score Widget */}
                        <div className="bg-white dark:bg-[#0B1120]/60 p-6 border border-slate-200 dark:border-blue-900/30 rounded-2xl shadow-sm text-center glass-obsidian">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Security Health</h3>

                            {/* Ring Representation */}
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.86" strokeDashoffset="52" className="text-green-500 transition-all duration-1000 ease-out" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">85%</span>
                                    <span className="text-[10px] uppercase font-bold text-green-500">Good</span>
                                </div>
                            </div>

                            <div className="text-xs text-left bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-blue-900/30">
                                <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Recommended Action:</p>
                                <p className="text-slate-500 flex items-center gap-1">
                                    <span className="text-blue-500">•</span> Add a recovery email
                                </p>
                            </div>
                        </div>

                        {/* Login History Mini */}
                        <div className="bg-transparent border-t border-slate-200 dark:border-blue-900/30 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sessions</h3>
                                <button onClick={logout} className="text-[10px] font-bold text-red-500 hover:text-red-600">REVOKE ALL</button>
                            </div>
                            <div className="space-y-3">
                                {/* Item 1 */}
                                <div className="flex items-start gap-3">
                                    <Smartphone className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">iPhone 14 Pro</p>
                                        <p className="text-[10px] text-green-500">Active now • San Francisco</p>
                                    </div>
                                </div>
                                {/* Item 2 */}
                                <div className="flex items-start gap-3">
                                    <div className="w-4 h-4 flex items-center justify-center"><div className="w-3 h-3 border  border-slate-400 rounded-sm"></div></div>
                                    <div className="opacity-60">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">MacBook Pro</p>
                                        <p className="text-[10px] text-slate-400">2h ago • Austin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
