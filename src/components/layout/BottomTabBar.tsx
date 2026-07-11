import React from 'react';
import { Badge } from '@/components/ui/';
import { Home, MessageSquare, Database, Share2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TabItem {
    key: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

export interface BottomTabBarProps {
    items?: TabItem[];
    activeKey?: string;
    onTabClick?: (key: string) => void;
    className?: string;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    items,
    activeKey,
    onTabClick,
    className,
}) => {
    const defaultItems: TabItem[] = items || [
        {
            key: 'home',
            icon: <Home className="h-6 w-6" />,
            label: 'Home',
        },
        {
            key: 'chat',
            icon: <MessageSquare className="h-6 w-6" />,
            label: 'Chat',
            badge: 3,
        },
        {
            key: 'knowledge',
            icon: <Database className="h-6 w-6" />,
            label: 'Knowledge',
        },
        {
            key: 'workflow',
            icon: <Share2 className="h-6 w-6" />,
            label: 'Workflow',
        },
        {
            key: 'profile',
            icon: <User className="h-6 w-6" />,
            label: 'Profile',
        },
    ];

    const handleTabClick = (key: string) => {
        onTabClick?.(key);
    };

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 h-[60px] bg-background border-t grid z-50",
                "grid-cols-5 items-center justify-items-center pb-safe",
                className
            )}
            style={{ gridTemplateColumns: `repeat(${defaultItems.length}, 1fr)` }}
        >
            {defaultItems.map((item) => {
                const isActive = item.key === activeKey;

                return (
                    <button
                        key={item.key}
                        onClick={() => handleTabClick(item.key)}
                        className={cn(
                            "relative flex flex-col items-center justify-center gap-1 w-full h-full border-none bg-transparent cursor-pointer transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {/* Wrapper for Icon + Badge */}
                        <div className="relative">
                            {item.icon}
                            {item.badge && item.badge > 0 && (
                                <Badge variant="destructive" className="absolute -top-1.5 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[9px] rounded-full">
                                    {item.badge}
                                </Badge>
                            )}
                        </div>

                        {/* Label */}
                        <span className={cn("text-[10px] font-medium leading-none", isActive && "font-semibold")}>
                            {item.label}
                        </span>

                        {/* Active Indicator */}
                        {isActive && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-b-sm" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

BottomTabBar.displayName = 'BottomTabBar';
