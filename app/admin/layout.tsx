import { Cinzel, Outfit, Roboto_Serif } from "next/font/google";
import '../globals.css'

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



export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoSerif.variable} ${cinzel.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

