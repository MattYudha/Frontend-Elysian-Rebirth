/**
 * ApiErrorFallback.tsx — Reusable error state component for React Query errors
 *
 * Use inside component sections where data fetching might fail.
 * Provides clear error messaging and a retry button.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ApiErrorFallbackProps {
    /** Error object from React Query */
    error: Error | null;
    /** Retry callback — typically query.refetch() */
    onRetry?: () => void;
    /** Custom title */
    title?: string;
    /** Custom description */
    description?: string;
    /** Whether to show as a Card (true) or inline (false) */
    card?: boolean;
}

export function ApiErrorFallback({
    error,
    onRetry,
    title = 'Failed to load data',
    description,
    card = true,
}: ApiErrorFallbackProps) {
    const errorMessage = description || error?.message || 'An unexpected error occurred. Please try again.';

    const content = (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
            <div className="space-y-1">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-sm">{errorMessage}</p>
            </div>
            {onRetry && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="gap-2"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try Again
                </Button>
            )}
        </div>
    );

    if (card) {
        return (
            <Card className="border-red-100 dark:border-red-900/30">
                <CardContent className="p-0">{content}</CardContent>
            </Card>
        );
    }

    return content;
}
