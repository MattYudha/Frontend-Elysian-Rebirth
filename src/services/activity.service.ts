/**
 * src/services/activity.service.ts
 *
 * Activity Service Layer
 * Responsibilities:
 * - Direct API calls for activity feed
 * - Type definitions for API responses
 */

import { http } from '@/lib/http';

export interface ActivityEvent {
    id: string;
    type: 'chat' | 'rag' | 'editor' | 'workflow' | 'system';
    action: string;
    description: string;
    timestamp: string;
    userId?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Fetch activity feed
 * Endpoint: GET /api/v1/activity
 */
export async function fetchActivityFeed(limit: number = 20): Promise<ActivityEvent[]> {
    const response = await http.get<{ status: string; data: ActivityEvent[] }>(
        `/api/v1/activity?limit=${limit}`
    );
    return response.data;
}
