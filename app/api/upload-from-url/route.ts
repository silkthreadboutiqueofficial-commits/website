import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { optimizeImage } from '@/utils/image-optimization';

export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { urls, bucket = 'products' } = body;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: 'URLs array is required' }, { status: 400 });
        }

        const uploadedUrls: string[] = [];
        const errors: string[] = [];

        for (const url of urls) {
            try {
                if (!url || typeof url !== 'string' || !url.trim()) {
                    continue;
                }

                const trimmedUrl = url.trim();

                // Validate URL format
                try {
                    new URL(trimmedUrl);
                } catch {
                    errors.push(`Invalid URL: ${trimmedUrl}`);
                    continue;
                }

                // Fetch the image from the URL
                const response = await fetch(trimmedUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; ImageBot/1.0)',
                    },
                });

                if (!response.ok) {
                    errors.push(`Failed to fetch: ${trimmedUrl} (${response.status})`);
                    continue;
                }

                const contentType = response.headers.get('content-type') || 'image/jpeg';

                // Check if it's an image
                if (!contentType.startsWith('image/')) {
                    errors.push(`Not an image: ${trimmedUrl}`);
                    continue;
                }

                // Get the image as buffer and optimize
                const imageBuffer = await response.arrayBuffer();
                const { buffer: optimizedBuffer, contentType: optimizedType, ext } = await optimizeImage(imageBuffer);

                // Generate unique filename
                const fileName = `imported/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

                // Upload to Supabase storage
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from(bucket)
                    .upload(fileName, optimizedBuffer, {
                        contentType: optimizedType,
                        cacheControl: '31536000',
                        upsert: false
                    });

                if (uploadError) {
                    errors.push(`Upload failed for ${trimmedUrl}: ${uploadError.message}`);
                    continue;
                }

                // Get the public URL
                const { data: { publicUrl } } = supabase
                    .storage
                    .from(bucket)
                    .getPublicUrl(fileName);

                uploadedUrls.push(publicUrl);

            } catch (err: any) {
                errors.push(`Error processing ${url}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            uploadedUrls,
            errors: errors.length > 0 ? errors : undefined,
            totalRequested: urls.length,
            totalUploaded: uploadedUrls.length
        });

    } catch (error: any) {
        console.error('Error in upload-from-url:', error);
        return NextResponse.json({ error: 'Failed to process images', details: error.message }, { status: 500 });
    }
}
