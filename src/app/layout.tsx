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
