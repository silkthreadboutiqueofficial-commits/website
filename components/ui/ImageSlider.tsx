'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageSliderProps {
    images: string[];
    alt: string;
    className?: string;
    interval?: number;
    pauseOnHover?: boolean;
    showDots?: boolean;
}

export default function ImageSlider({
    images,
    alt,
    className,
    interval = 3000,
    pauseOnHover = true,
    showDots = true
}: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    // Filter out failed images for display
    const validImages = images?.filter((_, idx) => !failedImages.has(idx)) || [];
    const hasMultipleImages = validImages.length > 1;

    const handleImageError = (index: number) => {
        setFailedImages(prev => new Set([...prev, index]));
    };

    useEffect(() => {
        if (!hasMultipleImages) return;
        if (pauseOnHover && isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [hasMultipleImages, isHovered, interval, pauseOnHover, images.length]);

    const handleDotClick = (e: React.MouseEvent, index: number) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();
        setCurrentIndex(index);
    };

    if (!images || images.length === 0) {
        return (
            <div className={`w-full h-full bg-neutral-100 flex items-center justify-center ${className}`}>
                <span className="text-neutral-300">No Image</span>
            </div>
        );
    }

    return (
        <div
            className={`relative w-full h-full overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Images */}
            <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, idx) => (
                    <div key={idx} className="relative w-full h-full shrink-0">
                        <Image
                            src={src}
                            alt={`${alt} ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover select-none"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/ANVp+oWmo2kV1aTrNBKu5HQ5BB/a0qt/4jqOk2ulQ2lrfW8MEYwkccoVRnk4A9qpSmGwmS1xV2V+dPkIf//Z"
                        />
                    </div>
                ))}
            </div>

            {/* Dots */}
            {hasMultipleImages && showDots && (
                <>
                    {/* Gradient backing for dots visibility */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={(e) => handleDotClick(e, idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex
                                    ? 'bg-white w-4 shadow-sm'
                                    : 'bg-white/50 w-1.5 hover:bg-white/80'
                                    }`}
                                role="button"
                                aria-label={`Go to image ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
