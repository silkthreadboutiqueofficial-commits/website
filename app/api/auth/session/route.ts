import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get('sb-access-token')?.value;

    if (!accessToken) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser(accessToken);

        if (error || !user) {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }

        return NextResponse.json({ authenticated: true, user });
    } catch (err) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
}
