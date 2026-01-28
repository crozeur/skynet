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
  title: "Skynet Consulting | Cybersecurity Solutions & Managed SOC",
  description: "Expert cybersecurity services: Managed SOC operations, security audits, and cloud security. Protect your organization with proven expertise.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
  },
  openGraph: {
    title: "Skynet Consulting | Cybersecurity Solutions & Managed SOC",
    description: "Expert cybersecurity services: Managed SOC operations, security audits, and cloud security.",
    url: "https://skynet-consulting.net",
    siteName: "Skynet Consulting",
    images: [
      {
        url: "/img/skynet-logo.png",
        width: 1200,
        height: 630,
        alt: "Skynet Consulting Logo"
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
        {/* Force favicon refresh with cache bust */}
        <link rel="icon" href="/favicon.svg?v=3" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="apple-touch-icon" href="/img/skynet-logo.png?v=3" />
        <meta name="theme-color" content="#e0f2fe" />
      </head>
      <body className={inter.className}>
        <ThemeProviderClient>
          <LanguageProvider>
            <Navbar />
            <div>{children}</div>
            <Footer />
            <CookieBanner />
            <StickyCta />
          </LanguageProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
