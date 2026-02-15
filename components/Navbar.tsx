'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Category {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
}

const Navbar = () => {
    const { setIsCartOpen, cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
    const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
    const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsMobileShopOpen(false);
        setIsMobileCategoriesOpen(false);
    };

    const closeDropdown = () => {
        setIsShopDropdownOpen(false);
        setIsCategoriesHovered(false);
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 py-5 bg-transparent text-white">
            <div className="sizer flex items-center justify-between relative">
                {/* Logo */}
                <div className="shrink-0 relative z-50 w-fit">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="relative h-22 w-62">
                            <Image
                                src="/logo/black-hoz-removebg-preview.png"
                                alt="Silk Thread Boutique"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 gap-8 text-sm font-medium tracking-wide font-sans">
                    <Link
                        href="/"
                        className="relative group transition-colors hover:text-white/80"
                    >
                        Home
                        <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    {/* Shop Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsShopDropdownOpen(true)}
                        onMouseLeave={closeDropdown}
                    >
                        <button className="relative group transition-colors hover:text-white/80 flex items-center gap-1">
                            Shop
                            <ChevronDown size={14} className={`transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                            <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                        </button>

                        {/* First Level Dropdown */}
                        <div className={`absolute top-full left-0 pt-3 transition-all duration-200 ${isShopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                            <div className="bg-white rounded-xl shadow-xl border border-neutral-100 py-2 min-w-[180px] text-neutral-900">
                                {/* Products Link */}
                                <Link
                                    href="/products"
                                    onClick={closeDropdown}
                                    className="block px-4 py-2.5 hover:bg-secondary/10 transition-colors text-sm normal-case font-normal"
                                >
                                    Products
                                </Link>

                                {/* Categories with Sub-dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setIsCategoriesHovered(true)}
                                    onMouseLeave={() => setIsCategoriesHovered(false)}
                                >
                                    <div className="flex items-center justify-between px-4 py-2.5 hover:bg-secondary/10 transition-colors text-sm normal-case font-normal cursor-pointer">
                                        <span>Categories</span>
                                        <ChevronRight size={14} className="text-neutral-400" />
                                    </div>

                                    {/* Second Level Dropdown - Categories List */}
                                    <div className={`absolute left-full top-0 pl-2 transition-all duration-200 ${isCategoriesHovered ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible -translate-x-2'}`}>
                                        <div className="bg-white rounded-xl shadow-xl border border-neutral-100 py-2 min-w-[200px] max-h-[350px] overflow-y-auto">
                                            {categories.length > 0 ? (
                                                <>
                                                    {categories.map((category) => (
                                                        <Link
                                                            key={category.id}
                                                            href={`/category/${category.slug}`}
                                                            onClick={closeDropdown}
                                                            className="block px-4 py-2.5 hover:bg-secondary/10 transition-colors text-sm normal-case font-normal"
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    ))}
                                                    <div className="border-t border-neutral-100 mt-2 pt-2">
                                                        <Link
                                                            href="/categories"
                                                            onClick={closeDropdown}
                                                            className="block px-4 py-2.5 text-secondary hover:bg-secondary/10 transition-colors text-sm normal-case font-medium"
                                                        >
                                                            View All Categories
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : (
                                                <Link
                                                    href="/categories"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2.5 hover:bg-secondary/10 transition-colors text-sm normal-case font-normal"
                                                >
                                                    Browse Categories
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/about-us"
                        className="relative group transition-colors hover:text-white/80"
                    >
                        About Us
                        <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                        href="/size-guide"
                        className="relative group transition-colors hover:text-white/80"
                    >
                        Size Guide
                        <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                        href="/contact-us"
                        className="relative group transition-colors hover:text-white/80"
                    >
                        Contact Us
                        <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>


                {/* Actions */}
                <div className="flex items-center gap-6 relative z-50">
                    <button
                        className="hover:text-secondary transition-colors relative"
                        aria-label="Cart"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button
                        className="md:hidden hover:text-secondary transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-6 transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <nav className="flex flex-col items-center gap-6 text-xl font-display uppercase tracking-widest">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors">
                            Home
                        </Link>

                        {/* Mobile Shop Dropdown */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={() => setIsMobileShopOpen(!isMobileShopOpen)}
                                className="hover:text-secondary transition-colors flex items-center gap-2"
                            >
                                Shop
                                <ChevronDown size={18} className={`transition-transform ${isMobileShopOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isMobileShopOpen && (
                                <div className="mt-4 flex flex-col items-center gap-3 text-base normal-case tracking-normal">
                                    <Link
                                        href="/products"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        Products
                                    </Link>

                                    {/* Categories sub-menu */}
                                    <button
                                        onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                                        className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        Categories
                                        <ChevronDown size={14} className={`transition-transform ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isMobileCategoriesOpen && (
                                        <div className="flex flex-col items-center gap-2 pl-4 border-l border-white/20">
                                            {categories.slice(0, 6).map((category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/category/${category.slug}`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-white/50 hover:text-white transition-colors text-sm"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                            <Link
                                                href="/categories"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-secondary hover:text-secondary/80 transition-colors text-sm"
                                            >
                                                All Categories →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link href="/about-us" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors">
                            About Us
                        </Link>
                        <Link href="/size-guide" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors">
                            Size Guide
                        </Link>
                        <Link href="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-secondary transition-colors">
                            Contact Us
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
