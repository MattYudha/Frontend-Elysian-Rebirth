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
            const backendUrl = process.env.ELYSIAN_API_URL || config.api.baseURL;
            console.log('[BFF Login] Forwarding to backend:', `${backendUrl}/api/v1/auth/login`);
            response = await fetch(`${backendUrl}/api/v1/auth/login`, {
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
                sameSite: 'strict',
                path: '/',
                maxAge: 24 * 60 * 60 // 24 hours
            });
            nextResponse.cookies.set({
                name: 'refresh_token',
                value: 'mock_refresh_token_123',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 // 7 days
            });
            return nextResponse;
        }

        const data = await response.json();
        console.log('[BFF Login] Backend response status:', response.status);

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Extract tokens from data
        const accessToken = data.data?.access_token || data.data?.data?.access_token;
        const refreshTokenFromData = data.data?.refresh_token || data.data?.data?.refresh_token;

        // Clean up response data to prevent tokens being exposed to client side js (XSS defense)
        if (data.data) {
            delete data.data.access_token;
            delete data.data.refresh_token;
            if (data.data.data) {
                delete data.data.data.access_token;
                delete data.data.data.refresh_token;
            }
        }

        // Buat response untuk Frontend (tanpa token di body JSON)
        const nextResponse = NextResponse.json(data, { status: 200 });

        // Set access_token cookie
        if (accessToken) {
            nextResponse.cookies.set({
                name: 'access_token',
                value: accessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 24 * 60 * 60 // 24 hours
            });
        }

        // Set refresh_token cookie (dari Set-Cookie header atau JSON fallback)
        const setCookieHeader = response.headers.get('set-cookie');
        let token = refreshTokenFromData;
        if (setCookieHeader) {
            const match = setCookieHeader.match(/refresh_token=([^;]+)/);
            if (match && match[1]) {
                token = match[1];
            }
        }

        if (token) {
            nextResponse.cookies.set({
                name: 'refresh_token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
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
