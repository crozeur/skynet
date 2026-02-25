"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";

export const CaseStudies = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Résultats concrets pour nos clients",
      subtitle: "Des organisations protégées, des résultats mesurables",
      cases: [
        {
          title: "Banque multinationale – Région EMEA",
          sector: "Services financiers | Audit Augmenté par l'IA",
          icon: "🏦",
          points: [
            "Une banque régionale avec 50+ agences, sans équipe de sécurité dédiée",
            "Aucune détection d'incidents en temps réel, vulnérabilités critiques non identifiées",
            "Audit de sécurité complet et migration Cloud via infrastructure éphémère",
            "Temps de détection réduit à < 2 minutes",
            "90% des attaques bloquées automatiquement",
          ],
        },
        {
          title: "Agence gouvernementale – Administration centrale",
          sector: "Secteur public | Audit & conformité",
          icon: "🏛️",
          points: [
            "Une agence gouvernementale critique avec systèmes d'information vieillissants et infrastructure distribuée",
            "Aucune visibilité sur les failles de sécurité, serveurs non patchés, risque de compromission élevé",
            "Audit technique complet + plan d'actions sur 90 jours avec priorisation selon l'impact",
            "32 vulnérabilités critiques remédiées en 3 mois, conformité réglementaire validée",
            "Formation intensive de 80+ employés, infrastructure sécurisée et modernisée",
          ],
        },
        {
          title: "Groupe industriel européen – International",
          sector: "Industrie | Services managés multi-sites",
          icon: "🏭",
          points: [
            "Groupe avec sites en Europe, Afrique du Nord et Middle East",
            "Infrastructure dispersée, incidents non détectés pendant des semaines",
            "Exécution standardisée sur tous les sites via nos playbooks IA",
            "Réduction de 40% des coûts de cybersécurité",
            "Attaque ransomware confinée en < 15 minutes",
          ],
        },
      ],
    },
    en: {
      title: "Concrete results for our clients",
      subtitle: "Protected organizations, measurable results",
      cases: [
        {
          title: "Regional Bank – 50+ Branches",
          sector: "Financial Services | AI-Augmented Audit",
          icon: "🏦",
          points: [
            "Regional bank with 50+ branches, no dedicated security team",
            "No real-time incident detection, unidentified critical vulnerabilities",
            "Comprehensive security audit and Cloud migration via ephemeral infrastructure",
            "Detection time reduced to < 2 minutes",
            "90% of attacks blocked automatically",
          ],
        },
        {
          title: "Government Ministry – Critical Infrastructure",
          sector: "Public Administration | Audit & Compliance",
          icon: "🏛️",
          points: [
            "Ministry with critical information systems, aging infrastructure",
            "No visibility on vulnerabilities, unpatched servers, high risk",
            "Complete technical audit + 90-day prioritized action plan",
            "32 critical vulnerabilities fixed in 3 months",
            "80+ employees trained, infrastructure modernized",
          ],
        },
        {
          title: "Multinational Industrial Group – Global Operations",
          sector: "Manufacturing | Multi-site Managed Services",
          icon: "🏭",
          points: [
            "Global industrial group with multiple regional sites",
            "Dispersed infrastructure, incidents undetected for weeks",
            "Standardized execution across all sites via our AI playbooks",
            "40% reduction in cybersecurity costs",
            "Ransomware attack contained in < 15 minutes",
          ],
        },
      ],
    },
  };

  const t = content[language];

  return (
    <Container className="py-16 lg:py-24 relative">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 dark:bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-blue-900/20 border border-slate-200/80 dark:border-blue-800/30 text-slate-600 dark:text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm shadow-slate-200/50">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {t.subtitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight break-words">
            {t.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:gap-10 lg:grid-cols-3">
          {t.cases.map((caseStudy, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col p-8 bg-white/90 dark:bg-slate-800/60 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-blue-900/5 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-md hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 animate-[fadeInUp_0.6s_ease-out] cursor-default overflow-hidden"
              style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: "backwards" }}
            >
              {/* Hover Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon & Title */}
              <div className="relative z-10 flex flex-col gap-5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <span className="drop-shadow-md">{caseStudy.icon}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Case {idx + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {caseStudy.title}
                  </h3>
                  <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
                    {caseStudy.sector}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative z-10 w-full h-px bg-gradient-to-r from-slate-200/50 via-slate-200 to-transparent dark:from-slate-700/50 dark:via-slate-700 dark:to-transparent mb-6"></div>

              {/* Points */}
              <ul className="relative z-10 space-y-4 flex-1">
                {caseStudy.points.map((point, pointIdx) => {
                  const isProblem = pointIdx === 0 || pointIdx === 1;
                  return (
                    <li key={pointIdx} className="flex items-start gap-3 group/item">
                      <span className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full mt-0.5 transition-transform duration-300 group-hover/item:scale-110 ${
                        isProblem 
                          ? "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400" 
                          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      }`}>
                        {isProblem ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm leading-relaxed ${
                        isProblem 
                          ? "text-slate-600 dark:text-slate-400" 
                          : "text-slate-800 dark:text-slate-200 font-medium"
                      }`}>
                        {point}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};
