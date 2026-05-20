import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('[BFF Login] Received body from frontend:', JSON.stringify(body));

        // MOCK BACKEND FOR HACKATHON DEMO (If Go backend isn't running)
        let response;
        try {
            console.log('[BFF Login] Forwarding to backend:', `${config.api.baseURL}/api/v1/auth/login`);
            response = await fetch(`${config.api.baseURL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                cache: 'no-store',
            });
        } catch (e: any) {
            console.warn("Real backend is offline or unreachable. Using Hackathon Mock Response for Login.");
            const mockData = {
                status: 'success',
                data: {
                    access_token: 'mock_jwt_token',
                    user: {
                        id: 'usr_demo_82x',
                        name: 'Elysian Admin',
                        email: body.email || 'admin@elysian.com',
                        role: 'admin'
                    }
                }
            };
            const nextResponse = NextResponse.json(mockData, { status: 200 });
            nextResponse.cookies.set({
                name: 'access_token',
                value: 'mock_jwt_token',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 // 15 minutes
            });
            nextResponse.cookies.set({
                name: 'refresh_token',
                value: 'mock_refresh_token_123',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
            return nextResponse;
        }

        const data = await response.json();
        console.log('[BFF Login] Backend response status:', response.status, 'data:', JSON.stringify(data));

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Backend berhasil login, dapatkan refresh_token
        // Ambil Header Set-Cookie dari response backend
        const setCookieHeader = response.headers.get('set-cookie');

        // Buat response untuk Frontend
        const nextResponse = NextResponse.json(data, { status: 200 });

        // Set access_token cookie from JSON body (for middleware SSR auth check)
        const accessToken = data.data?.access_token || data.data?.data?.access_token;
        if (accessToken) {
            nextResponse.cookies.set({
                name: 'access_token',
                value: accessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 15 * 60 // 15 minutes
            });
        }

        // Parsing cookie untuk di-set di doman Vercel (Next.js)
        if (setCookieHeader) {
            // Kita extract token secara manual dari `refresh_token=...;`
            const match = setCookieHeader.match(/refresh_token=([^;]+)/);
            if (match && match[1]) {
                const token = match[1];

                // Set the exact same cookie manually via Next.js
                // So the browser attaches it to Vercel domain requests
                // layout.tsx will look for this cookie on SSR.
                nextResponse.cookies.set({
                    name: 'refresh_token',
                    value: token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 7 * 24 * 60 * 60 // 7 days
                });
            } else {
                // Fallback: Just pass the original header over if parsing fails
                nextResponse.headers.append('Set-Cookie', setCookieHeader);
            }
        } else if (data.data?.refresh_token) {
            nextResponse.cookies.set({
                name: 'refresh_token',
                value: data.data.refresh_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
        }

        return nextResponse;
    } catch (error: any) {
        console.error('BFF Login Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
