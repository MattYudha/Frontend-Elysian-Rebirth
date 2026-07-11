/**
 * DegradationBanner.tsx — Network-truth degradation banner
 *
 * Shows when organic API calls return 503/504/429.
 * "Retry" button triggers queryClient.invalidateQueries() for degraded services,
 * forcing real GET/POST requests. If those succeed, the Axios interceptor calls
 * clearFor() and the banner auto-hides.
 *
 * No health polling. No HEAD probes. No timer-based clearing.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { globalDegradation } from '@/lib/globalDegradation';

export function DegradationBanner() {
    const queryClient = useQueryClient();
    const [isDegraded, setIsDegraded] = useState(false);
    const [degradedServices, setDegradedServices] = useState<string[]>([]);
    const [dismissed, setDismissed] = useState(false);
    const [retrying, setRetrying] = useState(false);

    useEffect(() => {
        const unsubscribe = globalDegradation.subscribe((degraded, services) => {
            setIsDegraded(degraded);
            setDegradedServices(services);
            // Reset dismissed state when new degradation occurs
            if (degraded) setDismissed(false);
            // Clear retrying state when degradation resolves
            if (!degraded) setRetrying(false);
        });
        return unsubscribe;
    }, []);

    /**
     * Retry: invalidate queries for all degraded services.
     * This triggers real API requests (GET/POST). If they return 200,
     * the Axios interceptor calls clearFor() and the banner auto-hides.
     */
    const handleRetry = useCallback(() => {
        setRetrying(true);
        const queryKeys = globalDegradation.getDegradedQueryKeys();
        queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: key });
        });
        // Retrying state clears when degradation resolves (in subscribe callback)
        // or after a timeout as UX fallback
        setTimeout(() => setRetrying(false), 5000);
    }, [queryClient]);

    if (!isDegraded || dismissed) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                    <span className="font-medium">Service degradation detected.</span>{' '}
                    Some features ({degradedServices.join(', ')}) may be temporarily unavailable.
                </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={handleRetry}
                    disabled={retrying}
                    className="flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${retrying ? 'animate-spin' : ''}`} />
                    {retrying ? 'Retrying...' : 'Retry'}
                </button>
                <button
                    onClick={() => setDismissed(true)}
                    className="text-amber-500 hover:text-amber-700 transition-colors"
                    aria-label="Dismiss banner"
                    title="Hide banner (degradation state persists)"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
