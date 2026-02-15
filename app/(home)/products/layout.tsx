import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Products | Shop Silk Thread Jewelry & Accessories',
    description: 'Browse our complete collection of handcrafted silk thread jewelry. Shop bangles, earrings, jhumkas, hair accessories, and more. Filter by category, type, and price. Free shipping available.',
    keywords: [
        'shop silk thread jewelry',
        'buy handmade bangles online',
        'silk thread earrings shop',
        'Indian accessories online',
        'jhumkas for sale',
        'handcrafted jewelry India',
        'traditional jewelry shop',
    ],
    alternates: {
        canonical: '/products',
    },
    openGraph: {
        title: 'Shop All Products | Silk Thread Boutique',
        description: 'Explore our handcrafted collection of silk thread jewelry and accessories. Find the perfect piece for every occasion.',
        type: 'website',
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
