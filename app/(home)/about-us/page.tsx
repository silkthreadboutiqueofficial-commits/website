import { Metadata } from 'next';
import { Gem, Heart, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Us | Our Story & Craftsmanship',
    description: 'Discover the story behind Silk Thread Boutique. We create exquisite handcrafted silk thread jewelry and accessories, combining traditional artistry with modern designs. Learn about our commitment to quality craftsmanship.',
    keywords: [
        'about silk thread boutique',
        'handmade jewelry artisans',
        'silk thread craft',
        'Indian jewelry makers',
        'traditional craftsmanship',
        'handcrafted accessories story',
    ],
    alternates: {
        canonical: '/about-us',
    },
    openGraph: {
        title: 'About Silk Thread Boutique | Our Story',
        description: 'Learn about our passion for creating beautiful handcrafted silk thread jewelry and traditional accessories.',
        type: 'website',
    },
};

const values = [
    {
        icon: Gem,
        title: 'Quality Craftsmanship',
        description: 'Every piece is meticulously handcrafted using premium silk threads and materials.',
    },
    {
        icon: Heart,
        title: 'Made with Love',
        description: 'Our artisans pour their heart into every creation, ensuring each piece is unique.',
    },
    {
        icon: Sparkles,
        title: 'Unique Designs',
        description: 'We blend traditional techniques with contemporary styles for timeless elegance.',
    },
    {
        icon: Users,
        title: 'Customer First',
        description: 'Your satisfaction is our priority. We work closely to bring your vision to life.',
    },
];

export default function AboutPage() {
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
                            Our Story
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
                            Crafting Beauty, <br />
                            <span className="text-secondary">One Thread at a Time</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70">
                            Welcome to Silk Thread Boutique, where traditional artistry meets contemporary elegance
                        </p>
                    </div>
                </div>

                <div className="absolute -bottom-1 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
            </section>

            {/* Story Section */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl group relative">
                                <Image
                                    src="/instagram-photos/1.png"
                                    alt="Silk Thread Boutique craftsmanship"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAECAAMEESEy/9oADAMBEQCEPwD/2Q=="
                                />
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary/20 rounded-2xl -z-10" />
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full -z-10" />
                        </div>

                        <div>
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                                Who We Are
                            </span>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-6">
                                A Passion for Handcrafted Excellence
                            </h2>
                            <div className="space-y-4 text-neutral-600">
                                <p>
                                    Silk Thread Boutique was born from a deep love for traditional Indian craftsmanship.
                                    What started as a small passion project has grown into a beloved brand,
                                    serving thousands of customers who appreciate the beauty of handmade accessories.
                                </p>
                                <p>
                                    Our journey began with a simple idea: to create beautiful, high-quality silk thread
                                    jewelry that celebrates Indian heritage while embracing modern aesthetics.
                                    Each piece we create tells a story of dedication, skill, and artistic expression.
                                </p>
                                <p>
                                    We take pride in our commitment to quality, using only the finest materials
                                    and time-honored techniques passed down through generations of artisans.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-neutral-50">
                <div className="sizer">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                            Our Values
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">
                            What Sets Us Apart
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center group"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 text-secondary mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <value.icon size={28} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-neutral-600 text-sm">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Adding Happiness Section */}
            <section className="py-20 bg-white">
                <div className="sizer">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                            Our Mission
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                            Adding Happiness!
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                            "Our goal is to deliver the best shopping experience with our unique handcrafted designs,
                            vibrant colors, and an extensive variety of products that bring joy to every occasion."
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid sm:grid-cols-3 gap-8">
                        <div className="text-center p-8 bg-neutral-50 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-display font-bold text-secondary mb-2">
                                1,000+
                            </div>
                            <div className="text-lg font-semibold text-neutral-900 mb-2">Products for Sale</div>
                            <p className="text-neutral-600 text-sm">
                                We offer a diverse range of handcrafted pieces catering to every style and occasion.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-neutral-50 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-display font-bold text-secondary mb-2">
                                10,000+
                            </div>
                            <div className="text-lg font-semibold text-neutral-900 mb-2">Happy Customers</div>
                            <p className="text-neutral-600 text-sm">
                                We take pride in creating beautiful products and memorable experiences for our valued customers.
                            </p>
                        </div>

                        <div className="text-center p-8 bg-neutral-50 rounded-2xl">
                            <div className="text-5xl md:text-6xl font-display font-bold text-secondary mb-2">
                                1
                            </div>
                            <div className="text-lg font-semibold text-neutral-900 mb-2">Physical Outlet</div>
                            <p className="text-neutral-600 text-sm">
                                Visit our boutique where affordable elegance meets impeccable handcrafted artistry.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Unique Things Section */}
            <section className="py-20 bg-neutral-50">
                <div className="sizer">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Timeless Products */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                                Our Specialty
                            </span>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">
                                Timeless Creations
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                At Silk Thread Boutique, we don't just follow trends – we create pieces meant to be treasured
                                for years to come. Our handcrafted accessories are made with meticulous care and attention to detail,
                                ensuring each one is a true work of art. From intricate silk thread patterns to the use of premium
                                materials, our pieces are designed to stand the test of time.
                            </p>
                        </div>

                        {/* Affordable Handcrafted */}
                        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
                            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                                Our Promise
                            </span>
                            <h3 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-4">
                                Affordable Elegance
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Experience the allure of beautiful handcrafted jewelry without the extravagant price tag.
                                Our collection features diverse styles to suit every taste and occasion, allowing you to
                                effortlessly elevate your look without compromising on quality. Choose sustainable fashion
                                with our handmade pieces – exuding elegance while supporting traditional craftsmanship.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-secondary/10 to-secondary/5 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-secondary/5 rounded-full" />
                <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-secondary/10 rounded-full" />

                {/* Sparkle elements */}
                <div className="absolute top-10 right-20 text-secondary/30 text-4xl">✦</div>
                <div className="absolute bottom-20 left-16 text-secondary/20 text-2xl">✦</div>
                <div className="absolute top-1/2 right-10 text-secondary/20 text-3xl">✦</div>

                <div className="sizer relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="inline-block px-4 py-1.5 bg-secondary/20 text-secondary text-sm font-medium rounded-full mb-4">
                            Let's Connect
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
                            Ready to Experience Our Craft?
                        </h2>
                        <p className="text-neutral-600 mb-8">
                            Explore our collection of handcrafted jewelry and accessories,
                            or reach out to us for custom orders.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25"
                            >
                                Shop Now
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
