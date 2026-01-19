'use client';

import { createContext, useContext, ReactNode } from 'react';

export type FeatureFlags = Record<string, boolean>;

export interface FeatureFlagsContextValue {
    /**
     * All feature flags
     */
    flags: FeatureFlags;

    /**
     * Check if feature is enabled
     */
    isEnabled: (key: string) => boolean;

    /**
     * Get feature flag value (with default fallback)
     */
    getFlag: (key: string, defaultValue?: boolean) => boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

export interface FeatureFlagsProviderProps {
    /**
     * Feature flags configuration
     */
    flags: FeatureFlags;

    /**
     * Children components
     */
    children: ReactNode;
}

/**
 * FeatureFlagsProvider - Feature flag provider for kill switches and gradual rollouts
 * 
 * @example
 * ```tsx
 * <FeatureFlagsProvider
 *   flags={{
 *     'workflow-builder': true,
 *     'rag-v2': false,
 *     'streaming-chat': true,
 *   }}
 * >
 *   <App />
 * </FeatureFlagsProvider>
 * ```
 */
export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({
    flags,
    children,
}) => {
    const isEnabled = (key: string): boolean => {
        return flags[key] === true;
    };

    const getFlag = (key: string, defaultValue: boolean = false): boolean => {
        return flags[key] ?? defaultValue;
    };

    const value: FeatureFlagsContextValue = {
        flags,
        isEnabled,
        getFlag,
    };

    return (
        <FeatureFlagsContext.Provider value={value}>
            {children}
        </FeatureFlagsContext.Provider>
    );
};

/**
 * useFeatureFlag - Hook to check feature flags
 * 
 * @example
 * ```tsx
 * const { isEnabled } = useFeatureFlag();
 * 
 * if (isEnabled('workflow-builder')) {
 *   return <WorkflowCanvas />;
 * }
 * ```
 */
export const useFeatureFlag = (): FeatureFlagsContextValue => {
    const context = useContext(FeatureFlagsContext);

    if (!context) {
        // Fallback - all features disabled
        return {
            flags: {},
            isEnabled: () => false,
            getFlag: (_, defaultValue = false) => defaultValue,
        };
    }

    return context;
};

/**
 * Feature - Component guard for feature flag-based rendering
 * 
 * @example
 * ```tsx
 * <Feature flag="workflow-builder">
 *   <WorkflowCanvas />
 * </Feature>
 * 
 * <Feature flag="rag-v2" fallback={<RagV1 />}>
 *   <RagV2 />
 * </Feature>
 * ```
 */
export interface FeatureProps {
    flag: string;
    fallback?: ReactNode;
    children: ReactNode;
}

export const Feature: React.FC<FeatureProps> = ({ flag, fallback = null, children }) => {
    const { isEnabled } = useFeatureFlag();

    return isEnabled(flag) ? <>{children}</> : <>{fallback}</>;
};

FeatureFlagsProvider.displayName = 'FeatureFlagsProvider';
Feature.displayName = 'Feature';
