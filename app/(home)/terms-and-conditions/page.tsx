import { Metadata } from 'next';
import { FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Purchase Policies',
    description: 'Read our terms and conditions for purchasing handcrafted jewelry from Silk Thread Boutique. Understand our pricing, payment, and replacement policies before placing an order.',
    keywords: [
        'terms and conditions',
        'purchase policy',
        'silk thread boutique terms',
        'jewelry return policy',
        'order terms',
        'payment policy',
    ],
    alternates: {
        canonical: '/terms-and-conditions',
    },
    openGraph: {
        title: 'Terms & Conditions | Silk Thread Boutique',
        description: 'Our terms and conditions for purchasing handcrafted silk thread jewelry.',
        type: 'article',
    },
    robots: {
        index: true,
        follow: true,
    },
};

const terms = [
    {
        title: 'Fixed Pricing',
        description: 'All our jewellery is sold at a fixed price, so bargaining is not available.',
    },
    {
        title: 'Pricing for Pastel Designs',
        description: 'Prices may slightly change for pastel colour designs.',
    },
    {
        title: 'Size-Based Pricing',
        description: 'The final price depends on the size of the jewellery you choose.',
    },
    {
        title: 'Payment & Order Confirmation',
        description: 'Your order will be confirmed only after full payment is completed.',
    },
    {
        title: 'Damage & Replacement Policy',
        description: 'In case of any damage, replacement will be provided only if an unedited package opening video is shared. The video must clearly show the package being opened from start to end.',
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-24 md:py-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="sizer relative z-10 pt-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-full mb-6">
                            <FileText className="inline w-4 h-4 mr-2" />
                            Legal
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                            Terms & <span className="text-secondary">Conditions</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70">
                            Please read these terms carefully before placing an order with us.
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Terms Content */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                                Our Policies
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                                What You Should Know
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {terms.map((term, idx) => (
                                <div
                                    key={idx}
                                    className="bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-900 mb-2">{term.title}</h3>
                                            <p className="text-neutral-600 leading-relaxed">{term.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-secondary/5 rounded-2xl border border-secondary/10 text-center">
                            <p className="text-neutral-600 mb-4">
                                By placing an order, you agree to all of the above terms and conditions.
                            </p>
                            <p className="text-sm text-neutral-500">
                                Have questions? Feel free to{' '}
                                <Link href="/contact-us" className="text-secondary font-medium hover:underline">
                                    contact us
                                </Link>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-secondary/10 to-secondary/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="sizer relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                            Ready to Shop?
                        </h2>
                        <p className="text-neutral-600 mb-8">
                            Explore our beautiful collection of handcrafted silk thread jewelry.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
