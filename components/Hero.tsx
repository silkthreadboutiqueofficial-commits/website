'use client';

import { useState, useEffect, useCallback } from 'react';
import Img from 'next/image';
import NavbarComponent from './Navbar';
import Button from './ui/Button';
import { ArrowRight } from 'lucide-react';

const heroImages = [
    '/hero/hero-1.png',
    '/hero/hero-2.png',
    '/hero/hero-3.png',
    '/hero/hero-4.png',
    '/hero/hero-5.png',
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const slideSeconds = 5000;

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        }, slideSeconds);

        return () => clearInterval(interval);
    }, []);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        heroImages.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === heroImages.length) {
                    setIsLoaded(true);
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === heroImages.length) {
                    setIsLoaded(true);
                }
            };
        });

        // Fallback to show after 2 seconds even if some images fail
        const timeout = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-neutral-950">
            <NavbarComponent />

            {/* Image Slideshow Background */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {heroImages.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Img
                            src={src}
                            alt={`Hero ${index + 1}`}
                            fill
                            sizes="100vw"
                            priority={index === 0}
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/ANVp+oWmo2kV1aTrNBKu5HQ5BB/a0qt/4jqOk2ulQ2lrfW8MEYwkccoVRnk4A9qpSmGwmS1xV2V+dPkIf//Z"
                        />
                    </div>
                ))}
            </div>

            {/* Full page loading while images load */}
            {!isLoaded && (
                <div className="fixed inset-0 z-100 bg-neutral-950 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                        <p className="text-white/60 text-sm font-medium animate-pulse">Loading...</p>
                    </div>
                </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />

            {/* Content */}
            <div className="sizer relative z-20 h-full flex flex-col justify-center text-white">
                <div className="max-w-4xl pt-24 md:pt-20 space-y-10">
                    <h1 className="text-4xl md:text-6xl font-semibold bg-linear-to-br from-white via-white to-black bg-clip-text text-transparent lg:text-7xl font-display mb-6 md:mb-8 leading-tight tracking-tight animate-fade-in-up">
                        Turning silk threads into treasures
                    </h1>
                    <p className="text-lg md:text-xl font-sans mb-10 md:mb-14 text-neutral-100 max-w-xl leading-relaxed animate-fade-in-up delay-200">
                        Discover handcrafted elegance with our premium collection of
                        silk threads and traditional embroidery supplies
                    </p>
                    <div className="animate-fade-in-up delay-300">
                        <Button
                            variant="white"
                            size="lg"
                            suffixIcon={<ArrowRight className="w-5 h-5" />}
                            href="/products"
                            className="transform hover:-translate-y-1"
                        >
                            Shop Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
