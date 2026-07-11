'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, X, Shield, HelpCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { NavigationMenu } from '@/components/NavigationMenu';
import Image from 'next/image';
import Link from 'next/link';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { GettingStartedWidget } from '@/components/GettingStartedWidget';
import { TenantSelector } from '@/components/TenantSelector';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function MobileSidebar() {
    const { isMobileOpen, setMobileOpen } = useSidebar();
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    // Auto-close sidebar when route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } finally {
            logout();
            toast.success("Berhasil keluar dari akun.");
            router.push('/login');
            setMobileOpen(false);
        }
    };

    return (
        <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>

            {/* THE ELYSIAN obsidian GLASS CONTAINER */}
            <SheetContent 
                side="left" 
                className="w-[280px] sm:w-[310px] p-0 border-r border-slate-200/50 dark:border-blue-950/40 shadow-2xl bg-white/95 dark:bg-[#070e1c]/95 backdrop-blur-2xl [&>button]:hidden data-[state=open]:duration-500 data-[state=open]:ease-in-out will-change-transform overflow-hidden flex flex-col h-full"
            >
                {/* 1. AMBIENT GLOW DECORATORS */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-5%] left-[-15%] w-60 h-60 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px]" />
                    <div className="absolute bottom-[-5%] right-[-15%] w-60 h-60 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* 2. HEADER: Brand Identity */}
                    <div className="p-5 pb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="relative shrink-0">
                                <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 rounded-full" />
                                <Image
                                    src="/assets/logo.svg"
                                    alt="Elysian Logo"
                                    width={36}
                                    height={36}
                                    className="relative z-10"
                                />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                    Elysian
                                </h2>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase leading-none mt-0.5">Autonomous Oversight</p>
                            </div>
                        </div>
                        {/* Close Button */}
                        <div
                            onClick={() => setMobileOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800"
                        >
                            <X className="w-4 h-4" />
                        </div>
                    </div>

                    <Separator className="bg-slate-100 dark:bg-blue-950/45" />

                    {/* 3. SCROLLABLE NAVIGATION CONTENT */}
                    <div className="flex-1 overflow-y-auto py-5 px-4 space-y-5 scrollbar-none">
                        {/* Workspace / Tenant Selector */}
                        <div className="pb-3">
                            <TenantSelector forceOpen={true} />
                        </div>

                        {/* Getting Started Progress Widget */}
                        <GettingStartedWidget />

                        <Separator className="bg-slate-150/40 dark:bg-blue-950/20" />

                        {/* Menu Navigation items */}
                        <div className="space-y-1">
                            <NavigationMenu />
                        </div>

                        {/* Supplemental action badges */}
                        <div className="space-y-2 pt-2">
                            {(user?.role === 'admin' || user?.role === 'super_admin') && (
                                <Link href="/admin" onClick={() => setMobileOpen(false)} className='block'>
                                    <Button variant="outline" className="w-full justify-start gap-2 border-sky-100 dark:border-sky-950/40 bg-sky-500/5 hover:bg-sky-500/10 text-sky-700 dark:text-sky-400 h-9 rounded-xl text-xs font-bold transition-all shadow-none">
                                        <Shield className="h-3.5 w-3.5" />
                                        Admin Dashboard
                                    </Button>
                                </Link>
                            )}

                            <Link href="/help" onClick={() => setMobileOpen(false)} className='block'>
                                <Button variant="outline" className="w-full justify-start gap-2 border-slate-100 dark:border-blue-950/30 bg-slate-50/60 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-350 h-9 rounded-xl text-xs font-bold transition-all shadow-none">
                                    <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                                    Pusat Bantuan
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* 4. FOOTER: User Profile & Night Mode Toggle */}
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-blue-950/30 pb-safe-offset-4 shrink-0">
                        <div className="rounded-2xl border border-slate-200/50 dark:border-blue-950/30 bg-white/70 dark:bg-slate-900/40 p-3.5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                                    {user?.avatar ? (
                                        <AvatarImage src={user.avatar} alt={user.name || 'User'} />
                                    ) : null}
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold text-xs">
                                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 pr-1">
                                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
                                        {user?.name || 'Guest User'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-medium">
                                        {user?.email || 'guest@elysian.ai'}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="h-8 w-8 shrink-0 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850"
                                >
                                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-500" />
                                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-400" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </div>

                            <Separator className="bg-slate-100 dark:bg-blue-950/20 my-3" />

                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleLogout}
                                className="w-full h-8 text-[11px] font-bold border-rose-200/40 dark:border-rose-950/40 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-450 hover:text-rose-700 dark:hover:text-rose-400 hover:border-rose-250 dark:hover:border-rose-900/30 rounded-xl transition-all shadow-none"
                            >
                                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                                Logout Sesi
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
