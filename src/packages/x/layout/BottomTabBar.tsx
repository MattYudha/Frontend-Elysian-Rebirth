import React from 'react';
import { Badge } from 'antd';
import {
    HomeOutlined,
    MessageOutlined,
    DatabaseOutlined,
    NodeIndexOutlined,
    UserOutlined,
} from '@ant-design/icons';

export interface TabItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

export interface BottomTabBarProps {
    /**
     * Tab items
     */
    items?: TabItem[];

    /**
     * Currently active tab key
     */
    activeKey?: string;

    /**
     * Callback when tab is clicked
     */
    onTabClick?: (key: string) => void;

    /**
     * Custom class name
     */
    className?: string;
}

/**
 * BottomTabBar - Mobile bottom navigation bar
 * 
 * Features:
 * - Fixed bottom positioning
 * - Icon + label tabs
 * - Badge support for notifications
 * - Active state highlighting
 * - Touch-friendly sizing
 * 
 * @example
 * ```tsx
 * <BottomTabBar
 *   items={[
 *     { key: 'home', icon: <HomeOutlined />, label: 'Home' },
 *     { key: 'chat', icon: <MessageOutlined />, label: 'Chat', badge: 3 },
 *   ]}
 *   activeKey="home"
 *   onTabClick={handleTabClick}
 * />
 * ```
 */
export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    items,
    activeKey,
    onTabClick,
    className,
}) => {
    const defaultItems: TabItem[] = items || [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: 'chat',
            icon: <MessageOutlined />,
            label: 'Chat',
            badge: 3,
        },
        {
            key: 'knowledge',
            icon: <DatabaseOutlined />,
            label: 'Knowledge',
        },
        {
            key: 'workflow',
            icon: <NodeIndexOutlined />,
            label: 'Workflow',
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
    ];

    const handleTabClick = (key: string) => {
        onTabClick?.(key);
    };

    return (
        <div
            className={className}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${defaultItems.length}, 1fr)`,
                height: 60,
                backgroundColor: '#fff',
                borderTop: '1px solid #f0f0f0',
            }}
        >
            {defaultItems.map((item) => {
                const isActive = item.key === activeKey;

                return (
                    <button
                        key={item.key}
                        onClick={() => handleTabClick(item.key)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            padding: '8px 0',
                            transition: 'all 0.2s',
                            position: 'relative',
                        }}
                    >
                        {/* Badge */}
                        {item.badge && item.badge > 0 ? (
                            <Badge count={item.badge} offset={[8, -2]}>
                                <div
                                    style={{
                                        fontSize: 22,
                                        color: isActive ? '#1677ff' : '#8c8c8c',
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    {item.icon}
                                </div>
                            </Badge>
                        ) : (
                            <div
                                style={{
                                    fontSize: 22,
                                    color: isActive ? '#1677ff' : '#8c8c8c',
                                    transition: 'color 0.2s',
                                }}
                            >
                                {item.icon}
                            </div>
                        )}

                        {/* Label */}
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? '#1677ff' : '#8c8c8c',
                                transition: 'all 0.2s',
                            }}
                        >
                            {item.label}
                        </span>

                        {/* Active Indicator */}
                        {isActive && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 40,
                                    height: 3,
                                    backgroundColor: '#1677ff',
                                    borderRadius: '0 0 3px 3px',
                                }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

BottomTabBar.displayName = 'BottomTabBar';
