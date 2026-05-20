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

    // Attempt to refresh the session and get user data
    let user: { id: string; name: string; email: string; role: 'admin' | 'super_admin' | 'manager' | 'viewer'; avatar: string | undefined } = { id: 'usr_fallback', name: 'Elysian User', email: 'user@elysian.com', role: 'viewer', avatar: undefined };
    let accessToken: string | undefined;

    try {
        // Determine the correct backend URL for SSR refresh
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL 
            || process.env.ELYSIAN_API_URL 
            || 'http://localhost:7777';

        const response = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refresh_token=${refreshCookie}`,
            },
            body: JSON.stringify({ refresh_token: refreshCookie }),
            cache: 'no-store',
        });

        if (response.ok) {
            const responseData = await response.json();

            // Handle token rotation
            const setCookieHeader = response.headers.get('set-cookie');
            if (setCookieHeader) {
                const match = setCookieHeader.match(/refresh_token=([^;]+)/);
                if (match && match[1]) {
                    try {
                        cookieStore.set({
                            name: 'refresh_token',
                            value: match[1],
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 7 * 24 * 60 * 60
                        });
                    } catch {
                        // Cookie rotation may fail in some Next.js versions, non-critical
                    }
                }
            }

            const rawUser = responseData.data?.user || responseData.data;
            if (rawUser) {
                user = {
                    id: rawUser.id || user.id,
                    name: rawUser.full_name || rawUser.name || user.name,
                    email: rawUser.email || user.email,
                    role: (rawUser.role || 'viewer') as 'admin' | 'super_admin' | 'manager' | 'viewer',
                    avatar: rawUser.avatar_url || rawUser.avatar || undefined
                };
            }
            accessToken = responseData.data?.access_token || responseData.access_token;
        } else if (response.status === 401 || response.status === 403) {
            // Token is truly invalid/expired, delete cookie and redirect to login
            try {
                cookieStore.delete('refresh_token');
            } catch {
                // Ignore cookie deletion errors in some Next.js edge cases
            }
            redirect('/login?session_expired=true');
        }
    } catch (error) {
        // CRITICAL: Re-throw Next.js redirect errors — they must NOT be swallowed by catch
        // redirect() in Next.js App Router throws a special NEXT_REDIRECT error
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        const errorObj = error as { digest?: string };
        if (errorObj?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        // Network error reaching backend — continue with fallback user data
        // The dashboard will render with limited functionality
        console.warn("SSR refresh failed (backend may be starting up):", error instanceof Error ? error.message : String(error));
    }

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
