"use client";

import React, { useState, useRef, useEffect } from "react";
import { Container } from "@/components/Container";
import { useLanguage } from "@/components/LanguageProvider";
import { translations } from "@/lib/translations";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  CloudIcon,
} from "@heroicons/react/24/solid";

export const Services = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState(0);
  const [activePanel, setActivePanel] = useState<"solution" | "results">("solution");
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const splitAudienceText = (text: string) => {
    const raw = String(text || "").trim();
    if (!raw) return { chips: [] as string[], rest: "" };

    const dashIdx = raw.search(/\s[–—-]\s/);
    if (dashIdx !== -1) {
      const left = raw.slice(0, dashIdx).trim();
      const right = raw.slice(dashIdx).replace(/^\s*[–—-]\s*/, "").trim();
      const chips = left
        .split(",")
        .map((s, idx) => {
          const cleaned = String(s || "").trim();
          if (!cleaned) return "";
          return idx === 0 ? cleaned : cleaned.replace(/^(and|et)\s+/i, "").trim();
        })
        .filter(Boolean)
        .slice(0, 6);
      return { chips, rest: right || raw };
    }

    // Fallback: if the whole string is a comma-separated list of audiences,
    // show them as chips (SOC offer uses this format).
    const commaParts = raw
      .split(",")
      .map((s, idx) => {
        const cleaned = String(s || "").trim();
        if (!cleaned) return "";
        return idx === 0 ? cleaned : cleaned.replace(/^(and|et)\s+/i, "").trim();
      })
      .filter(Boolean);

    const looksLikeList =
      commaParts.length >= 2 &&
      commaParts.length <= 6 &&
      commaParts.every((p) => p.length <= 60) &&
      raw.length <= 220;

    if (looksLikeList) {
      return { chips: commaParts, rest: "" };
    }

    return { chips: [] as string[], rest: raw };
  };

  const extractBadges = (text: string) => {
    const raw = String(text || "");
    const badges: string[] = [];
    if (/ISO\s*27001/i.test(raw)) badges.push("ISO 27001");
    if (/PCI\s*-?\s*DSS/i.test(raw)) badges.push("PCI-DSS");
    if (/GDPR/i.test(raw)) badges.push("GDPR");
    if (/RGPD/i.test(raw) && !badges.includes("GDPR")) badges.push("RGPD");
    if (/NIS\s*2/i.test(raw)) badges.push("NIS2");
    return badges;
  };

  const splitIntoSentences = (text: string) => {
    const raw = String(text || "").replace(/\s+/g, " ").trim();
    if (!raw) return [] as string[];

    // Avoid lookbehind for broad browser compatibility
    const parts = raw.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [raw];
    return parts.map((s) => s.trim()).filter(Boolean);
  };

  const toReadableBlocks = (text: string) => {
    const sentences = splitIntoSentences(text);
    if (sentences.length >= 2 && String(text || "").length >= 140) {
      return {
        lead: sentences[0] ?? "",
        bullets: sentences.slice(1).slice(0, 4),
      };
    }

    return { lead: String(text || "").trim(), bullets: [] as string[] };
  };

  // Auto-scroll to content when tab changes (mobile only), skip first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only scroll on viewports narrower than 1024px
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    if (!contentRef.current) return;

    setTimeout(() => {
      const element = contentRef.current;
      if (!element) return;
      const yOffset = -100; // Keep the section title visible
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 80);
  }, [activeTab]);

  const services = [
    {
      title: t.service1_title,
      for: t.service1_for,
      problem: t.service1_problem,
      solution: t.service1_solution,
      points: [
        t.service1_point1,
        t.service1_point2,
        t.service1_point3,
        t.service1_point4,
        t.service1_point5,
      ],
      results: t.service1_results,
      resultsList: [
        t.service1_result1,
        t.service1_result2,
        t.service1_result3,
        t.service1_result4,
      ],
      price: t.service1_price,
      icon: ShieldCheckIcon,
    },
    {
      title: t.service2_title,
      for: t.service2_for,
      problem: t.service2_problem,
      solution: t.service2_solution,
      points: [
        t.service2_point1,
        t.service2_point2,
        t.service2_point3,
        t.service2_point4,
      ],
      results: t.service2_results,
      resultsList: [
        t.service2_result1,
        t.service2_result2,
        t.service2_result3,
      ],
      price: t.service2_price,
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: t.service3_title,
      for: t.service3_for,
      problem: t.service3_problem,
      solution: t.service3_solution,
      points: [
        t.service3_point1,
        t.service3_point2,
        t.service3_point3,
      ],
      results: t.service3_results,
      resultsList: [
        t.service3_result1,
        t.service3_result2,
        t.service3_result3,
      ],
      price: t.service3_price,
      icon: CloudIcon,
    },
  ];

  const activeService = services[activeTab];

  return (
    <Container className="py-16 lg:py-24 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/50 bg-white/40 shadow-2xl shadow-blue-900/5 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/40 dark:shadow-none max-w-[90rem] mx-auto">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        
        <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:px-12 lg:px-16 min-w-0">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {t.services_section_title}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {t.services_section_subtitle}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {language === "en"
                ? "Pick the pillar you need now and expand later. Each offer is designed to deliver fast, tangible results."
                : "Commencez par le pilier dont vous avez besoin, puis élargissez ensuite. Nous garantissons des résultats rapides et concrets."}
            </p>
          </div>

          {/* Instruction Text */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md shadow-sm animate-[fadeInUp_0.8s_ease-out]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {language === "en" ? "Select an offer below to explore details" : "Sélectionnez une offre ci-dessous pour explorer les détails"}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2.5fr] min-w-0 w-full">
            <div className="space-y-4 w-full">
              {services.map((service, idx) => {
                const Icon = service.icon;
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`group relative flex w-full items-center gap-5 rounded-2xl border p-5 text-left transition-all duration-500 backdrop-blur-md cursor-pointer focus:outline-none ${
                      isActive
                        ? "border-blue-500/50 bg-white/80 shadow-xl shadow-blue-900/10 dark:border-cyan-500/30 dark:bg-slate-800/80 dark:shadow-cyan-900/20 scale-[1.02]"
                        : "border-slate-200/50 bg-white/40 hover:bg-white/60 hover:border-blue-300/50 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 dark:hover:border-cyan-500/30"
                    }`}
                  >
                    {/* Glow effect for active tab */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 rounded-2xl blur-md -z-10"></div>
                    )}
                    
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-110"
                          : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700 dark:group-hover:text-cyan-400"
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-all duration-500 ${
                          isActive 
                            ? "bg-blue-100 text-blue-700 dark:bg-cyan-900/30 dark:text-cyan-300" 
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{language === "en" ? "Offer" : "Offre"}</span>
                      </div>
                      <p className={`text-lg font-bold leading-tight truncate transition-colors duration-300 ${
                        isActive 
                          ? "text-slate-900 dark:text-white" 
                          : "text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white"
                      }`}>
                        {service.title}
                      </p>
                    </div>
                    
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                      isActive 
                        ? "bg-blue-50 text-blue-600 dark:bg-cyan-900/20 dark:text-cyan-400 translate-x-1" 
                        : "bg-transparent text-slate-300 group-hover:text-blue-400 dark:text-slate-600 dark:group-hover:text-cyan-500"
                    }`}>
                      <ChevronRightIcon className="h-5 w-5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Service Content */}
            {/* Mobile: problem card + toggle between Solution / Results, then CTA */}
            <div ref={contentRef} className="md:hidden space-y-4" key={`mobile-${activeTab}`}>
              {/* Problem & For - split into two clear sections */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900 space-y-5">
                {/* Target Audience section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm dark:from-blue-500/20 dark:to-cyan-500/20 dark:text-blue-300">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {language === "en" ? "Target Audience" : "Public Cible"}
                    </span>
                  </div>
                  {(() => {
                    const { chips, rest } = splitAudienceText(activeService.for);
                    const blocks = toReadableBlocks(rest);
                    return (
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 dark:border-white/10 dark:from-white/5 dark:via-white/3 dark:to-blue-500/10">
                        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-300/10 blur-2xl dark:from-blue-400/10 dark:to-cyan-300/10" aria-hidden />
                        {chips.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {chips.map((c) => (
                              <span
                                key={c}
                                className="inline-flex items-center rounded-full border border-blue-200/70 bg-white/70 px-2.5 py-1 text-xs font-semibold text-blue-800 shadow-sm backdrop-blur dark:border-blue-400/20 dark:bg-white/5 dark:text-blue-200"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        {blocks.lead && (
                          <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed break-words dark:text-white">
                            {blocks.lead}
                          </p>
                        )}
                        {blocks.bullets.length > 0 && (
                          <ul className="mt-3 space-y-2 text-sm text-slate-800/90 dark:text-slate-100/90">
                            {blocks.bullets.map((b) => (
                              <li key={b} className="flex gap-2 leading-relaxed">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500/70" />
                                <span className="break-words">{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-700" />

                {/* Challenge section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700 shadow-sm dark:from-red-500/20 dark:to-orange-500/20 dark:text-red-300">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {language === "en" ? "Challenge" : "Défi"}
                    </span>
                  </div>
                  {(() => {
                    const badges = extractBadges(activeService.problem);
                    const blocks = toReadableBlocks(activeService.problem);
                    return (
                      <div className="relative overflow-hidden rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-50 via-white to-orange-50/60 p-4 dark:border-red-500/20 dark:from-red-500/10 dark:via-white/3 dark:to-orange-500/10">
                        <div className="pointer-events-none absolute -left-6 top-0 h-full w-1 bg-gradient-to-b from-red-500/70 via-orange-500/40 to-transparent" aria-hidden />
                        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-red-400/15 to-orange-300/10 blur-2xl dark:from-red-400/10 dark:to-orange-300/10" aria-hidden />
                        {badges.length > 0 && (
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-red-700/90 dark:text-red-200/90">
                              {language === "en" ? "Frameworks" : "Référentiels"}
                            </span>
                            {badges.map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center rounded-full border border-red-200/70 bg-white/70 px-2.5 py-1 text-xs font-semibold text-red-800 shadow-sm backdrop-blur dark:border-red-400/20 dark:bg-white/5 dark:text-red-200"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed break-words dark:text-white">
                          {blocks.lead}
                        </p>
                        {blocks.bullets.length > 0 && (
                          <ul className="mt-3 space-y-2 text-sm text-slate-800/90 dark:text-slate-100/90">
                            {blocks.bullets.map((b) => (
                              <li key={b} className="flex gap-2 leading-relaxed">
                                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/70" />
                                <span className="break-words">{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Toggle buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePanel("solution")}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border ${
                    activePanel === "solution"
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-white"
                  }`}
                >
                  {language === "en" ? "Solution" : "Solution"}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel("results")}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 border ${
                    activePanel === "results"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow"
                      : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-white"
                  }`}
                >
                  {language === "en" ? "Results" : "Résultats"}
                </button>
              </div>

              {/* Mobile panels */}
              {activePanel === "solution" && (
                <div className="relative group w-full max-w-2xl mx-auto rounded-2xl border-2 border-blue-200 bg-white p-5 sm:p-7 shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 dark:border-blue-500/40 dark:bg-slate-900">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-blue-900 break-words dark:text-white">{activeService.solution}</h3>
                        {activeTab === 0 && (
                          <span className="inline-flex md:hidden text-[11px] text-slate-600 dark:text-slate-300">
                            {language === "en" ? "(AI-Augmented Execution Platform)" : "(Plateforme d'Exécution Augmentée par l'IA)"}
                          </span>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {activeService.points.map((point, idx) => (
                        <li key={idx} className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700 group/item dark:text-slate-100/90 min-w-0 leading-snug">
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 group-hover/item:scale-110 transition-transform dark:text-blue-400" />
                          <span className="break-words flex-1 min-w-0">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activePanel === "results" && (
                <div className="relative group w-full max-w-2xl mx-auto rounded-2xl border-2 border-emerald-200 bg-white p-5 sm:p-7 shadow-lg hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 dark:border-emerald-500/40 dark:bg-slate-900">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-emerald-900 break-words dark:text-white">{activeService.results}</h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {activeService.resultsList.map((result, idx) => (
                        <li key={idx} className="flex gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700 group/item dark:text-slate-100/90 min-w-0 leading-snug">
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0 group-hover/item:scale-110 transition-transform dark:text-emerald-400" />
                          <span className="break-words flex-1 min-w-0">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-lg dark:border-white/10 dark:bg-slate-900">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-100">
                      {language === "en" ? "Custom Engagements" : "Engagements personnalisés"}
                    </p>
                    <h4 className="text-xl font-bold text-slate-900 mt-1 break-words dark:text-white">
                      {language === "en"
                        ? "Tailored scopes and clear execution."
                        : "Périmètres adaptés et exécution claire."}
                    </h4>
                    <p className="text-sm text-slate-700 mt-2 dark:text-slate-200/90 break-words leading-relaxed">
                      {language === "en"
                          ? "Share your context with us and we'll design the right combination of AI-augmented audits, cloud migrations, and compliance services."
                          : "Partagez votre contexte avec nous et nous concevrons la bonne combinaison d'audits augmentés par l'IA, de migrations cloud et de services de conformité."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://calendly.com/skynet-consulting-dz/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-blue-300 hover:scale-105 dark:shadow-blue-900/40 break-words"
                    >
                      {language === "en" ? "Request a Demo" : "Demander une démo"}
                    </a>
                    <a
                      href="mailto:skynet.consulting.dz@email.com"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 dark:border-white/30 dark:text-white dark:hover:border-white/60 break-words"
                    >
                      {language === "en" ? "Start a Free Audit" : "Lancer un audit gratuit"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: show all cards */}
            <div className="hidden lg:flex flex-col gap-6 animate-[fadeInUp_0.5s_ease-out] min-w-0 w-full" key={activeTab}>
              {/* Problem & For - split into two clear sections */}
              <div className="w-full rounded-3xl border border-slate-200/50 bg-white/60 p-6 sm:p-8 shadow-xl shadow-blue-900/5 backdrop-blur-md transition-all duration-500 dark:border-slate-700/50 dark:bg-slate-800/60 space-y-6">
                {/* Target Audience section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 border border-blue-100 dark:border-blue-800/50">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {language === "en" ? "Target Audience" : "Public Cible"}
                    </span>
                  </div>
                  {(() => {
                    const { chips, rest } = splitAudienceText(activeService.for);
                    const blocks = toReadableBlocks(rest);
                    return (
                      <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 p-5 dark:border-slate-700/50 dark:bg-slate-900/50 shadow-sm">
                        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl dark:bg-cyan-400/5" aria-hidden />
                        {chips.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {chips.map((c) => (
                              <span
                                key={c}
                                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        {blocks.lead && (
                          <p className="text-base font-semibold text-slate-900 leading-relaxed dark:text-white">
                            {blocks.lead}
                          </p>
                        )}
                        {blocks.bullets.length > 0 && (
                          <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            {blocks.bullets.map((b) => (
                              <li key={b} className="flex gap-3 leading-relaxed">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200/50 dark:border-slate-700/50" />

                {/* Challenge section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-900/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {language === "en" ? "Challenge" : "Défi"}
                    </span>
                  </div>
                  {(() => {
                    const badges = extractBadges(activeService.problem);
                    const blocks = toReadableBlocks(activeService.problem);
                    return (
                      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-red-50/30 p-5 dark:border-red-900/30 dark:bg-red-900/10 shadow-sm">
                        <div className="pointer-events-none absolute -left-6 top-0 h-full w-1 bg-gradient-to-b from-red-500/50 to-transparent" aria-hidden />
                        <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-red-400/10 blur-2xl dark:bg-red-400/5" aria-hidden />
                        {badges.length > 0 && (
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
                              {language === "en" ? "Frameworks" : "Référentiels"}
                            </span>
                            {badges.map((b) => (
                              <span
                                key={b}
                                className="inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 shadow-sm dark:border-red-800/50 dark:bg-slate-900 dark:text-red-300"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-base font-semibold text-slate-900 leading-relaxed dark:text-white">
                          {blocks.lead}
                        </p>
                        {blocks.bullets.length > 0 && (
                          <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            {blocks.bullets.map((b) => (
                              <li key={b} className="flex gap-3 leading-relaxed">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Solution */}
              <div className="relative group w-full rounded-3xl border border-blue-200/50 bg-white/60 shadow-xl shadow-blue-900/5 backdrop-blur-md hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 dark:border-blue-500/30 dark:bg-slate-800/60 flex flex-col xl:flex-row overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Left side: Icon and Title */}
                <div className="relative z-10 p-6 md:p-8 xl:w-2/5 flex flex-col justify-center border-b xl:border-b-0 xl:border-r border-blue-200/30 dark:border-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{activeService.solution}</h3>
                  {activeTab === 0 && (
                    <span className="inline-block mt-4 text-xs font-medium text-blue-600 dark:text-cyan-400 bg-blue-100/50 dark:bg-blue-900/40 px-3 py-1.5 rounded-lg border border-blue-200/50 dark:border-blue-800/50 w-fit">
                      {language === "en" ? "AI-Augmented Execution Platform" : "Plateforme d'Exécution Augmentée par l'IA"}
                    </span>
                  )}
                </div>

                {/* Right side: Points */}
                <div className="relative z-10 p-6 md:p-8 xl:w-3/5 flex items-center">
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
                    {activeService.points.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-700 group/item dark:text-slate-300 leading-relaxed">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform dark:text-cyan-400" />
                        <span className="flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Results */}
              <div className="relative group w-full rounded-3xl border border-emerald-200/50 bg-white/60 shadow-xl shadow-emerald-900/5 backdrop-blur-md hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 dark:border-emerald-500/30 dark:bg-slate-800/60 flex flex-col xl:flex-row overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Left side: Icon and Title */}
                <div className="relative z-10 p-6 md:p-8 xl:w-2/5 flex flex-col justify-center border-b xl:border-b-0 xl:border-r border-emerald-200/30 dark:border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-900/10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{activeService.results}</h3>
                </div>

                {/* Right side: Points */}
                <div className="relative z-10 p-6 md:p-8 xl:w-3/5 flex items-center">
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4 w-full">
                    {activeService.resultsList.map((result, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-700 group/item dark:text-slate-300 leading-relaxed">
                        <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform dark:text-emerald-400" />
                        <span className="flex-1">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Card */}
              <div className="w-full rounded-3xl border border-slate-200/50 bg-white/80 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/80 mt-4">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 mb-2">
                      {language === "en" ? "Custom Engagements" : "Engagements personnalisés"}
                    </p>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                      {language === "en"
                        ? "Tailored scopes and clear execution."
                        : "Périmètres adaptés et exécution claire."}
                    </h4>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {language === "en"
                        ? "Share your context with us and we'll design the right combination of SOC, audit, and cloud modernization services."
                        : "Partagez votre contexte avec nous et nous concevrons la bonne combinaison de services SOC, audit et modernisation cloud."}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://calendly.com/skynet-consulting-dz/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-6 py-3.5 text-sm font-bold text-white dark:text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/20"
                    >
                      {language === "en" ? "Request a Demo" : "Demander une démo"}
                    </a>
                    <a
                      href="mailto:skynet.consulting.dz@email.com"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition-all duration-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {language === "en" ? "Start a Free Audit" : "Lancer un audit gratuit"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
