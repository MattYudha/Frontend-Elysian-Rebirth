'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { ThemeProvider } from 'next-themes';
import { TelemetryProvider } from '@/components/providers/TelemetryProvider';
import { I18nProvider } from '@/components/providers/I18nProvider';
import { PermissionsProvider } from '@/components/providers/PermissionsProvider';
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';
import { CrashRecoveryProvider } from '@/components/CrashRecoveryProvider';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SiteFooter } from '@/components/SiteFooter';
import { Toaster } from '@/components/ui/toaster';

import { GlobalCommandDialog } from '@/components/command/GlobalCommandDialog';

import { QueryProvider } from '@/components/providers/QueryProvider';
import { MockProvider } from '@/components/providers/MockProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Only allow dark mode on the specific landing page root '/'
    // All other pages (Dashboard, Settings, Chat, Auth, etc.) are forced to Light Mode
    const isLandingPage = pathname === '/';

    return (
        <MockProvider>
            <QueryProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    forcedTheme={!isLandingPage ? 'light' : undefined}
                >
                    <TelemetryProvider onEvent={() => { }}>
                        <I18nProvider locale="id">
                            <PermissionsProvider permissions={['admin', 'editor']} roles={['admin']}>
                                <FeatureFlagsProvider flags={{ advancedMode: true }}>
                                    <CrashRecoveryProvider>
                                        <SidebarProvider>
                                            <OfflineBanner />
                                            <SessionTimeoutWarning />
                                            <GlobalCommandDialog />
                                            <div className="pb-20 md:pb-0">
                                                <SmoothScroll>
                                                    {children}
                                                </SmoothScroll>
                                            </div>
                                            <Toaster />
                                            <Toaster />

                                            {/* Hide Bottom Nav on Auth Pages and Landing Page */}
                                            {!['/login', '/register', '/forgot-password', '/'].includes(pathname) && (
                                                <MobileBottomNav />
                                            )}
                                            {pathname === '/' && <SiteFooter />}
                                        </SidebarProvider>
                                    </CrashRecoveryProvider>
                                </FeatureFlagsProvider>
                            </PermissionsProvider>
                        </I18nProvider>
                    </TelemetryProvider>
                </ThemeProvider>
            </QueryProvider>
        </MockProvider>
    );
}
