"use client";

import { Container } from "@/components/Container";
import { AuditForm } from "@/components/AuditForm";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

export const Hero = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const heroTitle =
    t.hero_title || "Enterprise-Grade Cybersecurity, Powered by Advanced Automation";
  const heroDesc =
    t.hero_desc ||
    "Around-the-clock threat detection and response, comprehensive audits, and strategic guidance. A holistic approach to secure, audit, and govern your cybersecurity.";
  const heroTag =
    t.audit_form_title || "Request a Free Security Audit";

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-all duration-700" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.06),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.14),transparent_35%)]" aria-hidden />

      <Container className="relative">
        <div className="text-center max-w-5xl mx-auto mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-cyan-500/10 dark:from-emerald-400/10 dark:via-blue-400/10 dark:to-cyan-400/10 backdrop-blur-sm border border-emerald-400/30 dark:border-emerald-400/20 shadow-lg shadow-emerald-500/10 animate-[fadeInUp_0.6s_ease-out] group hover:scale-105 active:scale-95 transition-all duration-300">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-emerald-700 via-blue-700 to-cyan-700 dark:from-emerald-300 dark:via-blue-300 dark:to-cyan-300 bg-clip-text text-transparent uppercase">
              {heroTag}
            </span>
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.2] sm:leading-[1.15] tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent animate-[fadeInUp_0.6s_ease-out] drop-shadow-sm break-words">
            {heroTitle}
          </h1>
          <p className="mt-5 sm:mt-4 text-base sm:text-lg lg:text-xl leading-[1.7] sm:leading-relaxed text-gray-600 dark:text-blue-100/90 max-w-4xl mx-auto animate-[fadeInUp_0.8s_ease-out] font-medium">
            {heroDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
          {/* Left: value props */}
          <div className="space-y-5 sm:space-y-4 animate-[fadeInUp_0.65s_ease-out]" style={{ animationFillMode: "backwards" }}>
            {[t.hero_benefit1, t.hero_benefit2, t.hero_benefit3].map((benefit, idx) => (
              <div
                key={benefit}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/50 dark:bg-gradient-to-br dark:from-white/[0.07] dark:via-blue-500/[0.03] dark:to-white/[0.07] backdrop-blur-xl px-5 py-5 sm:px-6 sm:py-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_25px_80px_-45px_rgba(0,0,0,0.55)] transition-all duration-500 hover:-translate-y-2 active:translate-y-0 hover:shadow-xl hover:shadow-slate-300/60 dark:hover:shadow-[0_30px_90px_-40px_rgba(59,130,246,0.45)] hover:border-blue-300/50 dark:hover:border-white/20 cursor-default"
                style={{ animationDelay: `${0.1 * idx}s`, animationFillMode: "backwards" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-cyan-500/[0.06] to-indigo-500/[0.08] dark:from-blue-600/12 dark:via-cyan-500/12 dark:to-indigo-600/12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" aria-hidden />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="flex-shrink-0 w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white leading-relaxed flex items-center gap-2">
                      {benefit}
                      {idx === 0 && (
                        <span className="hidden md:inline-flex items-center gap-1 text-xs text-gray-600 dark:text-blue-100/80 relative group">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" d="M12 8.5v4.2" />
                            <circle cx="12" cy="16.2" r="0.8" />
                          </svg>
                          <span className="absolute left-5 top-1 z-20 whitespace-nowrap rounded-md bg-gray-900 text-white px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            {language === "en"
                              ? "AI-Augmented Execution Platform"
                              : "Plateforme d'Exécution Augmentée par l'IA"}
                          </span>
                        </span>
                      )}
                    </p>
                    {idx === 0 && (
                      <p className="md:hidden mt-1 text-xs text-gray-600 dark:text-blue-100/80">
                        {language === "en"
                          ? "Powered by our Security Operations Center"
                          : "Propulsé par notre Cerveau IA propriétaire"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3 pt-2 animate-[fadeInUp_0.8s_ease-out]" style={{ animationFillMode: "backwards" }}>
              {["Zero-Trace VMs", "Evidence-ready reports", "Deployment < 10 days"].map((pill, idx) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800/80 dark:bg-gradient-to-r dark:from-white/10 dark:to-white/5 border border-slate-200 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-blue-100 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-default"
                  style={{ animationDelay: `${0.08 * idx}s`, animationFillMode: "backwards" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div className="animate-[fadeInUp_0.75s_ease-out_0.1s_backwards]">
              <div className="relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-gray-900/70 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-[0_28px_90px_-48px_rgba(0,0,0,0.75)] p-6 sm:p-8 lg:p-10 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300/60">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/80 via-white/60 to-slate-50/80 dark:from-blue-600/10 dark:via-cyan-500/8 dark:to-indigo-600/10" aria-hidden />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 opacity-0 hover:opacity-20 blur-2xl transition-opacity duration-700" aria-hidden />
              <div className="relative">
                <div className="flex items-start justify-between gap-3 mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {t.audit_form_title}
                    </p>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent mt-2 leading-tight">
                      {t.hero_audit_title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-blue-100/80 mt-2 leading-relaxed">
                      {t.hero_audit_desc}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30 dark:shadow-blue-500/20 hover:scale-110 transition-transform duration-300">
                    <svg aria-hidden className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 4.5v9L12 21 4.5 16.5v-9L12 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>

                <AuditForm />

                <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:from-white/[0.06] dark:via-cyan-500/[0.03] dark:to-white/[0.06] backdrop-blur-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-[fadeInUp_0.7s_ease-out] shadow-sm hover:shadow-md transition-all duration-500" style={{ animationFillMode: "backwards", animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-blue-100">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 text-blue-600 dark:text-blue-100 shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h5l2 5-3 2c1.5 2.8 3.7 5 6.5 6.5l2-3 5 2v5c0 1.1-.9 2-2 2C10.3 24 0 13.7 0 2 0 .9.9 0 2 0h5l2 5-3 2" />
                      </svg>
                    </span>
                    <div className="leading-snug space-y-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{t.hero_call_to_action}</p>
                      <p className="text-xs text-gray-500 dark:text-blue-100/70">{t.hero_call_to_action_sub}</p>
                      <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 animate-[pulseGlow_2.6s_ease-in-out_infinite]" aria-hidden />
                    </div>
                  </div>
                  <a
                    href="https://calendly.com/skynet-consulting-dz/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-sm font-bold hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 active:scale-95 transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 hover:scale-105"
                  >
                    {t.hero_schedule_call}
                    <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint - guide users to navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-[fadeInUp_1s_ease-out_0.8s_backwards] hidden md:block">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">
              {language === "en" ? "Explore sections" : "Explorez les sections"}
            </p>
            <svg className="w-5 h-5 mx-auto text-blue-500 dark:text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
};


