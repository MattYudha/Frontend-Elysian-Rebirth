'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/config/nav';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

// Icon mapping from string names to Lucide components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
    Home: LucideIcons.Home,
    Message: LucideIcons.MessageSquare,
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
    const { hasAnyRole } = useAuth();
    const pathname = usePathname();

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

    return (
        <nav className="space-y-1">
            {filteredNav.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        <Icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

function getIcon(iconName: string) {
    return iconMap[iconName] || LucideIcons.Home;
}
