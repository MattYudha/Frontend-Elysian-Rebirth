'use client';

import React from 'react';
import { Button } from '@/components/ui/';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/';
import { Badge } from '@/components/ui/';
import {
    Menu,
    Bell,
    HelpCircle,
    User,
    Settings,
    LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopbarProps {
    logo?: React.ReactNode;
    title?: string;
    collapsed?: boolean;
    onToggleSidebar?: () => void;
    user?: {
        name: string;
        avatar?: string;
        email?: string;
    };
    notificationCount?: number;
    onNotificationClick?: () => void;
    userMenuItems?: React.ReactNode; // Modified to accept standard ReactNodes or be custom
    actions?: React.ReactNode;
    className?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
    logo,
    title = 'Asisten Operasional',
    collapsed,
    onToggleSidebar,
    user,
    notificationCount = 0,
    onNotificationClick,
    actions,
    className,
}) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-6 h-16 bg-background border-b border-border/40",
                className
            )}
        >
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Sidebar Toggle */}
                {onToggleSidebar && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    {logo}
                    <span className="text-lg font-semibold text-foreground">
                        {title}
                    </span>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Custom Actions */}
                {actions}

                {/* Help */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                >
                    <HelpCircle className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNotificationClick}
                        className="text-muted-foreground"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>
                    {notificationCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-background pointer-events-none" />
                    )}
                </div>

                {/* User Profile */}
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
};

Topbar.displayName = 'Topbar';
