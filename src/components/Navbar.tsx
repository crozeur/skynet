"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();

  // Always track scrolled state for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active item detection: sections on home, route-based on other pages
  useEffect(() => {
    if (pathname === "/") {
      const detectActiveSection = () => {
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
      window.addEventListener("scroll", detectActiveSection);
      detectActiveSection();
      return () => window.removeEventListener("scroll", detectActiveSection);
    } else {
      if (pathname && pathname.startsWith("/blog")) {
        setActiveSection("blog");
      } else if (pathname && (pathname.startsWith("/fr/blog") || pathname.startsWith("/en/blog"))) {
        setActiveSection("blog");
      } else {
        setActiveSection("");
      }
    }
  }, [pathname]);

  const isActive = (sectionId: string) => activeSection === sectionId;

  const navItemClass = (sectionId: string, opts?: { promoted?: boolean }) => {
    const promoted = Boolean(opts?.promoted);
    return `text-gray-900 dark:text-gray-100 transition font-bold whitespace-nowrap text-lg lg:text-xl px-3 py-2 rounded-md ${
      isActive(sectionId)
        ? "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 border-b-2 border-blue-700 dark:border-blue-300 shadow-sm"
        : promoted
          ? "text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-900/20 ring-1 ring-blue-200/80 dark:ring-blue-700/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/30"
          : "hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
    }`;
  };

  const blogBadge = (
    <span className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-white shadow-sm">
      {language === "en" ? "Guides" : "Guides"}
    </span>
  );

  return (
    <nav className={`sticky top-0 z-50 bg-white dark:bg-gray-900/90 backdrop-blur-md border-b-2 border-gray-300 dark:border-gray-800 relative transition-all duration-300 ${
      scrolled ? "shadow-xl shadow-gray-400/60 dark:shadow-black/50" : "shadow-lg shadow-gray-300/50 dark:shadow-black/20"
    }`}>
      <Container className="flex items-center justify-between py-1.5 md:py-2 relative">
        <a href="/#hero" className="flex items-center gap-3 focus:outline-none brightness-0 dark:brightness-100 transform hover:scale-105 transition-transform duration-200 flex-shrink-0">
          <Image src="/img/skynet-logo.svg" alt="Skynet Consulting" width={144} height={144} className="h-24 w-auto sm:h-28 md:h-32 lg:h-36 hover:opacity-90 transition-opacity duration-150" />
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
            href={language === "fr" ? "/fr/blog" : "/blog"}
            className={navItemClass("blog", { promoted: true })}
          >
            <span className="inline-flex items-center">
              {language === "en" ? "Blog" : "Blog"}
              {blogBadge}
            </span>
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
        <div className="flex items-center gap-2 md:gap-4 mr-4">
          <div className="hidden md:block">
            <ThemeChanger />
          </div>
          <div className="hidden md:block">
            <SearchBar />
          </div>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          
          {/* Mobile: compact icons with theme switcher and search above */}
          <div className="md:hidden flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <ThemeChanger />
              <SearchBar />
            </div>
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {open ? (
                  <>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-xs font-semibold">{language === "en" ? "Close" : "Fermer"}</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-xs font-semibold">{language === "en" ? "Menu" : "Menu"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
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
            <a
              href={language === "fr" ? "/fr/blog" : "/blog"}
              className="w-full text-blue-700 dark:text-blue-300 bg-blue-50/70 dark:bg-blue-900/20 ring-1 ring-blue-200/80 dark:ring-blue-700/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/30 transition font-bold text-lg px-3 py-2 rounded-md"
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center">
                Blog
                {blogBadge}
              </span>
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

