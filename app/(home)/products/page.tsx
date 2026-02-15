'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Grid3X3, List, Search, X, SlidersHorizontal, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import ImageSlider from '@/components/ui/ImageSlider';
import { Product, Category, ProductType } from '@/lib/data';

const PRODUCTS_PER_PAGE = 12;

import { Suspense } from 'react';

// Wrap the main content in Suspense to handle useSearchParams
function ProductsContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [prodRes, catRes, typeRes] = await Promise.all([
                    fetch('/api/products?status=active'),
                    fetch('/api/categories'),
                    fetch('/api/product-types')
                ]);

                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    setProducts(prodData);
                }
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData);
                }
                if (typeRes.ok) {
                    const typeData = await typeRes.json();
                    setProductTypes(typeData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Category options for Select component
    const categoryOptions = useMemo(() => [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
    ], [categories]);

    // Handle URL Search Params
    const searchParams = useSearchParams();

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && categories.length > 0) {
            // Try to match by slug first, then name
            const category = categories.find(c =>
                c.slug === categoryParam ||
                c.name.toLowerCase() === categoryParam.toLowerCase()
            );
            if (category) {
                setSelectedCategory(category.id);
            }
        }
    }, [searchParams, categories]);

    const typeOptions = useMemo(() => [
        { value: 'all', label: 'All Types' },
        ...productTypes.map(t => ({ value: t.id, label: t.name }))
    ], [productTypes]);

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'name-asc', label: 'Name: A-Z' },
        { value: 'name-desc', label: 'Name: Z-A' },
    ];

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let prods = [...products];

        // Category filter
        if (selectedCategory !== 'all') {
            prods = prods.filter(p => p.category_id === selectedCategory);
        }

        // Type filter
        if (selectedType !== 'all') {
            prods = prods.filter(p => p.type_id === selectedType);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            prods = prods.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category?.name?.toLowerCase().includes(query) ||
                p.product_type?.name?.toLowerCase().includes(query)
            );
        }

        // Sort
        return prods.sort((a, b) => {
            const priceA = a.offer_price || a.mrp_price;
            const priceB = b.offer_price || b.mrp_price;
            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
    }, [products, selectedCategory, selectedType, searchQuery, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedType, searchQuery, sortBy]);

    const clearFilters = () => {
        setSelectedCategory('all');
        setSelectedType('all');
        setSearchQuery('');
        setSortBy('newest');
    };

    const hasActiveFilters = selectedCategory !== 'all' || selectedType !== 'all' || searchQuery;

    // Product Card Component
    const ProductCard = ({ product }: { product: Product }) => {
        const offerPrice = product.offer_price || product.mrp_price;
        const mrpPrice = product.mrp_price;
        const discount = mrpPrice > offerPrice
            ? Math.round(((mrpPrice - offerPrice) / mrpPrice) * 100)
            : 0;

        return (
            <Link
                href={`/product/${product.id}`}
                className={`group bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-lg transition-all duration-300 ${viewMode === 'list' ? 'flex gap-4 p-4' : ''}`}
            >
                <div className={`relative overflow-hidden bg-neutral-100 ${viewMode === 'list' ? 'w-32 h-32 rounded-lg shrink-0' : 'aspect-square'}`}>
                    <ImageSlider
                        images={product.images && product.images.length > 0 ? product.images : ['https://placehold.co/400x400?text=No+Image']}
                        alt={product.name}
                        pauseOnHover={true}
                    />
                    {product.ribbon && (
                        <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded pointer-events-none z-10">
                            {product.ribbon}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded pointer-events-none z-10">
                            {discount}% OFF
                        </span>
                    )}
                </div>
                <div className={viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : 'p-4'}>
                    <p className="text-xs text-secondary font-medium mb-1">{product.product_type?.name || 'Product'}</p>
                    <h3 className="font-medium text-neutral-900 group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-neutral-900">
                            ₹{offerPrice.toLocaleString('en-IN')}
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-neutral-400 line-through">
                                ₹{mrpPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <main className="min-h-screen bg-neutral-50 relative">
            <div className='absolute top-0 left-0 right-0 h-32 bg-black z-10'></div>

            <div className="sizer pt-42 pb-16 relative z-20">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                        All Products
                    </h1>
                    <p className="text-neutral-600">
                        {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
                    </p>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-neutral-100">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/10 outline-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filters Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm"
                        >
                            <Filter size={18} />
                            Filters
                            {hasActiveFilters && <span className="w-2 h-2 bg-secondary rounded-full" />}
                        </button>

                        {/* Desktop Filters */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                options={categoryOptions}
                            />
                            <Select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                options={typeOptions}
                            />
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                options={sortOptions}
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="hidden lg:flex items-center gap-1 border border-neutral-200 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-secondary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-secondary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filters Panel */}
                    {showFilters && (
                        <div className="lg:hidden mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3">
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                options={categoryOptions}
                            />
                            <Select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                options={typeOptions}
                            />
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                options={sortOptions}
                            />
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <div className="hidden lg:flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
                            <span className="text-sm text-neutral-500">Active Filters:</span>
                            {selectedCategory !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded">
                                    {categories.find(c => c.id === selectedCategory)?.name}
                                    <button onClick={() => setSelectedCategory('all')}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {selectedType !== 'all' && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded">
                                    {productTypes.find(t => t.id === selectedType)?.name}
                                    <button onClick={() => setSelectedType('all')}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded">
                                    "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-xs text-red-500 hover:underline ml-2"
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : paginatedProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-neutral-500 mb-4">No products found matching your criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="text-secondary hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
                            : 'flex flex-col gap-4'
                        }>
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(p) => setCurrentPage(p)}
                            maxVisible={3}
                        />
                    </>
                )}
            </div>
        </main>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-white pt-32">
                <div className="sizer flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-secondary" size={32} />
                </div>
            </main>
        }>
            <ProductsContent />
        </Suspense>
    );
}
