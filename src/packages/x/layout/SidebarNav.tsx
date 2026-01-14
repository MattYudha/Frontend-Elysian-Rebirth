'use client';

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

export interface NavItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
    children?: NavItem[];
}

export interface SidebarNavProps {
    /**
     * Navigation items
     */
    items?: NavItem[];

    /**
     * Currently selected key
     */
    selectedKey?: string;

    /**
     * Callback when item is clicked
     */
    onSelect?: (key: string) => void;

    /**
     * Whether sidebar is collapsed
     */
    collapsed?: boolean;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * SidebarNav - Main sidebar navigation component
 * 
 * Features:
 * - Hierarchical menu structure
 * - Icons and badges
 * - Collapsed mode support
 * - Route integration ready
 * 
 * @example
 * ```tsx
 * <SidebarNav
 *   items={[
 *     { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
 *     { key: 'chat', label: 'Chat', icon: <MessageOutlined />, badge: 3 },
 *   ]}
 *   selectedKey="dashboard"
 *   onSelect={handleNavigation}
 * />
 * ```
 */
export const SidebarNav: React.FC<SidebarNavProps> = ({
    items,
    selectedKey,
    onSelect,
    collapsed,
    className,
}) => {
    const defaultItems: NavItem[] = items || [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <DashboardOutlined />,
        },
        {
            key: 'chat',
            label: 'AI Chat',
            icon: <MessageOutlined />,
            badge: 3,
        },
        {
            key: 'rag',
            label: 'Knowledge Base',
            icon: <DatabaseOutlined />,
            children: [
                { key: 'rag-sources', label: 'Sources' },
                { key: 'rag-config', label: 'Configuration' },
                { key: 'rag-playground', label: 'Playground' },
            ],
        },
        {
            key: 'workflow',
            label: 'Workflows',
            icon: <NodeIndexOutlined />,
        },
        {
            key: 'documents',
            label: 'Documents',
            icon: <FileTextOutlined />,
        },
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
        },
    ];

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

    return (
        <div className={className} style={{ height: '100%', paddingTop: 16 }}>
            <Menu
                mode="inline"
                selectedKeys={selectedKey ? [selectedKey] : undefined}
                items={menuItems}
                onClick={({ key }) => onSelect?.(key)}
                style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                }}
                inlineCollapsed={collapsed}
            />
        </div>
    );
};

SidebarNav.displayName = 'SidebarNav';
