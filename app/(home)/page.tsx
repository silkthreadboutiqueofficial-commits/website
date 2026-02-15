import { Metadata } from "next";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import InstagramSection from "@/components/home/InstagramSection";

export const metadata: Metadata = {
  title: "Home | Handcrafted Silk Thread Jewelry & Accessories",
  description: "Shop premium handcrafted silk thread jewelry, bangles, earrings, jhumkas, and traditional Indian accessories. Beautiful handmade pieces perfect for weddings, festivals, and everyday elegance. Free shipping on select orders.",
  keywords: ["silk thread jewelry", "handmade bangles", "Indian jewelry online", "silk thread earrings", "jhumkas online", "traditional accessories", "wedding jewelry India"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Silk Thread Boutique | Handcrafted Jewelry & Accessories",
    description: "Discover our collection of premium handcrafted silk thread jewelry. Beautiful bangles, earrings, and accessories made with love.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data - Store/E-commerce Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Silk Thread Boutique",
            description: "Handcrafted silk thread jewelry and traditional Indian accessories",
            url: "https://www.silkthreadboutique.in",
            logo: "https://www.silkthreadboutique.in/logo/black-appicon.png",
            image: "https://www.silkthreadboutique.in/logo/white-hoz.jpg",
            priceRange: "₹₹",
            currenciesAccepted: "INR",
            paymentAccepted: "Whatsapp Order",
            openingHoursSpecification: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "09:00",
              closes: "19:00",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Silk Thread Jewelry Collection",
              itemListElement: [
                {
                  "@type": "OfferCatalog",
                  name: "Bangles",
                  itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Silk Thread Bangles" } },
                  ],
                },
                {
                  "@type": "OfferCatalog",
                  name: "Earrings",
                  itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Jhumkas & Earrings" } },
                  ],
                },
              ],
            },
          }),
        }}
      />
      <main className="min-h-screen">
        <Hero />
        <CategoriesSection />
        <FeaturedProducts />
        <FeaturesSection />
        <TestimonialsSection />
        <InstagramSection />
      </main>
    </>
  );
}

