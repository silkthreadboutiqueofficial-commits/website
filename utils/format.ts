/**
 * Currency formatting utilities
 */

export interface FormatCurrencyOptions {
    locale?: string;
    currency?: string;
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

const defaultOptions: FormatCurrencyOptions = {
    locale: 'en-IN',
    currency: 'INR',
    showSymbol: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
};

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1500) // "₹1,500"
 * formatCurrency(1500, { showSymbol: false }) // "1,500"
 * formatCurrency(1500.50, { maximumFractionDigits: 2 }) // "₹1,500.50"
 */
export function formatCurrency(amount: number, options?: FormatCurrencyOptions): string {
    const opts = { ...defaultOptions, ...options };

    const formatted = new Intl.NumberFormat(opts.locale, {
        style: 'currency',
        currency: opts.currency,
        minimumFractionDigits: opts.minimumFractionDigits,
        maximumFractionDigits: opts.maximumFractionDigits,
    }).format(amount);

    if (!opts.showSymbol) {
        // Remove currency symbol, keeping the formatted number
        return formatted.replace(/[^\d,.-]/g, '').trim();
    }

    return formatted;
}

/**
 * Format price with optional sale price
 * @returns Object with formatted prices and discount info
 * 
 * @example
 * formatPrice(2000, 1500)
 * // { price: "₹2,000", salePrice: "₹1,500", discount: 25, savings: "₹500" }
 */
export function formatPrice(price: number, salePrice?: number | null) {
    const formattedPrice = formatCurrency(price);

    if (salePrice && salePrice < price) {
        const discount = Math.round(((price - salePrice) / price) * 100);
        const savings = price - salePrice;

        return {
            price: formattedPrice,
            salePrice: formatCurrency(salePrice),
            discount,
            savings: formatCurrency(savings),
            hasSale: true,
        };
    }

    return {
        price: formattedPrice,
        salePrice: null,
        discount: 0,
        savings: null,
        hasSale: false,
    };
}

/**
 * Format a number with Indian number system (lakhs, crores)
 * @example
 * formatIndianNumber(100000) // "1,00,000"
 */
export function formatIndianNumber(num: number): string {
    return new Intl.NumberFormat('en-IN').format(num);
}
