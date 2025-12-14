"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

export const About = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const expertiseItems = [
    {
      title: language === "en" ? "Global Reach" : "Portée internationale",
      bullets: language === "en"
        ? ["Teams deployed across regions", "Local context built into every mission"]
        : ["Équipes présentes dans chaque région clé", "Contexte local intégré à chaque mission"],
    },
    {
      title: language === "en" ? "Innovation First" : "Innovation en priorité",
      bullets: language === "en"
        ? ["Cutting-edge stack adopted early", "Automation to reduce manual toil"]
        : ["Technologies de pointe adoptées dès leur stabilisation", "Automatisation pour limiter les tâches manuelles"],
    },
    {
      title: language === "en" ? "Tailored Solutions" : "Solutions sur mesure",
      bullets: language === "en"
        ? ["Scoping driven by your constraints", "Roadmaps with clear milestones"]
        : ["Cadrage construit sur vos contraintes", "Feuille de route jalonnée et datée"],
    },
    {
      title: language === "en" ? "Quality Standards" : "Exigence qualité",
      bullets: language === "en"
        ? ["ISO-grade processes & playbooks", "Evidence-ready reporting by default"]
        : ["Processus et playbooks alignés ISO", "Rapports exploitables et prêts pour audit"],
    },
  ];

  return (
    <Container className="pt-10 pb-14 lg:pt-14 lg:pb-18">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-[fadeInUp_0.6s_ease-out]">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 blur-2xl opacity-20"></div>
              <h2 className="relative text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-cyan-400 dark:to-white tracking-tight">
                {language === "en" ? "Your Global Partner" : "Votre Partenaire Mondial"}
              </h2>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {language === "en" 
                ? "Innovative cybersecurity solutions for organizations of all sizes, from startups to enterprises."
                : "Solutions de cybersécurité innovantes pour organisations de toutes tailles, des startups aux entreprises."}
            </p>
          </div>
        </div>

        {/* Expertise Section */}
        <div className="mb-12">
          <div className="text-center mb-5 animate-[fadeInUp_0.8s_ease-out]">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {language === "en" ? "Our Expertise" : "Notre expertise"}
            </h3>
            <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {language === "en"
                ? "Four pillars, stated simply. Skimmable and action-focused."
                : "Quatre piliers, expliqués simplement. Lisible et orienté action."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-7">
            {expertiseItems.map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/85 dark:bg-[#0e1424]/80 backdrop-blur p-6 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.75)] hover:shadow-[0_26px_80px_-40px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-1 animate-[fadeInUp_0.7s_ease-out_backwards]"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/8 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" aria-hidden />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/30">
                    <ShieldCheckIcon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                      {item.bullets.map((line, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="animate-[fadeInUp_0.8s_ease-out_0.6s_backwards]">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-100/90 via-blue-50/95 to-cyan-50/90 dark:from-blue-950/85 dark:via-slate-900/85 dark:to-blue-950/80 p-8 lg:p-12 rounded-3xl border border-blue-200 dark:border-white/10 shadow-2xl dark:shadow-[0_30px_90px_-50px_rgba(0,0,0,0.85)] overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/12 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-cyan-400/12 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-2xl shadow-blue-900/40 mb-6">
                  <ShieldCheckIcon className="h-8 w-8 text-white" />
                </div>
                
                <p className="text-lg lg:text-xl text-gray-900 dark:text-blue-50 leading-relaxed max-w-3xl mx-auto font-semibold">
                  {language === "en"
                    ? "Trusted partner for organizations worldwide seeking comprehensive cybersecurity support."
                    : "Partenaire de confiance pour organisations mondiales cherchant un soutien cybersécurité complet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
