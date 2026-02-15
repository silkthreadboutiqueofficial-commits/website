'use client';

import { ArrowRight, Layers, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Category } from '@/lib/data';
import ImageSlider from '@/components/ui/ImageSlider';

interface CategoryWithCount extends Category {
    productCount?: number;
}

export default function CategoriesSection() {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    // API already includes products count
                    setCategories(data.map((cat: any) => ({
                        ...cat,
                        productCount: cat.products?.[0]?.count || 0
                    })));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
                <div className="sizer max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-secondary" size={32} />
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
            <div className="sizer max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                        Browse Collections
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                        Explore our curated collections of traditional and contemporary fashion
                    </p>
                </div>

                {/* Category Grid - Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[200px] md:auto-rows-[220px]">
                    {categories.map((category, index) => {
                        // First item spans 2 rows, creating asymmetric layout
                        const isLarge = index === 0;
                        const isMedium = index === 1 || index === 2;

                        return (
                            <Link
                                key={category.id}
                                href={`/products?category=${encodeURIComponent(category.slug)}`}
                                className={`
                                    group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl 
                                    transition-all duration-500 transform hover:-translate-y-1
                                    ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                                    ${isMedium ? 'lg:col-span-1' : ''}
                                `}
                            >
                                {/* Image Container */}
                                <div className="absolute inset-0">
                                    {category.images && category.images.length > 0 ? (
                                        <ImageSlider
                                            images={category.images}
                                            alt={category.name}
                                            className="w-full h-full"
                                            pauseOnHover={true}
                                            showDots={false}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center">
                                            <Layers size={isLarge ? 64 : 40} className="text-secondary/40" />
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                                    <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-1">
                                        {/* Product Count Badge */}
                                        <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white/90 text-xs font-medium rounded-full mb-2">
                                            {category.productCount || 0} Products
                                        </span>

                                        <h3 className={`font-display font-semibold text-white mb-1 ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                                            {category.name}
                                        </h3>

                                        {(isLarge || isMedium) && (
                                            <p className="text-white/70 text-sm mb-3 line-clamp-2">
                                                {category.description || 'Explore our collection'}
                                            </p>
                                        )}

                                        <span className="flex items-center gap-1.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                                            Explore Collection
                                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                {categories.length > 4 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30"
                        >
                            View All Collections
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
