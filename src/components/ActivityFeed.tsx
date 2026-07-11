/**
 * ActivityFeed.tsx — Now powered by React Query instead of Zustand
 *
 * Uses useActivityFeed() which:
 * - Fetches on mount
 * - Refetches on window focus
 * - Gets invalidated after mutations in chat/workflow/knowledge
 * - No polling
 */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/';
import { Badge } from '@/components/ui/';
import {
  MessageSquare,
  Database,
  Edit,
  Workflow,
  Info,
  Loader2,
} from 'lucide-react';
import { useActivityFeed } from '@/queries/activity.queries';

const iconMap = {
  chat: MessageSquare,
  rag: Database,
  editor: Edit,
  workflow: Workflow,
  system: Info,
};

const colorMap = {
  chat: 'bg-blue-500',
  rag: 'bg-green-500',
  editor: 'bg-orange-500',
  workflow: 'bg-purple-500',
  system: 'bg-gray-500',
};

export function ActivityFeed({ limit = 10 }: { limit?: number }) {
  const { data: events = [], isLoading, isError } = useActivityFeed(limit);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Loading activity...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Failed to load activity feed</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const eventType = event.type as keyof typeof iconMap;
            const Icon = iconMap[eventType] || Info;
            const colorClass = colorMap[eventType] || 'bg-gray-500';

            return (
              <div key={event.id || `${event.timestamp}-${index}`} className="flex gap-4">
                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {index < events.length - 1 && (
                    <div className="absolute left-5 top-10 h-full w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 space-y-1 pb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <span className="font-semibold text-sm">{event.action}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
