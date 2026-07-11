"use client";

import React from 'react';
import {
    LayoutDashboard,
    MessageSquare,
    Database,
    Workflow,
    FileText,
    Settings,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/';
import { ScrollArea } from '@/components/ui/';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/';

export interface NavItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
    children?: NavItem[];
    path?: string;
}

export interface SidebarNavProps {
    items?: NavItem[];
    selectedKey?: string;
    onSelect?: (key: string) => void;
    collapsed?: boolean;
    className?: string;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
    items,
    selectedKey,
    onSelect,
    collapsed,
    className,
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const defaultItems: NavItem[] = items || [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="h-4 w-4" />,
            path: '/dashboard'
        },
        {
            key: 'chat',
            label: 'AI Chat',
            icon: <MessageSquare className="h-4 w-4" />,
            badge: 3,
            path: '/chat'
        },
        {
            key: 'rag',
            label: 'Knowledge Base',
            icon: <Database className="h-4 w-4" />,
            children: [
                { key: 'rag-sources', label: 'Sources', path: '/knowledge' },
                { key: 'rag-config', label: 'Configuration', path: '/knowledge/config' },
                { key: 'rag-playground', label: 'Playground', path: '/knowledge/playground' },
            ],
        },
        {
            key: 'workflow',
            label: 'Workflows',
            icon: <Workflow className="h-4 w-4" />,
            path: '/workflows'
        },
        {
            key: 'documents',
            label: 'Documents',
            icon: <FileText className="h-4 w-4" />,
            path: '/documents'
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <Settings className="h-4 w-4" />,
            path: '/settings'
        },
    ];

    const activeKey = selectedKey || (
        pathname?.includes('/knowledge') ? 'rag-sources' :
            pathname?.includes('/chat') ? 'chat' :
                pathname?.includes('/dashboard') ? 'dashboard' :
                    'dashboard'
    );

    const handleNavigation = (item: NavItem) => {
        if (item.path) {
            router.push(item.path);
        } else if (onSelect) {
            onSelect(item.key);
        }
    };

    const SidebarNavItem = ({
        item,
        level = 0,
        collapsed,
        activeKey,
        onNavigate
    }: {
        item: NavItem;
        level?: number;
        collapsed?: boolean;
        activeKey?: string;
        onNavigate: (item: NavItem) => void;
    }) => {
        const isActive = activeKey === item.key || (item.children && item.children.some(child => child.key === activeKey));
        const hasChildren = item.children && item.children.length > 0;
        const [isOpen, setIsOpen] = React.useState(isActive);

        // Update isOpen when active state changes (e.g. navigation elsewhere)
        React.useEffect(() => {
            if (isActive) setIsOpen(true);
        }, [isActive]);

        if (hasChildren) {
            return (
                <Collapsible
                    key={item.key}
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full"
                >
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size={collapsed ? "icon" : "default"}
                            className={cn(
                                "w-full justify-start mb-1",
                                collapsed ? "px-0" : "px-3",
                                isActive && !collapsed ? "bg-accent/50 text-accent-foreground font-medium" : ""
                            )}
                            title={collapsed ? item.label : undefined}
                        >
                            {item.icon && <span className={cn(collapsed ? "m-0" : "mr-2")}>{item.icon}</span>}
                            {!collapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {isOpen ? <ChevronDown className="h-3 w-3 opacity-50" /> : <ChevronRight className="h-3 w-3 opacity-50" />}
                                </>
                            )}
                        </Button>
                    </CollapsibleTrigger>
                    {!collapsed && (
                        <CollapsibleContent className="pl-4 space-y-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            {item.children?.map(child => (
                                <SidebarNavItem
                                    key={child.key}
                                    item={child}
                                    level={level + 1}
                                    collapsed={collapsed}
                                    activeKey={activeKey}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </CollapsibleContent>
                    )}
                </Collapsible>
            );
        }

        return (
            <Button
                key={item.key}
                variant={isActive ? "secondary" : "ghost"}
                size={collapsed ? "icon" : "default"}
                className={cn(
                    "w-full justify-start mb-1",
                    collapsed ? "px-0" : "px-3",
                    isActive ? "font-medium" : ""
                )}
                onClick={() => onNavigate(item)}
                title={collapsed ? item.label : undefined}
            >
                {item.icon && <span className={cn(collapsed ? "m-0" : "mr-2")}>{item.icon}</span>}
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2">
                                {item.badge}
                            </span>
                        )}
                    </>
                )}
            </Button>
        );
    };

    return (
        <div className={cn("flex h-full flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
            {/* Header Logo */}
            <div className="flex h-16 items-center px-4 border-b border-border/40 flex-shrink-0">
                {!collapsed && <span className="text-lg font-semibold tracking-tight">Elysian</span>}
                {collapsed && <span className="text-lg font-bold mx-auto">E</span>}
            </div>

            <ScrollArea className="flex-1 py-4">
                <div className="px-2 space-y-1">
                    {defaultItems.map(item => (
                        <SidebarNavItem
                            key={item.key}
                            item={item}
                            collapsed={collapsed}
                            activeKey={activeKey}
                            onNavigate={handleNavigation}
                        />
                    ))}
                </div>
            </ScrollArea>

            {/* User Profile / Footer Area */}
            <div className="p-4 border-t border-border/40 flex-shrink-0">
                <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-border">
                        JD
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">John Doe</span>
                            <span className="text-xs text-muted-foreground">Admin Workspace</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

SidebarNav.displayName = 'SidebarNav';
