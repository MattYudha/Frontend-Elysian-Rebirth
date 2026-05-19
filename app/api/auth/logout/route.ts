import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });
        
        // Clear the authentication cookies to effectively log the user out
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        
        return response;
    } catch (error) {
        console.error('BFF Logout Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
