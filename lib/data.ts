// Static configuration data - NOT fetched from database

export const footerLinks = [
    {
        title: "Shop",
        links: [
            { name: "All Products", href: "/products" },
            { name: "Categories", href: "/categories" },
            { name: "Size Guide", href: "/size-guide" },
        ]
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "/about-us" },
            { name: "Contact", href: "/contact-us" },
            { name: "Privacy Policy", href: "/privacy-policy" },
            { name: "Terms & Conditions", href: "/terms-and-conditions" },
        ]
    }
];

export const kidsSizeChart = [
    { size: '1.8', diameter: '3.6 cm' },
    { size: '1.10', diameter: '4.0 cm' },
    { size: '1.12', diameter: '4.4 cm' },
    { size: '1.14', diameter: '4.8 cm' },
    { size: '2.0', diameter: '4.9 to 5.0 cm' },
];

export const adultSizeChart = [
    { size: '2.2', diameter: '5.2 to 5.4 cm' },
    { size: '2.4', diameter: '5.7 to 5.9 cm' },
    { size: '2.6', diameter: '6 to 6.3 cm' },
    { size: '2.8', diameter: '6.4 to 6.5 cm' },
    { size: '2.10', diameter: '6.6 to 6.7 cm' },
    { size: '2.12', diameter: '6.8 to 7 cm' },
];

// Default Colors for product variants
export const DEFAULT_COLORS = [
    'Dark Green', 'Light Green', 'Red', 'Orange',
    'Light Blue', 'Dark Blue', 'Dark Pink', 'Gold', 'White', 'Pearl'
];

// Default Sizes for product variants
export const DEFAULT_KIDS_SIZES = kidsSizeChart.map((size) => size.size);
export const DEFAULT_ADULT_SIZES = adultSizeChart.map((size) => size.size);

// Product interface for database products
export interface Product {
    id: string;
    name: string;
    subtitle?: string;
    ribbon?: string;
    description?: string;
    mrp_price: number;
    offer_price?: number;
    category_id: string;
    type_id: string;
    product_title?: string;
    status: 'active' | 'inactive';
    options?: any[];
    images: string[];
    created_at?: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    product_type?: {
        id: string;
        name: string;
        slug: string;
    };
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    // image_url?: string; // Legacy
    images?: string[];
    created_at?: string;
}

export interface ProductType {
    id: string;
    name: string;
    slug: string;
    category_id?: string;
    category?: Category;
}
