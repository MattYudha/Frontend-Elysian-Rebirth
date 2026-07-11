'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, Inbox, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useRef, useEffect } from 'react';

const NAV_ITEMS = [
    { label: 'Overview', href: '/workstreams', icon: Activity },
    { label: 'Active', href: '/workstreams/active', icon: Clock },
    { label: 'Completed', href: '/workstreams/completed', icon: CheckCircle2 },
    { label: 'All', href: '/workstreams/all', icon: Inbox },
    { label: 'Log', href: '/workstreams/team-activity', icon: Users },
];

export function WorkstreamMobileNav() {
    const pathname = usePathname();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to selected element on mount if needed
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        // Find the active element
        const activeElement = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
        if (activeElement) {
            // Scroll it into view smoothly
            const container = scrollContainerRef.current;
            const scrollLeft = activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }, [pathname]);

    return (
        <div className="lg:hidden sticky top-[64px] z-40 w-full bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div
                ref={scrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto px-4 py-2 overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {NAV_ITEMS.map((item) => {
                    // Exact match for Overview (/workstreams), precise match for specific targets
                    const isActive = item.href === '/workstreams'
                        ? pathname === '/workstreams'
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            data-active={isActive}
                            className="shrink-0"
                        >
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors relative",
                                    isActive
                                        ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400")} />
                                <span>{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
