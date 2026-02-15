/**
 * Server-side image optimization using Sharp.
 * Converts images to WebP and resizes for optimal storage/bandwidth.
 */
import sharp from 'sharp';

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const WEBP_QUALITY = 82;

/**
 * Optimize an image buffer: resize + convert to WebP.
 * Returns the optimized buffer and content type.
 */
export async function optimizeImage(
    buffer: Buffer | ArrayBuffer,
    options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
    const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
    const maxWidth = options?.maxWidth ?? MAX_WIDTH;
    const maxHeight = options?.maxHeight ?? MAX_HEIGHT;
    const quality = options?.quality ?? WEBP_QUALITY;

    try {
        const metadata = await sharp(inputBuffer).metadata();

        // Skip SVGs - can't process with sharp meaningfully
        if (metadata.format === 'svg') {
            return { buffer: inputBuffer, contentType: 'image/svg+xml', ext: 'svg' };
        }

        // Skip animated GIFs (preserve animation)
        if (metadata.format === 'gif' && (metadata.pages ?? 1) > 1) {
            return { buffer: inputBuffer, contentType: 'image/gif', ext: 'gif' };
        }

        const optimized = await sharp(inputBuffer)
            .resize(maxWidth, maxHeight, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality })
            .toBuffer();

        // Only use optimized if it's actually smaller
        if (optimized.length >= inputBuffer.length) {
            return {
                buffer: inputBuffer,
                contentType: `image/${metadata.format || 'jpeg'}`,
                ext: metadata.format || 'jpg',
            };
        }

        return { buffer: optimized, contentType: 'image/webp', ext: 'webp' };
    } catch {
        // If sharp fails, return original
        return { buffer: inputBuffer, contentType: 'image/jpeg', ext: 'jpg' };
    }
}
