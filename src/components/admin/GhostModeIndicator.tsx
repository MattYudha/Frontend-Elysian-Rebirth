'use client';

import { useImpersonate } from "@/hooks/useImpersonate";
import { Button } from "@/components/ui/button";
import { Ghost, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export function GhostModeIndicator() {
    const { isImpersonating, exitGhostMode } = useImpersonate();
    const [tenantName, setTenantName] = useState<string>('');

    useEffect(() => {
        if (isImpersonating) {
            setTenantName(localStorage.getItem('impersonating_tenant') || 'Unknown User');
        }
    }, [isImpersonating]);

    if (!isImpersonating) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black px-4 py-2 shadow-md flex items-center justify-center gap-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 font-bold tracking-wider animate-pulse">
                <Ghost className="h-5 w-5" />
                <span>GHOST MODE ACTIVE</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-black/20" />
            <div className="text-sm font-medium">
                You are acting as: <span className="font-bold underline">{tenantName}</span>
            </div>
            <Button
                size="sm"
                variant="destructive"
                onClick={exitGhostMode}
                className="ml-4 h-7 text-xs bg-black text-white hover:bg-slate-800 border-none"
            >
                <LogOut className="mr-2 h-3 w-3" />
                EXIT GHOST MODE
            </Button>
        </div>
    );
}
