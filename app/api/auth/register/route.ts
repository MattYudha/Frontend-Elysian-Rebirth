import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // MOCK BACKEND FOR HACKATHON DEMO
        let response;
        try {
            response = await fetch(`${config.api.baseURL}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                cache: 'no-store',
            });
        } catch (e: any) {
            console.warn("Real backend offline. Mocking Register response.");
            return NextResponse.json({
                status: 'success',
                data: { message: "Mock registration successful." }
            }, { status: 201 });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Backend berhasil daftar
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('BFF Register Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
