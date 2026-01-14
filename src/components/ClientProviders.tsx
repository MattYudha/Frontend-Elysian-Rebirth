'use client';

import { ConfigProvider, theme } from 'antd';
import { darkTheme } from '@/config/theme';
import { useAuth } from '@/hooks/useAuth';

export function ClientProviders({ children }: { children: React.ReactNode }) {
    useAuth();

    return (
        <ConfigProvider
            theme={{
                ...darkTheme,
                algorithm: theme.darkAlgorithm,
            }}
        >
            {/* In real implementation, wrap with:
        - <TelemetryProvider>
        - <I18nProvider>
        - <PermissionsProvider user={user}>
        - <FeatureFlagsProvider>
        - <XErrorBoundary>
        From @enterprise-ai/x/providers
      */}
            {children}
        </ConfigProvider>
    );
}
