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
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  UserGroupIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

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
        t.service3_point4,
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
    {
      title: t.service4_title,
      for: t.service4_for,
      problem: t.service4_problem,
      solution: t.service4_solution,
      points: [
        t.service4_point1,
        t.service4_point2,
        t.service4_point3,
      ],
      results: t.service4_results,
      resultsList: [
        t.service4_result1,
        t.service4_result2,
        t.service4_result3,
      ],
      price: t.service4_price,
      icon: ChartBarIcon,
    },
  ];

  const activeService = services[activeTab];

  return (
    <Container className="py-20 lg:py-32 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-cyan-950/30 border border-slate-200 dark:border-cyan-800/50 w-fit mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-cyan-400 uppercase tracking-widest">
            {t.services_section_title}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 break-words">
          {t.services_section_subtitle}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {language === "en"
            ? "Pick the pillar you need now and expand later. Each offer is designed to deliver fast, tangible results."
            : "Commencez par le pilier dont vous avez besoin, puis élargissez ensuite. Nous garantissons des résultats rapides et concrets."}
        </p>
      </div>

      {/* Horizontal Tabs (The 4 Pillars) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`relative group p-5 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                isActive 
                  ? "bg-slate-900 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] dark:bg-slate-800" 
                  : "bg-white/60 border-slate-200/50 hover:bg-white hover:border-cyan-300/50 dark:bg-slate-900/40 dark:border-slate-700/50 dark:hover:bg-slate-800/60"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              )}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
                  isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:text-cyan-500"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-1 text-slate-500 dark:text-slate-400">
                    {language === "en" ? `Pillar 0${idx + 1}` : `Pilier 0${idx + 1}`}
                  </div>
                  <div className={`text-sm font-bold leading-tight ${isActive ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {service.title}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Area (Glassmorphism Dashboard) */}
      <div ref={contentRef} className="relative z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-cyan-500/20 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden mb-12">
        {/* Top scanning line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column: The Problem & Target */}
          <div className="space-y-8">
            {/* Target Audience */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                  <UserGroupIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                  {language === "en" ? "Target Profile" : "Profil Cible"}
                </h3>
              </div>
              {(() => {
                const { chips, rest } = splitAudienceText(activeService.for);
                const blocks = toReadableBlocks(rest);
                return (
                  <div className="space-y-5">
                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {chips.map((c) => (
                          <span key={c} className="inline-flex items-center rounded-md border border-blue-200/50 bg-blue-50/50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                    {blocks.lead && (
                      <p className="text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {blocks.lead}
                      </p>
                    )}
                    {blocks.bullets.length > 0 && (
                      <ul className="space-y-3">
                        {blocks.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400/60" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* The Challenge */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-red-50/80 to-orange-50/80 dark:from-red-950/30 dark:to-orange-950/10 border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden backdrop-blur-sm">
              {/* Decorative background element */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/5 dark:bg-red-500/10 blur-2xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center border border-red-200 dark:border-red-500/30">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-red-900 dark:text-red-400">
                  {language === "en" ? "The Challenge" : "Le Défi"}
                </h3>
              </div>
              {(() => {
                const badges = extractBadges(activeService.problem);
                const blocks = toReadableBlocks(activeService.problem);
                return (
                  <div className="relative z-10">
                    {badges.length > 0 && (
                      <div className="mb-5 flex flex-wrap gap-2">
                        {badges.map((b) => (
                          <span key={b} className="inline-flex items-center rounded-md border border-red-200/60 bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300 shadow-sm">
                            {b}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                      {blocks.lead}
                    </p>
                    {blocks.bullets.length > 0 && (
                      <ul className="mt-5 space-y-3">
                        {blocks.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/60" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Right Column: Solution & Results */}
          <div className="space-y-10">
            {/* The Solution */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {language === "en" ? "Our Solution" : "Notre Solution"}
                </h3>
              </div>
              <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 dark:bg-slate-800/50 border border-slate-800 dark:border-cyan-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full"></div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-6 relative z-10">
                  {activeService.solution}
                </h4>
                <ul className="space-y-4 relative z-10">
                  {activeService.points.map((point, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                      <CheckCircleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Expected Outcomes */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {language === "en" ? "Expected Outcomes" : "Résultats Attendus"}
                </h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-4">
                {activeService.resultsList.map((result, idx) => (
                  <li key={idx} className="flex gap-3 p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Bar (Our Priorities) */}
      <div className="relative z-10 bg-slate-900 dark:bg-slate-950 rounded-3xl border border-slate-800 dark:border-slate-800 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex items-center gap-4 lg:w-1/4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
                {language === "en" ? "Global Telemetry" : "Télémétrie Globale"}
              </div>
              <div className="text-lg font-bold text-white">
                {language === "en" ? "Our Priorities" : "Nos Priorités"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:w-3/4 w-full">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{t.stats_threats || "Menaces"}</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">{t.stats_threats_value || "2,847"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{t.stats_response_time || "Réponse"}</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">{t.stats_response_value || "8m 42s"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{t.stats_system_health || "Santé"}</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">{t.stats_health_value || "99.8%"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{t.stats_coverage || "Couverture"}</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">{t.stats_coverage_value || "100%"}</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
