'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, LayoutGrid, Bot, Sun, Moon, Grid2x2, Grid2x2X } from 'lucide-react';
import { Button } from '@/components/ui/';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/';
import { MobileSidebar } from './MobileSidebar';
import { NotificationPopover } from '@/components/NotificationPopover';
import { useUiStore } from '@/store/uiStore';
import { useSettingsUiStore } from '@/store/ui/settingsStore';
import { useAuthStore } from '@/store/authStore';

// User avatar using data from store
const UserAvatar = ({ avatarUrl }: { avatarUrl?: string | null }) => {
    if (avatarUrl) {
        return (
            <div className="h-9 w-9 rounded-full cursor-pointer hover:shadow-md transition-shadow overflow-hidden border border-slate-200 dark:border-slate-700">
                <Image src={avatarUrl} alt="User Avatar" width={36} height={36} className="object-cover w-full h-full" />
            </div>
        );
    }

    return (
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 p-[2px] cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-blue-400" />
            </div>
        </div>
    );
};

export function DashboardNavbar({ staticMode = false }: { staticMode?: boolean }) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const { isGridVisible, toggleGrid } = useUiStore();
    const setReturnUrl = useSettingsUiStore((s) => s.setReturnUrl);
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('main-scroll-container');
            const containerScroll = container ? container.scrollTop : 0;
            const windowScroll = window.scrollY || document.documentElement.scrollTop;
            const scrollValue = Math.max(containerScroll, windowScroll);
            setScrolled(scrollValue > 20);
        };

        const container = document.getElementById('main-scroll-container');
        window.addEventListener('scroll', handleScroll, { passive: true });
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
        }

        // Also trigger once on mount to check initial state
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [pathname]);

    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'Dashboard';
        if (pathname.startsWith('/chat')) return 'AI Assistant';
        if (pathname.startsWith('/knowledge')) return 'Knowledge Base';
        if (pathname === '/editor') return 'Smart Editor';
        if (pathname === '/workflow') return 'Workflow';
        if (pathname === '/settings') return 'Settings';
        if (pathname === '/getting-started') return 'Panduan Memulai';
        if (pathname === '/help') return 'Pusat Bantuan';
        return 'Elysian';
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;

    return (
        <div className={cn(
            "w-full z-40 transition-all",
            staticMode ? "relative" : "sticky top-4 h-0 pointer-events-none"
        )}>
            <motion.header
                initial="initial"
                animate={!staticMode ? (scrolled ? "scrolled" : "initial") : "static"}
                variants={{
                    static: { y: 0 },
                    initial: { y: 0 },
                    scrolled: { y: 0 }
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={cn(
                    "mx-auto flex items-center justify-between transition-all duration-300 rounded-full border border-transparent pointer-events-auto",
                    staticMode
                        ? "h-16 w-full px-6 bg-transparent"
                        : "w-[95%] md:w-full max-w-5xl",
                    !staticMode && (scrolled
                        ? "h-14 border-slate-200/50 dark:border-slate-700/50 px-4 bg-white/90 dark:bg-slate-900/85 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]"
                        : "h-16 px-4 bg-white/0 dark:bg-slate-900/0 backdrop-blur-none shadow-none")
                )}
            >

                {/* Left Side: Logo & Breadcrumbs */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu & Logo */}
                    <div className="flex items-center gap-2 md:hidden">
                        <MobileSidebar />
                        <Link href="/dashboard">
                            <Image src="/assets/logo.svg" alt="Elysian Logo" width={54} height={54} className="scale-100 drop-shadow-md" />
                        </Link>
                    </div>

                    {/* Desktop Context: Page Title / Status */}
                    <div className="hidden md:flex items-center gap-3 ml-2 animate-in fade-in slide-in-from-left-2 duration-500">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-blue-900/40">
                            {pathname.startsWith('/chat') ? (
                                <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            ) : (
                                <LayoutGrid className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                            )}
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
                                {getPageTitle()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Page Title (Always visible on mobile) */}
                <div className={cn(
                    "absolute left-1/2 -translate-x-1/2 font-semibold text-slate-800 dark:text-slate-100 transition-all duration-500 md:hidden",
                    scrolled ? "text-sm" : "text-base"
                )}>
                    {getPageTitle()}
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-1 sm:gap-2">



                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "hidden md:flex rounded-full text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all",
                            scrolled ? "h-9 w-9" : "h-10 w-10 bg-white/50 dark:bg-slate-800/40"
                        )}
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {/* Grid Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        title={isGridVisible ? 'Hide grid background' : 'Show grid background'}
                        className={cn(
                            "rounded-full hidden sm:flex transition-all",
                            isGridVisible
                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                                : "text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30",
                            scrolled ? "h-9 w-9" : "h-10 w-10 bg-white/50 dark:bg-slate-800/40"
                        )}
                        onClick={toggleGrid}
                    >
                        {isGridVisible
                            ? <Grid2x2 className="h-4 w-4" />
                            : <Grid2x2X className="h-4 w-4" />
                        }
                    </Button>

                    {/* Notification Popover */}
                    <div className={cn(
                        "rounded-full transition-all flex items-center justify-center",
                        scrolled ? "h-9 w-9" : "h-10 w-10 bg-white/50 dark:bg-slate-800/40"
                    )}>
                        <NotificationPopover />
                    </div>

                    <div className="hidden md:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "relative rounded-full border-none p-0 ml-1 hover:bg-transparent focus-visible:ring-0 transition-all",
                                        scrolled ? "h-9 w-9" : "h-10 w-10 scale-105"
                                    )}
                                >
                                    <UserAvatar avatarUrl={user?.avatar} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@elysian.app'}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/settings/profile" onClick={() => { if (!pathname.startsWith('/settings')) setReturnUrl(pathname); }}>
                                    <DropdownMenuItem className="cursor-pointer"><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                                </Link>
                                <Link href="/settings" onClick={() => { if (!pathname.startsWith('/settings')) setReturnUrl(pathname); }}>
                                    <DropdownMenuItem className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => logout()}><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </motion.header >
        </div >
    );
}
