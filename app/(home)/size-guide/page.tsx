import { Metadata } from 'next';
import { Ruler, Info, Baby, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { kidsSizeChart, adultSizeChart } from '@/lib/data';

export const metadata: Metadata = {
    title: 'Bangle Size Guide | Find Your Perfect Fit',
    description: 'Complete bangle size guide for kids and adults. Learn how to measure your bangle size accurately with our step-by-step guide and size charts. Find the perfect fit for silk thread bangles.',
    keywords: [
        'bangle size guide',
        'how to measure bangle size',
        'silk thread bangle size',
        'bangle measurement',
        'Indian bangle sizes',
        'kids bangle size chart',
        'adult bangle size chart',
    ],
    alternates: {
        canonical: '/size-guide',
    },
    openGraph: {
        title: 'Bangle Size Guide | Silk Thread Boutique',
        description: 'Find your perfect bangle size with our comprehensive measurement guide for kids and adults.',
        type: 'article',
    },
};

export default function SizeGuidePage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section - Matching About Us */}
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
                            Size Guide
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                            Find Your Perfect <br />
                            <span className="text-secondary">Bangle Size</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70">
                            Ensure a perfect fit for your handcrafted jewelry with our comprehensive measurement guide.
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* How to Measure Section - Full Width Image */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="relative mb-16">
                        <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl group border border-neutral-100">
                            <Image
                                src="/size-guide/how-to-measure-bangle.jpg"
                                alt="How to measure bangle size"
                                width={1000}
                                height={600}
                                className="w-full h-full object-contains transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative Element */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-2xl -z-10 hidden md:block" />
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full -z-10 hidden md:block" />
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                                Simple Steps
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                                How to Measure
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl">1</div>
                                <div>
                                    <h4 className="font-semibold text-neutral-900 mb-2">Select a Standard Bangle</h4>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Choose a bangle that fits you comfortably. It should slide over your hand with a little resistance.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl">2</div>
                                <div>
                                    <h4 className="font-semibold text-neutral-900 mb-2">Measure Inner Diameter</h4>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Place it on a flat surface and measure the inside diameter straight across the center using a ruler.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl">3</div>
                                <div>
                                    <h4 className="font-semibold text-neutral-900 mb-2">Match Your Size</h4>
                                    <p className="text-neutral-600 text-sm leading-relaxed">Compare your measurement in cm with our charts below. When in doubt, size up.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Size Charts Section - Matching Values Section */}
            <section className="py-20 bg-neutral-50">
                <div className="sizer">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                            Reference Charts
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                            Standard Measurements
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Kids Chart */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4 mb-6 border-b border-neutral-100 pb-4">
                                <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                                    <Baby size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold text-neutral-900">Kids Sizes</h3>
                                    <p className="text-neutral-500 text-sm">For the little ones</p>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm font-semibold text-neutral-900 border-b border-neutral-100">
                                        <th className="pb-3 pl-2">Size</th>
                                        <th className="pb-3 text-right pr-2">Inner Diameter</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {kidsSizeChart.map((row, i) => (
                                        <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-3 pl-2 font-medium text-neutral-900">{row.size}</td>
                                            <td className="py-3 pr-2 text-right text-neutral-600">{row.diameter}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Adult Chart */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-4 mb-6 border-b border-neutral-100 pb-4">
                                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold text-neutral-900">Adult Sizes</h3>
                                    <p className="text-neutral-500 text-sm">Standard collection sizes</p>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm font-semibold text-neutral-900 border-b border-neutral-100">
                                        <th className="pb-3 pl-2">Size</th>
                                        <th className="pb-3 text-right pr-2">Inner Diameter</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {adultSizeChart.map((row, i) => (
                                        <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                                            <td className="py-3 pl-2 font-medium text-neutral-900">{row.size}</td>
                                            <td className="py-3 pr-2 text-right text-neutral-600">{row.diameter}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Helpful Tips - Matching Features Grid */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-neutral-50 rounded-2xl p-8 text-center group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-100">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-lg font-display font-bold text-neutral-900 mb-2">Precision Matters</h3>
                            <p className="text-neutral-600 text-sm">Use a stiff ruler rather than a flexible tape for the most accurate diameter measurement.</p>
                        </div>
                        <div className="bg-neutral-50 rounded-2xl p-8 text-center group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-100">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:scale-110 transition-transform">
                                <Info size={24} />
                            </div>
                            <h3 className="text-lg font-display font-bold text-neutral-900 mb-2">When in Doubt</h3>
                            <p className="text-neutral-600 text-sm">If you find yourself between two sizes, always choose the larger size for comfort.</p>
                        </div>
                        <div className="bg-neutral-50 rounded-2xl p-8 text-center group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-neutral-100">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:scale-110 transition-transform">
                                <Baby size={24} />
                            </div>
                            <h3 className="text-lg font-display font-bold text-neutral-900 mb-2">Growing Kids</h3>
                            <p className="text-neutral-600 text-sm">For children, opting for a slightly larger size ensures they can wear their bangles longer.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Matching About Us Footer */}
            <section className="py-20 bg-gradient-to-br from-secondary/10 to-secondary/5 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3" />

                <div className="sizer relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary text-sm font-medium rounded-full mb-4">
                            Ready to Shop?
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                            Find Your Perfect Pair
                        </h2>
                        <p className="text-neutral-600 mb-8">
                            Now that you know your size, explore our stunning collection of handcrafted silk thread bangles.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25"
                            >
                                Shop Collection
                            </Link>
                            <Link
                                href="/contact-us"
                                className="inline-flex items-center justify-center px-8 py-3 bg-white text-neutral-700 rounded-full font-medium hover:bg-neutral-100 transition-colors border border-neutral-200"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
