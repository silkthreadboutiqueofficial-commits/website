'use client';

import { Gem, Palette, Shield } from 'lucide-react';

const features = [
    {
        icon: Gem,
        title: 'Hand Crafted',
        description: 'While trends come and go, handmade bangles have a timeless appeal that transcends fashion fads.',
    },
    {
        icon: Palette,
        title: 'Unique Designs',
        description: 'We work closely with customers to create bespoke designs that reflect their personal style, preferences.',
    },
    {
        icon: Shield,
        title: 'High Quality',
        description: 'Used finest quality materials, ensuring that is not only beautiful but also durable and long-lasting.',
    },
];

export default function FeaturesSection() {
    return (
        <section className="py-20 bg-neutral-50">
            <div className="sizer max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-center group"
                        >
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-6 transition-all duration-300 group-hover:bg-secondary group-hover:text-white group-hover:scale-110">
                                <feature.icon size={28} strokeWidth={1.5} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl md:text-2xl font-display font-semibold text-neutral-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
