"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

interface AcronymProps {
  term: "SLA" | "SOC" | "MDR" | string;
  titleKey?: keyof typeof translations["en"];
  descKey?: keyof typeof translations["en"];
  className?: string;
}

export default function Acronym({ term, titleKey, descKey, className }: AcronymProps) {
  const { language } = useLanguage();
  const t = translations[language as "en" | "fr"] as any;
  const [open, setOpen] = useState(false);

  const title = titleKey ? t[titleKey] : term;
  const desc = descKey ? t[descKey] : undefined;

  return (
    <span className={`relative inline-flex items-center group ${className || ""}`}>
      <abbr
        title={desc || title}
        className="cursor-help underline decoration-dotted underline-offset-2 text-blue-700 dark:text-blue-300"
        onClick={() => setOpen((v) => !v)}
      >
        {term}
      </abbr>
      {(desc || title) && (
        <span
          className={`absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 w-64 text-xs rounded-lg border bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-200 shadow-xl border-gray-200/80 dark:border-gray-700/80 px-3 py-2 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          role="tooltip"
          aria-hidden={!open}
        >
          <div className="font-semibold mb-1">{title}</div>
          <div className="leading-snug">{desc}</div>
        </span>
      )}
    </span>
  );
}
