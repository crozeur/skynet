"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const CaseStudies = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const content = {
    title: isEn ? "Real Clients, Real ROI" : "Clients réels, ROI avéré",
    subtitle: isEn ? "Transforming Risks into Measurable Results" : "Transformer le risque en résultats mesurables",
    cases: [
      {
        title: isEn ? "Multinational Bank" : "Banque multinationale",
        sector: isEn ? "Financial Services" : "Services financiers",
        icon: "🏦",
        before: isEn ? "No real-time incident detection, unidentified critical vulnerabilities in 50+ branches." : "Aucune détection d'incidents en temps réel, failles critiques ignorées sur 50+ agences.",
        after: isEn ? "AI-augmented security audit and 24/7 SOC integration via ephemeral infrastructure." : "Audit augmenté par l'IA et intégration d'un SOC 24/7 via notre infrastructure éphémère.",
        stat: "< 2 min",
        statLabel: isEn ? "Threat detection time" : "Temps de détection des menaces",
      },
      {
        title: isEn ? "Government Agency" : "Agence gouvernementale",
        sector: isEn ? "Public Sector" : "Secteur public",
        icon: "🏛️",
        before: isEn ? "Zero visibility on security flaws, unpatched servers, critical breach risk." : "Aucune visibilité sur les failles, serveurs non patchés, risque critique de compromission.",
        after: isEn ? "Complete technical audit + 90-day prioritized action plan based on threat impact." : "Audit technique complet + plan d'action sur 90 jours avec priorisation d'impact.",
        stat: "32",
        statLabel: isEn ? "Critical vulnerabilities fixed in 3 months" : "Failles critiques remédiées en 3 mois",
      },
      {
        title: isEn ? "Industrial Group" : "Groupe industriel européen",
        sector: isEn ? "Manufacturing" : "Industrie / Multi-sites",
        icon: "🏭",
        before: isEn ? "Dispersed infrastructure across regions, incidents undetected for weeks." : "Infrastructure dispersée, incidents non détectés pendant des semaines.",
        after: isEn ? "Standardized incident-response across all sites via our AI-powered playbooks." : "Réponse à incident standardisée sur tous les sites via nos playbooks IA.",
        stat: "-40%",
        statLabel: isEn ? "Reduction in global cybersecurity costs" : "Réduction des coûts globaux de sécurité",
      },
    ],
  };

  return (
    <Container className="py-20 lg:py-28 relative border-t border-slate-200/50 dark:border-slate-800/50">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 dark:bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-blue-900/20 border border-slate-200/80 dark:border-blue-800/30 text-slate-800 dark:text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm shadow-slate-200/50">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            {content.subtitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight break-words">
            {content.title}
          </h2>
        </div>

        <div className="grid gap-10 lg:gap-8 lg:grid-cols-3">
          {content.cases.map((caseStudy, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col bg-white dark:bg-slate-900/80 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:border-cyan-500/50 hover:-translate-y-2 overflow-hidden"
            >
              {/* Header Box */}
              <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden bg-slate-50 dark:bg-slate-900">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                 <div className="flex items-center justify-between relative z-10 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-2xl border border-slate-100 dark:border-slate-700">
                      {caseStudy.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                      Case 0{idx + 1}
                    </span>
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2 relative z-10">
                    {caseStudy.title}
                 </h3>
                 <p className="text-sm font-semibold text-blue-600 dark:text-cyan-500 relative z-10">
                    {caseStudy.sector}
                 </p>
              </div>

              {/* Before / After Body */}
              <div className="p-8 flex-1 flex flex-col gap-6">
                
                {/* Before */}
                <div className="flex-1 relative">
                  <div className="text-[10px] uppercase font-bold text-red-500 tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    {isEn ? "Before" : "Avant"}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {caseStudy.before}
                  </p>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                   <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <ArrowRightIcon className="w-4 h-4" />
                   </div>
                </div>

                {/* After */}
                <div className="flex-1 relative">
                  <div className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {isEn ? "The Solution" : "La Solution"}
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-300 font-medium line-clamp-3">
                    {caseStudy.after}
                  </p>
                </div>
              </div>

              {/* Huge Stat Footer */}
              <div className="p-6 bg-slate-800 dark:bg-slate-950 text-white rounded-b-[2rem] border-t border-slate-800 dark:border-cyan-900/30 group-hover:bg-slate-900 dark:group-hover:bg-slate-900 transition-colors">
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-black tracking-tight text-white dark:text-cyan-400">{caseStudy.stat}</span>
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                  {caseStudy.statLabel}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
