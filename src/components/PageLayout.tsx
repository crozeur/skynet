"use client";

import { useState } from "react";
import { Language, translations } from "@/lib/translations";
import { Navbar } from "@/components/Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  getTranslation: (lang: Language) => typeof translations.en;
}

export default function PageLayout({ children, getTranslation }: PageLayoutProps) {
  const [language, setLanguage] = useState<Language>("en");
  const t = getTranslation(language);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
