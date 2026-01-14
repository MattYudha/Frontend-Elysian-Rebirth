'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Plus, BookOpen, User, Scan } from 'lucide-react';

export function MobileBottomNav() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('Home');

    // Sync active state (for visual consistency, although Link causes nav)
    useEffect(() => {
        if (pathname === '/dashboard' || pathname === '/') setActiveTab('Dashboard');
        else if (pathname.startsWith('/chat')) setActiveTab('Chat');
        else if (pathname.startsWith('/knowledge')) setActiveTab('Knowledge');
        else if (pathname.startsWith('/settings')) setActiveTab('Profile');
        else if (pathname.startsWith('/editor') || pathname.startsWith('/workflow')) setActiveTab('Actions');
    }, [pathname]);

    // 5 Items Configuration: Home, Chat, [MAIN], Knowledge, Profile
    const navItems = [
        { name: 'Dashboard', icon: Home, href: '/dashboard' },
        { name: 'Chat', icon: MessageSquare, href: '/chat' },
        { name: 'Actions', icon: Plus, href: '/editor', isMain: true }, // Main Button
        { name: 'Knowledge', icon: BookOpen, href: '/knowledge' },
        { name: 'Profile', icon: User, href: '/settings' },
    ];

    if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') return null;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 pb-4 ptr-events-none">
            {/* 
                Container has pointer-events-none to let clicks pass through the edges,
                but the nav itself has pointer-events-auto.
             */}
            <nav className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/50 flex justify-between items-center h-[70px] px-6 relative mx-auto max-w-sm">

                {navItems.map((item) => {
                    const isActive = activeTab === item.name;

                    if (item.isMain) {
                        // Central "Main" Button Style (Floating Bulb/Plus)
                        return (
                            <div key={item.name} className="relative -top-6">
                                <Link
                                    href={item.href}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 ${isActive
                                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 ring-4 ring-white'
                                        : 'bg-blue-600 ring-4 ring-white'
                                        }`}
                                >
                                    <Scan className="w-6 h-6 text-white" />
                                </Link>
                            </div>
                        );
                    }

                    // Standard Nav Item
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setActiveTab(item.name)}
                            className="flex flex-col items-center justify-center gap-1 min-w-[3rem]"
                        >
                            <item.icon
                                className={`h-5 w-5 transition-colors duration-300 ${isActive ? 'text-blue-600 stroke-[2.5px]' : 'text-slate-400'
                                    }`}
                            />
                            {/* Label - Small and conditional or always visible as per user image */}
                            <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-slate-400'
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
