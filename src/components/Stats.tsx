"use client";

import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";
import Acronym from "./Acronym";

export const Stats = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const metrics = [
    {
      label: t.stats_threats || "Menaces détectées",
      value: t.stats_threats_value || "2,847",
      description: t.stats_threats_desc || "Attaques, anomalies et tentatives d'intrusion bloquées ce mois",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: t.stats_response_time || "Temps de réponse",
      value: t.stats_response_value || "8m 42s",
      description: t.stats_response_desc || "Délai moyen de détection et d'intervention sur incident critique",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: t.stats_system_health || "Santé du système",
      value: t.stats_health_value || "99.8%",
      description: t.stats_health_desc || "Disponibilité garantie de vos systèmes critiques en production",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: t.stats_coverage || "Couverture active",
      value: t.stats_coverage_value || "100%",
      description: t.stats_coverage_desc || "Tous les actifs informatiques monitorés 24/7 sans interruption",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
      {/* High-tech background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <Container className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {language === "en" ? "Performance Metrics" : "Indicateurs de Performance"}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            {t.stats_section_title || "Our Commitment to Excellence"}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {language === "en" 
              ? "Measurable objectives, continuously tracked to ensure your security posture remains uncompromised." 
              : "Des objectifs mesurables et suivis en continu pour garantir une posture de sécurité sans faille."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-slate-800/50 transition-all duration-500"
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>
              
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 group-hover:w-24 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-blue-100 dark:border-blue-800/30">
                  {metric.icon}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {metric.value}
                  </p>
                  <Acronym
                    term="SLA"
                    titleKey="glossary_sla_title"
                    descKey="glossary_sla_desc"
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
                  />
                </div>

                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  {metric.label}
                </h4>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {metric.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {language === "en" ? "Live tracking" : "Suivi en direct"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 lg:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" aria-hidden />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                {language === "en"
                  ? "Want a security assessment tailored to you?"
                  : "Une évaluation sécurité sur mesure ?"}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                {language === "en"
                  ? "Clear, prioritized actions with SLAs that match your reality."
                  : "Actions claires et priorisées avec des SLA adaptés à votre réalité."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/20"
              >
                {language === "en" ? "Request a Free Audit" : "Demander un audit gratuit"}
                <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <p className="font-semibold text-slate-700 dark:text-slate-300">{language === "en" ? "Avg. response < 2h" : "Réponse moyenne < 2h"}</p>
                <p>{language === "en" ? "Evidence-ready reports included" : "Rapports prêts pour audit"}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
