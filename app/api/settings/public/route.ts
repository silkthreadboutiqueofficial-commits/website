import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Public endpoint to get settings for footer (no auth required)
export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
            .from('settings')
            .select('instagram_url, youtube_url, email, phone, whatsapp_number, address, city, state, brand_name, description')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Public Settings API Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data || {}, {
            headers: {
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
            },
        });
    } catch (err) {
        console.error('Public Settings API Fatal Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
