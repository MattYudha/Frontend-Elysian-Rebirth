'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Lock, Bell, Palette, ChevronRight, Settings, Users, 
    ShieldCheck, Activity, CreditCard, Import, Bot, Zap, X, Menu, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSettingsUiStore } from '@/store/ui/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Dynamic switchboard page imports
import ProfilePage from '../../../app/settings/profile/page';
import NotificationsPage from '../../../app/settings/notifications/page';
import SecurityPage from '../../../app/settings/security/page';
import AppearancePage from '../../../app/settings/appearance/page';
import WorkspacePreferencesPage from '../../../app/settings/workspace/preferences/page';
import WorkspaceTeammatesPage from '../../../app/settings/workspace/teammates/page';
import WorkspaceIdentityPage from '../../../app/settings/workspace/identity/page';
import WorkspaceTypesPage from '../../../app/settings/workspace/types/page';
import WorkspaceBillingPage from '../../../app/settings/workspace/billing/page';
import WorkspaceImportPage from '../../../app/settings/workspace/import/page';
import AiAgentsPage from '../../../app/settings/ai/agents/page';
import AiSkillsPage from '../../../app/settings/ai/skills/page';

const ADMIN_ONLY_TABS = [
    'workspace/identity',
    'workspace/billing',
    'workspace/import',
];

const sidebarGroups = [
    {
        label: 'Personal',
        items: [
            { id: 'profile', title: 'Account', icon: User },
            { id: 'notifications', title: 'Notifications', icon: Bell },
            { id: 'security', title: 'Security', icon: Lock },
            { id: 'appearance', title: 'Appearance', icon: Palette },
        ]
    },
    {
        label: 'Workspace',
        items: [
            { id: 'workspace/preferences', title: 'Preferences', icon: Settings },
            { id: 'workspace/teammates', title: 'Teammates', icon: Users },
            { id: 'workspace/identity', title: 'Identity', icon: ShieldCheck },
            { id: 'workspace/types', title: 'Types', icon: Activity },
            { id: 'workspace/billing', title: 'Plans & billing', icon: CreditCard },
            { id: 'workspace/import', title: 'Import', icon: Import },
        ]
    },
    {
        label: 'AI',
        items: [
            { id: 'ai/agents', title: 'Agents', icon: Bot },
            { id: 'ai/skills', title: 'Skills', icon: Zap },
        ]
    }
];

