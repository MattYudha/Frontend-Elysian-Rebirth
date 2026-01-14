'use client';

import { NavigationMenu } from '@/components/NavigationMenu';
import { APP_NAME } from '@/lib/config';
import { User } from 'lucide-react';

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm hidden md:flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
                        {APP_NAME}
                    </span>
                </h1>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                <NavigationMenu />
            </div>
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">admin@elysian.ai</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
