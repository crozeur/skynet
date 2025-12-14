"use client";

import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export const Stats = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const metrics = [
    {
      label: t.stats_threats || "Menaces détectées",
      value: t.stats_threats_value || "2,847",
      description: t.stats_threats_desc || "Attaques, anomalies et tentatives d'intrusion bloquées ce mois",
      icon: "🛡️",
    },
    {
      label: t.stats_response_time || "Temps de réponse",
      value: t.stats_response_value || "8m 42s",
      description: t.stats_response_desc || "Délai moyen de détection et d'intervention sur incident critique",
      icon: "⚡",
    },
    {
      label: t.stats_system_health || "Santé du système",
      value: t.stats_health_value || "99.8%",
      description: t.stats_health_desc || "Disponibilité garantie de vos systèmes critiques en production",
      icon: "📊",
    },
    {
      label: t.stats_coverage || "Couverture active",
      value: t.stats_coverage_value || "100%",
      description: t.stats_coverage_desc || "Tous les actifs informatiques monitorés 24/7 sans interruption",
      icon: "🔍",
    },
  ];

  return (
    <section className="relative overflow-hidden py-10 lg:py-12 bg-gradient-to-b from-white via-blue-50/35 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_30%_80%,rgba(99,102,241,0.12),transparent_30%)]" aria-hidden />
      <Container>
        <div className="text-center mb-16 animate-[fadeInUp_0.6s_ease-out]">
          <SectionTitle
            title={t.stats_section_title || "Skynet en un coup d'œil"}
            align="center"
          />
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{language === "en" ? "Measurable objectives, not vanity metrics." : "Des objectifs mesurables, pas d'indicateurs d'apparat."}</p>
        </div>

        <div className="relative">
          <div className="absolute inset-x-4 -top-6 bottom-6 rounded-3xl border border-blue-100/60 dark:border-blue-900/50 bg-white/30 dark:bg-white/5 blur-xl" aria-hidden />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white/90 dark:bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-7 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.55)] transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] cursor-default animate-[fadeInUp_0.6s_ease-out]"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "backwards" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-cyan-500/8 to-indigo-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-0" />
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/25 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-100/80 dark:border-blue-800/60">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      {metric.label}
                    </span>
                    <span className="text-3xl drop-shadow-sm">{metric.icon}</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                      {metric.value}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">SLA</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                    {metric.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 font-semibold">
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    {language === "en" ? "Continuously monitored" : "Surveillance continue"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-indigo-600/10 dark:from-blue-900/30 dark:via-blue-900/20 dark:to-gray-900 p-10 lg:p-12 shadow-[0_22px_70px_-40px_rgba(59,130,246,0.6)] animate-[fadeInUp_0.7s_ease-out]">
          <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-transparent to-white/10 dark:from-white/5 dark:via-white/0 dark:to-white/5 blur-2xl pointer-events-none z-0" aria-hidden />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 text-xs font-semibold text-blue-700 dark:text-blue-200 border border-blue-100/70 dark:border-blue-800/60">
                {language === "en" ? "Tailored Security Assessment" : "Évaluation sécurité sur mesure"}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {language === "en"
                  ? "Want a security assessment tailored to you?"
                  : "Une évaluation sécurité sur mesure ?"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm lg:text-base leading-relaxed">
                {language === "en"
                  ? "Clear, prioritized actions with SLAs that match your reality."
                  : "Actions claires et priorisées avec des SLA adaptés à votre réalité."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#hero"
                className="group inline-flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white font-semibold shadow-[0_18px_45px_-30px_rgba(59,130,246,0.9)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(59,130,246,0.95)] active:scale-95 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                {language === "en" ? "Request a Free Audit" : "Demander un audit gratuit"}
                <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p className="font-semibold text-gray-800 dark:text-gray-200">{language === "en" ? "Avg. response < 2h" : "Réponse moyenne < 2h"}</p>
                <p>{language === "en" ? "Evidence-ready reports included" : "Rapports prêts pour audit"}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
