/**
 * QueryProvider.tsx — React Query global configuration with error interception
 *
 * Global error handlers via QueryCache and MutationCache:
 * - Shows toast for background refetch failures (only if stale data exists)
 * - Shows toast for mutation failures
 * - No dedicated health polling — errors detected from organic API calls
 */
'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode } from 'react';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            // Only show toast for background refetch failures where stale data exists.
            if (query.state.data !== undefined) {
                toast.error(`Background sync failed: ${error.message}`, {
                    duration: 4000,
                });
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            // Global fallback for mutations that don't handle errors locally
            toast.error(`Action failed: ${error.message}`, {
                duration: 5000,
            });
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export function clearQueryCache() {
    queryClient.clear();
}

export function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
