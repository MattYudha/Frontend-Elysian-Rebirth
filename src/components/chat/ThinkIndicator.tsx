import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThinkIndicatorProps {
    message?: string;
    className?: string;
}

export const ThinkIndicator: React.FC<ThinkIndicatorProps> = ({
    message = 'Thinking...',
    className,
}) => {
    return (
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg mb-4 text-sm text-muted-foreground animate-in fade-in duration-300",
                className
            )}
        >
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="animate-pulse font-medium">
                {message}
            </span>
        </div>
    );
};

ThinkIndicator.displayName = 'ThinkIndicator';
