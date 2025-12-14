"use client";

import React, { useState } from "react";
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
    <Container className="py-10 lg:py-12 !overflow-x-visible">
      <div className="relative overflow-visible rounded-3xl border border-slate-200 bg-white shadow-xl shadow-blue-100/40 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-none">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
        <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-12 min-w-0">
          <div className="mb-10 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-white/10 dark:text-blue-100">
              {t.services_section_title}
            </p>
            <h2 className="mt-4 text-[1.75rem] leading-[1.25] sm:text-3xl lg:text-4xl xl:text-5xl font-bold sm:leading-tight text-slate-900 break-words dark:text-white">
              {t.services_section_subtitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-700 max-w-3xl mx-auto dark:text-slate-200/90">
              {language === "en"
                ? "Pick the pillar you need now and expand later. Each offer is designed to deliver fast, tangible results."
                : "Choisissez le pilier dont vous avez besoin maintenant et étendez ensuite. Chaque offre est conçue pour délivrer des résultats rapides et concrets."}
            </p>
          </div>

          {/* Instruction Text */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-700 animate-[fadeInUp_0.8s_ease-out]">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                {language === "en" ? "👇 Click on an offer to explore details" : "👇 Cliquez sur une offre pour explorer les détails"}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative z-10 grid gap-4 sm:gap-5 xl:grid-cols-[1.05fr_1.4fr] min-w-0 w-full">
            <div className="space-y-3 sm:space-y-4 w-full">
              {services.map((service, idx) => {
                const Icon = service.icon;
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`group relative flex w-full items-start gap-3 sm:gap-4 rounded-2xl border px-3 py-3 sm:px-5 sm:py-5 text-left transition-all duration-300 backdrop-blur cursor-pointer shadow-md hover:shadow-xl active:scale-[0.98] focus:ring-2 focus:ring-blue-500/50 focus:outline-none ${
                      isActive
                        ? "border-blue-400 bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30 shadow-2xl shadow-blue-200/60 dark:border-blue-500/80 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-cyan-900/10 dark:shadow-blue-900/40 scale-105"
                        : "border-slate-200 bg-white/90 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white hover:shadow-xl hover:shadow-blue-100/50 hover:scale-[1.02] dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-500/50 dark:hover:from-blue-900/10 dark:hover:to-transparent"
                    }`}
                  >
                    {/* Glow effect for active tab */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl -z-10"></div>
                    )}
                    
                    <span
                      className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl border shadow-lg transition-all duration-300 ${
                        isActive
                          ? "border-blue-300 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 scale-110 shadow-blue-200 dark:border-blue-400/60 dark:from-blue-500/30 dark:to-cyan-500/30 dark:text-white"
                          : "border-slate-200 bg-gradient-to-br from-slate-50 to-white text-slate-600 group-hover:border-blue-200 group-hover:from-blue-50 group-hover:to-cyan-50 group-hover:text-blue-600 group-hover:scale-105 dark:border-white/10 dark:from-white/10 dark:to-white/5 dark:text-white"
                      }`}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700/90 dark:text-blue-200/90">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                          isActive 
                            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg scale-110" 
                            : "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white dark:bg-white/10 dark:text-white"
                        }`}>
                          {idx + 1}
                        </span>
                        <span className={isActive ? "text-blue-700 dark:text-blue-300" : ""}>
                          {language === "en" ? "Offer" : "Offre"}
                        </span>
                      </div>
                      <p className={`text-base sm:text-lg font-bold leading-tight transition-colors ${
                        isActive 
                          ? "text-blue-900 dark:text-white" 
                          : "text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300"
                      }`}>
                        {service.title}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 dark:text-slate-300/80">{service.for}</p>
                    </div>
                    <ChevronRightIcon
                      className={`ml-auto h-6 w-6 transition-all duration-300 flex-shrink-0 ${
                        isActive 
                          ? "text-blue-600 translate-x-2 scale-125 dark:text-blue-400" 
                          : "text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Service Content */}
            <div className="grid gap-4 sm:gap-5 xl:grid-cols-2 animate-[fadeInUp_0.5s_ease-out] min-w-0 w-full" key={activeTab}>
              {/* Problem & For */}
              <div className="col-span-2 w-full max-w-2xl mx-auto rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-white p-5 sm:p-7 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:from-white/5 dark:via-slate-800/20 dark:to-white/5">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm dark:from-blue-500/20 dark:to-cyan-500/20 dark:text-blue-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {language === "en" ? "Target Audience" : "Public Cible"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-100 to-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700 shadow-sm dark:from-red-500/20 dark:to-orange-500/20 dark:text-red-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {language === "en" ? "Challenge" : "Défi"}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-3 break-words dark:text-slate-200/90">{activeService.for}</p>
                <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed break-words dark:text-white">{activeService.problem}</p>
              </div>

              {/* Solution */}
              <div className="relative group w-full max-w-2xl mx-auto rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50/50 to-blue-50 p-5 sm:p-7 backdrop-blur shadow-lg hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 dark:border-blue-500/40 dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-blue-900/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-blue-900 break-words dark:text-white">{activeService.solution}</h3>
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

              {/* Results */}
              <div className="relative group w-full max-w-2xl mx-auto rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50/50 to-emerald-50 p-5 sm:p-7 backdrop-blur shadow-lg hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-300 dark:border-emerald-500/40 dark:from-emerald-900/20 dark:via-green-900/10 dark:to-emerald-900/20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
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

              {/* CTA Card */}
              <div className="col-span-2 w-full max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 backdrop-blur dark:border-white/10 dark:bg-white/5">
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
                        ? "Share your context with us and we'll design the right combination of SOC, audit, and cloud modernization services."
                        : "Partagez votre contexte avec nous et nous concevrons la bonne combinaison de services SOC, audit et modernisation cloud."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://calendly.com/skynet-consulting-dz/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-blue-300 hover:scale-105 dark:shadow-blue-900/40 break-words"
                    >
                      {language === "en" ? "Book a call" : "Réserver un appel"}
                    </a>
                    <a
                      href="mailto:skynet.consulting.dz@email.com"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 dark:border-white/30 dark:text-white dark:hover:border-white/60 break-words"
                    >
                      {language === "en" ? "Email us" : "Nous écrire"}
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
