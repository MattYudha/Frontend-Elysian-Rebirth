'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Lock, Bell, Palette, ChevronLeft, Settings, Users, ShieldCheck, Activity, CreditCard, Import, Bot, Zap, X, Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants, Button } from '@/components/ui/button';
import { useSettingsUiStore } from '@/store/ui/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";

import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';
import { SafeLink } from '@/components/navigation/SafeLink';

const ADMIN_ONLY_ROUTES = [
    '/settings/workspace/identity',
    '/settings/workspace/billing',
    '/settings/workspace/import',
];

const sidebarGroups = [
    {
        label: 'Personal',
        items: [
            { href: '/settings/profile', title: 'Account', icon: User },
            { href: '/settings/notifications', title: 'Notifications', icon: Bell },
            { href: '/settings/security', title: 'Security', icon: Lock },
            { href: '/settings/appearance', title: 'Appearance', icon: Palette },
        ]
    },
    {
        label: 'Workspace',
        items: [
            { href: '/settings/workspace/preferences', title: 'Preferences', icon: Settings },
            { href: '/settings/workspace/teammates', title: 'Teammates', icon: Users },
            { href: '/settings/workspace/identity', title: 'Identity', icon: ShieldCheck },
            { href: '/settings/workspace/types', title: 'Types', icon: Activity },
            { href: '/settings/workspace/billing', title: 'Plans and billing', icon: CreditCard },
            { href: '/settings/workspace/import', title: 'Import', icon: Import },
        ]
    },
    {
        label: 'AI',
        items: [
            { href: '/settings/ai/agents', title: 'Agents', icon: Bot },
            { href: '/settings/ai/skills', title: 'Skills', icon: Zap },
        ]
    }
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const userRole = user?.role || 'member';
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Filter sidebar groups based on role
    const filteredSidebarGroups = sidebarGroups.map(group => ({
        ...group,
        items: group.items.filter(item => {
            if (ADMIN_ONLY_ROUTES.includes(item.href)) {
                return userRole === 'admin';
            }
            return true;
        })
    }));

    const isRestricted = ADMIN_ONLY_ROUTES.some(r => pathname.includes(r));
    const isForbidden = isRestricted && userRole !== 'admin';

    // Check if ANY form is dirty across the entire settings schema
    const isAnyDirty = useSettingsUiStore((s) => s.isAnyDirty());
    const isPathDirty = useSettingsUiStore((s) => s.isPathDirty);
    const setDirty = useSettingsUiStore((s) => s.setDirty);
    const returnUrl = useSettingsUiStore((s) => s.returnUrl);

    // Native browser unload interceptor (only triggers for refresh/close tab)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isAnyDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isAnyDirty]);

    const handleClose = (e: React.MouseEvent) => {
        if (isPathDirty(pathname)) {
            e.preventDefault();
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin menutup?");
            if (confirmLeave) {
                setDirty(pathname, false);
                router.push(returnUrl || '/dashboard');
            }
        } else {
            router.push(returnUrl || '/dashboard');
        }
    };

    const handleBackContext = (e: React.MouseEvent) => {
        if (isPathDirty(pathname)) {
            e.preventDefault();
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin kembali?");
            if (confirmLeave) {
                setDirty(pathname, false);
                router.push('/settings');
            }
        } else {
            router.push('/settings');
        }
    };

    const handleSubMenuSelect = (href: string) => {
        setIsDropdownOpen(false);
        if (isPathDirty(pathname)) {
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin pindah?");
            if (confirmLeave) {
                setDirty(pathname, false);
                router.push(href);
            }
        } else {
            router.push(href);
        }
    };

    return (
        <div className="flex bg-slate-50/50 dark:bg-[#060D18] h-[100dvh] w-full relative z-0">
            <ElysianGrid />
            {/* Background Base (Simulating the Dashboard behind the modal) */}
            <Sidebar />

            <main className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
                <div className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <DashboardNavbar staticMode={true} />
                </div>
                {/* Dummy background content so it's not empty behind blur */}
                <div className="flex-1 p-8 opacity-20 hidden md:block">
                    <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl"></div>
                </div>
            </main>

            {/* Modal Overlay / Popup */}
            {/* Removed backdrop-blur-[2px] fixed massive GPU performance drop on full screen overlays */}
            <div className="fixed inset-0 z-[100] bg-white sm:bg-slate-900/60 sm:dark:bg-black/80 flex items-center justify-center p-0 md:p-4 lg:p-12 overflow-y-auto md:overflow-hidden">
                <div className="relative w-full h-[100dvh] sm:h-full md:h-[80vh] md:min-h-[500px] md:max-h-[750px] sm:max-w-[960px] lg:max-w-[1080px] mx-auto bg-white dark:bg-[#0B1120] rounded-none md:rounded-2xl lg:rounded-3xl shadow-none sm:shadow-2xl border-0 md:border border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row overflow-hidden my-auto">



                    {/* Left Sidebar Pane (Always visible on Desktop, visible on Mobile ONLY if pathname is exactly /settings) */}
                    <aside className={cn(
                        "w-full md:w-64 lg:w-[280px] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#060D18] flex-col flex-1 md:flex-none md:shrink-0 overflow-y-auto md:overflow-visible",
                        pathname === '/settings' ? "flex" : "hidden md:flex"
                    )}>
                        {/* Sidebar Header Space */}
                        <div className="hidden md:block h-14 lg:h-20" />

                        <nav className="flex flex-col md:flex-1 md:overflow-y-auto px-4 md:px-0 md:pb-8 gap-4 md:gap-6 scrollbar-hide shrink-0 w-full mt-4 md:mt-0">
                            {filteredSidebarGroups.map((group) => (
                                <div key={group.label} className="flex flex-col gap-2 md:gap-1 shrink-0 pb-4 md:pb-0 w-full">
                                    <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-3">
                                        {group.label}
                                    </h4>
                                    <div className="flex flex-col gap-2 md:gap-0.5 w-full">
                                        {group.items.map((item) => {
                                            const isActive = pathname.includes(item.href);
                                            return (
                                                <SafeLink
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center justify-between px-4 md:px-3 py-3 md:py-2 rounded-xl md:rounded-lg text-[15px] md:text-[13px] font-medium transition-all duration-200 w-full",
                                                        isActive
                                                            ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white ring-1 ring-slate-200/50 dark:ring-slate-700/50 md:ring-0"
                                                            : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent bg-white/50 dark:bg-slate-800/20 md:bg-transparent md:dark:bg-transparent"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("p-2 rounded-lg md:p-0 md:bg-transparent shrink-0",
                                                            isActive ? "bg-white dark:bg-[#0B1120] shadow-sm md:shadow-none" : "bg-slate-100 dark:bg-slate-800/50 md:bg-transparent md:dark:bg-transparent")}>
                                                            <item.icon className={cn("h-5 w-5 md:h-4 md:w-4 shrink-0", isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")} />
                                                        </div>
                                                        <span className="text-left">{item.title}</span>
                                                    </div>
                                                    {/* Mobile Arrow Indicator */}
                                                    <ChevronLeft className="h-4 w-4 shrink-0 text-slate-400 rotate-180 md:hidden" />
                                                </SafeLink>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                            {/* Mobile Close Button for Settings Main Menu */}
                            <div className="md:hidden px-4 md:px-0 mt-8 mb-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-center gap-2 rounded-xl h-12 text-slate-600 dark:text-slate-400"
                                    onClick={handleClose}
                                >
                                    <X className="h-5 w-5" />
                                    Close Settings
                                </Button>
                            </div>
                        </nav>
                    </aside>

                    {/* Right Content Pane (Visible on Desktop always, Visible on Mobile ONLY if pathname is NOT /settings) */}
                    <main className={cn(
                        "flex-1 flex flex-col bg-white dark:bg-[#0B1120] relative min-w-0 md:w-auto h-[100dvh] md:h-auto overflow-hidden",
                        pathname === '/settings' ? "hidden md:flex" : "flex"
                    )}>

                        {/* Mobile Sticky Header (Visible only on < md) */}
                        <header className="md:hidden flex flex-none items-center h-auto py-2.5 pt-safe px-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur top-0 sticky z-[60] w-full justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Settings</span>
                                <span className="text-slate-400 font-normal mx-1.5">•</span>
                                {/* Clickable Dropdown Trigger for Sub-Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 active:scale-[0.98] transition-all"
                                    >
                                        <span>
                                            {(() => {
                                                const currentSlug = pathname.split('/').pop()?.replace('-', ' ') || 'profile';
                                                return currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1);
                                            })()}
                                        </span>
                                        <ChevronDown className="h-3.5 w-3.5 transition-transform" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                                    </button>

                                    {isDropdownOpen && (
                                        <>
                                            {/* Backdrop overlay to close dropdown */}
                                            <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsDropdownOpen(false)} />
                                            <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                                                {filteredSidebarGroups.map((group) => (
                                                    <div key={group.label} className="py-1">
                                                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                            {group.label}
                                                        </div>
                                                        {group.items.map((item) => (
                                                            <button
                                                                key={item.href}
                                                                onClick={() => handleSubMenuSelect(item.href)}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center gap-2 rounded-lg",
                                                                    pathname.includes(item.href)
                                                                        ? "bg-slate-50 dark:bg-white/5 text-blue-500 dark:text-blue-400"
                                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                                                                )}
                                                            >
                                                                <item.icon className="h-3.5 w-3.5" />
                                                                {item.title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Side Buttons: Hamburger Menu + Close Button */}
                            <div className="flex items-center gap-1">
                                {/* Hamburger Menu - Settings Drawer */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                                        >
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[85vw] max-w-[320px] p-0 flex flex-col bg-slate-50 dark:bg-[#060D18]">
                                        <SheetHeader className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-row items-center justify-between text-left space-y-0">
                                            <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-white">Settings</SheetTitle>
                                        </SheetHeader>
                                        <nav className="flex-1 overflow-y-auto p-4 gap-6 flex flex-col scrollbar-hide">
                                            {filteredSidebarGroups.map((group) => (
                                                <div key={group.label} className="flex flex-col gap-1 shrink-0">
                                                    <h4 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 px-3">
                                                        {group.label}
                                                    </h4>
                                                    <div className="flex flex-col gap-0.5">
                                                        {group.items.map((item) => {
                                                            const isActive = pathname.includes(item.href);
                                                            return (
                                                                <SheetClose asChild key={item.href}>
                                                                    <button
                                                                        onClick={() => handleSubMenuSelect(item.href)}
                                                                        className={cn(
                                                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 w-full text-left",
                                                                            isActive
                                                                                ? "bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white"
                                                                                : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
                                                                        )}
                                                                    >
                                                                        <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")} />
                                                                        <span className="flex-1 text-left">{item.title}</span>
                                                                    </button>
                                                                </SheetClose>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </nav>
                                    </SheetContent>
                                </Sheet>

                                {/* Close Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                                    onClick={handleClose}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </header>

                        {/* Desktop Close Button (Floating Top Right inside content) */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 hidden md:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                onClick={handleClose}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 lg:p-12 scrollbar-hide pb-safe mt-0">
                            <div className="max-w-[800px] w-full mx-auto md:mx-0 min-h-full">
                                {isForbidden ? (
                                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                                        <ShieldCheck className="h-16 w-16 text-red-500 mb-4 animate-pulse" />
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">403 Forbidden</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                            Halaman ini memerlukan hak akses Administrator. Hubungi admin workspace Anda untuk informasi lebih lanjut.
                                        </p>
                                    </div>
                                ) : (
                                    children
                                )}
                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
