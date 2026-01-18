'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ThemeProvider } from 'next-themes';
import {
    TelemetryProvider,
    I18nProvider,
    PermissionsProvider,
    FeatureFlagsProvider
} from '@enterprise-ai/x';
import { CrashRecoveryProvider } from '@/components/CrashRecoveryProvider';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { SiteFooter } from '@/components/SiteFooter';
import { Toaster } from '@/ui/sonner';

import { GlobalCommandDialog } from '@/components/command/GlobalCommandDialog';

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <TelemetryProvider onEvent={() => { }}>
                <I18nProvider locale="en">
                    <PermissionsProvider permissions={['admin', 'editor']} roles={['admin']}>
                        <FeatureFlagsProvider flags={{ advancedMode: true }}>
                            <CrashRecoveryProvider>
                                <SidebarProvider>
                                    <OfflineBanner />
                                    <SessionTimeoutWarning />
                                    <GlobalCommandDialog />
                                    <div className="pb-28 md:pb-0">
                                        {children}
                                    </div>
                                    <Toaster />
                                    <MobileBottomNav />
                                    {pathname === '/' && <SiteFooter />}
                                </SidebarProvider>
                            </CrashRecoveryProvider>
                        </FeatureFlagsProvider>
                    </PermissionsProvider>
                </I18nProvider>
            </TelemetryProvider>
        </ThemeProvider>
    );
}
