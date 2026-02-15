'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

const instagramPhotos = [
    '/instagram-photos/1.jpeg',
    '/instagram-photos/2.jpeg',
    '/instagram-photos/3.jpeg',
    '/instagram-photos/4.jpeg',
    '/instagram-photos/5.jpeg',
];

export default function InstagramSection() {
    const [instagramUrl, setInstagramUrl] = useState('https://instagram.com');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    if (data.instagram_url) {
                        setInstagramUrl(data.instagram_url);
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <section className="py-16 bg-neutral-900">
            {/* Section Header */}
            <div className="text-center mb-10 px-4">
                <div className="inline-flex items-center gap-2 text-white mb-4">
                    <Instagram size={24} className="text-pink-500" />
                    <span className="text-sm font-medium uppercase tracking-wider">@silkthreadboutique</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Follow Us on Instagram!
                </h2>
            </div>

            {/* Instagram Photos Grid */}
            <div className="sizer">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                    {instagramPhotos.map((photo, idx) => (
                        <a
                            key={idx}
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-lg"
                        >
                            {/* Image */}
                            <Image
                                src={photo}
                                alt={`Instagram photo ${idx + 1}`}
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                            />

                            {/* Overlay with Instagram Icon */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                        <Instagram size={28} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10">
                <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg"
                >
                    <Instagram size={20} />
                    Follow @silkthreadboutique
                </a>
            </div>
        </section>
    );
}
