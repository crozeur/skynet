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

  const isFrench = language === "fr";
  const desktopNavGapClass = isFrench ? "gap-1 lg:gap-2" : "gap-3 lg:gap-4";
  const desktopRightGapClass = isFrench ? "gap-2 md:gap-2" : "gap-2 md:gap-3";

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
    const textSizeClass = isFrench ? "text-[14px] lg:text-[15px] xl:text-base" : "text-[15px] lg:text-base xl:text-lg";
    const paddingClass = "px-3 py-1.5 lg:px-4 lg:py-2";
    
    return `relative group rounded-full transition-all duration-300 ease-out font-semibold tracking-wide whitespace-nowrap ${textSizeClass} ${paddingClass} ${
      isActive(sectionId)
        ? "text-blue-700 dark:text-cyan-300 bg-blue-50/80 dark:bg-cyan-900/20 ring-1 ring-blue-200/50 dark:ring-cyan-700/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(34,211,238,0.05)]"
        : promoted
          ? "text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
    }`;
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md relative transition-all duration-300 ${
      scrolled ? "shadow-xl shadow-gray-400/60 dark:shadow-black/50 py-0.5" : "shadow-lg shadow-gray-300/50 dark:shadow-black/20"
    }`}>
      <Container className="flex items-center justify-between gap-2 py-1.5 md:py-2 relative">
        <a href="/#hero" className="flex items-center gap-3 focus:outline-none brightness-0 dark:brightness-100 transform hover:scale-105 transition-transform duration-200 flex-shrink-0">
          <Image src="/img/skynet-logo.svg" alt="Skynet Consulting" width={144} height={144} className="h-24 w-auto sm:h-28 md:h-32 lg:h-36 hover:opacity-90 transition-opacity duration-150" />
          <span className="sr-only">Skynet Consulting</span>
        </a>
        <div className={`hidden md:flex flex-1 min-w-0 items-center justify-center ${desktopNavGapClass} overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1`}>
          <a
            href="/#hero"
            className={navItemClass("hero")}
          >
            {language === "en" ? "Hub" : "Hub"}
          </a>
          <a
            href="/#services-overview"
            className={`${navItemClass("services-overview", { promoted: true })} group`}
          >
            <span className="inline-flex items-center">
              {language === "en" ? "Capabilities" : "Savoir-faire"}
              <span className="relative ml-2 inline-flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-cyan-400/75 animate-ping [animation-duration:2.2s]" />
                <span className="absolute inset-0 rounded-full bg-cyan-300/60 animate-ping [animation-duration:2.2s] [animation-delay:1.1s]" />
                <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_0_6px_rgba(34,211,238,0.34),0_0_22px_rgba(6,182,212,0.95),0_0_34px_rgba(6,182,212,0.55)] animate-[pulse_1.9s_ease-in-out_infinite]" />
              </span>
            </span>
          </a>
          <a
            href="/#case-studies"
            className={navItemClass("case-studies")}
          >
            {language === "en" ? "Impact" : "Impact"}
          </a>
          <a
            href={language === "fr" ? "/fr/blog" : "/blog"}
            className={`${navItemClass("blog")} group`}
          >
            <span className="inline-flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-purple-400 font-bold drop-shadow-sm group-hover:from-blue-500 group-hover:to-indigo-500 dark:group-hover:from-cyan-300 dark:group-hover:to-purple-300 transition-all duration-300">
              {language === "en" ? "Intel" : "Expertise"}
              <span className="ml-1.5 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 dark:bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 dark:bg-purple-500"></span>
              </span>
            </span>
          </a>
          <a
            href="/#compliance"
            className={navItemClass("compliance")}
          >
            {language === "en" ? (
              "Governance"
            ) : (
              <>
                <span className="hidden lg:inline">Gouvernance</span>
                <span className="lg:hidden">Gouvernance</span>
              </>
            )}
          </a>
          <a
            href="/#about"
            className={navItemClass("about")}
          >
            {language === "en" ? "Vision" : "Vision"}
          </a>
          <a
            href="/#contact"
            className={navItemClass("contact")}
          >
            {language === "en" ? (
              "Contact"
            ) : (
              <>
                <span className="hidden lg:inline">Contact</span>
                <span className="lg:hidden">Contact</span>
              </>
            )}
          </a>
        </div>
        <div className={`flex flex-shrink-0 items-center ${desktopRightGapClass}`}>
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
                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Mobile menu */}
      {/* Mobile menu: uses max-height + opacity transition for slide/fade effect */}
      <div className={`md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0 py-0'}`}>
        <Container className="px-4">
          <div className={`flex flex-col items-start gap-4 transition-transform duration-300 ${open ? 'translate-y-0' : '-translate-y-2 pointer-events-none'}`}>
            <a href="/#hero" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Home" : "Accueil"}
            </a>
            <a
              href="/#services-overview"
              className="group w-full text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition font-bold text-lg"
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center">
                {language === "en" ? "Capabilities" : "Savoir-faire"}
                <span className="relative ml-2 inline-flex h-2.5 w-2.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400/75 animate-ping [animation-duration:2.2s]" />
                  <span className="absolute inset-0 rounded-full bg-emerald-300/60 animate-ping [animation-duration:2.2s] [animation-delay:1.1s]" />
                  <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.34),0_0_22px_rgba(16,185,129,0.95),0_0_34px_rgba(16,185,129,0.55)] animate-[pulse_1.9s_ease-in-out_infinite]" />
                </span>
              </span>
            </a>
            <a href="/#case-studies" className="w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg" onClick={() => setOpen(false)}>
              {language === "en" ? "Success Stories" : "Nos Succès"}
            </a>
            <a
              href={language === "fr" ? "/fr/blog" : "/blog"}
              className="group w-full text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 transition font-semibold text-lg"
              onClick={() => setOpen(false)}
            >
              <span className="inline-flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-purple-400 font-bold drop-shadow-sm">
                {language === "en" ? "Intel" : "Expertise"}
                <span className="ml-2 relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 dark:bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 dark:bg-purple-500"></span>
                </span>
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

