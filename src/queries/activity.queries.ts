/**
 * src/queries/activity.queries.ts
 *
 * Activity Feed Query Layer
 * Policy: No polling. Re-fetches on window focus + cache invalidation after mutations.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchActivityFeed } from '@/services/activity.service';

export const activityKeys = {
    all: ['activity'] as const,
    list: (limit: number) => [...activityKeys.all, 'list', limit] as const,
};

/**
 * useActivityFeed — Recent activity events
 *
 * Policy:
 * - No polling (no refetchInterval)
 * - refetchOnWindowFocus: true (re-fetch when user returns to tab)
 * - staleTime: 60s (consider fresh for 1 minute)
 * - Invalidated by mutations in chat/workflow/knowledge via:
 *   queryClient.invalidateQueries({ queryKey: activityKeys.all })
 */
export function useActivityFeed(limit: number = 20) {
    return useQuery({
        queryKey: activityKeys.list(limit),
        queryFn: () => fetchActivityFeed(limit),
        refetchOnWindowFocus: true,
        staleTime: 60_000,
    });
}
