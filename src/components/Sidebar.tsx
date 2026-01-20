'use client';

import Link from 'next/link';

import { NavigationMenu } from '@/components/NavigationMenu';
import { GettingStartedWidget } from '@/components/GettingStartedWidget';
import { User, Infinity as InfinityIcon, Sparkles, ChevronsLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/';
import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const { isOpen, toggle } = useSidebar();

    return (
        <aside className={cn(
            "border-r border-blue-100 bg-white relative hidden md:flex flex-col h-full overflow-hidden shadow-sm z-30 transition-all duration-300 ease-in-out",
            isOpen ? "w-64" : "w-20"
        )}>
            {/* Visual Identity: Elysian Clouds Background (Animated) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50/50 to-white" />

                {/* Animated Gradient Orbs (Clouds) */}
                <div className="absolute -top-10 -left-20 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl animate-cloud-float" />
                <div className="absolute top-10 right-0 h-32 w-32 rounded-full bg-white/60 blur-2xl animate-cloud-float-slow" />
            </div>

            {/* Header: Logo & Toggle */}
            <div className={cn(
                "relative z-10 py-5 border-b border-blue-100/50 flex items-center transition-all duration-500 ease-out animate-sidebar-enter",
                isOpen ? "px-4 justify-between" : "px-2 justify-center"
            )}>
                {isOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-400/30 ring-1 ring-white/30 backdrop-blur-md transition-all duration-500 group-hover:scale-[1.03] animate-[logo-pulse_1.5s_ease-out]">
                            <InfinityIcon className="h-5 w-5 stroke-white" strokeWidth={2.5} />
                            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-white/90 animate-pulse fill-white/20" />
                        </div>
                        <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                            Elysian Rebirth
                        </h1>
                    </div>
                ) : (
                    <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-400/30 ring-1 ring-white/30 backdrop-blur-md mb-2 animate-[logo-pulse_1.5s_ease-out]">
                        <InfinityIcon className="h-5 w-5 stroke-white" strokeWidth={2.5} />
                        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-white/90 animate-pulse fill-white/20" />
                    </div>
                )}

                {isOpen && (
                    <button
                        onClick={toggle}
                        className="relative p-1 rounded-md text-slate-400 transition-all duration-300 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm hover:shadow-blue-200/50 group"
                    >
                        <ChevronsLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </button>
                )}
            </div>

            {!isOpen && (
                <div className="relative z-10 flex justify-center pb-2 border-b border-blue-100/50">
                    <button
                        onClick={toggle}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                    >
                        <ChevronsLeft className="h-5 w-5 rotate-180" />
                    </button>
                </div>
            )}

            {/* Navigation - Dense Mode */}
            <div className="relative z-10 flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden pb-6">
                <NavigationMenu />
            </div>

            {/* Footer Area */}
            <div className="relative z-10 p-3 pb-6 space-y-3 bg-white/60 backdrop-blur-md border-t border-blue-100">
                {/* Getting Started Widget - Moved to Bottom */}
                {isOpen && <GettingStartedWidget />}

                {/* Bantuan Button (Reference Image 2) */}
                {isOpen ? (
                    <Link href="/help" className="w-full">
                        <Button variant="outline" className="w-full justify-start gap-2 bg-blue-50/50 hover:bg-blue-100 border-blue-200 text-blue-700 h-9 rounded-lg text-sm font-semibold shadow-sm animate-in fade-in duration-300">
                            <HelpCircle className="h-4 w-4" />
                            Bantuan
                        </Button>
                    </Link>
                ) : (
                    <div className="flex justify-center">
                        <Link href="/help">
                            <Button variant="ghost" size="icon" className="text-blue-700 hover:bg-blue-100 h-9 w-9">
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* User Profile - Compact */}
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 transition-all duration-200 cursor-pointer group border border-transparent hover:border-blue-100 hover:shadow-sm",
                    !isOpen && "justify-center"
                )}>
                    <div className="h-8 w-8 min-w-[2rem] rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                        <User className="h-4 w-4" />
                    </div>
                    {isOpen && (
                        <div className="flex-1 overflow-hidden animate-in fade-in duration-300">
                            <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-700 transition-colors">Admin User</p>
                            <p className="text-[10px] text-slate-500 truncate font-medium">admin@elysian.ai</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
