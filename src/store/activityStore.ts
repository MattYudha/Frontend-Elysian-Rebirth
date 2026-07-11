import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityEvent {
  id: string;
  type: 'chat' | 'rag' | 'editor' | 'workflow' | 'system';
  action: string;
  description: string;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface ActivityState {
  events: ActivityEvent[];
  addEvent: (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  clearEvents: () => void;
  getRecentEvents: (limit?: number) => ActivityEvent[];
  getEventsByType: (type: ActivityEvent['type']) => ActivityEvent[];
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (event) => {
        const newEvent: ActivityEvent = {
          ...event,
          id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        set((state) => ({
          events: [newEvent, ...state.events].slice(0, 100), // Keep last 100 events
        }));
      },

      clearEvents: () => set({ events: [] }),

      getRecentEvents: (limit = 10) => {
        return get().events.slice(0, limit);
      },

      getEventsByType: (type) => {
        return get().events.filter((e) => e.type === type);
      },
    }),
    {
      name: 'activity-storage',
    }
  )
);
