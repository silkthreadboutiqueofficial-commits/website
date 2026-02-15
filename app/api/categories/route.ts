import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        let query = supabase
            .from('categories')
            .select(`
                *,
                products (
                    images
                )
            `)
            .order('created_at', { ascending: false });

        // Filter by slug if provided
        if (slug) {
            query = query.eq('slug', slug);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        // Transform data to include images array from products
        const categoriesWithImages = data.map((category: any) => {
            const allImages: string[] = [];
            let productCount = 0;

            if (category.products && Array.isArray(category.products)) {
                productCount = category.products.length;
                category.products.forEach((p: any) => {
                    if (p.images && Array.isArray(p.images)) {
                        allImages.push(...p.images);
                    }
                });
            }

            // Remove legacy field and add new ones
            const { image_url, products, ...rest } = category;

            return {
                ...rest,
                images: allImages,
                products: [{ count: productCount }] // Maintain expected structure for count
            };
        });

        return NextResponse.json(categoriesWithImages, {
            headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
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
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([{
                name,
                slug,
                description
            }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ ...data, images: [] });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
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
        const { id, name, slug, description } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('categories')
            .update({
                name,
                slug,
                description
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({ ...data, images: [] }); // Images are dynamic, so return empty or fetch logic required if needed immediately
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const token = request.cookies.get('sb-access-token')?.value;
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
