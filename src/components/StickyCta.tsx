"use client";

import { useLanguage } from "./LanguageProvider";

const calendlyUrl = "https://calendly.com/skynet-consulting-dz/30min";
const emailUrl = "mailto:skynet.consulting.dz@email.com";

export function StickyCta() {
  const { language } = useLanguage();

  const label = language === "en" ? "Talk to an expert" : "Parler à un expert";
  const sub = language === "en" ? "Response within 24h" : "Réponse sous 24h";
  const alt = language === "en" ? "Schedule a call" : "Planifier un appel";

  return (
    <>
      {/* Desktop sticky */}
      <div className="hidden md:flex fixed bottom-8 right-8 z-40 items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 shadow-2xl shadow-blue-500/30 border border-white/10 text-white backdrop-blur">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-[11px] text-white/80">{sub}</span>
        </div>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-semibold transition-colors"
        >
          {alt}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
        <a
          href={emailUrl}
          className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          aria-label={language === "en" ? "Contact by email" : "Contact par email"}
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
          </svg>
        </a>
      </div>

      {/* Mobile floating button */}
      <a
        href={calendlyUrl}
        target="_blank"
        rel="noreferrer"
        className="md:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 shadow-2xl shadow-blue-500/40 text-white text-sm font-bold hover:scale-105 active:scale-95 transition-transform duration-200"
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h4" />
        </svg>
        {label}
      </a>
    </>
  );
}