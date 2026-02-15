'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import SizeGuide from '@/components/home/SizeGuide';
import { Product } from '@/lib/data';

export default function ProductPage() {
    const params = useParams();
    const productId = params.id as string;
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/products/${productId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);

                    // Fetch related products (same category)
                    if (data.category_id) {
                        const relRes = await fetch(`/api/products?status=active&limit=4`);
                        if (relRes.ok) {
                            const relData = await relRes.json();
                            // Filter to related products (same category or type, not current)
                            const related = relData.filter((p: Product) =>
                                p.id !== productId &&
                                (p.category_id === data.category_id || p.type_id === data.type_id)
                            ).slice(0, 4);
                            setRelatedProducts(related);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);



    if (isLoading) {
        return (
            <main className="min-h-screen bg-white pt-32">
                <div className="sizer flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-secondary" size={32} />
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-white pt-32">
                <div className="sizer text-center">
                    <h1 className="text-2xl font-display font-bold text-neutral-900 mb-4">
                        Product Not Found
                    </h1>
                    <p className="text-neutral-600 mb-8">
                        Sorry, the product you're looking for doesn't exist.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Products
                    </Link>
                </div>
            </main>
        );
    }

    // Use product images array directly
    const images = product?.images || ['https://placehold.co/400x400?text=No+Image'];

    // Calculate dynamic price based on selected options
    let computedMrp = product?.mrp_price || 0;
    let computedOffer = product?.offer_price || product?.mrp_price || 0;

    if (product?.options && Array.isArray(product.options)) {
        // Find the variant with the highest price among selected options to determine the display price
        // This handles cases where e.g. Size has different prices but Color doesn't
        let maxMrp = 0;
        let associatedOffer = 0;

        product.options.forEach((opt: any) => {
            const selectedVariantName = selectedOptions[opt.name];
            const variant = opt.variants?.find((v: any) => v.name === selectedVariantName);

            if (variant) {
                const varMrp = parseFloat(variant.price) || 0;
                const varOffer = parseFloat(variant.sale_price) || varMrp;

                if (varMrp > maxMrp) {
                    maxMrp = varMrp;
                    associatedOffer = varOffer;
                }
            }
        });

        // If we found a variant price (that should effectively override base price if it's "real")
        // In this simple logic, if we found variants, we use the max found price. 
        // If the max found price is 0 (unlikely if data is good), we keep base. 
        if (maxMrp > 0) {
            computedMrp = maxMrp;
            computedOffer = associatedOffer;
        }
    }

    const offerPrice = computedOffer;
    const mrpPrice = computedMrp;

    const discount = mrpPrice > offerPrice
        ? Math.round(((mrpPrice - offerPrice) / mrpPrice) * 100)
        : 0;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    // Check if all options are selected
    const areAllOptionsSelected = () => {
        if (!product?.options || !Array.isArray(product.options) || product.options.length === 0) return true;

        // Group options by their "base" name to handle mutually exclusive sets like Sizes
        // Logic: specific business rule for "Adult Size" and "Kids Size" - only one is required.
        const hasAdultSize = product.options.some((o: any) => o.name === 'Adult Size');
        const hasKidsSize = product.options.some((o: any) => o.name === 'Kids Size');

        // Standard check for all other options
        const standardOptionsValid = product.options
            .filter((o: any) => o.name !== 'Adult Size' && o.name !== 'Kids Size')
            .every((o: any) => selectedOptions[o.name]);

        // Size check
        let sizeValid = true;
        if (hasAdultSize && hasKidsSize) {
            // If both exist as options, only ONE is required
            sizeValid = !!selectedOptions['Adult Size'] || !!selectedOptions['Kids Size'];
        } else if (hasAdultSize) {
            sizeValid = !!selectedOptions['Adult Size'];
        } else if (hasKidsSize) {
            sizeValid = !!selectedOptions['Kids Size'];
        }

        return standardOptionsValid && sizeValid;
    };

    const handleOptionSelect = (optionName: string, variantName: string) => {
        // If selecting Adult Size, clear Kids Size and vice versa to enforce mutual exclusivity visually
        if (optionName === 'Adult Size') {
            setSelectedOptions(prev => {
                const newState: Record<string, string> = { ...prev, [optionName]: variantName };
                delete newState['Kids Size'];
                return newState;
            });
        } else if (optionName === 'Kids Size') {
            setSelectedOptions(prev => {
                const newState: Record<string, string> = { ...prev, [optionName]: variantName };
                delete newState['Adult Size'];
                return newState;
            });
        } else {
            setSelectedOptions(prev => ({ ...prev, [optionName]: variantName }));
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (!areAllOptionsSelected()) {
            alert('Please select all required options before adding to cart.');
            return;
        }

        const cartProduct = {
            id: product.id,
            title: product.name,
            price: mrpPrice,
            sale_price: offerPrice,
            images: images,
        };
        addToCart(cartProduct, quantity, selectedOptions, offerPrice);
        setQuantity(1);
    };

    const clearSelections = () => {
        setSelectedOptions({});
    };

    return (
        <main className="min-h-screen bg-white relative">
            <div className='absolute top-0 left-0 right-0 h-32 bg-black z-10'></div>

            {/* Breadcrumb */}
            <div className="sizer pt-42 relative z-20">
                <nav className="flex items-center gap-2 text-sm text-neutral-500">
                    <Link href="/" className="hover:text-secondary">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-secondary">Products</Link>
                    <span>/</span>
                    <Link href={`/products?category=${encodeURIComponent(product.category?.name || '')}`} className="hover:text-secondary">{product.category?.name}</Link>
                    <span>/</span>
                    <span className="text-neutral-900">{product.name}</span>
                </nav>
            </div>

            {/* Product Section */}
            <section className="pb-12 pt-6">
                <div className="sizer">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left: Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
                                <Image
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                    className="object-cover"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                />

                                {/* Ribbons */}
                                {product.ribbon && (
                                    <span className="absolute top-4 left-4 bg-secondary text-white text-sm font-bold px-3 py-1.5 rounded-full">
                                        {product.ribbon}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded">
                                        {discount}% OFF
                                    </span>
                                )}

                                {/* Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${currentImageIndex === index
                                            ? 'border-secondary ring-2 ring-secondary/20'
                                            : 'border-transparent hover:border-neutral-200'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt=""
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product Info */}
                        <div className="lg:pl-8">
                            {/* Category Badge */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
                                    {product.product_type?.name || 'Product'}
                                </span>
                                <span className="text-neutral-400 text-sm">{product.category?.name}</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
                                {product.name}
                            </h1>
                            <p className="text-neutral-500 mb-6">{product.product_title || 'Silk Thread'}</p>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-neutral-900">
                                    ₹{offerPrice.toLocaleString('en-IN')}
                                </span>
                                {discount > 0 && (
                                    <>
                                        <span className="text-xl text-neutral-400 line-through">
                                            ₹{mrpPrice.toLocaleString('en-IN')}
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                                            Save ₹{(mrpPrice - offerPrice).toLocaleString('en-IN')}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-neutral-600 leading-relaxed mb-8">
                                {product.description || `Beautiful handcrafted ${product.product_type?.name?.toLowerCase() || 'product'} made with premium silk thread. Perfect for traditional occasions and festivals. Each piece is carefully crafted by skilled artisans to ensure the highest quality.`}
                            </p>

                            {/* Dynamic Options */}
                            {product.options && Array.isArray(product.options) && product.options.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-neutral-900">Options</h3>
                                        {Object.keys(selectedOptions).length > 0 && (
                                            <button
                                                onClick={clearSelections}
                                                className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                                            >
                                                Clear Selection
                                            </button>
                                        )}
                                    </div>

                                    {product.options.map((option: any, index: number) => (
                                        <div key={index} className="mb-6 last:mb-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-neutral-900">
                                                    {option.name}: <span className="font-normal text-neutral-500">{selectedOptions[option.name] || 'Select an option'}</span>
                                                </span>
                                                {/* Show Size Chart only if option name contains 'Size' */}
                                                {option.name.toLowerCase().includes('size') && <SizeGuide />}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {option.variants.map((variant: any) => (
                                                    <button
                                                        key={variant.name}
                                                        onClick={() => handleOptionSelect(option.name, variant.name)}
                                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selectedOptions[option.name] === variant.name
                                                            ? 'bg-secondary text-white border-secondary'
                                                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-secondary'
                                                            }`}
                                                    >
                                                        {variant.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Quantity & Add to Cart */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 h-12 flex items-center justify-center font-medium text-neutral-900 border-x border-neutral-200">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-12"
                                    prefixIcon={<ShoppingBag size={20} />}
                                >
                                    Add to Cart - ₹{(offerPrice * quantity).toLocaleString('en-IN')}
                                </Button>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {
                relatedProducts.length > 0 && (
                    <section className="py-16 bg-neutral-50">
                        <div className="sizer">
                            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-8">
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map((relProduct) => {
                                    const relOfferPrice = relProduct.offer_price || relProduct.mrp_price;
                                    const relMrpPrice = relProduct.mrp_price;
                                    return (
                                        <Link
                                            key={relProduct.id}
                                            href={`/product/${relProduct.id}`}
                                            className="group bg-white rounded-xl overflow-hidden border border-neutral-100 hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="relative aspect-square overflow-hidden bg-neutral-100">
                                                <Image
                                                    src={relProduct.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                                                    alt={relProduct.name}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                                />
                                                {relProduct.ribbon && (
                                                    <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        {relProduct.ribbon}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs text-secondary font-medium mb-1">{relProduct.product_type?.name || 'Product'}</p>
                                                <h3 className="font-medium text-neutral-900 group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                                                    {relProduct.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-neutral-900">
                                                        ₹{relOfferPrice.toLocaleString('en-IN')}
                                                    </span>
                                                    {relOfferPrice < relMrpPrice && (
                                                        <span className="text-sm text-neutral-400 line-through">
                                                            ₹{relMrpPrice.toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )
            }
        </main >
    );
}
