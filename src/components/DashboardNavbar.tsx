'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings, LogOut, LayoutGrid, Infinity as InfinityIcon, Bot } from 'lucide-react';
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

// Placeholder for user avatar
const UserAvatar = () => (
    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] cursor-pointer hover:shadow-md transition-shadow">
        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <User className="h-5 w-5 text-blue-500" />
        </div>
    </div>
);

export function DashboardNavbar({ staticMode = false }: { staticMode?: boolean }) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const container = document.getElementById('main-scroll-container');
            // If container exists, use its scrollTop, otherwise use window.scrollY
            const scrollY = container ? container.scrollTop : window.scrollY;
            const isScrolled = scrollY > 20;
            setScrolled(isScrolled);
        };

        // Check availability of the container
        const container = document.getElementById('main-scroll-container');
        const target = container || window;

        target.addEventListener('scroll', handleScroll, { passive: true });

        // Also trigger once on mount to check initial state
        handleScroll();

        return () => target.removeEventListener('scroll', handleScroll);
    }, []);

    const getPageTitle = () => {
        if (pathname === '/dashboard') return 'Dashboard';
        if (pathname.startsWith('/chat')) return 'AI Assistant';
        if (pathname.startsWith('/knowledge')) return 'Knowledge Base';
        if (pathname === '/editor') return 'Smart Editor';
        if (pathname === '/workflow') return 'Workflow';
        if (pathname === '/settings') return 'Settings';
        return 'Elysian';
    };

    return (
        <div className={cn(
            staticMode ? "relative w-full" : "fixed left-0 right-0 z-40 transition-all duration-500 ease-in-out pointer-events-none",
            !staticMode && (scrolled ? "top-4 px-4" : "top-0 px-0")
        )}>
            <header className={cn(
                "mx-auto flex items-center justify-between transition-all duration-500 ease-in-out",
                staticMode
                    ? "h-16 w-full px-6 bg-transparent"
                    : "pointer-events-auto",
                !staticMode && (scrolled
                    ? "h-14 max-w-5xl rounded-full border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(30,58,138,0.1)] px-4"
                    : "h-20 w-full max-w-7xl bg-transparent border-b border-transparent px-6 sm:px-8")
            )}>

                {/* Left Side: Logo & Breadcrumbs */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu & Logo */}
                    <div className="flex items-center gap-2 md:hidden">
                        <MobileSidebar />
                        <Link href="/dashboard">
                            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg text-white shadow-blue-500/20">
                                <InfinityIcon className="h-5 w-5 stroke-white" strokeWidth={2.5} />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Context: Page Title / Status */}
                    <div className="hidden md:flex items-center gap-3 ml-2 animate-in fade-in slide-in-from-left-2 duration-500">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/50 border border-slate-200/50">
                            {pathname.startsWith('/chat') ? (
                                <Bot className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                                <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
                            )}
                            <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
                                {getPageTitle()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Page Title (Always visible on mobile) */}
                <div className={cn(
                    "absolute left-1/2 -translate-x-1/2 font-semibold text-slate-800 transition-all duration-500 md:hidden",
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
                            "rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 hidden sm:flex transition-all",
                            scrolled ? "h-9 w-9" : "h-10 w-10 bg-white/50"
                        )}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>

                    {/* Notification Popover */}
                    <div className={cn(
                        "rounded-full transition-all flex items-center justify-center",
                        scrolled ? "h-9 w-9" : "h-10 w-10 bg-white/50"
                    )}>
                        <NotificationPopover />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "relative rounded-full border-none p-0 ml-1 hover:bg-transparent focus-visible:ring-0 transition-all",
                                    scrolled ? "h-9 w-9" : "h-10 w-10 scale-105"
                                )}
                            >
                                <UserAvatar />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Administrator</p>
                                    <p className="text-xs leading-none text-muted-foreground">admin@elysian.ai</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header >
        </div >
    );
}
