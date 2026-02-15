import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
