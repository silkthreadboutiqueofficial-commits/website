'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
    options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
    const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<T | null>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsInView(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, isInView];
}
