'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Book, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            active: pathname === '/dashboard',
        },
        {
            label: 'Chat',
            href: '/chat',
            icon: MessageSquare,
            active: pathname.startsWith('/chat'),
        },
        {
            label: 'Knowledge',
            href: '/knowledge',
            icon: Book,
            active: pathname.startsWith('/knowledge'),
        },
        {
            label: 'Profile',
            href: '/settings', // Assuming Profile links to Settings or Profile page
            icon: User,
            active: pathname.startsWith('/settings'),
        },
    ];

    return (
        <div id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 h-16 px-6 flex items-center justify-between md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[calc(env(safe-area-inset-bottom))] transition-all duration-300">
            {navItems.map((item) => {
                const getOnboardingId = (href: string) => {
                    if (href === '/dashboard') return 'mobile-nav-dashboard';
                    if (href === '/chat') return 'mobile-nav-chat';
                    if (href === '/knowledge') return 'mobile-nav-knowledge';
                    if (href === '/settings') return 'mobile-nav-profile';
                    return undefined;
                };

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        id={getOnboardingId(item.href)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                            item.active
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        )}
                    >
                        <item.icon className={cn("h-6 w-6", item.active && "fill-current")} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
