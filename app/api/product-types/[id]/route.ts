import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data, error } = await supabase
            .from('product_types')
            .select(`
                *,
                category:categories(id, name, slug)
            `)
            .eq('id', params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Product type not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching product type:', error);
        return NextResponse.json({ error: 'Failed to fetch product type' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { id } = params;

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

        // Check for duplicate (excluding current)
        const { data: existing } = await supabase
            .from('product_types')
            .select('id')
            .eq('slug', slug)
            .neq('id', id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'A product type with this name already exists' },
                { status: 409 }
            );
        }

        const { data, error } = await supabase
            .from('product_types')
            .update({
                name: name.trim(),
                slug,
                category_id: category_id || null
            })
            .eq('id', id)
            .select(`
                *,
                category:categories(id, name, slug)
            `)
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: 'A product type with this name already exists' },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error updating product type:', error);
        return NextResponse.json({ error: 'Failed to update product type' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { id } = params;

        // Auth check
        const token = request.cookies.get('sb-access-token')?.value;
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if any products are using this type
        const { data: productsUsingType } = await supabase
            .from('products')
            .select('id')
            .eq('type_id', id)
            .limit(1);

        if (productsUsingType && productsUsingType.length > 0) {
            return NextResponse.json(
                { error: 'Cannot delete product type that is being used by products' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('product_types')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting product type:', error);
        return NextResponse.json({ error: 'Failed to delete product type' }, { status: 500 });
    }
}
