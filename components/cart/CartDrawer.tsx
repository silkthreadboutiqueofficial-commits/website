'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';

export default function CartDrawer() {
    const {
        isCartOpen,
        setIsCartOpen,
        items,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-100">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
                {/* Header */}
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                    <h2 className="text-xl font-display font-medium text-neutral-900 flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Shopping Cart
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-2">
                                <ShoppingBag size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900">Your cart is empty</h3>
                            <p className="text-neutral-500 max-w-[200px]">Looks like you haven't added anything to your cart yet.</p>
                            <Button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4"
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    {/* Image */}
                                    <Link
                                        href={`/product/${item.productId}`}
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 relative block"
                                    >
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
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <Link
                                                    href={`/product/${item.productId}`}
                                                    onClick={() => setIsCartOpen(false)}
                                                    className="font-medium text-neutral-900 line-clamp-2 leading-tight hover:text-secondary transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-neutral-400 hover:text-red-500 transition-colors p-1 -mr-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Category & Type */}
                                            {(item.category || item.productType) && (
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {[item.category, item.productType].filter(Boolean).join(' • ')}
                                                </p>
                                            )}

                                            {/* Options */}
                                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                <div className="text-xs text-neutral-500 mt-1 space-y-0.5">
                                                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                        <p key={key}><span className="font-medium">{key}:</span> {value}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-neutral-200 rounded-lg h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className="font-semibold text-neutral-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-neutral-100 bg-neutral-50/50">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-neutral-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-neutral-900">
                                <span>Total</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>

                        </div>
                        <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="block">
                            <Button className="w-full h-12 text-base">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
