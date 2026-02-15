import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

            <div className="sizer relative z-10">
                <div className="text-center max-w-2xl mx-auto px-4">
                    {/* 404 Number */}
                    <div className="mb-8">
                        <span className="text-[150px] md:text-[200px] font-display font-bold text-white/5 leading-none select-none">
                            404
                        </span>
                    </div>

                    {/* Content */}
                    <div className="-mt-24 md:-mt-32">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 text-secondary mb-6">
                            <Search size={32} />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                            Page Not Found
                        </h1>

                        <p className="text-lg text-white/60 mb-8 leading-relaxed">
                            Oops! The page you're looking for seems to have wandered off.
                            Let's get you back to our beautiful collection.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/25"
                            >
                                <Home size={18} />
                                Go Home
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                            >
                                <ArrowLeft size={18} />
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
