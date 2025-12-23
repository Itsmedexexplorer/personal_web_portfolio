import type { Metadata } from "next";
import { Playfair_Display, Merriweather, Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhanesh Shetty | Portfolio",
  description: "Product Designer & Developer",
};

import { CustomCursor } from "@/components/ui/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${merriweather.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased bg-paper-light min-h-screen`}
      >
        <CustomCursor />
        <div className="fixed inset-0 border-[5px] border-paper-light z-[9999] pointer-events-none rounded-[30px] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.05)]"></div>
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
