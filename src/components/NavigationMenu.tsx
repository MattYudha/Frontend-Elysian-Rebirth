'use client';

import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/contexts/SidebarContext';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/config/nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

// Icon mapping from string names to Lucide components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
    Home: LucideIcons.LayoutDashboard, // More distinct dashboard icon
    Message: LucideIcons.MessageCircle, // Requested change
    Book: LucideIcons.Book,
    Settings: LucideIcons.Settings,
    Workflow: LucideIcons.Workflow,
    FileText: LucideIcons.FileText,
    Briefcase: LucideIcons.Briefcase,
    Activity: LucideIcons.Activity,
    Users: LucideIcons.Users,
    Database: LucideIcons.Database,
};

export function NavigationMenu() {
    const { user } = useAuthStore();
    const { isOpen } = useSidebar();
    const pathname = usePathname();

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

    // Group by section
    const groupedNav: Record<string, typeof filteredNav> = {
        'Main': [],
        'System': []
    };

    filteredNav.forEach(item => {
        const section = item.section || 'Main';
        if (!groupedNav[section]) groupedNav[section] = [];
        groupedNav[section].push(item);
    });

    return (
        <nav className="space-y-6">
            {Object.entries(groupedNav).map(([section, items]) => {
                if (items.length === 0) return null;

                return (
                    <div key={section} className="space-y-1">
                        {isOpen && (
                            <h4 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                {section}
                            </h4>
                        )}
                        {!isOpen && (
                            <div className="h-px w-6 mx-auto bg-slate-200 my-2" />
                        )}

                        {items.map((item) => {
                            const Icon = getIcon(item.icon);
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative',
                                        !isOpen && 'justify-center px-2',
                                        isActive
                                            ? 'text-blue-700 bg-blue-50'
                                            : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                                    )}
                                    <Icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-500")} />
                                    {isOpen && <span className="animate-in fade-in duration-200">{item.label}</span>}
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
    return iconMap[iconName] || LucideIcons.Home;
}
