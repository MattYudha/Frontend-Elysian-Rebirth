'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
    const { isOnline } = useNetworkStatus();

    if (isOnline) return null;

    return (
        <Alert
            variant="default"
            className="fixed top-0 left-0 right-0 z-[9999] rounded-none border-b border-yellow-500/20 bg-yellow-500/10"
        >
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You are offline</AlertTitle>
            <AlertDescription>
                Your actions will be queued and retried when connection is restored.
            </AlertDescription>
        </Alert>
    );
}
