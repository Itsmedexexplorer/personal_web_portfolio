import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { KEYWORDS, SITE } from "@/lib/seo";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

const description =
  "Dhanesh Shetty is an AI & automation engineer from Kolhapur, India, and co-founder of Nexa Tech. He builds AI agents, React Native apps, ROS 2 autonomous drones and n8n automations. See his projects, GitHub activity and resume.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Dhanesh Shetty — AI Engineer, App Developer & Automation | Portfolio", template: "%s · Dhanesh Shetty" },
  description,
  applicationName: "Dhanesh Shetty",
  keywords: KEYWORDS,
  authors: [{ name: "Dhanesh Shetty", url: SITE }],
  creator: "Dhanesh Shetty",
  category: "technology",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    type: "profile", url: "/", siteName: "Dhanesh Shetty", locale: "en_IN", firstName: "Dhanesh", lastName: "Shetty",
    title: "Dhanesh Shetty — software that thinks, sees and flies", description,
  },
  twitter: { card: "summary_large_image", title: "Dhanesh Shetty — AI agents, apps & automation", description },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [{ color: "#8fb8de" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* reveal animations only hide content when JavaScript is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
