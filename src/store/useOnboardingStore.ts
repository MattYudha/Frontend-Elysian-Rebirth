import { create } from 'zustand';
import { getOnboardingSteps } from '@/config/onboarding';

// ─── Types ──────────────────────────────────────────────────────
export type OnboardingPhase = 'welcome' | 'setup' | 'tour' | 'completed';

export interface UserSetupProfile {
    displayName: string;
    businessType: string;
    enabledFeatures: string[];
}

interface OnboardingState {
    // Phase tracking
    currentPhase: OnboardingPhase;
    isFirstTimeUser: boolean;

    // Phase 1: Welcome
    hasSeenWelcome: boolean;

    // Phase 2: Setup Wizard
    setupStep: number; // 1-3
    userProfile: UserSetupProfile;

    // Phase 3: Tour (existing system, enhanced)
    currentMilestone: number;
    isOpen: boolean;
    isCompleted: boolean;
    showCelebration: boolean;
    hasSeenOnboardingAt: number | null;

    // Actions
    // Phase navigation
    startOnboarding: () => void;
    completeWelcome: () => void;
    skipWelcome: () => void;

    // Setup wizard
    nextSetupStep: () => void;
    prevSetupStep: () => void;
    updateProfile: (data: Partial<UserSetupProfile>) => void;
    completeSetup: () => void;
    skipSetup: () => void;

    // Tour (existing, updated)
    open: () => void;
    close: () => void;
    nextStep: () => void;
    completeTour: () => void;
    dismissCelebration: () => void;

    // Global
    resetOnboarding: () => void;
    getStepNumber: () => number;
    syncProgress: () => void;
    getTourProgress: () => { current: number; total: number; percent: number };
}

// ─── Default Profile ────────────────────────────────────────────
const defaultProfile: UserSetupProfile = {
    displayName: '',
    businessType: '',
    enabledFeatures: ['chat', 'knowledge', 'workflow', 'editor'],
};

// ─── Store ──────────────────────────────────────────────────────
// NOTE: Pure in-memory store (no localStorage persistence per AGENTS.md security rules)
export const useOnboardingStore = create<OnboardingState>()(
    (set, get) => ({
        // Initial state
        currentPhase: 'welcome',
        isFirstTimeUser: false,
        hasSeenWelcome: false,
        setupStep: 1,
        userProfile: { ...defaultProfile },
        currentMilestone: 1,
        isOpen: false,
        isCompleted: false,
        showCelebration: false,
        hasSeenOnboardingAt: null,

        // ── Phase Navigation ────────────────────────────────
        startOnboarding: () => set({
            isFirstTimeUser: true,
            currentPhase: 'welcome',
            hasSeenWelcome: false,
            setupStep: 1,
            currentMilestone: 1,
            isCompleted: false,
            hasSeenOnboardingAt: null,
        }),

        completeWelcome: () => set({
            hasSeenWelcome: true,
            currentPhase: 'setup',
        }),

        skipWelcome: () => set({
            hasSeenWelcome: true,
            currentPhase: 'setup',
        }),

        // ── Setup Wizard ────────────────────────────────────
        nextSetupStep: () => {
            const current = get().setupStep;
            if (current < 3) {
                set({ setupStep: current + 1 });
            } else {
                get().completeSetup();
            }
        },

        prevSetupStep: () => {
            const current = get().setupStep;
            if (current > 1) {
                set({ setupStep: current - 1 });
            }
        },

        updateProfile: (data) => set((state) => ({
            userProfile: { ...state.userProfile, ...data },
        })),

        completeSetup: () => set({
            currentPhase: 'tour',
            isOpen: true,
        }),

        skipSetup: () => set({
            currentPhase: 'tour',
            isOpen: true,
        }),

        // ── Tour (Phase 3) ──────────────────────────────────
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),

        nextStep: () => {
            const { currentMilestone } = get();
            // Use desktop steps length as canonical (8 steps)
            const steps = getOnboardingSteps(false);
            if (currentMilestone < steps.length) {
                set({ currentMilestone: currentMilestone + 1 });
            } else {
                get().completeTour();
            }
        },

        completeTour: () => set({
            isCompleted: true,
            isOpen: false,
            showCelebration: true,
            currentPhase: 'completed',
            hasSeenOnboardingAt: Date.now(),
            isFirstTimeUser: false,
        }),

        dismissCelebration: () => set({ showCelebration: false }),

        // ── Global ──────────────────────────────────────────
        resetOnboarding: () => set({
            currentPhase: 'welcome',
            isFirstTimeUser: true,
            hasSeenWelcome: false,
            setupStep: 1,
            userProfile: { ...defaultProfile },
            currentMilestone: 1,
            isOpen: false,
            isCompleted: false,
            showCelebration: false,
            hasSeenOnboardingAt: null,
        }),

        getStepNumber: () => get().currentMilestone,

        syncProgress: () => {
            // Ensure phase consistency
            const { hasSeenOnboardingAt, isCompleted } = get();
            if (hasSeenOnboardingAt && isCompleted) {
                set({ currentPhase: 'completed', isFirstTimeUser: false });
            }
        },

        getTourProgress: () => {
            const steps = getOnboardingSteps(false);
            const current = get().currentMilestone;
            return {
                current,
                total: steps.length,
                percent: Math.round((current / steps.length) * 100),
            };
        },
    })
);
