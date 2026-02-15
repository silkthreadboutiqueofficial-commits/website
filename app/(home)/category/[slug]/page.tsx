'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Grid3X3, List, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import ImageSlider from '@/components/ui/ImageSlider';
import { Product, Category, ProductType } from '@/lib/data';

const PRODUCTS_PER_PAGE = 12;

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [productTypes, setProductTypes] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedType, setSelectedType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Get category by slug
                const catRes = await fetch(`/api/categories?slug=${slug}`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    if (catData && catData.length > 0) {
                        const cat = catData[0];
                        setCategory(cat);

                        // Get products for this category
                        const prodRes = await fetch(`/api/products?status=active`);
                        if (prodRes.ok) {
                            const prodData = await prodRes.json();
                            const categoryProducts = prodData.filter((p: Product) => p.category_id === cat.id);
                            setProducts(categoryProducts);
                        }

                        // Get types for this category
                        const typeRes = await fetch(`/api/product-types?category_id=${cat.id}`);
                        if (typeRes.ok) {
                            const typeData = await typeRes.json();
                            setProductTypes(typeData);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    // Type options for Select
    const typeOptions = useMemo(() => [
        { value: 'all', label: 'All Types' },
        ...productTypes.map(t => ({ value: t.id, label: t.name }))
    ], [productTypes]);

    // Filter by type and sort
    const filteredProducts = useMemo(() => {
        let prods = [...products];

        if (selectedType !== 'all') {
            prods = prods.filter(p => p.type_id === selectedType);
        }

        return prods.sort((a, b) => {
            const priceA = a.offer_price || a.mrp_price;
            const priceB = b.offer_price || b.mrp_price;
            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });
    }, [products, selectedType, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, sortBy]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white pt-32">
                <div className="sizer flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-secondary" size={32} />
                </div>
            </main>
        );
    }

    if (!category) {
        return (
            <main className="min-h-screen bg-white pt-32">
                <div className="sizer">
                    <div className="text-center py-20">
                        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-4">Category Not Found</h1>
                        <p className="text-neutral-600 mb-8">The category you're looking for doesn't exist.</p>
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Browse All Categories
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Product Card Component
    const ProductCard = ({ product }: { product: Product }) => {
        const offerPrice = product.offer_price || product.mrp_price;
        const mrpPrice = product.mrp_price;
        const discount = mrpPrice > offerPrice
            ? Math.round(((mrpPrice - offerPrice) / mrpPrice) * 100)
            : 0;

        if (viewMode === 'list') {
            return (
                <Link
                    href={`/product/${product.id}`}
                    className="group flex gap-6 bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-lg transition-shadow p-4"
                >
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative overflow-hidden bg-neutral-100 rounded-lg">
                        <ImageSlider
                            images={product.images && product.images.length > 0 ? product.images : ['https://placehold.co/400x400?text=No+Image']}
                            alt={product.name}
                            pauseOnHover={true}
                        />
                        {product.ribbon && (
                            <span className="absolute top-2 left-2 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
                                {product.ribbon}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-xs text-secondary font-medium mb-1">{product.product_type?.name || 'Product'}</p>
                        <h3 className="font-medium text-lg text-neutral-900 group-hover:text-secondary transition-colors mb-2">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-neutral-900">
                                ₹{offerPrice.toLocaleString('en-IN')}
                            </span>
                            {discount > 0 && (
                                <>
                                    <span className="text-sm text-neutral-400 line-through">
                                        ₹{mrpPrice.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs font-medium text-red-500">
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
            );
        }

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
                    {discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {discount}% OFF
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
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-24 md:py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="sizer relative z-10 pt-10">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft size={18} />
                        All Categories
                    </Link>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
                        {category.name}
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl">
                        {category.description || `Explore our beautiful collection of ${category.name.toLowerCase()}`}
                    </p>
                    <p className="text-white/50 mt-4">
                        {products.length} {products.length === 1 ? 'Product' : 'Products'}
                    </p>
                </div>

                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Products Section */}
            <section className="py-12">
                <div className="sizer">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <p className="text-neutral-600">
                            Showing <span className="font-medium text-neutral-900">{paginatedProducts.length}</span> of {filteredProducts.length} products
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Type Filter */}
                            {productTypes.length > 0 && (
                                <Select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    options={typeOptions}
                                />
                            )}

                            {/* Sort By */}
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                options={[
                                    { value: 'newest', label: 'Newest' },
                                    { value: 'price-low', label: 'Price: Low to High' },
                                    { value: 'price-high', label: 'Price: High to Low' },
                                    { value: 'name', label: 'Name' },
                                ]}
                            />

                            {/* View Mode */}
                            <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 bg-neutral-50 rounded-2xl">
                            <SlidersHorizontal className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-700 mb-2">No products found</h3>
                            <p className="text-neutral-500 mb-6">Try adjusting your filter.</p>
                            <button
                                onClick={() => setSelectedType('all')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors"
                            >
                                Clear Filter
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(p) => setCurrentPage(p)}
                        maxVisible={9}
                    />
                </div>
            </section>
        </main>
    );
}
