import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
        }

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

        // 1. Verify user using the access token
        const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

        if (userError || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Verify current password
        // We need a separate client instance for sign in to avoid mixing contexts, 
        // though strictly not necessary if we don't persist session.
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword
        });

        if (signInError) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        // 3. Update password using Admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
        );

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Password Update Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
