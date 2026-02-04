"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Language } from "@/lib/translations";
import { usePathname } from "next/navigation";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = useMemo(
    () =>
      (lang: Language) => {
        setLanguageState(lang);
        try {
          window.localStorage.setItem("skynet_lang", lang);
        } catch {
          // ignore
        }
      },
    []
  );

  // Load persisted language on first mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("skynet_lang");
      if (saved === "en" || saved === "fr") {
        setLanguageState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // URL prefix wins for localized routes (e.g. /fr/blog/...)
  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/" || !pathname.startsWith("/")) return;
    if (pathname.startsWith("/fr/")) {
      setLanguageState("fr");
      return;
    }
    if (pathname.startsWith("/en/")) {
      setLanguageState("en");
    }
  }, [pathname]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
