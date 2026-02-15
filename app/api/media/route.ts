import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { optimizeImage } from '@/utils/image-optimization';

// Image file extensions to filter
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];

function isImageFile(fileName: string): boolean {
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    return IMAGE_EXTENSIONS.includes(ext);
}

export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { searchParams } = new URL(request.url);
        const bucket = searchParams.get('bucket') || 'products';
        const folder = searchParams.get('folder') || '';

        // Get all files and folders from the bucket
        const allMedia: { name: string; url: string; created_at: string; folder: string; bucket: string }[] = [];

        // List items in the specified path
        const listFilesRecursively = async (currentPath: string) => {
            const { data, error } = await supabase
                .storage
                .from(bucket)
                .list(currentPath, {
                    limit: 500,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) {
                console.error(`Error listing ${currentPath}:`, error);
                return;
            }

            for (const item of data || []) {
                const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;

                // Check if it's a folder (no metadata means folder)
                if (!item.metadata) {
                    // It's a folder, recurse into it
                    await listFilesRecursively(fullPath);
                } else if (isImageFile(item.name)) {
                    // It's a file, check if it's an image
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from(bucket)
                        .getPublicUrl(fullPath);

                    allMedia.push({
                        name: fullPath,
                        url: publicUrl,
                        created_at: item.created_at || new Date().toISOString(),
                        folder: currentPath || 'root',
                        bucket
                    });
                }
            }
        };

        // Start from root or specified folder
        await listFilesRecursively(folder);

        // Sort by created_at desc
        allMedia.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return NextResponse.json(allMedia, {
            headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
            },
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || '';
        const bucket = formData.get('bucket') as string || 'products';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Optimize image: resize + convert to WebP
        const fileBuffer = await file.arrayBuffer();
        const { buffer: optimizedBuffer, contentType, ext } = await optimizeImage(fileBuffer);

        const baseName = file.name.replace(/\.[^.]+$/, '');
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${baseName}.${ext}`;
        const fullPath = folder ? `${folder}/${fileName}` : fileName;

        const { data, error } = await supabase
            .storage
            .from(bucket)
            .upload(fullPath, optimizedBuffer, {
                contentType,
                cacheControl: '31536000',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(fullPath);

        return NextResponse.json({
            name: fullPath,
            url: publicUrl,
            folder: folder || 'root',
            bucket
        });

    } catch (error) {
        console.error('Error uploading media:', error);
        return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const body = await request.json();
        const { name, bucket = 'products' } = body;

        if (!name) {
            return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
        }

        const { error } = await supabase
            .storage
            .from(bucket)
            .remove([name]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ message: 'Media deleted successfully' });

    } catch (error) {
        console.error('Error deleting media:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
