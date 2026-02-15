import { Metadata } from 'next';
import { Shield, Lock, Eye, Database, Mail, UserCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | Your Data Security',
    description: 'Learn how Silk Thread Boutique collects, uses, and protects your personal information. Read our comprehensive privacy policy detailing data security, third-party sharing, and your rights.',
    keywords: [
        'privacy policy',
        'data protection',
        'silk thread boutique privacy',
        'customer data security',
        'personal information protection',
    ],
    alternates: {
        canonical: '/privacy-policy',
    },
    openGraph: {
        title: 'Privacy Policy | Silk Thread Boutique',
        description: 'Your privacy matters to us. Learn how we protect your personal information.',
        type: 'article',
    },
    robots: {
        index: true,
        follow: true,
    },
};

const policies = [
    {
        icon: Database,
        title: 'Information We Collect',
        description: 'We collect personal information such as your name, phone number, email address, and delivery address when you place an order. This information is essential for processing and delivering your orders.',
    },
    {
        icon: Eye,
        title: 'How We Use Your Information',
        description: 'Your information is used solely for order processing, delivery coordination, and customer support. We may also use it to send you updates about your order status.',
    },
    {
        icon: Lock,
        title: 'Data Security',
        description: 'We take appropriate measures to protect your personal information from unauthorized access, alteration, or disclosure. Your payment information is processed securely through trusted payment gateways.',
    },
    {
        icon: UserCheck,
        title: 'Third-Party Sharing',
        description: 'We do not sell, trade, or share your personal information with third parties for marketing purposes. Your data may only be shared with delivery partners to fulfill your orders.',
    },
    {
        icon: Mail,
        title: 'Communication',
        description: 'We may contact you via WhatsApp, phone, or email regarding your orders, delivery updates, or to address any queries. You can opt out of promotional messages at any time.',
    },
    {
        icon: Shield,
        title: 'Your Rights',
        description: 'You have the right to access, update, or request deletion of your personal information. Contact us if you wish to exercise these rights or have any privacy-related concerns.',
    },
];

export default function PrivacyPolicyPage() {
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
                            <Shield className="inline w-4 h-4 mr-2" />
                            Your Privacy Matters
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                            Privacy <span className="text-secondary">Policy</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70">
                            We are committed to protecting your personal information and your right to privacy.
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Policy Content */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                                Our Commitment
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                                How We Handle Your Data
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {policies.map((policy, idx) => (
                                <div
                                    key={idx}
                                    className="bg-neutral-50 rounded-2xl p-6 md:p-8 border border-neutral-100 hover:shadow-lg transition-shadow group"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                                        <policy.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{policy.title}</h3>
                                    <p className="text-neutral-600 text-sm leading-relaxed">{policy.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 bg-secondary/5 rounded-2xl border border-secondary/10">
                            <div className="text-center">
                                <p className="text-neutral-600 mb-4">
                                    This privacy policy was last updated on <strong>December 2024</strong>.
                                </p>
                                <p className="text-sm text-neutral-500">
                                    If you have any questions about our privacy practices, please{' '}
                                    <Link href="/contact-us" className="text-secondary font-medium hover:underline">
                                        contact us
                                    </Link>.
                                </p>
                            </div>
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
                            Shop with Confidence
                        </h2>
                        <p className="text-neutral-600 mb-8">
                            Your trust is important to us. Explore our collection knowing your data is safe.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25"
                            >
                                Shop Now
                            </Link>
                            <Link
                                href="/terms-and-conditions"
                                className="inline-flex items-center justify-center px-8 py-3 bg-white text-neutral-700 rounded-full font-medium hover:bg-neutral-100 transition-colors border border-neutral-200"
                            >
                                View Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
