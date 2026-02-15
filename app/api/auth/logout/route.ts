import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ success: true });

    // Clear authentication cookies
    response.cookies.set('sb-access-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    response.cookies.set('sb-refresh-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });

    return response;
}
