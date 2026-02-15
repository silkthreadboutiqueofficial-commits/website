/**
 * Client-side image compression utility.
 * Converts images to WebP and resizes them before upload to reduce bandwidth.
 */

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.82;
const MAX_FILE_SIZE_MB = 5;

export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Compress and convert an image file to WebP format client-side.
 * Returns a new File object with reduced size.
 */
export async function compressImage(file: File): Promise<File> {
    // Skip SVGs and GIFs (can't meaningfully compress with canvas)
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        return file;
    }

    // Skip already small files (< 50KB)
    if (file.size < 50 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            // Scale down if larger than max dimensions
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file); // Fallback to original
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // Only use compressed version if it's actually smaller
                    if (blob.size >= file.size) {
                        resolve(file);
                        return;
                    }

                    const compressedName = file.name.replace(/\.[^.]+$/, '.webp');
                    const compressedFile = new File([blob], compressedName, {
                        type: 'image/webp',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                },
                'image/webp',
                QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // Fallback to original on error
        };

        img.src = url;
    });
}

/**
 * Compress multiple files in parallel.
 */
export async function compressImages(files: File[]): Promise<File[]> {
    return Promise.all(files.map(compressImage));
}

/**
 * Validate file size before upload.
 */
export function validateFileSize(file: File): { valid: boolean; message?: string } {
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            message: `File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
        };
    }
    return { valid: true };
}
