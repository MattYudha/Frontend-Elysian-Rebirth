'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cloud, Sparkles, User, Settings, LogOut, LayoutGrid } from 'lucide-react';
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
                            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-lg text-white">
                                <Cloud className="h-5 w-5 fill-white" />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Logo & Title */}
                    <Link href="/dashboard" className="hidden md:flex items-center gap-3 group">
                        <div className={cn(
                            "relative flex items-center justify-center bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl text-white transition-all duration-500",
                            scrolled ? "w-9 h-9 shadow-md" : "w-10 h-10 shadow-lg scale-110"
                        )}>
                            <Cloud className={cn("fill-white transition-all", scrolled ? "h-5 w-5" : "h-6 w-6")} />
                            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-200 animate-pulse" />
                        </div>
                        <div className="hidden lg:flex flex-col">
                            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 leading-none">
                                Elysian
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium tracking-wide">ENTERPRISE</span>
                        </div>
                    </Link>

                    {/* Page Title (Fade in when scrolled or always visible?) 
                        Let's keep it consistent: Divider + Title */}
                    {scrolled && (
                        <>
                            <div className="hidden md:block h-5 w-px bg-slate-200/60 mx-1 animate-in fade-in zoom-in" />
                            <h1 className="hidden md:block text-sm font-semibold text-slate-700 animate-in fade-in slide-in-from-left-2">
                                {getPageTitle()}
                            </h1>
                        </>
                    )}
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
