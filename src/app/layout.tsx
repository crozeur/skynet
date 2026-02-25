import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProviderClient } from "@/components/ThemeProviderClient";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { StickyCta } from "@/components/StickyCta";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://skynet-consulting.net"),
  title: "Skynet Consulting | Advanced Cybersecurity Solutions",
  description: "Skynet Consulting: The Cybertech platform replacing traditional consulting. Standardized audits, ephemeral infrastructure, and automated compliance.",
  openGraph: {
    title: "Skynet Consulting | Advanced Cybersecurity Solutions",
    description: "Skynet Consulting: The Cybertech platform replacing traditional consulting. Standardized audits, ephemeral infrastructure, and automated compliance.",
    url: "https://skynet-consulting.net",
    siteName: "Skynet Consulting",
    images: [
      {
        url: "/img/hero.png",
        width: 1200,
        height: 630,
        alt: "Skynet Consulting"
      }
    ],
    locale: "en_US",
    type: "website"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={inter.className}>
        <ThemeProviderClient>
          <LanguageProvider>
            <Navbar />
            <div className="overflow-x-hidden">{children}</div>
            <Footer />
            <CookieBanner />
            <StickyCta />
          </LanguageProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
