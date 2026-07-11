'use client';

import { Button } from '@/components/ui/';
import { Input } from '@/components/ui/';
import { Bell, Search } from 'lucide-react';

export function TopHeader() {
    return (
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
            <div className="w-96">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search everything..."
                        className="pl-9 bg-secondary/50 border-transparent focus:bg-background transition-colors"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </Button>
            </div>
        </header>
    );
}
