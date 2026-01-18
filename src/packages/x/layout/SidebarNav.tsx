"use client";

import React from 'react';
import { Menu, type MenuProps } from 'antd';
import {
    DashboardOutlined,
    MessageOutlined,
    DatabaseOutlined,
    NodeIndexOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { cn } from '../../../lib/utils';
import { useRouter, usePathname } from 'next/navigation';

export interface NavItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
    children?: NavItem[];
    path?: string; // Added path for navigation
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
            icon: <DashboardOutlined />,
            path: '/dashboard'
        },
        {
            key: 'chat',
            label: 'AI Chat',
            icon: <MessageOutlined />,
            badge: 3,
            path: '/chat'
        },
        {
            key: 'rag',
            label: 'Knowledge Base',
            icon: <DatabaseOutlined />,
            children: [
                { key: 'rag-sources', label: 'Sources', path: '/knowledge' },
                { key: 'rag-config', label: 'Configuration', path: '/knowledge/config' }, // Placeholder
                { key: 'rag-playground', label: 'Playground', path: '/knowledge/playground' }, // Placeholder
            ],
        },
        {
            key: 'workflow',
            label: 'Workflows',
            icon: <NodeIndexOutlined />,
            path: '/workflows'
        },
        {
            key: 'documents',
            label: 'Documents',
            icon: <FileTextOutlined />,
            path: '/documents'
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
            path: '/settings'
        },
    ];

    const handleNavigation = (key: string) => {
        if (onSelect) {
            onSelect(key);
            return;
        }

        // Find path from default items recursively
        const findPath = (items: NavItem[]): string | undefined => {
            for (const item of items) {
                if (item.key === key && item.path) return item.path;
                if (item.children) {
                    const childPath = findPath(item.children);
                    if (childPath) return childPath;
                }
            }
        };

        const path = findPath(defaultItems);
        if (path) router.push(path);
    };

    const convertToMenuItems = (navItems: NavItem[]): MenuProps['items'] => {
        return navItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.badge && !collapsed ? (
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {item.label}
                    <span
                        style={{
                            backgroundColor: '#ff4d4f',
                            color: '#fff',
                            borderRadius: 10,
                            padding: '2px 8px',
                            fontSize: 11,
                            fontWeight: 600,
                            minWidth: 20,
                            textAlign: 'center',
                        }}
                    >
                        {item.badge}
                    </span>
                </span>
            ) : (
                item.label
            ),
            children: item.children ? convertToMenuItems(item.children) : undefined,
        }));
    };

    const menuItems = convertToMenuItems(defaultItems);

    // Determine selected key from pathname if not provided
    const activeKey = selectedKey || (
        pathname?.includes('/knowledge') ? 'rag-sources' :
            pathname?.includes('/chat') ? 'chat' :
                pathname?.includes('/dashboard') ? 'dashboard' :
                    'dashboard' // default
    );

    return (
        <div className={cn("flex h-full flex-col", className)}>
            {/* Header Logo */}
            <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-zinc-800 flex-shrink-0">
                {!collapsed && <span className="text-lg font-bold text-slate-800 dark:text-slate-200">Elysian</span>}
                {collapsed && <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mx-auto">E</span>}
            </div>

            <div className="flex-1 overflow-y-auto pt-4">
                <Menu
                    mode="inline"
                    selectedKeys={[activeKey]}
                    defaultOpenKeys={['rag']} // Keep RAG open by default for visibility
                    items={menuItems}
                    onClick={({ key }) => handleNavigation(key)}
                    className="bg-transparent border-none"
                    inlineCollapsed={collapsed}
                    style={{ borderRight: 0 }}
                />
            </div>

            {/* User Profile / Footer Area */}
            <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex-shrink-0">
                <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs">
                        JD
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">John Doe</span>
                            <span className="text-xs text-slate-400">Admin Workspace</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

SidebarNav.displayName = 'SidebarNav';
