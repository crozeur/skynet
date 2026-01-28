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
      { url: '/favicon-black.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
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
        {/* Favicons - light/dark variants */}
        <link rel="icon" type="image/svg+xml" href="/favicon-black.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/skynet-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
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
