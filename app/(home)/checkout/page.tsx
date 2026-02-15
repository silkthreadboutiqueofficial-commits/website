'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import { ShoppingBag, MessageCircle, ArrowLeft, User, Phone, Mail, MapPin } from 'lucide-react';

interface Settings {
    whatsapp_number?: string;
    phone?: string;
    brand_name?: string;
}

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const [settings, setSettings] = useState<Settings>({});
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch settings for WhatsApp number
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    // Redirect to products if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/products');
        }
    }, [items, router]);

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!customerInfo.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!customerInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[+]?[\d\s-]{10,}$/.test(customerInfo.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (customerInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!customerInfo.address.trim()) {
            newErrors.address = 'Delivery address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Generate WhatsApp message with order details
    const generateWhatsAppMessage = () => {
        const lines: string[] = [];
        const brandName = settings.brand_name || 'Silk Thread Boutique';

        lines.push(`🛒 *New Order from ${brandName}*`);
        lines.push('');

        // Customer Information
        lines.push('👤 *Customer Details:*');
        lines.push('━━━━━━━━━━━━━━━━');
        lines.push(`Name: ${customerInfo.name}`);
        lines.push(`Phone: ${customerInfo.phone}`);
        if (customerInfo.email) {
            lines.push(`Email: ${customerInfo.email}`);
        }
        lines.push(`Address: ${customerInfo.address}`);
        lines.push('');

        // Order Details
        lines.push('📦 *Order Details:*');
        lines.push('━━━━━━━━━━━━━━━━');
        lines.push('');

        items.forEach((item, index) => {
            lines.push(`${index + 1}. *${item.title}*`);

            // Add selected options/variants
            if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
                Object.entries(item.selectedOptions).forEach(([key, value]) => {
                    lines.push(`   ${key}: ${value}`);
                });
            }

            lines.push(`   Qty: ${item.quantity}`);
            lines.push(`   Price: ${formatCurrency(item.price * item.quantity)}`);

            // Add product image URL
            if (item.image) {
                lines.push(`   📷 Image: ${item.image}`);
            }

            lines.push('');
        });

        lines.push('━━━━━━━━━━━━━━━━');
        lines.push(`*Total: ${formatCurrency(cartTotal)} + Shipping charges*`);
        lines.push('');
        lines.push('Please confirm availability and payment details. Thank you!');

        return encodeURIComponent(lines.join('\n'));
    };
    
    // Handle WhatsApp redirect
    const handleWhatsAppOrder = () => {
        if (!validateForm()) {
            return;
        }

        const whatsappNumber = settings.whatsapp_number || settings.phone || '';
        if (!whatsappNumber) {
            alert('Unable to process order. Please try again later.');
            return;
        }

        const cleanPhone = whatsappNumber.replace(/\D/g, '');
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        // Clear cart after redirect
        clearCart();
    };

    if (items.length === 0) {
        return null; // Redirecting
    }

    return (
        <main className="min-h-screen bg-neutral-50 pt-32 pb-20 relative">
            <div className="bg-black w-full absolute top-0 left-0 h-32"></div>
            <div className="sizer pt-10">
                {/* Back Link */}
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-neutral-600 hover:text-secondary transition-colors mb-8"
                >
                    <ArrowLeft size={18} />
                    Continue Shopping
                </Link>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Customer Information Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden h-fit">
                        <div className="bg-neutral-900 p-6 text-white">
                            <h2 className="text-xl font-display font-bold flex items-center gap-3">
                                <User size={24} />
                                Your Information
                            </h2>
                            <p className="text-white/70 mt-1 text-sm">Please provide your details for delivery</p>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={customerInfo.name}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-secondary focus:ring-secondary/20'} focus:ring-2 outline-none transition-all`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        value={customerInfo.phone}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-secondary focus:ring-secondary/20'} focus:ring-2 outline-none transition-all`}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                    Email Address <span className="text-neutral-400 text-xs">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-secondary focus:ring-secondary/20'} focus:ring-2 outline-none transition-all`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                                    Delivery Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-neutral-400 w-5 h-5" />
                                    <textarea
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                        rows={3}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border resize-none ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-secondary focus:ring-secondary/20'} focus:ring-2 outline-none transition-all`}
                                        placeholder="Enter your full delivery address including city and pincode"
                                    />
                                </div>
                                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden h-fit">
                        {/* Header */}
                        <div className="bg-linear-to-r from-secondary to-secondary/80 p-6 text-white">
                            <h1 className="text-xl font-display font-bold flex items-center gap-3">
                                <ShoppingBag size={24} />
                                Order Summary
                            </h1>
                            <p className="text-white/80 mt-1 text-sm">{items.length} item(s) in your cart</p>
                        </div>

                        {/* Items List */}
                        <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
                                    <div className="w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden shrink-0 relative">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                <ShoppingBag size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-neutral-900 text-sm truncate">{item.title}</h3>

                                        {/* Selected Options */}
                                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                    <span
                                                        key={key}
                                                        className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full"
                                                    >
                                                        {key}: {value}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-neutral-500">Qty: {item.quantity}</span>
                                            <span className="font-semibold text-neutral-900 text-sm">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total & Action */}
                        <div className="p-6 bg-neutral-50 border-t border-neutral-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-medium text-neutral-700">Total Amount</span>
                                <span className="text-2xl font-bold text-secondary">{formatCurrency(cartTotal)}</span>
                            </div>

                            <Button
                                onClick={handleWhatsAppOrder}
                                className="w-full h-14 text-lg gap-3 flex items-center"
                            >
                                <div className="flex items-center justify-center gap-4">
                                    <MessageCircle size={24} className='w-fit' />
                                    Order via WhatsApp
                                </div>
                            </Button>

                            <p className="text-center text-xs text-neutral-500 mt-4">
                                You'll be redirected to WhatsApp to complete your order
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
