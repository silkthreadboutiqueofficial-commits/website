'use client';

import { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { TestimonialsSectionSkeleton } from '@/components/ui/Skeleton';

interface Testimonial {
    id: string;
    name: string;
    location?: string;
    rating: number;
    text: string;
    image_url?: string;
}

// Fallback testimonials if none in database
const fallbackTestimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        location: 'Mumbai',
        rating: 5,
        text: 'The bangles I ordered are absolutely stunning! The craftsmanship is impeccable and they look even better in person.',
    },
    {
        id: '2',
        name: 'Anjali Patel',
        location: 'Delhi',
        rating: 5,
        text: 'I got a custom set made for my wedding and it was perfect. The team was so helpful in understanding my vision.',
    },
    {
        id: '3',
        name: 'Meera Krishnan',
        location: 'Chennai',
        rating: 5,
        text: 'Beautiful handcrafted pieces with amazing attention to detail. The quality is outstanding. Highly recommend!',
    },
];

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const [sectionRef, isInView] = useInView<HTMLElement>({ rootMargin: '200px' });

    useEffect(() => {
        if (isInView && !hasFetched) {
            setHasFetched(true);
            const fetchTestimonials = async () => {
                try {
                    const res = await fetch('/api/testimonials');
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.length > 0) {
                            setTestimonials(data);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching testimonials:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchTestimonials();
        }
    }, [isInView, hasFetched]);

    // Show skeleton when not yet fetched or loading
    if (!hasFetched || isLoading) {
        return (
            <section ref={sectionRef}>
                <TestimonialsSectionSkeleton />
            </section>
        );
    }

    // Double for seamless loop
    const doubledTestimonials = [...testimonials, ...testimonials];

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section ref={sectionRef} className="py-20 bg-white overflow-hidden">
            {/* Section Header */}
            <div className="text-center mb-12 px-4">
                <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                    Customer Love
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                    What Our Customers Say
                </h2>
            </div>

            {/* Infinite Scrolling Testimonials */}
            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Scrolling Container */}
                <div
                    className="flex gap-6 animate-marquee"
                    style={{
                        width: 'max-content',
                        animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                >
                    {doubledTestimonials.map((testimonial, idx) => (
                        <div
                            key={`${testimonial.id}-${idx}`}
                            className="w-[350px] md:w-[400px] shrink-0 bg-neutral-50 rounded-2xl p-6 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-3 left-6">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shadow-md">
                                    <Quote size={14} className="text-white" fill="white" />
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-0.5 mb-4 mt-2">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="text-amber-400" fill="#fbbf24" />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-neutral-600 leading-relaxed mb-6 line-clamp-4">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-neutral-900 text-sm">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-xs text-neutral-500">
                                        {testimonial.location || ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </section>
    );
}
