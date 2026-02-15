'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Layers, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/lib/data';
import ImageSlider from '@/components/ui/ImageSlider';

interface CategoryWithCount extends Category {
    productCount?: number;
}

const CATEGORIES_PER_PAGE = 8;

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
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

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (searchQuery.trim() === '') {
            return categories;
        }
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, categories]);

    // Pagination
    const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * CATEGORIES_PER_PAGE,
        currentPage * CATEGORIES_PER_PAGE
    );

    // Reset to page 1 when search changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    return (
        <main className="min-h-screen bg-neutral-50">
            {/* Hero Header */}
            <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-20 md:py-28 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="sizer pt-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center">
                            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
                                {categories.length} Collections Available
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                                All Categories
                            </h1>
                            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
                                Explore our complete collection of traditional and contemporary fashion categories
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-md mx-auto relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-neutral-50 to-transparent" />
            </section>

            <section className="py-16 md:py-20">
                <div className="sizer">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="animate-spin text-secondary" size={32} />
                            </div>
                        ) : (
                            <>
                                {/* Results count */}
                                <div className="flex items-center justify-between mb-8">
                                    <p className="text-neutral-600">
                                        Showing <span className="font-medium text-neutral-900">{paginatedCategories.length}</span> of {filteredCategories.length} categories
                                    </p>
                                </div>

                                {filteredCategories.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Layers className="mx-auto mb-4 text-neutral-300" size={48} />
                                        <h3 className="text-xl font-medium text-neutral-600 mb-2">No categories found</h3>
                                        <p className="text-neutral-500">
                                            {searchQuery ? 'Try a different search term' : 'Categories will appear here once added'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {paginatedCategories.map((category, index) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                                                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    {/* Image */}
                                                    <div className="aspect-[4/3] relative overflow-hidden">
                                                        {category.images && category.images.length > 0 ? (
                                                            <ImageSlider
                                                                images={category.images}
                                                                alt={category.name}
                                                                pauseOnHover={true}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
                                                                <Layers size={40} className="text-secondary/40" />
                                                            </div>
                                                        )}

                                                        {/* Product Count Badge */}
                                                        <div className="absolute top-3 right-3">
                                                            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                                {category.productCount || 0} items
                                                            </span>
                                                        </div>

                                                        {/* Hover Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                                            <span className="flex items-center gap-1.5 text-white text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                                View Collection
                                                                <ArrowRight size={16} />
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5">
                                                        <h3 className="text-lg font-display font-semibold text-neutral-900 mb-1 group-hover:text-secondary transition-colors">
                                                            {category.name}
                                                        </h3>
                                                        <p className="text-sm text-neutral-500 line-clamp-2">
                                                            {category.description || 'Explore our collection'}
                                                        </p>
                                                    </div>

                                                    {/* Bottom Border Accent */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-2 mt-12">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    {[...Array(totalPages)].map((_, i) => {
                                                        const page = i + 1;
                                                        if (
                                                            page === 1 ||
                                                            page === totalPages ||
                                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                                        ) {
                                                            return (
                                                                <button
                                                                    key={page}
                                                                    onClick={() => setCurrentPage(page)}
                                                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                                                        ? 'bg-secondary text-white'
                                                                        : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                                                                        }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            );
                                                        }
                                                        if (
                                                            (page === currentPage - 2 && currentPage > 3) ||
                                                            (page === currentPage + 2 && currentPage < totalPages - 2)
                                                        ) {
                                                            return (
                                                                <span key={page} className="px-2 text-neutral-400">
                                                                    ...
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>

                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="sizer">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">
                            Can't find what you're looking for?
                        </h2>
                        <p className="text-neutral-600 mb-8">
                            Browse all our products or contact us for custom orders
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25"
                            >
                                Browse All Products
                                <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-neutral-100 text-neutral-700 rounded-full font-medium hover:bg-neutral-200 transition-colors"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
