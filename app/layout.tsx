import type { Metadata, Viewport } from "next";
import { Roboto_Serif, Cinzel, Outfit } from "next/font/google";
import "./globals.css";

const robotoSerif = Roboto_Serif({
    variable: "--font-roboto-serif",
    subsets: ["latin"],
});

const cinzel = Cinzel({
    variable: "--font-cinzel",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

// Site Configuration
const siteConfig = {
    name: "Silk Thread Boutique",
    description: "Discover handcrafted elegance with premium silk thread jewelry, bangles, earrings, and traditional Indian accessories. Handmade with love, perfect for festivals, weddings, and everyday wear.",
    url: "https://www.silkthreadboutique.in", // Update with your actual domain
    ogImage: "/logo/white-hoz.jpg",
    keywords: [
        "silk thread jewelry",
        "silk thread bangles",
        "handmade jewelry",
        "Indian jewelry",
        "traditional accessories",
        "silk thread earrings",
        "handcrafted bangles",
        "ethnic jewelry",
        "wedding jewelry",
        "festival jewelry",
        "jhumkas",
        "kada bangles",
        "hair accessories",
        "silk thread boutique",
        "handmade accessories India"
    ],
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    ],
};

export const metadata: Metadata = {
    // Basic Meta Tags
    title: {
        default: `${siteConfig.name} | Handcrafted Silk Thread Jewelry & Accessories`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

    // Robots & Indexing
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Canonical URL
    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: "/",
    },

    // Open Graph (Facebook, LinkedIn, etc.)
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: `${siteConfig.name} | Handcrafted Silk Thread Jewelry & Accessories`,
        description: siteConfig.description,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} - Handcrafted Silk Thread Jewelry`,
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: "summary_large_image",
        title: `${siteConfig.name} | Handcrafted Silk Thread Jewelry`,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: "@silkthreadboutique", // Update with actual Twitter handle
    },

    // Icons & Manifest
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/logo/black-appicon.png", type: "image/png", sizes: "192x192" },
        ],
        apple: [
            { url: "/logo/black-appicon.png", sizes: "180x180", type: "image/png" },
        ],
        shortcut: "/favicon.ico",
    },
    manifest: "/site.webmanifest",

    // Additional Meta
    applicationName: siteConfig.name,
    referrer: "origin-when-cross-origin",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    // Category for classification
    category: "e-commerce",

    // Verification (Add your actual verification codes)
    // verification: {
    //     google: "your-google-verification-code",
    //     yandex: "your-yandex-verification-code",
    // },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Structured Data - Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: siteConfig.name,
                            url: siteConfig.url,
                            logo: `${siteConfig.url}/logo/black-appicon.png`,
                            description: siteConfig.description,
                            sameAs: [
                                "https://instagram.com/silkthreadboutique", // Update with actual links
                                "https://youtube.com/silkthreadboutique",
                            ],
                            contactPoint: {
                                "@type": "ContactPoint",
                                contactType: "customer service",
                                availableLanguage: ["English", "Tamil"],
                            },
                        }),
                    }}
                />
                {/* Structured Data - Website Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: siteConfig.name,
                            url: siteConfig.url,
                            potentialAction: {
                                "@type": "SearchAction",
                                target: {
                                    "@type": "EntryPoint",
                                    urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
                                },
                                "query-input": "required name=search_term_string",
                            },
                        }),
                    }}
                />
            </head>
            <body
                className={`${robotoSerif.variable} ${cinzel.variable} ${outfit.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}

