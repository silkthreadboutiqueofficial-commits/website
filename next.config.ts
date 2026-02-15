import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://localhost:3000", "https://silk-thread-boutique.vercel.app", "https://www.silkthreadboutique.in"],
  images: {
    unoptimized: true, // Disable optimization to avoid Vercel free tier quota limits
    // Images are compressed to WebP at upload time via sharp instead
    minimumCacheTTL: 31536000, // 1 year — browser/CDN cache for optimized images
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rjlzeqkphicmxxsivqen.supabase.co",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      }
    ],
  },
  headers: async () => [
    {
      // Cache Supabase storage images aggressively
      source: '/_next/image',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

export default nextConfig;
