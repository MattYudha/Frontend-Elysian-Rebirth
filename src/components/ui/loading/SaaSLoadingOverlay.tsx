'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SaaSLoadingOverlayProps {
    active: boolean;
    message?: string;
    className?: string;
}

export const SaaSLoadingOverlay: React.FC<SaaSLoadingOverlayProps> = ({
    active,
    message = 'Processing...',
    className,
}) => {
    if (!active) {
        return null;
    }

    return (
        <div
            className={cn(
                "fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300",
                className
            )}
        >
            {/* Glassmorphic card */}
            <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
                <p className="text-white text-lg font-medium tracking-wide animate-pulse">{message}</p>
            </div>
        </div>
    );
};

SaaSLoadingOverlay.displayName = 'SaaSLoadingOverlay';
