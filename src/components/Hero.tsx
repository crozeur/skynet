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
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-sm border border-slate-200/80 dark:border-blue-900/30 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-[fadeInUp_0.4s_ease-out]">
            <div className="h-2 w-2 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rotate-45 animate-pulse"></div>
            <span className="text-xs sm:text-sm font-bold font-mono tracking-[0.2em] text-slate-800 dark:text-blue-300 uppercase">
              {heroTag}
            </span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-white animate-[fadeInUp_0.6s_ease-out] drop-shadow-[0_0_15px_rgba(255,255,255,0.08)] uppercase break-words relative">
              <span className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 blur-2xl rounded-full opacity-0 dark:opacity-60 -z-10"></span> 
            {heroTitle}
          </h1>
          <p className="mt-5 sm:mt-6 text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl mx-auto animate-[fadeInUp_0.8s_ease-out] font-semibold tracking-wide border-x-2 border-blue-500/20 px-4">
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
                              : "Plateforme Cyberdéfense Augmentée par l'IA"}
                          </span>
                        </span>
                      )}
                    </p>
                    {idx === 0 && (
                      <p className="md:hidden mt-1 text-xs text-gray-600 dark:text-blue-100/80">
                        {language === "en"
                          ? "Powered by our Security Operations Center"
                          : "Piloté par notre moteur d'IA propriétaire"}
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

          {/* Right: Technical Terminal / Interactive block */}
          <div className="animate-[fadeInUp_0.75s_ease-out_0.1s_backwards] h-full flex flex-col pt-10 lg:pt-0 lg:ml-10">    
              {/* Terminal Window */}
              <div className="relative w-full rounded-sm overflow-hidden bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-blue-900/40 shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)] dark:shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)]">
                
                {/* Terminal Header */}
                <div className="flex items-center px-4 py-3 bg-slate-200/50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-blue-900/40">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                   </div>
                   <div className="mx-auto text-xs font-mono text-slate-500 flex items-center gap-2">
                     <svg className="w-3 h-3 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                     skynet-console
                   </div>
                </div>

                {/* Terminal Body */}
                <div className="p-5 font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 h-[260px] sm:h-[300px] overflow-hidden relative">
                   <div className="space-y-2.5 opacity-90">
                      <div className="text-blue-600 dark:text-cyan-400">skynet@console:~$ <span className="text-slate-900 dark:text-white">start_engagement --client enterprise</span></div>
                      <div className="text-slate-500">[2026-03] Initializing secure analysis environment... <span className="text-emerald-600 dark:text-emerald-400">[OK]</span></div>
                      <div className="text-slate-500">[2026-03] Loading detection signatures &amp; AI models...</div>
                      <div className="text-slate-600 dark:text-slate-400">Applying security baseline... <span className="text-emerald-600 dark:text-emerald-400">Validated</span></div>
                      <div className="text-slate-600 dark:text-slate-400">Running surface analysis... <span className="text-emerald-600 dark:text-emerald-400">Active</span></div>
                      <div className="text-blue-600 dark:text-cyan-400">skynet@console:~$ <span className="text-slate-900 dark:text-white">analyze --scope full --report</span></div>
                      <div className="text-amber-600 dark:text-yellow-400">[ALERT] Exposure detected — severity: HIGH</div>
                      <div className="text-emerald-600 dark:text-emerald-400">[DONE] Assessment complete. Report ready for delivery.</div>
                      <div className="text-blue-600 dark:text-cyan-400 mt-2 flex items-center">
                        skynet@console:~$ <span className="w-2 h-4 bg-blue-600 dark:bg-cyan-400 ml-2 animate-pulse"></span>
                      </div>
                   </div>
                   
                   {/* Gradient fade out at bottom */}
                   <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-50 dark:from-[#0B1120] to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Call to action boxes */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
                <a
                  href="https://calendly.com/skynet-consulting-dz/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto relative group inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all outline-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -ml-4 w-1/4"></div>
                  {language === "en" ? "Demand an Assessment" : "Réserver un Audit Rapide"}
                </a>
                
                <a 
                  href="#services-overview"
                  className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-white font-bold text-sm shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  {language === "en" ? "Discover the Engine" : "Découvrir la Plateforme"}
                </a>
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


