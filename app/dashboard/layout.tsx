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
    // In Edge middleware, we rely on standard next/server. Here we use next/headers
    const refreshCookie = cookieStore.get('refresh_token')?.value;

    if (!refreshCookie) {
        // No refresh token means no session, redirect to login
        redirect('/login');
    }

    try {
        // Use the BFF proxy route so cookies are forwarded correctly
        // In SSR, we must use absolute URL. Detect the current host from headers or fallback.
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : `http://localhost:${process.env.PORT || 3000}`;
        const response = await fetch(`${baseUrl}/api/proxy/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refresh_token=${refreshCookie}`,
            },
            body: JSON.stringify({ refresh_token: refreshCookie }),
            cache: 'no-store',
        });

        if (!response.ok) {
            // Only redirect if the error is 401 (Unauthorized) or 403 (Forbidden)
            if (response.status === 401 || response.status === 403) {
                redirect('/login?session_expired=true');
            }
            // For other errors (500, 502, etc.), throw to let the catch block handle it
            throw new Error(`Backend refresh failed with status: ${response.status}`);
        }

        const responseData = await response.json();
        
        // --- Token Rotation Sync ---
        // If the backend sent a new refresh_token in the set-cookie header, 
        // we should ideally update the browser's cookie.
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader) {
            const match = setCookieHeader.match(/refresh_token=([^;]+)/);
            if (match && match[1]) {
                const newToken = match[1];
                try {
                    // Try to set the rotated cookie back to the browser
                    // Note: This works in Next.js Server Components if called before streaming
                    cookieStore.set({
                        name: 'refresh_token',
                        value: newToken,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: 7 * 24 * 60 * 60 
                    });
                } catch {
                    console.warn("Could not sync rotated cookie in SSR Layout (expected in some Next.js versions). Rotation might rely on next client-side refresh.");
                }
            }
        }

        const rawUser = responseData.data?.user || responseData.data;
        const user = rawUser ? {
            id: rawUser.id,
            name: rawUser.full_name || rawUser.name || 'Elysian User',
            email: rawUser.email,
            role: rawUser.role || 'user',
            avatar: rawUser.avatar_url || rawUser.avatar || null
        } : { id: 'usr_fallback', name: 'Elysian User', email: 'user@elysian.com', role: 'user', avatar: null };
        const accessToken = responseData.data?.access_token || responseData.access_token;

        return (
            <div className="flex h-[100dvh] w-full overflow-hidden relative z-0 bg-slate-50/50 dark:bg-[#060D18]">
                {/* 
                    Synchronous Client Memory Hydration: 
                    Obliterates the client waterfall by passing the validated SSR user directly into Zustand.
                */}
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

    } catch (error) {
        // Absolute fallback route defense
        console.error("SSR Hydration Defense Triggered:", error);
        redirect('/login?session_expired=true');
    }
}
