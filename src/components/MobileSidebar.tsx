'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Settings, User as UserIcon, X, Shield, HelpCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NavigationMenu } from '@/components/NavigationMenu';
import Image from 'next/image';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { GettingStartedWidget } from '@/components/GettingStartedWidget';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function MobileSidebar() {
    // Kita gunakan context untuk state sidebar agar sinkron
    const { isMobileOpen, setMobileOpen } = useSidebar();
    const { user } = useAuthStore();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // Auto-close sidebar when route changes (mobile mode)
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    return (
        <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>

            {/* THE ELYSIAN GLASS CONTAINER */}
            <SheetContent side="left" className="w-[270px] sm:w-[300px] p-0 border-r border-white/20 shadow-2xl bg-gradient-to-b from-sky-50/80 via-white/90 to-blue-50/80 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-950/90 backdrop-blur-xl [&>button]:hidden data-[state=open]:duration-600 data-[state=open]:ease-in-out will-change-transform">

                {/* 1. AMBIENT BACKGROUND (The "Elysian Soul") */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-blue-400/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-10%] right-[-20%] w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* 2. HEADER: Brand Identity */}
                    <div className="p-6 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 blur-lg opacity-20 rounded-full" />
                                <Image
                                    src="/assets/logo.svg"
                                    alt="Elysian"
                                    width={42}
                                    height={42}
                                    className="relative z-10"
                                />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent font-heading">
                                    Elysian
                                </h2>
                                <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Dashboard</p>
                            </div>
                        </div>
                        {/* Close Button yang lebih elegan */}
                        <div
                            onClick={() => setMobileOpen(false)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-blue-100 to-transparent dark:via-slate-800 opacity-50" />

                    {/* 3. NAVIGATION AREA - Scrollable including Widgets */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                        {/* Getting Started Widget */}
                        <GettingStartedWidget />

                        {/* Main Menu */}
                        <div className="space-y-1">
                            <NavigationMenu />
                        </div>

                        {/* WIDGETS SECTION (Restored & Styled) */}
                        <div className="space-y-2 pt-1">
                            {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                <Link href="/admin" onClick={() => setMobileOpen(false)} className='block'>
                                    <Button variant="outline" className="w-full justify-start gap-2 bg-gradient-to-r from-sky-50 to-white/60 dark:from-sky-950/40 dark:to-slate-900/40 hover:from-sky-100 dark:hover:from-sky-900/60 hover:to-sky-50 dark:hover:to-slate-800/60 border-sky-200 dark:border-sky-800/50 text-sky-700 dark:text-sky-300 h-9 rounded-lg text-sm font-semibold shadow-sm transition-all">
                                        <Shield className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                                        Admin Panel
                                    </Button>
                                </Link>
                            )}

                            {/* Help Button */}
                            <Link href="/help" onClick={() => setMobileOpen(false)} className='block'>
                                <Button variant="outline" className="w-full justify-start gap-2 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 h-9 rounded-lg text-sm font-semibold shadow-sm transition-all">
                                    <HelpCircle className="h-4 w-4" />
                                    Bantuan
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* 4. FOOTER: User Profile Card */}
                    <div className="p-4 mt-auto z-20 pb-24">
                        <div className="rounded-2xl bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-900/30 border border-white/50 dark:border-slate-700 shadow-lg backdrop-blur-md p-4 group hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-700 shadow-sm">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white">AD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                                        Admin User
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">admin@elysian.ai</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="h-8 w-8 shrink-0 rounded-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-500" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </div>

                            <div className="mt-3">
                                <Button variant="outline" size="sm" className="w-full h-8 text-xs border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/50 text-slate-700 dark:text-slate-300 transition-all">
                                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
