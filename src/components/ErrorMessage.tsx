import { Alert, AlertDescription, AlertTitle } from '@/components/ui/';
import { Button } from '@/components/ui/';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    error: Error | string;
    onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
    const message = error instanceof Error ? error.message : error;

    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>{message}</span>
                {onRetry && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRetry}
                        className="ml-4"
                    >
                        Retry
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
