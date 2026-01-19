'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
    Menu,
    Home,
    MessageSquare,
    BookOpen,
    FileText,
    GitMerge,
    Settings,
    Search,
    LogOut,
    Sparkles,
    Cloud,
    User
} from 'lucide-react';

const dashboardItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/chat', label: 'Chat Assistant', icon: MessageSquare },
    { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { href: '/editor', label: 'Smart Editor', icon: FileText },
    { href: '/workflow', label: 'Workflow', icon: GitMerge },
    { href: '/settings', label: 'Settings', icon: Settings },
];

const landingItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/#features', label: 'Produk & Fitur', icon: FileText },
    { href: '/#solutions', label: 'Solusi AI', icon: Sparkles }, // Zap replaced by Sparkles for consistency
    { href: '#', label: 'Peringatan', icon: Menu }, // Bell/Menu placeholder
    { href: '#', label: 'Bantuan', icon: Cloud }, // LifeBuoy placeholder
];

interface MobileSidebarProps {
    variant?: 'dashboard' | 'landing';
}

export function MobileSidebar({ variant = 'dashboard' }: MobileSidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const items = variant === 'landing' ? landingItems : dashboardItems;

    return (
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                {/* Embedded Hamburger Button */}
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 bg-transparent hover:bg-slate-100 text-slate-600 rounded-lg transition-all"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>

                {/* Sidebar Content (Elysian Liquid Glass) */}
                <SheetContent
                    side="left"
                    className="w-[85vw] max-w-[320px] p-0 border-none bg-transparent shadow-2xl"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <div className="relative flex flex-col h-full overflow-hidden bg-white/80 backdrop-blur-2xl border-r border-white/40 rounded-r-3xl">

                        {/* Background Textures (Clouds/Waves) */}
                        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                            <Image
                                src="/elysian_banner_waves.png"
                                alt="Background Pattern"
                                fill
                                className="object-cover object-left-top mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/30 via-white/50 to-white/80" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col h-full">

                            {/* Header */}
                            <div className="px-6 pt-10 pb-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                                        <Cloud className="h-6 w-6 text-white drop-shadow-sm" />
                                        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-200 animate-pulse" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
                                            Elysian
                                        </h2>
                                        <p className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase">Enterprise Platform</p>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="px-6 mb-6">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-blue-400/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                                    <div className="relative flex items-center bg-white/60 border border-blue-100 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300 transition-all">
                                        <Search className="h-4 w-4 text-blue-400 mr-3" />
                                        <input
                                            type="text"
                                            placeholder="Cari fitur..."
                                            className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-blue-300/70 w-full font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4 scrollbar-hide">
                                {items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`relative overflow-hidden flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                        >
                                            {/* Active background shine */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
                                            )}

                                            <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                                            <span className={`font-medium text-sm ${isActive ? 'font-semibold tracking-wide' : ''}`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Footer Profile or Login */}
                            <div className="p-6 mt-auto">
                                {variant === 'landing' ? (
                                    <div className="space-y-3">
                                        <Link href="/login" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-xl py-6">
                                                <User className="mr-2 h-4 w-4" /> Masuk Akun
                                            </Button>
                                        </Link>
                                        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-sm text-center">
                                            <p className="text-xs text-slate-500">Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline" onClick={() => setIsOpen(false)}>Daftar</Link></p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-white border-2 border-white shadow-sm flex items-center justify-center">
                                                <span className="font-bold text-blue-600 text-xs">AD</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 truncate">Admin User</h4>
                                                <p className="text-xs text-slate-500 truncate">admin@elysian.ai</p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                <LogOut className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
