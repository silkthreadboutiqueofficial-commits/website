'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Package, Tag, Users, LogOut, Settings, MessageSquareQuote, Layers } from 'lucide-react';

const navItems = [
    { name: 'Products', href: '/admin/dashboard/products', icon: Package },
    { name: 'Categories', href: '/admin/dashboard/categories', icon: Tag },
    { name: 'Product Types', href: '/admin/dashboard/product-types', icon: Layers },
    { name: 'Testimonials', href: '/admin/dashboard/testimonials', icon: MessageSquareQuote },
    // { name: 'Customers', href: '/admin/dashboard/customers', icon: Users },
    { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 fixed inset-y-0 left-0 z-10 flex flex-col">
            <div className="p-2 border-b border-neutral-100 flex justify-center">
                <div className="relative h-20 w-52">
                    <Image
                        src="/logo/white-hoz-removebg-preview.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                ? 'bg-secondary/10 text-secondary'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 w-full transition-colors cursor-pointer"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
