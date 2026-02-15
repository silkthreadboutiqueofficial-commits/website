/**
 * Server-side image passthrough.
 * Client-side compression (via canvas WebP conversion) handles optimization
 * before upload, so the server just passes the buffer through with correct metadata.
 */

/**
 * Pass through an image buffer, detecting content type from the file signature.
 * Returns the buffer unchanged with appropriate content type.
 */
export async function optimizeImage(
    buffer: Buffer | ArrayBuffer,
    _options?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<{ buffer: Buffer; contentType: string; ext: string }> {
    const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;

    // Detect content type from magic bytes
    const { contentType, ext } = detectImageType(inputBuffer);

    return { buffer: inputBuffer, contentType, ext };
}

/** Detect image type from file signature (magic bytes). */
function detectImageType(buffer: Buffer): { contentType: string; ext: string } {
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return { contentType: 'image/png', ext: 'png' };
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) return { contentType: 'image/jpeg', ext: 'jpg' };
    if (buffer[0] === 0x47 && buffer[1] === 0x49) return { contentType: 'image/gif', ext: 'gif' };
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[8] === 0x57 && buffer[9] === 0x45) return { contentType: 'image/webp', ext: 'webp' };
    if (buffer[0] === 0x3C) return { contentType: 'image/svg+xml', ext: 'svg' };
    // Default to JPEG
    return { contentType: 'image/jpeg', ext: 'jpg' };
}
