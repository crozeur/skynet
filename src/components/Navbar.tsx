"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/Container";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SearchBar } from "@/components/SearchBar";
import { useLanguage } from "./LanguageProvider";
import ThemeChanger from "./DarkSwitch";

export const Navbar = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  // translations are consumed directly inside components that need them

  useEffect(() => {
    const handleScroll = () => {
      // Track scroll position for enhanced shadow
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = ["hero", "case-studies", "services-overview", "compliance", "about", "contact"];
      const scrollPos = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (sectionId: string) => activeSection === sectionId;

  const navItemClass = (sectionId: string) =>
    `text-gray-800 dark:text-gray-100 transition font-semibold text-lg lg:text-xl px-3 py-2 rounded-md ${
      isActive(sectionId)
        ? "text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border-b-2 border-blue-600 dark:border-blue-300"
        : "hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
    }`;

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 relative transition-all duration-300 ${
      scrolled ? "shadow-lg shadow-gray-300/80 dark:shadow-black/50" : "shadow-md shadow-gray-200/40 dark:shadow-black/20"
    }`}>
      <Container className="flex items-center justify-between py-1.5 md:py-2 relative">
        <a href="/#hero" className="flex items-center gap-3 focus:outline-none brightness-0 dark:brightness-100 transform hover:scale-105 transition-transform duration-200 flex-shrink-0">
          <img src="/img/skynet-logo.svg" alt="Skynet Consulting" className="h-24 w-auto sm:h-28 md:h-32 lg:h-36 hover:opacity-90 transition-opacity duration-150" />
          <span className="sr-only">Skynet Consulting</span>
        </a>
        <div className="hidden md:flex items-center gap-5">
          <a
            href="/#hero"
            className={navItemClass("hero")}
          >
            {language === "en" ? "Home" : "Accueil"}
          </a>
          <a
            href="/#case-studies"
            className={navItemClass("case-studies")}
          >
            {language === "en" ? "Success Stories" : "Nos Succès"}
          </a>
          <a
            href="/#services-overview"
            className={navItemClass("services-overview")}
          >
            {language === "en" ? "Services" : "Nos Services"}
          </a>
          <a
            href="/#compliance"
            className={navItemClass("compliance")}
          >
            {language === "en" ? "Compliance" : "Conformité & Risques"}
          </a>
          <a
            href="/#about"
            className={navItemClass("about")}
          >
            {language === "en" ? "About Us" : "À Propos"}
          </a>
          <a
            href="/#contact"
            className={navItemClass("contact")}
          >
            {language === "en" ? "Contact" : "Nous Contacter"}
          </a>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <SearchBar />
          <LanguageSwitcher />
          
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-pulse hover:animate-none"
            >
              {open ? (
                <>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-semibold">{language === "en" ? "Close" : "Fermer"}</span>
                </>
              ) : (
                <>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-semibold">{language === "en" ? "Menu" : "Menu"}</span>
                </>
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

