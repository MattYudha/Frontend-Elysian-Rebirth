'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TelemetryProvider } from '@/components/providers/TelemetryProvider';
import { I18nProvider, Locale } from '@/components/providers/I18nProvider';
import { PermissionsProvider } from '@/components/providers/PermissionsProvider';
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';
import { OfflineBanner } from '@/components/OfflineBanner';
import { SessionTimeoutWarning } from '@/components/SessionTimeoutWarning';
import { SiteFooter } from '@/components/SiteFooter';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/CookieConsent';

import { GlobalCommandDialog } from '@/components/command/GlobalCommandDialog';

import { QueryProvider } from '@/components/providers/QueryProvider';
import { MockProvider } from '@/components/providers/MockProvider';
import { TenantProvider } from '@/contexts/TenantContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [locale, setLocale] = React.useState<Locale>('id');

    // Only allow dark mode on the specific landing page root '/'
    // All other pages (Dashboard, Settings, Chat, Auth, etc.) are forced to Light Mode
    const isLandingPage = pathname === '/';

    return (
        <MockProvider>
            <QueryProvider>
                <TenantProvider>
                    <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    storageKey="elysian-theme" // Unified storage key
                >
                    <TelemetryProvider onEvent={() => { }}>
                        <I18nProvider locale={locale} onLocaleChange={setLocale}>
                            <PermissionsProvider permissions={['admin', 'editor']} roles={['admin']}>
                                <FeatureFlagsProvider flags={{ advancedMode: true }}>
                                    <SidebarProvider>
                                        <OfflineBanner />
                                        <SessionTimeoutWarning />
                                        <GlobalCommandDialog />
                                        <div className="pb-0">
                                            {isLandingPage ? (
                                                <SmoothScroll>
                                                    {children}
                                                </SmoothScroll>
                                            ) : (
                                                <>{children}</>
                                            )}
                                        </div>
                                        <Toaster />
                                        <SonnerToaster />

                                        {/* Hide Bottom Nav on Auth Pages and Landing Page */}
                                        {/* Mobile Bottom Nav Removed as requested */}
                                        {/* {!['/login', '/register', '/forgot-password', '/'].includes(pathname) && (
                                            <MobileBottomNav />
                                        )} */}
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
