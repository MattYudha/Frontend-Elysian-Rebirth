import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardNavbar } from '@/components/DashboardNavbar';
import { ElysianGrid } from '@/components/backgrounds/ElysianGrid';
import { StoreInitializer } from '@/components/providers/StoreInitializer';
import { OnboardingController } from '@/components/onboarding/OnboardingController';
import { config } from '@/lib/config';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const refreshCookie = cookieStore.get('refresh_token')?.value;

    if (!refreshCookie) {
        // No refresh token means no session, redirect to login
        redirect('/login');
    }

    // Let the client-side persistent Zustand store handle user context and session state.
    // By keeping this layout lightweight, we prevent synchronous blocking network requests
    // during page navigation, enabling instantaneous page rendering.
    const user = { id: 'usr_fallback', name: 'Elysian User', email: 'user@elysian.com', role: 'viewer' as const, avatar: undefined };
    const accessToken = undefined;

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden relative z-0 bg-slate-50/50 dark:bg-[#060D18]">
            <StoreInitializer user={user} accessToken={accessToken} />
            <OnboardingController />

            <ElysianGrid />

            <Sidebar />

            <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
                <div className="relative z-10 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                    <DashboardNavbar staticMode={true} />
                </div>

                <div id="main-scroll-container" className="flex-1 overflow-y-auto relative">
                    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
