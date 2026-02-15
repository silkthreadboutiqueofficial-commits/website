'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ImageSlider from '@/components/ui/ImageSlider';
import { Product } from '@/lib/data';
import { useInView } from '@/hooks/useInView';
import { FeaturedProductsSkeleton } from '@/components/ui/Skeleton';

// Featured Product Card Component
function FeaturedProductCard({ product }: { product: Product }) {
    const offerPrice = product.offer_price || product.mrp_price;
    const mrpPrice = product.mrp_price;

    return (
        <Link
            href={`/product/${product.id}`}
            className="group bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300"
        >
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <ImageSlider
                    images={product.images && product.images.length > 0 ? product.images : ['https://placehold.co/400x400?text=No+Image']}
                    alt={product.name}
                    pauseOnHover={true}
                />
                {product.ribbon && (
                    <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {product.ribbon}
                    </span>
                )}
                {offerPrice < mrpPrice && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(((mrpPrice - offerPrice) / mrpPrice) * 100)}% OFF
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="text-xs text-secondary font-medium mb-1">{product.product_type?.name || 'Product'}</p>
                <h3 className="font-medium text-neutral-900 group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-neutral-900">
                        ₹{offerPrice.toLocaleString('en-IN')}
                    </span>
                    {offerPrice < mrpPrice && (
                        <span className="text-sm text-neutral-400 line-through">
                            ₹{mrpPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [sectionRef, isInView] = useInView<HTMLElement>({ rootMargin: '200px' });

    useEffect(() => {
        if (isInView && !hasFetched) {
            setHasFetched(true);
            const fetchProducts = async () => {
                try {
                    const res = await fetch('/api/products?limit=12&status=active');
                    if (res.ok) {
                        const data = await res.json();
                        setProducts(data);
                    }
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isInView, hasFetched]);

    if (!hasFetched || isLoading) {
        return (
            <section ref={sectionRef}>
                <FeaturedProductsSkeleton />
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="sizer">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-secondary/10 to-amber-500/10 text-secondary text-sm font-medium rounded-full mb-4">
                            ✨ Just Arrived
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                            New Arrivals
                        </h2>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all group"
                    >
                        View All Products
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <FeaturedProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
