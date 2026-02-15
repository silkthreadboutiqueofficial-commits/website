import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category_id');

        let query = supabase
            .from('product_types')
            .select(`
                *,
                category:categories(id, name, slug),
                products(count)
            `)
            .order('name', { ascending: true });

        // Filter by category if provided
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching product types:', error);
        return NextResponse.json({ error: 'Failed to fetch product types' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // Auth check
        const token = request.cookies.get('sb-access-token')?.value;
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, category_id } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check for duplicate slug globally
        const { data: existingBySlug } = await supabase
            .from('product_types')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();

        if (existingBySlug) {
            return NextResponse.json(
                { error: 'A product type with this name already exists' },
                { status: 409 }
            );
        }

        const { data, error } = await supabase
            .from('product_types')
            .insert([{
                name: name.trim(),
                slug,
                category_id: category_id || null
            }])
            .select(`
                *,
                category:categories(id, name, slug)
            `)
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json(
                    { error: 'A product type with this name already exists' },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error creating product type:', error);
        return NextResponse.json({ error: 'Failed to create product type' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // Auth check
        const token = request.cookies.get('sb-access-token')?.value;
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
        }

        // Check if any products are using these types
        const { data: productsUsingTypes } = await supabase
            .from('products')
            .select('id')
            .in('type_id', ids)
            .limit(1);

        if (productsUsingTypes && productsUsingTypes.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete product types that are being used by products' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('product_types')
            .delete()
            .in('id', ids);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Product types deleted successfully' });

    } catch (error) {
        console.error('Error deleting product types:', error);
        return NextResponse.json({ error: 'Failed to delete product types' }, { status: 500 });
    }
}
