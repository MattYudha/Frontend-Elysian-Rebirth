import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { message: 'Refresh token is required' },
                { status: 400 }
            );
        }

        console.log('[BFF Refresh] Forwarding to backend:', `${config.api.baseURL}/api/v1/auth/refresh`);
        const response = await fetch(`${config.api.baseURL}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `refresh_token=${refreshToken}`,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            cache: 'no-store',
        });

        const data = await response.json();
        console.log('[BFF Refresh] Backend response status:', response.status);

        if (!response.ok) {
            const errorResponse = NextResponse.json(data, { status: response.status });
            // If the refresh token is invalid or expired, clear cookies
            if (response.status === 401) {
                errorResponse.cookies.delete('access_token');
                errorResponse.cookies.delete('refresh_token');
                errorResponse.cookies.delete('tenant_id');
            }
            return errorResponse;
        }

        const nextResponse = NextResponse.json(data, { status: 200 });

        // Set access_token cookie from JSON body
        const accessToken = data.data?.access_token || data.data?.data?.access_token;
        if (accessToken) {
            nextResponse.cookies.set({
                name: 'access_token',
                value: accessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 24 * 60 * 60 // 24 hours
            });
        }

        // Set refresh_token cookie (usually same token, but update TTL)
        nextResponse.cookies.set({
            name: 'refresh_token',
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return nextResponse;
    } catch (error: any) {
        console.error('BFF Refresh Token Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