export default function SettingsModal() {
    const { isOpen, activeTab, closeSettings, setActiveTab, isAnyDirty, clearAllDirty } = useSettingsUiStore();
    const user = useAuthStore((s) => s.user);
    const userRole = user?.role || 'member';

    // Intercept closing if any form in the settings has unsaved changes
    const handleClose = () => {
        if (isAnyDirty()) {
            const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin menutup?");
            if (confirmLeave) {
                clearAllDirty();
                closeSettings();
            }
        } else {
            closeSettings();
        }
    };

    // ESC key listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isAnyDirty]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Filter sidebar groups based on role
    const filteredSidebarGroups = sidebarGroups.map(group => ({
        ...group,
        items: group.items.filter(item => {
            if (ADMIN_ONLY_TABS.includes(item.id)) {
                return userRole === 'admin';
            }
            return true;
        })
    }));

    const isRestricted = ADMIN_ONLY_TABS.includes(activeTab);
    const isForbidden = isRestricted && userRole !== 'admin';

    // Switchboard renderer
    const renderActiveTabContent = () => {
        if (isForbidden) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 animate-in fade-in duration-300">
                    <ShieldCheck className="h-16 w-16 text-red-500 mb-4 animate-pulse" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">403 Forbidden</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                        Halaman ini memerlukan hak akses Administrator. Hubungi admin workspace Anda untuk informasi lebih lanjut.
                    </p>
                </div>
            );
        }

        switch (activeTab) {
            case 'profile':
                return <ProfilePage />;
            case 'notifications':
                return <NotificationsPage />;
            case 'security':
                return <SecurityPage />;
            case 'appearance':
                return <AppearancePage />;
            case 'workspace/preferences':
                return <WorkspacePreferencesPage />;
            case 'workspace/teammates':
                return <WorkspaceTeammatesPage />;
            case 'workspace/identity':
                return <WorkspaceIdentityPage />;
            case 'workspace/types':
                return <WorkspaceTypesPage />;
            case 'workspace/billing':
                return <WorkspaceBillingPage />;
            case 'workspace/import':
                return <WorkspaceImportPage />;
            case 'ai/agents':
                return <AiAgentsPage />;
            case 'ai/skills':
                return <AiSkillsPage />;
            default:
                return <ProfilePage />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
                    {/* Backdrop Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Window */}
                    <motion.div 
                        initial={{ scale: 0.96, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 15 }}
                        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                        className="relative w-full h-[100dvh] sm:h-full md:h-[80vh] md:min-h-[550px] md:max-h-[800px] sm:max-w-[960px] lg:max-w-[1120px] mx-auto bg-white dark:bg-[#0B1120] rounded-none sm:rounded-2xl lg:rounded-3xl shadow-2xl border-0 sm:border border-slate-200/60 dark:border-slate-800/60 flex flex-col md:flex-row overflow-hidden my-auto z-10"
                    >
                        {/* Left Sidebar Menu */}
                        <aside className="w-full md:w-64 lg:w-[280px] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-[#060D18]/70 backdrop-blur-md flex-col flex-none hidden md:flex h-full select-none">
                            <div className="p-6">
                                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Settings
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Manage your personal & team preferences
                                </p>
                            </div>

                            <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                                {filteredSidebarGroups.map((group) => (
                                    <div key={group.label} className="flex flex-col gap-1.5 w-full">
                                        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3">
                                            {group.label}
                                        </h4>
                                        <div className="flex flex-col gap-0.5 w-full">
                                            {group.items.map((item) => {
                                                const isActive = activeTab === item.id;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => setActiveTab(item.id)}
                                                        className={cn(
                                                            "flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 w-full group outline-none",
                                                            isActive
                                                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", 
                                                                isActive ? "" : "text-slate-500 group-hover:scale-105"
                                                            )} />
                                                            <span className="text-left">{item.title}</span>
                                                        </div>
                                                        <ChevronRight className={cn("h-3.5 w-3.5 opacity-0 transition-all duration-200", 
                                                            isActive ? "opacity-100" : "group-hover:opacity-40 group-hover:translate-x-0.5"
                                                        )} />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </aside>

                        {/* Mobile Header (Hidden on Desktop) */}
                        <header className="md:hidden flex flex-none items-center h-14 px-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md sticky top-0 z-10 w-full justify-between select-none">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Settings
                                </h2>
                                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                                <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 capitalize">
                                    {activeTab.split('/').pop()?.replace('-', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {/* Hamburger Switcher for Mobile */}
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
                                    <SheetContent side="right" className="w-[80vw] max-w-[300px] p-0 flex flex-col bg-slate-50 dark:bg-[#060D18]">
                                        <SheetHeader className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-row items-center justify-between text-left space-y-0">
                                            <SheetTitle className="text-base font-bold text-slate-900 dark:text-white">Settings Tab</SheetTitle>
                                        </SheetHeader>
                                        <nav className="flex-1 overflow-y-auto p-4 gap-5 flex flex-col">
                                            {filteredSidebarGroups.map((group) => (
                                                <div key={group.label} className="flex flex-col gap-1 shrink-0">
                                                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1">
                                                        {group.label}
                                                    </h4>
                                                    <div className="flex flex-col gap-0.5">
                                                        {group.items.map((item) => {
                                                            const isActive = activeTab === item.id;
                                                            return (
                                                                <SheetTrigger asChild key={item.id}>
                                                                    <button
                                                                        onClick={() => setActiveTab(item.id)}
                                                                        className={cn(
                                                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none w-full text-left",
                                                                            isActive
                                                                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                                                                                : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"
                                                                        )}
                                                                    >
                                                                        <item.icon className="h-4 w-4 shrink-0" />
                                                                        <span className="flex-1">{item.title}</span>
                                                                    </button>
                                                                </SheetTrigger>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </nav>
                                    </SheetContent>
                                </Sheet>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full"
                                    onClick={handleClose}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main className="flex-1 flex flex-col bg-white dark:bg-[#0B1120] relative min-w-0 h-full overflow-hidden">
                            {/* Floating Desktop Close Button */}
                            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 hidden md:block">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    onClick={handleClose}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Scrollable pane rendering imported child component */}
                            <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-10 lg:p-12 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 pb-safe">
                                <div className="max-w-[760px] w-full mx-auto md:mx-0 min-h-full">
                                    {renderActiveTabContent()}
                                </div>
                            </div>
                        </main>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
