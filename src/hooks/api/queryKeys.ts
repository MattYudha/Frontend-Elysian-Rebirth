// Centralized Query Keys for Enterprise React Query Architecture
export const queryKeys = {
    workspace: {
        all: ['workspace'] as const,
        teammates: () => [...queryKeys.workspace.all, 'teammates'] as const,
        billing: () => [...queryKeys.workspace.all, 'billing'] as const,
        preferences: () => [...queryKeys.workspace.all, 'preferences'] as const,
    },
    ai: {
        all: ['ai'] as const,
        agents: () => [...queryKeys.ai.all, 'agents'] as const,
        skills: () => [...queryKeys.ai.all, 'skills'] as const,
    },
    user: {
        profile: ['user', 'profile'] as const,
    }
} as const;
