import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage } from '@/utils/image-optimization';

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
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                product_type:product_types(id, name, slug)
            `)
            .eq('id', params.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
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

        const formData = await request.formData();

        // Extract fields with new schema
        const name = formData.get('name') as string;
        const subtitle = formData.get('subtitle') as string;
        const ribbon = formData.get('ribbon') as string;
        const description = formData.get('description') as string;
        const mrp_price = formData.get('mrpPrice') as string;
        const offer_price = formData.get('offerPrice') as string;
        const category_id = formData.get('category_id') as string;
        const type_id = formData.get('type_id') as string;
        const product_title = formData.get('product_title') as string || 'Silk Thread';
        const status = formData.get('status') as string;
        const optionsStr = formData.get('options') as string;
        const options = optionsStr ? JSON.parse(optionsStr) : [];
        const existingImagesStr = formData.get('existingImages') as string;
        const existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : [];

        // Check for duplicate product name in same category and type (excluding current product)
        const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('name', name)
            .eq('category_id', category_id)
            .eq('type_id', type_id)
            .eq('mrp_price', mrp_price ? parseFloat(mrp_price) : 0)
            .neq('id', id)
            .maybeSingle();

        if (existingProduct) {
            return NextResponse.json(
                { error: 'A product with this name, category, type, and MRP price already exists' },
                { status: 409 }
            );
        }

        // Handle New Image Uploads
        const newImages: File[] = [];
        const imageEntries = formData.getAll('newImages');

        for (const entry of imageEntries) {
            if (entry instanceof File && entry.size > 0) {
                newImages.push(entry);
            }
        }

        const newImageUrls: string[] = [];

        for (const image of newImages) {
            // Optimize image: resize + convert to WebP
            const imgBuffer = await image.arrayBuffer();
            const { buffer: optimizedBuffer, contentType, ext } = await optimizeImage(imgBuffer);
            const baseName = image.name.replace(/\.[^.]+$/, '');
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${baseName}.${ext}`;
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('products')
                .upload(fileName, optimizedBuffer, {
                    contentType,
                    cacheControl: '31536000',
                    upsert: false
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
            } else if (uploadData) {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('products')
                    .getPublicUrl(fileName);
                newImageUrls.push(publicUrl);
            }
        }

        // Combine existing (kept) images with new ones
        const allImages = [...existingImages, ...newImageUrls];

        // Update product in table
        const { data, error } = await supabase
            .from('products')
            .update({
                name,
                subtitle,
                ribbon,
                description,
                mrp_price: mrp_price ? parseFloat(mrp_price) : 0,
                offer_price: offer_price ? parseFloat(offer_price) : null,
                category_id,
                type_id: type_id || null,
                product_title,
                status,
                options,
                images: allImages
            })
            .eq('id', id)
            .select(`
                *,
                category:categories(id, name, slug),
                product_type:product_types(id, name, slug)
            `)
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
