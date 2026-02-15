'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import { RibbonBadge, DiscountBadge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import ImageSlider from './ImageSlider';

export interface ProductCardProps {
    id: string;
    title: string;
    subtitle?: string;
    price: number;
    sale_price?: number;
    discount_percent?: number;
    images: string[];
    ribbon?: string;
    category_id?: string;
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
    const { addToCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const images = product.images || [];

    const goToImage = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // setCurrentImageIndex(index); // Removed
    };

    // Calculate discount from sale_price or use discount_percent
    const discount = product.discount_percent || (
        product.sale_price && product.price
            ? Math.round(((product.price - product.sale_price) / product.price) * 100)
            : 0
    );

    // Calculate final price
    const finalPrice = product.sale_price || (
        product.discount_percent
            ? product.price - (product.price * product.discount_percent / 100)
            : product.price
    );

    const hasDiscount = discount > 0;

    return (
        <Link
            href={`/product/${product.id}`}
            className="group block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative bg-neutral-50 rounded-2xl overflow-hidden mb-4">
                {/* Image Slider */}
                <div className="aspect-[3/4] relative overflow-hidden group/slider">
                    <ImageSlider
                        images={images}
                        alt={product.title}
                        pauseOnHover={true}
                    />

                    {/* Ribbon Badge */}
                    {product.ribbon && (
                        <div className="absolute top-3 left-3 z-10 pointer-events-none">
                            <RibbonBadge>{product.ribbon}</RibbonBadge>
                        </div>
                    )}

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-3 right-3 z-10 pointer-events-none">
                            <DiscountBadge percent={discount} />
                        </div>
                    )}

                    {/* Quick Actions (shown on hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 pb-8 flex justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.location.href = `/product/${product.id}`;
                            }}
                            className="px-4 py-2.5 bg-white rounded-full shadow-lg hover:bg-neutral-800 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <Eye size={16} />
                            Quick View
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product, 1);
                            }}
                            className="px-4 py-2.5 bg-secondary text-white rounded-full shadow-lg hover:bg-secondary/90 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <ShoppingBag size={16} />
                            Add
                        </button>
                    </div>

                    {/* Gradient overlay for dots visibility */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Product Info */}
            <div className="px-1">
                <h3 className="text-sm md:text-base font-medium text-neutral-900 mb-1 line-clamp-1 group-hover:text-secondary transition-colors">
                    {product.title}
                </h3>
                {product.subtitle && (
                    <p className="text-xs text-neutral-500 mb-2 line-clamp-1">
                        {product.subtitle}
                    </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                    {hasDiscount ? (
                        <>
                            <span className="text-sm text-neutral-400 line-through italic pt-1">
                                {formatCurrency(product.price)}
                            </span>
                            <span className="text-base md:text-lg font-semibold text-red-500">
                                {formatCurrency(finalPrice)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                                Save {formatCurrency(product.price - finalPrice)}
                            </span>
                        </>
                    ) : (
                        <span className="text-base md:text-lg font-semibold text-neutral-900">
                            {formatCurrency(product.price)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
