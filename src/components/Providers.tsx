'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TelemetryProvider } from '@/components/providers/TelemetryProvider';
import { I18nProvider, Locale } from '@/components/providers/I18nProvider';
import { PermissionsProvider } from '@/components/providers/PermissionsProvider';
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';

import { GlobalCommandDialog } from '@/components/command/GlobalCommandDialog';
import SettingsModal from '@/components/settings/SettingsModal';

import { QueryProvider } from '@/components/providers/QueryProvider';
import { MockProvider } from '@/components/providers/MockProvider';
import { TenantProvider } from '@/contexts/TenantContext';

// Dynamic imports to reduce bundle size for non-marketing paths and prevent hydration mismatches
const SiteFooter = dynamic(() => import('@/components/SiteFooter').then(mod => mod.SiteFooter), {
    ssr: false,
    loading: () => null // Prevent layout shift during load
});

const CookieConsent = dynamic(() => import('@/components/CookieConsent').then(mod => mod.CookieConsent), {
    ssr: false
});

// Static references to prevent unnecessary re-renders in Provider contexts
const TELEMETRY_ON_EVENT = () => {};
const DEFAULT_PERMISSIONS = ['admin', 'editor'];
const DEFAULT_ROLES = ['admin'];
const DEFAULT_FLAGS = { advancedMode: true };

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [locale, setLocale] = React.useState<Locale>('id');

    // Pages that are purely for marketing/public viewing and should be forced to dark mode
    const isMarketingPage = pathname ? (
                            pathname === '/' ||
                            pathname.startsWith('/observability') ||
                            pathname.startsWith('/actions-triggers') ||
                            pathname.startsWith('/evals') ||
                            pathname.startsWith('/prompt-management') ||
                            pathname.startsWith('/deployment') ||
                            pathname.startsWith('/rag') ||
                            pathname.startsWith('/docs') ||
                            pathname.startsWith('/pricing') ||
                            pathname.startsWith('/usecases') ||
                            pathname.startsWith('/use-cases') ||
                            pathname.startsWith('/resources') ||
                            pathname.startsWith('/tutorial') ||
                            pathname.startsWith('/examples') ||
                            pathname.startsWith('/blog') ||
                            pathname.startsWith('/about') ||
                            pathname.startsWith('/launch-week') ||
                            pathname.startsWith('/documentations')
    ) : false;

    const isDashboardArea = pathname ? (
                            pathname.startsWith('/dashboard') ||
                            pathname.startsWith('/settings') ||
                            pathname.startsWith('/chat') ||
                            pathname.startsWith('/editor') ||
                            pathname.startsWith('/admin') ||
                            pathname.startsWith('/swarm') ||
                            pathname.startsWith('/action-center') ||
                            pathname.startsWith('/workstreams') ||
                            pathname.startsWith('/workflow') ||
                            pathname.startsWith('/getting-started') ||
                            pathname.startsWith('/help') ||
                            pathname.startsWith('/debug') ||
                            pathname.startsWith('/blockchain')
    ) : false;

    const isDarkOnlyPage = isMarketingPage || !isDashboardArea;

    return (
        <MockProvider>
            <QueryProvider>
                <TenantProvider>
                    <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="elysian-theme" // Unified storage key
                    forcedTheme={isDarkOnlyPage ? 'dark' : undefined}
                >
                    <TelemetryProvider onEvent={TELEMETRY_ON_EVENT}>
                        <I18nProvider locale={locale} onLocaleChange={setLocale}>
                            <PermissionsProvider permissions={DEFAULT_PERMISSIONS} roles={DEFAULT_ROLES}>
                                <FeatureFlagsProvider flags={DEFAULT_FLAGS}>
                                    <SidebarProvider>
                                        <OfflineBanner />
                                        <SessionTimeoutWarning />
                                        <GlobalCommandDialog />
                                        <SettingsModal />
                                        <div className="pb-0">
                                            <SmoothScroll>
                                                {children}
                                            </SmoothScroll>
                                        </div>
                                        <Toaster />
                                        <SonnerToaster />

                                        {/* SiteFooter and CookieConsent are rendered client-side only and code-split */}
                                        {pathname === '/' && <SiteFooter />}
                                        {pathname === '/' && <CookieConsent />}
                                    </SidebarProvider>
                                </FeatureFlagsProvider>
                            </PermissionsProvider>
                        </I18nProvider>
                    </TelemetryProvider>
                    </ThemeProvider>
                </TenantProvider>
            </QueryProvider>
        </MockProvider >
    );
}
