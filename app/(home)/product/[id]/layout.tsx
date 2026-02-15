import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: Promise<{ id: string }>
};

// Fetch product data for dynamic metadata
async function getProduct(id: string) {
    try {
        // Use absolute URL for server-side fetch
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.silkthreadboutique.in';
        const res = await fetch(`${baseUrl}/api/products/${id}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (res.ok) {
            return res.json();
        }
        return null;
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        };
    }

    const price = product.offer_price || product.mrp_price;
    const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
    const categoryName = product.category?.name || product.product_type?.name || 'Silk Thread Jewelry';
    const productImage = product.images?.[0] || '/logo/white-hoz.jpg';

    return {
        title: `${product.name} | ${categoryName}`,
        description: product.description || `Shop ${product.name} - handcrafted ${categoryName.toLowerCase()}. ${formattedPrice}. Premium silk thread jewelry made with love and tradition. Free shipping on select orders.`,
        keywords: [
            product.name.toLowerCase(),
            categoryName.toLowerCase(),
            'silk thread jewelry',
            'handmade jewelry',
            'Indian accessories',
            product.product_type?.name?.toLowerCase() || 'accessories',
        ].filter(Boolean),
        alternates: {
            canonical: `/product/${id}`,
        },
        openGraph: {
            title: `${product.name} | Silk Thread Boutique`,
            description: product.description || `Handcrafted ${categoryName.toLowerCase()} - ${formattedPrice}`,
            type: 'website',
            images: [
                {
                    url: productImage,
                    width: 600,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description || `Handcrafted ${categoryName.toLowerCase()} - ${formattedPrice}`,
            images: [productImage],
        },
    };
}

// JSON-LD structured data script component
function ProductJsonLd({ product }: { product: any }) {
    if (!product) return null;

    const price = product.offer_price || product.mrp_price;
    const productImage = product.images?.[0] || 'https://www.silkthreadboutique.in/logo/white-hoz.jpg';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || `Handcrafted ${product.category?.name || 'silk thread jewelry'}`,
        image: productImage,
        brand: {
            '@type': 'Brand',
            name: 'Silk Thread Boutique',
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: price,
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Silk Thread Boutique',
            },
        },
        category: product.category?.name || 'Jewelry',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function ProductLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProduct(id);

    return (
        <>
            <ProductJsonLd product={product} />
            {children}
        </>
    );
}
