'use client';

import Link from 'next/link';
import Image from 'next/image';

import { NavigationMenu } from '@/components/NavigationMenu';
import { GettingStartedWidget } from '@/components/GettingStartedWidget';
import { User, ChevronsLeft, HelpCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const { isOpen, toggle } = useSidebar();
    const { user } = useAuthStore();

    return (
        <aside id="main-sidebar" className={cn(
            "border-r border-blue-100 dark:border-blue-900/30 bg-white/70 backdrop-blur-md dark:bg-[#0B1120]/70 relative hidden md:flex flex-col h-full overflow-hidden shadow-sm z-30 transition-all duration-300 ease-in-out shrink-0",
            isOpen ? "w-64" : "w-20"
        )}>
            {/* Visual Identity: Elysian Clouds Background (Animated) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50/50 to-white dark:from-blue-900/20 dark:via-[#0B1120]/50 dark:to-[#0B1120]" />

                {/* Animated Gradient Orbs (Clouds) */}
                <div className="absolute -top-10 -left-20 h-40 w-40 rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl animate-cloud-float" />
                <div className="absolute top-10 right-0 h-32 w-32 rounded-full bg-white/60 dark:bg-blue-900/20 blur-2xl animate-cloud-float-slow" />
            </div>

            {/* Header: Logo & Toggle */}
            <div className={cn(
                "relative z-10 py-5 border-b border-blue-100/50 dark:border-blue-900/30 flex items-center transition-all duration-500 ease-out animate-sidebar-enter",
                isOpen ? "px-4 justify-between" : "px-2 justify-center"
            )}>
                {isOpen ? (
                    <div className="flex items-center gap-3">
                        <Image src="/assets/logo.svg" alt="Elysian Logo" width={54} height={54} className="relative z-10 scale-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#338DB0] to-[#479BBA] dark:from-blue-100 dark:via-blue-200 dark:to-white bg-clip-text text-transparent font-heading drop-shadow-sm">
                            Elysian
                        </h1>
                    </div>
                ) : (
                    <div className="flex justify-center mb-2">
                        <Image src="/assets/logo.svg" alt="Elysian Logo" width={48} height={48} className="relative z-10 scale-100 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
                    </div>
                )}

                {isOpen && (
                    <button
                        onClick={toggle}
                        className="relative p-1 rounded-md text-slate-400 dark:text-slate-500 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-sm hover:shadow-blue-200/50 dark:hover:shadow-blue-900/20 group"
                    >
                        <ChevronsLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </button>
                )}
            </div>

            {!isOpen && (
                <div className="relative z-10 flex justify-center pb-2 border-b border-blue-100/50 dark:border-blue-900/30">
                    <button
                        onClick={toggle}
                        className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                        <ChevronsLeft className="h-5 w-5 rotate-180" />
                    </button>
                </div>
            )}

            {/* Navigation - Dense Mode */}
            <div className="relative z-10 flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden pb-6 scrollbar-width-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                <NavigationMenu />
            </div>

            {/* Footer Area */}
            <div className="relative z-10 p-3 pb-6 space-y-3 bg-white/60 dark:bg-[#0B1120]/60 backdrop-blur-md border-t border-blue-100 dark:border-blue-900/30">
                {/* Getting Started Widget - Moved to Bottom */}
                {isOpen && <GettingStartedWidget />}

                {/* Admin Dashboard Link (For Super Admins) */}
                {isOpen ? (
                    (user?.role === 'admin' || user?.role === 'super_admin') && (
                        <Link href="/admin" className="w-full">
                            <Button variant="outline" className="w-full justify-start gap-2 bg-gradient-to-r from-sky-50 to-white dark:from-sky-900/20 dark:to-[#0B1120] hover:from-sky-100 hover:to-sky-50 dark:hover:from-sky-900/40 dark:hover:to-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 h-9 rounded-lg text-sm font-semibold shadow-sm animate-in fade-in duration-300 group">
                                <Shield className="h-4 w-4 text-sky-500 dark:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors" />
                                Admin Panel
                            </Button>
                        </Link>
                    )
                ) : (
                    (user?.role === 'admin' || user?.role === 'super_admin') && (
                        <div className="flex justify-center mb-2">
                            <Link href="/admin">
                                <Button variant="ghost" size="icon" className="text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30 h-9 w-9 relative group">
                                    <Shield className="h-5 w-5" />
                                    <span className="absolute left-10 bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800 shadow-md text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        Admin Panel
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    )
                )}

                {/* Bantuan Button (Reference Image 2) */}
                {isOpen ? (
                    <Link href="/help" className="w-full">
                        <Button variant="outline" className="w-full justify-start gap-2 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 h-9 rounded-lg text-sm font-semibold shadow-sm animate-in fade-in duration-300">
                            <HelpCircle className="h-4 w-4" />
                            Bantuan
                        </Button>
                    </Link>
                ) : (
                    <div className="flex justify-center">
                        <Link href="/help">
                            <Button variant="ghost" size="icon" className="text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 h-9 w-9">
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* User Profile - Compact */}
                <div id="user-menu-trigger" className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-sm",
                    !isOpen && "justify-center"
                )}>
                    {user?.avatar ? (
                        <div className="h-8 w-8 min-w-[2rem] rounded-full overflow-hidden shadow-md">
                            <Image src={user.avatar} alt={user.name || "User"} width={32} height={32} className="object-cover w-full h-full" />
                        </div>
                    ) : (
                        <div className="h-8 w-8 min-w-[2rem] rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 flex items-center justify-center text-white shadow-md">
                            <User className="h-4 w-4" />
                        </div>
                    )}

                    {isOpen && (
                        <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">
                                {user?.email || 'user@elysian.app'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
