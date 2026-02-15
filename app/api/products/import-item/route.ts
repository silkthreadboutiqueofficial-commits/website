import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage } from '@/utils/image-optimization';

// Helper to download image from text URL and upload to Supabase
async function processImage(supabase: any, imageUrl: string) {
    try {
        const fetchRes = await fetch(imageUrl);
        if (!fetchRes.ok) return null;

        const blob = await fetchRes.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Optimize image: resize + convert to WebP
        const { buffer: optimizedBuffer, contentType: optimizedType, ext: optimizedExt } = await optimizeImage(buffer);
        const fileName = `import-${Date.now()}-${Math.random().toString(36).substring(7)}.${optimizedExt}`;

        const { data, error } = await supabase
            .storage
            .from('products')
            .upload(fileName, optimizedBuffer, {
                contentType: optimizedType,
                cacheControl: '31536000',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('products')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (e) {
        console.error('Image processing failed:', e);
        return null; // Return null on failure to keep going
    }
}

export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();

        // Expected format: { title, subtitle, category_name, ribbon, description, price, sale_price, image_urls: [] }
        const { title, subtitle, category_name, ribbon, description, price, sale_price, image_urls } = body;

        if (!title || !price || !category_name) {
            return NextResponse.json({ error: 'Missing required fields', status: 'error' }, { status: 400 });
        }

        // Normalize for comparison
        const titleLower = title.toLowerCase().trim();
        const categoryLower = category_name.toLowerCase().trim();

        // 1. Handle Category first (needed for duplicate check)
        let categoryId;
        const { data: allCategories } = await supabase
            .from('categories')
            .select('id, name');

        // Find category with case-insensitive match
        const existingCat = allCategories?.find(
            (c: any) => c.name.toLowerCase().trim() === categoryLower
        );

        if (existingCat) {
            categoryId = existingCat.id;
        } else {
            // Create Category
            let catImageUrl = null;
            if (image_urls && image_urls.length > 0) {
                catImageUrl = await processImage(supabase, image_urls[0]);
            }

            const { data: newCat, error: catError } = await supabase
                .from('categories')
                .insert([{
                    name: category_name,
                    slug: category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                    description: `Collection of ${category_name}`,
                    image_url: catImageUrl
                }])
                .select()
                .single();

            if (catError) throw catError;
            categoryId = newCat.id;
        }

        // 2. Check for duplicate by title + category (case-insensitive)
        const { data: allProducts } = await supabase
            .from('products')
            .select('id, title, category_id')
            .eq('category_id', categoryId);

        const existingProduct = allProducts?.find(
            (p: any) => p.title.toLowerCase().trim() === titleLower
        );

        if (existingProduct) {
            return NextResponse.json({
                error: 'Product with this title already exists in this category',
                status: 'duplicate',
                existingProduct
            }, { status: 409 });
        }

        // 2. Process Images for Product
        const finalImageUrls: string[] = [];
        if (image_urls && Array.isArray(image_urls)) {
            for (const url of image_urls) {
                // If we already processed the first one for category (and it was the exact same URL), we *could* reuse it.
                // But for simplicity of code structure right now, let's just re-process or separate concerns.
                // Optimization: Check if this URL matches the one we just uploaded for category? 
                // Creating a duplicate file is safer than complex checking logic for now.

                const uploadedUrl = await processImage(supabase, url);
                if (uploadedUrl) finalImageUrls.push(uploadedUrl);
            }
        }

        // 3. Create Product
        const { data: product, error: prodError } = await supabase
            .from('products')
            .insert([{
                title,
                subtitle,
                ribbon,
                description,
                price: parseFloat(price),
                sale_price: sale_price ? parseFloat(sale_price) : null,
                category_id: categoryId,
                status: 'active',
                images: finalImageUrls,
                options: [] // Default empty options
            }])
            .select()
            .single();

        if (prodError) throw prodError;

        return NextResponse.json(product);

    } catch (error) {
        console.error('Import Item Error:', error);
        return NextResponse.json({ error: 'Failed to import item' }, { status: 500 });
    }
}
