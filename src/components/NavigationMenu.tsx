'use client';

import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/contexts/SidebarContext';
import { usePathname } from 'next/navigation';
import { useSettingsUiStore } from '@/store/ui/settingsStore';
import { mainNav } from '@/config/nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Bot,
    Book,
    Settings,
    Workflow,
    FileText,
    Briefcase,
    Activity,
    ShieldAlert,
    Users,
    Database,
    Home
} from 'lucide-react';

// Icon mapping from string names to Lucide components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
    Home: LayoutDashboard,
    dashboard: LayoutDashboard, // Fix for nav.ts key
    chat: Bot, // Fix for nav.ts key
    Message: Bot,
    Book: Book,
    Settings: Settings,
    Workflow: Workflow,
    FileText: FileText,
    Briefcase: Briefcase,
    Activity: Activity,
    ShieldAlert: ShieldAlert,
    Users: Users,
    Database: Database,

};

export function NavigationMenu() {
    const { user } = useAuthStore();
    const { isOpen } = useSidebar();
    const pathname = usePathname();
    const setReturnUrl = useSettingsUiStore((s) => s.setReturnUrl);

    const hasAnyRole = (allowedRoles: string[]) => {
        if (!user || !user.role) return false;
        return allowedRoles.includes(user.role);
    };

    const filteredNav = mainNav.filter((item) => {
        // Check role requirement
        if (item.roles && !hasAnyRole(item.roles)) {
            return false;
        }

        // Check feature flag (if library supports it)
        // if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) {
        //   return false;
        // }

        return true;
    });

    // Group by section dynamically to support any section defined in nav.ts
    const groupedNav: Record<string, typeof filteredNav> = {};

    // Ensure order matching the nav.ts structure
    const sectionOrder: string[] = [];

    filteredNav.forEach(item => {
        const section = item.section || 'MAIN';
        if (!groupedNav[section]) {
            groupedNav[section] = [];
            sectionOrder.push(section);
        }
        groupedNav[section].push(item);
    });

    return (
        <nav className="space-y-6 pb-2">
            {sectionOrder.map((section) => {
                const items = groupedNav[section];
                if (!items || items.length === 0) return null;

                return (
                    <div key={section} className="space-y-1">
                        {isOpen && (
                            <h4 className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                {section}
                            </h4>
                        )}
                        {!isOpen && (
                            <div className="h-px w-6 flex shrink-0 mx-auto bg-slate-200 dark:bg-slate-700/50 mb-3 mt-4 first:mt-0" />
                        )}

                        {items.map((item) => {
                            const Icon = getIcon(item.icon);
                            const isActive = pathname === item.href;

                            // Map hrefs to onboarding IDs
                            const getOnboardingId = (href: string) => {
                                const idMap: Record<string, string> = {
                                    '/chat': 'ai-assistant-trigger',
                                    '/knowledge': 'knowledge-base-trigger',
                                    '/editor': 'editor-trigger',
                                    '/workflow': 'workflow-trigger',
                                    '/settings': 'settings-trigger',
                                };
                                return idMap[href];
                            };

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    id={getOnboardingId(item.href)}
                                    onClick={() => {
                                        if (item.href.startsWith('/settings') && !pathname.startsWith('/settings')) {
                                            setReturnUrl(pathname);
                                        }
                                    }}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden',
                                        !isOpen && 'justify-center px-2',
                                        isActive
                                            ? 'text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/40 dark:to-transparent shadow-sm shadow-blue-100/50 dark:shadow-none'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600 dark:hover:text-blue-300'
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                                    )}
                                    <Icon className={cn("h-5 w-5 transition-colors shrink-0", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400")} />
                                    {isOpen && <span className="animate-in fade-in duration-200 truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                );
            })}
        </nav>
    );
}

function getIcon(iconName: string) {
    return iconMap[iconName] || Home;
}
