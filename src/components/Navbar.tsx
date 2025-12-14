"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import ThemeChanger from "./DarkSwitch";

export const Navbar = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  // translations are consumed directly inside components that need them

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg shadow-gray-200/60 dark:shadow-black/30 relative transition-all duration-300">
      <Container className="flex items-center justify-between py-1.5 md:py-2 relative">
        <a href="/#hero" className="flex items-center gap-3 focus:outline-none brightness-0 dark:brightness-100 transform hover:scale-105 transition-transform duration-200">
          <img src="/img/skynet-logo.svg" alt="Skynet Consulting" className="h-20 w-auto sm:h-24 md:h-32 lg:h-36 hover:opacity-90 transition-opacity duration-150" />
          <span className="sr-only">Skynet Consulting</span>
        </a>
        <div className="hidden md:flex items-center gap-5">
          <a
            href="/#hero"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg lg:text-xl px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {language === "en" ? "Home" : "Accueil"}
          </a>
          <a
            href="/#case-studies"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg lg:text-xl px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {language === "en" ? "Success Stories" : "Nos Succès"}
          </a>
          <a
            href="/#services-overview"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg lg:text-xl px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {language === "en" ? "Services" : "Nos Services"}
          </a>
          <a
            href="/#compliance"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg lg:text-xl px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {language === "en" ? "Compliance" : "Conformité & Risques"}
          </a>
          <a
            href="/#about"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg lg:text-xl px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {language === "en" ? "About Us" : "À Propos"}
          </a>
          <a
            href="/#contact"
            className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg lg:text-xl px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {language === "en" ? "Contact" : "Nous Contacter"}
          </a>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher />
          
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {open ? (
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <ThemeChanger />
        </div>
      </Container>

      {/* Accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-500/40 via-cyan-400/40 to-blue-600/40"></div>

      {/* Mobile menu */}
      {/* Mobile menu: uses max-height + opacity transition for slide/fade effect */}
      <div className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}>
        <Container className="px-4">
          <div className={`flex flex-col items-start gap-4 ${open ? '' : 'pointer-events-none'}`}>
            <a href="/#hero" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Home" : "Accueil"}
            </a>
            <a href="/#case-studies" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Success Stories" : "Nos Succès"}
            </a>
            <a href="/#services-overview" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Services" : "Nos Services"}
            </a>
            <a href="/#compliance" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Compliance" : "Conformité & Risques"}
            </a>
            <a href="/#about" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "About Us" : "À Propos"}
            </a>
            <a href="/#contact" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Contact" : "Nous Contacter"}
            </a>

            <div className="pt-2 w-full flex items-center gap-4">
              <ThemeChanger />
              <LanguageSwitcher />
            </div>
          </div>
        </Container>
      </div>
    </nav>
  );
};

