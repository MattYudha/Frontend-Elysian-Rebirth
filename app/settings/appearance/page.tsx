'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Check, Moon, Sun, Laptop, ChevronLeft, ArrowLeft, Info, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPreferences, useUpdateUserPreferences } from '@/queries/user.queries';

export default function AppearancePage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    
    const { data: serverPrefs } = useUserPreferences();
    const updatePrefsMutation = useUpdateUserPreferences();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && serverPrefs?.theme && serverPrefs.theme !== theme) {
            setTheme(serverPrefs.theme);
        }
    }, [mounted, serverPrefs, theme, setTheme]);

    const handleSetTheme = (newTheme: string) => {
        setTheme(newTheme);
        updatePrefsMutation.mutate({ theme: newTheme });
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex justify-center text-[#111318] dark:text-white p-4">
            <div className="relative w-full max-w-md mx-auto bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-blue-900/30 flex flex-col min-h-screen shadow-2xl overflow-hidden rounded-3xl glass-obsidian">

                {/* Header */}
                <div className="sticky top-0 z-50 bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border-b border-white/20 dark:border-blue-900/30">
                    <div className="flex items-center justify-between px-4 py-4">
                        <Link href="/settings" className="flex items-center justify-center p-2 -ml-2 text-[#111318] dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-lg font-bold tracking-tight text-[#111318] dark:text-white">Appearance</h1>
                        <div className="w-10"></div> {/* Spacer for visual balance */}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-10">
                    <div className="px-6 pt-6 pb-2 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            Customize your interface theme to match your preference or environment.
                        </p>
                    </div>

                    {/* Theme Options Grid */}
                    <div className="flex flex-col gap-6 p-6">

                        {/* Light Mode Card */}
                        <div
                            onClick={() => handleSetTheme('light')}
                            className="group relative cursor-pointer"
                        >
                            <div className={cn(
                                "relative overflow-hidden rounded-xl border-2 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform duration-300 active:scale-[0.98]",
                                theme === 'light' ? "border-blue-600" : "border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                            )}>
                                {/* Abstract UI Preview */}
                                <div className="relative h-40 w-full bg-[#F3F4F6] p-4">
                                    <div className="absolute left-0 top-0 h-full w-16 bg-white opacity-50 border-r border-gray-100"></div>
                                    <div className="absolute left-20 top-4 right-4 h-3 rounded-full bg-white shadow-sm"></div>
                                    <div className="absolute left-20 top-10 right-4 h-24 rounded-lg bg-white shadow-sm flex flex-col gap-2 p-3">
                                        <div className="h-2 w-1/3 rounded-full bg-gray-100"></div>
                                        <div className="h-2 w-1/2 rounded-full bg-gray-100"></div>
                                        <div className="mt-2 h-10 w-full rounded bg-blue-50/50"></div>
                                    </div>
                                    <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-blue-100 opacity-20 blur-xl"></div>
                                </div>

                                <div className="flex items-center justify-between px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#111318] dark:text-black">Light</span>
                                        {theme === 'light' && <span className="text-sm text-blue-600 font-medium mt-0.5">Active</span>}
                                    </div>
                                    <div className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-full transition-all",
                                        theme === 'light'
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                            : "border border-gray-300 dark:border-gray-600 bg-transparent"
                                    )}>
                                        {theme === 'light' && <Check className="w-4 h-4 stroke-[3]" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dark Mode Card */}
                        <div
                            onClick={() => handleSetTheme('dark')}
                            className="group relative cursor-pointer"
                        >
                            <div className={cn(
                                "relative overflow-hidden rounded-xl border-2 bg-gray-50 dark:bg-[#0B1120]/60 transition-all duration-300 active:scale-[0.98]",
                                theme === 'dark' ? "border-blue-600 dark:border-blue-600" : "border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                            )}>
                                {/* Abstract UI Preview */}
                                <div className="relative h-40 w-full bg-[#1E232F] p-4">
                                    <div className="absolute left-0 top-0 h-full w-16 bg-white/5 border-r border-white/5"></div>
                                    <div className="absolute left-20 top-4 right-4 h-3 rounded-full bg-white/10"></div>
                                    <div className="absolute left-20 top-10 right-4 h-24 rounded-lg bg-[#252A36] border border-white/5 flex flex-col gap-2 p-3">
                                        <div className="h-2 w-1/3 rounded-full bg-white/10"></div>
                                        <div className="h-2 w-1/2 rounded-full bg-white/10"></div>
                                        <div className="mt-2 h-10 w-full rounded bg-blue-600/10"></div>
                                    </div>
                                    <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-indigo-500 opacity-10 blur-xl"></div>
                                </div>

                                <div className="flex items-center justify-between px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#111318] dark:text-white">Dark</span>
                                        {theme === 'dark' && <span className="text-sm text-blue-600 font-medium mt-0.5">Active</span>}
                                    </div>
                                    <div className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-full transition-all",
                                        theme === 'dark'
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                            : "border border-gray-300 dark:border-gray-600 bg-transparent"
                                    )}>
                                        {theme === 'dark' && <Check className="w-4 h-4 stroke-[3]" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Mode Card */}
                        <div
                            onClick={() => handleSetTheme('system')}
                            className="group relative cursor-pointer"
                        >
                            <div className={cn(
                                "relative overflow-hidden rounded-xl border-2 bg-gray-50 dark:bg-[#0B1120]/60 transition-all duration-300 active:scale-[0.98]",
                                theme === 'system' ? "border-blue-600 dark:border-blue-600" : "border-transparent dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                            )}>
                                {/* Abstract UI Preview */}
                                <div className="relative h-40 w-full flex">
                                    {/* Left Half (Light) */}
                                    <div className="w-1/2 h-full bg-[#F3F4F6] relative overflow-hidden">
                                        <div className="absolute left-4 top-10 right-0 h-16 rounded-l-lg bg-white shadow-sm p-3 border-r-0 border border-gray-100">
                                            <div className="h-2 w-3/4 rounded-full bg-gray-100 mb-2"></div>
                                            <div className="h-8 w-full rounded bg-blue-50/50"></div>
                                        </div>
                                    </div>
                                    {/* Right Half (Dark) */}
                                    <div className="w-1/2 h-full bg-[#1E232F] relative overflow-hidden">
                                        <div className="absolute left-0 top-10 right-4 h-16 rounded-r-lg bg-[#252A36] border border-l-0 border-white/5 p-3">
                                            <div className="h-2 w-3/4 rounded-full bg-white/10 mb-2"></div>
                                            <div className="h-8 w-full rounded bg-blue-600/10"></div>
                                        </div>
                                    </div>
                                    {/* Split Line/Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-10 w-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 z-10">
                                            <Laptop className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-5 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#111318] dark:text-white">System</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">Follows device settings</span>
                                        {theme === 'system' && <span className="text-sm text-blue-600 font-medium mt-0.5 block md:hidden">Active</span>}
                                    </div>
                                    <div className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-full transition-all",
                                        theme === 'system'
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                                            : "border border-gray-300 dark:border-gray-600 bg-transparent"
                                    )}>
                                        {theme === 'system' && <Check className="w-4 h-4 stroke-[3]" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Info Tip */}
                    <div className="px-6 mt-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <p className="text-xs text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                                Changes will apply to this device only and sync to your user account profile preferences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
