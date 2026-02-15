import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get('sb-access-token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            console.error('Settings API: Auth Error', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase.from("settings").select("*").single();

        if (error && error.code !== "PGRST116") {
            console.error('Settings API: DB Error', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || {});
    } catch (err: any) {
        console.error('Settings API: Fatal Error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const accessToken = request.cookies.get('sb-access-token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            console.error('Settings POST: Auth Error', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // Check if a settings row already exists
        const { data: existing } = await supabase.from("settings").select("id").single();

        let result;
        if (existing) {
            result = await supabase
                .from("settings")
                .update({
                    ...body,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id)
                .select()
                .single();
        } else {
            result = await supabase
                .from("settings")
                .insert({
                    ...body,
                })
                .select()
                .single();
        }

        if (result.error) {
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        return NextResponse.json(result.data);
    } catch (err: any) {
        console.error('Settings POST: Fatal Error', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
