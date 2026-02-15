'use client';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-neutral-200 ${className}`}
        />
    );
}

// Category Card Skeleton
export function CategoryCardSkeleton({ isLarge = false }: { isLarge?: boolean }) {
    return (
        <div className={`
            relative overflow-hidden rounded-2xl bg-neutral-100
            ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
        `}>
            <Skeleton className="absolute inset-0 rounded-2xl" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                <Skeleton className="h-5 w-20 rounded-full mb-2" />
                <Skeleton className={`${isLarge ? 'h-8 w-48' : 'h-6 w-32'} mb-2`} />
                {isLarge && <Skeleton className="h-4 w-64" />}
            </div>
        </div>
    );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-neutral-100">
            <Skeleton className="aspect-3/4 w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// Testimonial Card Skeleton
export function TestimonialCardSkeleton() {
    return (
        <div className="w-[350px] md:w-[400px] shrink-0 bg-neutral-100 rounded-2xl p-6">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                ))}
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
}

// Categories Section Skeleton
export function CategoriesSectionSkeleton() {
    return (
        <section className="py-20 bg-linear-to-b from-white to-neutral-50">
            <div className="sizer max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Skeleton className="h-8 w-40 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-10 w-72 mx-auto mb-4" />
                    <Skeleton className="h-5 w-96 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[200px] md:auto-rows-[220px]">
                    <CategoryCardSkeleton isLarge />
                    <CategoryCardSkeleton />
                    <CategoryCardSkeleton />
                    <CategoryCardSkeleton />
                </div>
            </div>
        </section>
    );
}

// Featured Products Section Skeleton
export function FeaturedProductsSkeleton() {
    return (
        <section className="py-20 bg-white">
            <div className="sizer">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <Skeleton className="h-8 w-32 rounded-full mb-4" />
                        <Skeleton className="h-10 w-56" />
                    </div>
                    <Skeleton className="h-6 w-40" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Testimonials Section Skeleton
export function TestimonialsSectionSkeleton() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="text-center mb-12 px-4">
                <Skeleton className="h-8 w-32 mx-auto rounded-full mb-4" />
                <Skeleton className="h-10 w-72 mx-auto" />
            </div>
            <div className="flex gap-6 px-8 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <TestimonialCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

// Category Page Card Skeleton (for /categories page)
export function CategoryPageCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="aspect-4/3 w-full" />
            <div className="p-5">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    );
}

