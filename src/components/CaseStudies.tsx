"use client";

import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
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
          sector: "Services financiers | SOC externalisé 24/7",
          icon: "🏦",
          points: [
            "Une banque régionale avec 50+ agences, sans équipe de sécurité dédiée",
            "Aucune détection d'incidents en temps réel, vulnérabilités critiques non identifiées",
            "Déploiement d'un SOC externalisé 24/7 avec monitoring complet et détection IA",
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
            "SOC hybride 24/7 pour tous les sites, support multilingue",
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
          title: "Regional Bank – North Africa",
          sector: "Financial Services | 24/7 Managed SOC",
          icon: "🏦",
          points: [
            "Regional bank with 50+ branches, no dedicated security team",
            "No real-time incident detection, unidentified critical vulnerabilities",
            "24/7 managed SOC deployment with full monitoring and AI detection",
            "Detection time reduced to < 2 minutes",
            "90% of attacks blocked automatically",
          ],
        },
        {
          title: "Government Ministry – Algeria",
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
          title: "European Industrial Group – International",
          sector: "Manufacturing | Multi-site Managed Services",
          icon: "🏭",
          points: [
            "Group with sites in Europe, North Africa and Middle East",
            "Dispersed infrastructure, incidents undetected for weeks",
            "24/7 hybrid SOC for all sites, multilingual support",
            "40% reduction in cybersecurity costs",
            "Ransomware attack contained in < 15 minutes",
          ],
        },
      ],
    },
  };

  const t = content[language];

  return (
    <Container className="py-10 lg:py-12">
      <SectionTitle title={t.title} preTitle={t.subtitle} />

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-3 mt-10">
        {t.cases.map((caseStudy, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col p-7 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98] active:shadow-xl transition-all duration-400 animate-[fadeInUp_0.6s_ease-out] cursor-default"
            style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: "backwards" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" />
            {/* Icon & Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 dark:from-blue-900/40 dark:via-cyan-900/40 dark:to-blue-800/40 flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform duration-300">
                {caseStudy.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {caseStudy.title}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {caseStudy.sector}
                </p>
              </div>
            </div>

            {/* Points */}
            <ul className="space-y-3 flex-1">
              {caseStudy.points.map((point, pointIdx) => (
                <li key={pointIdx} className="flex items-start gap-2">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/40 dark:text-blue-300 mt-0.5">
                    {pointIdx === 0 || pointIdx === 1 ? "•" : "✓"}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
};
