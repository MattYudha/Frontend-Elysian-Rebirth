'use client';

import React from 'react';
import { Space, Button, Avatar, Dropdown, Badge, Typography, type MenuProps } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined,
    QuestionCircleOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { cn } from '../../../lib/utils';


const { Text } = Typography;

export interface TopbarProps {
    /**
     * Application logo/brand
     */
    logo?: React.ReactNode;

    /**
     * Application title
     */
    title?: string;

    /**
     * Whether sidebar is collapsed
     */
    collapsed?: boolean;

    /**
     * Callback to toggle sidebar
     */
    onToggleSidebar?: () => void;

    /**
     * User information
     */
    user?: {
        name: string;
        avatar?: string;
        email?: string;
    };

    /**
     * Notification count
     */
    notificationCount?: number;

    /**
     * Callback when notification bell is clicked
     */
    onNotificationClick?: () => void;

    /**
     * User menu items
     */
    userMenuItems?: MenuProps['items'];

    /**
     * Custom actions (right side)
     */
    actions?: React.ReactNode;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * Topbar - Application header/topbar component
 * 
 * Features:
 * - Logo and branding
 * - Sidebar toggle
 * - Notifications
 * - User profile dropdown
 * - Custom actions
 * 
 * @example
 * ```tsx
 * <Topbar
 *   title="Enterprise AI Platform"
 *   user={{ name: "John Doe", email: "john@example.com" }}
 *   notificationCount={5}
 *   onToggleSidebar={handleToggle}
 *   onNotificationClick={handleNotifications}
 * />
 * ```
 */
export const Topbar: React.FC<TopbarProps> = ({
    logo,
    title = 'Enterprise AI Platform',
    collapsed,
    onToggleSidebar,
    user,
    notificationCount = 0,
    onNotificationClick,
    userMenuItems,
    actions,
    className,
}) => {
    const defaultUserMenuItems: MenuProps['items'] = userMenuItems || [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
        },
    ];

    return (
        <div
            className={cn(
                "flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100",
                className
            )}
        >
            {/* Left Section */}
            <Space size={16}>
                {/* Sidebar Toggle */}
                {onToggleSidebar && (
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={onToggleSidebar}
                        className="text-lg"
                    />
                )}

                {/* Logo & Title */}
                <Space size={12}>
                    {logo && <div className="flex items-center">{logo}</div>}
                    <Text strong className="text-lg text-primary">
                        {title}
                    </Text>
                </Space>
            </Space>

            {/* Right Section */}
            <Space size={16}>
                {/* Custom Actions */}
                {actions}

                {/* Help */}
                <Button
                    type="text"
                    icon={<QuestionCircleOutlined />}
                    className="text-lg"
                />

                {/* Notifications */}
                <Badge count={notificationCount} offset={[-5, 5]}>
                    <Button
                        type="text"
                        icon={<BellOutlined />}
                        onClick={onNotificationClick}
                        className="text-lg"
                    />
                </Badge>

                {/* User Profile */}
                {user && (
                    <Dropdown menu={{ items: defaultUserMenuItems }} placement="bottomRight">
                        <Space style={{ cursor: 'pointer' }}>
                            <Avatar
                                src={user.avatar}
                                icon={!user.avatar && <UserOutlined />}
                                className="bg-primary"
                            />
                            <div className="flex flex-col items-start">
                                <Text strong className="text-sm">
                                    {user.name}
                                </Text>
                                {user.email && (
                                    <Text type="secondary" className="text-xs">
                                        {user.email}
                                    </Text>
                                )}
                            </div>
                        </Space>
                    </Dropdown>
                )}
            </Space>
        </div>
    );
};

Topbar.displayName = 'Topbar';
