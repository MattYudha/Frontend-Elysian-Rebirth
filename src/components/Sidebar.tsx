'use client';

import Link from 'next/link';

import { NavigationMenu } from '@/components/NavigationMenu';
import { GettingStartedWidget } from '@/components/GettingStartedWidget';
import { User, Command, ChevronsLeft, HelpCircle } from 'lucide-react';
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
            {/* Visual Identity: Elysian Clouds Background - INCREASED OPACITY */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Base Gradient - Stronger Blue Tint */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-sky-50/50 to-white" />

                {/* Cloud Texture Overlay - Higher Opacity & Better Blend */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
                    style={{
                        backgroundImage: 'url(/assets/images/elysian_clouds.png)',
                    }}
                />
            </div>

            {/* Header: Logo & Toggle */}
            <div className={cn(
                "relative z-10 py-5 border-b border-blue-100/50 flex items-center transition-all",
                isOpen ? "px-4 justify-between" : "px-2 justify-center"
            )}>
                {isOpen ? (
                    <div className="flex items-center gap-2.5 animate-in fade-in duration-300">
                        <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                            <Command className="h-4.5 w-4.5" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-800">
                            Elysian
                        </h1>
                    </div>
                ) : (
                    <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white mb-2">
                        <Command className="h-5 w-5" />
                    </div>
                )}

                {isOpen && (
                    <button
                        onClick={toggle}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                    >
                        <ChevronsLeft className="h-5 w-5" />
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
