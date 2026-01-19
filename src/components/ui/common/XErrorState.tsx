import React from 'react';
import { Button } from '@/components/ui/';
import { XCircle, AlertTriangle, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface XErrorStateProps {
    type?: 'error' | 'warning' | 'network';
    title?: string;
    message?: string;
    onRetry?: () => void;
    onGoBack?: () => void;
    actions?: React.ReactNode;
    className?: string;
}

export const XErrorState: React.FC<XErrorStateProps> = ({
    type = 'error',
    title,
    message,
    onRetry,
    onGoBack,
    actions,
    className,
}) => {
    const getIcon = () => {
        switch (type) {
            case 'network': return <WifiOff className="h-16 w-16 text-red-500/50" />;
            case 'warning': return <AlertTriangle className="h-16 w-16 text-amber-500/50" />;
            default: return <XCircle className="h-16 w-16 text-red-500/50" />;
        }
    };

    const getDefaultTitle = () => {
        switch (type) {
            case 'network': return 'Connection Failed';
            case 'warning': return 'Warning';
            default: return 'Error Occurred';
        }
    };

    return (
        <div className={cn("flex flex-col items-center justify-center p-10 text-center animate-in zoom-in-95 duration-300", className)}>
            <div className="mb-6 p-4 rounded-full bg-slate-50 border border-slate-100 dark:bg-zinc-900/50 dark:border-zinc-800">
                {getIcon()}
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-2">
                {title || getDefaultTitle()}
            </h3>

            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                {message || 'An unexpected error occurred. Please try again.'}
            </p>

            <div className="flex gap-4 items-center justify-center">
                {actions ? actions : (
                    <>
                        {onRetry && (
                            <Button onClick={onRetry} variant="default">
                                Retry
                            </Button>
                        )}
                        {onGoBack && (
                            <Button onClick={onGoBack} variant="outline">
                                Go Back
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

XErrorState.displayName = 'XErrorState';
