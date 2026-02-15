import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Get in Touch',
    description: 'Have questions about our silk thread jewelry? Need a custom order? Contact Silk Thread Boutique via phone, email, WhatsApp, or visit our store. We respond within 24 hours.',
    keywords: [
        'contact silk thread boutique',
        'silk thread jewelry contact',
        'custom jewelry order',
        'handmade jewelry inquiry',
        'jewelry store contact',
        'buy silk thread bangles',
    ],
    alternates: {
        canonical: '/contact-us',
    },
    openGraph: {
        title: 'Contact Us | Silk Thread Boutique',
        description: 'Get in touch with us for custom orders, queries, or feedback. We\'re here to help you find the perfect handcrafted jewelry.',
        type: 'website',
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
