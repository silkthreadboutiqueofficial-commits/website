import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage } from '@/utils/image-optimization';

export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(request.url);
        const categorySlug = searchParams.get('category');
        const typeId = searchParams.get('type_id');
        const status = searchParams.get('status');

        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name, slug),
                product_type:product_types(id, name, slug)
            `)
            .order('created_at', { ascending: false });

        // Filter by category if provided
        if (categorySlug) {
            const { data: categoryData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', categorySlug)
                .single();

            if (categoryData) {
                query = query.eq('category_id', categoryData.id);
            }
        }

        // Filter by type_id if provided
        if (typeId) {
            query = query.eq('type_id', typeId);
        }

        // Filter by status if provided
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        // Limit results if provided
        const limit = searchParams.get('limit');
        if (limit) {
            query = query.limit(parseInt(limit));
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
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
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
        const status = formData.get('status') as string || 'active';
        const optionsStr = formData.get('options') as string;
        const options = optionsStr ? JSON.parse(optionsStr) : [];
        const existingImagesStr = formData.get('images') as string;
        const existingImages = existingImagesStr ? JSON.parse(existingImagesStr) : [];

        // Check for duplicate product (same name + category + type + mrp price)
        let duplicateQuery = supabase
            .from('products')
            .select('id')
            .eq('name', name)
            .eq('mrp_price', mrp_price ? parseFloat(mrp_price) : 0);

        // Only add category/type filters if they are provided
        if (category_id) {
            duplicateQuery = duplicateQuery.eq('category_id', category_id);
        } else {
            duplicateQuery = duplicateQuery.is('category_id', null);
        }

        if (type_id) {
            duplicateQuery = duplicateQuery.eq('type_id', type_id);
        } else {
            duplicateQuery = duplicateQuery.is('type_id', null);
        }

        const { data: existingProduct } = await duplicateQuery.maybeSingle();

        if (existingProduct) {
            return NextResponse.json(
                { error: 'A product with this name, category, type, and MRP price already exists' },
                { status: 409 }
            );
        }

        // Handle Image Uploads
        const images: File[] = [];
        const imageEntries = formData.getAll('newImages');

        for (const entry of imageEntries) {
            if (entry instanceof File && entry.size > 0) {
                images.push(entry);
            }
        }

        const imageUrls: string[] = [...existingImages];

        for (const image of images) {
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
            }

            if (uploadData) {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('products')
                    .getPublicUrl(fileName);
                imageUrls.push(publicUrl);
            }
        }

        // Insert into products table
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name,
                subtitle,
                ribbon,
                description,
                mrp_price: mrp_price ? parseFloat(mrp_price) : 0,
                offer_price: offer_price ? parseFloat(offer_price) : null,
                category_id: category_id || null,
                type_id: type_id || null,
                product_title,
                status,
                options,
                images: imageUrls
            }])
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
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
        }

        // 1. Fetch products to get image URLs before deleting
        const { data: productsToDelete, error: fetchError } = await supabase
            .from('products')
            .select('images')
            .in('id', ids);

        if (fetchError) {
            console.error('Error fetching products for deletion:', fetchError);
        } else if (productsToDelete && productsToDelete.length > 0) {

            // 2. Collect files to delete
            const filesToDelete: string[] = [];

            productsToDelete.forEach(product => {
                if (product.images && Array.isArray(product.images)) {
                    product.images.forEach((url: string) => {
                        try {
                            // Extract path from URL
                            // format: .../storage/v1/object/public/products/filename.ext
                            const urlObj = new URL(url);
                            const pathParts = urlObj.pathname.split('/products/');
                            if (pathParts.length > 1) {
                                filesToDelete.push(pathParts[1]); // content after /products/
                            }
                        } catch (e) {
                            // If relative URL or invalid
                            console.warn('Invalid image URL:', url);
                        }
                    });
                }
            });

            // 3. Delete files from storage
            if (filesToDelete.length > 0) {
                const { error: storageError } = await supabase
                    .storage
                    .from('products')
                    .remove(filesToDelete);

                if (storageError) {
                    console.error('Error deleting product images:', storageError);
                }
            }
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .in('id', ids);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Products and associated images deleted successfully' });

    } catch (error) {
        console.error('Error deleting products:', error);
        return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { ids, status } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
        }

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('products')
            .update({ status })
            .in('id', ids);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Products updated successfully' });

    } catch (error) {
        console.error('Error updating products:', error);
        return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
    }
}
