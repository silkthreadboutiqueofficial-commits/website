'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string; // This can be a composite ID (productId + options) to distinguish variants
    productId: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    category?: string;
    productType?: string;
    selectedOptions?: Record<string, string>;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any, quantity: number, options?: Record<string, string>, price?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from local storage');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addToCart = (product: any, quantity: number, options: Record<string, string> = {}, priceOverride?: number) => {
        // Create a unique ID for the item based on product ID and selected options
        // Sorting keys ensures {Color: Red, Size: M} is same as {Size: M, Color: Red}
        const optionsString = JSON.stringify(options, Object.keys(options).sort());
        const itemId = `${product.id}-${optionsString}`;

        setItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === itemId);

            if (existingItemIndex > -1) {
                // Item exists, update quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // New item - use price override if provided, otherwise fallback to product price
                const price = priceOverride ?? (product.sale_price || product.price);
                const newItem: CartItem = {
                    id: itemId,
                    productId: product.id,
                    title: product.title,
                    category: product.category?.name,
                    productType: product.product_type?.name,
                    price: price,
                    image: product.images?.[0] || '',
                    quantity: quantity,
                    selectedOptions: options
                };
                return [...prevItems, newItem];
            }
        });

        setIsCartOpen(true); // Open cart when adding item
    };

    const removeFromCart = (itemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
