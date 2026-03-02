"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";
import { 
  ShieldCheckIcon, 
  GlobeAltIcon, 
  CommandLineIcon, 
  PresentationChartLineIcon 
} from "@heroicons/react/24/outline";

export const About = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const expertiseItems = [
    {
      title: language === "en" ? "Global Reach, Local Impact" : "Portée Mondiale, Impact Local",
      bullets: language === "en"
        ? ["Global threat intelligence spanning multiple jurisdictions", "Seamless compliance across international frameworks (DORA, NIS2)"]
        : ["Renseignement sur les menaces à l'échelle internationale", "Conformité fluide aux cadres réglementaires (DORA, NIS2)"],
      icon: GlobeAltIcon,
      colorClasses: "from-blue-500 to-indigo-600",
    },
    {
      title: language === "en" ? "Engineering Excellence" : "Excellence en Ingénierie",
      bullets: language === "en"
        ? ["Zero-trust architectures implemented by default", "Automation-first approach to all security operations"]
        : ["Architectures Zero-Trust implémentées par défaut", "Approche orientée automatisation (Automation-first)"],
      icon: CommandLineIcon,
      colorClasses: "from-cyan-400 to-blue-500",
    },
    {
      title: language === "en" ? "Strategic Alignment" : "Alignement Stratégique",
      bullets: language === "en"
        ? ["Cybersecurity tailored to your specific business drivers", "Clear tactical roadmaps with measurable ROI and milestones"]
        : ["Cybersécurité calibrée sur vos enjeux d'affaires", "Feuilles de route tactiques avec jalons et ROI mesurables"],
      icon: PresentationChartLineIcon,
      colorClasses: "from-indigo-500 to-purple-500",
    },
    {
      title: language === "en" ? "Uncompromising Quality" : "Exigence Sans Compromis",
      bullets: language === "en"
        ? ["Offensive and defensive playbooks tested against real-world APTs", "Audit-ready reporting and highly transparent metrics"]
        : ["Playbooks testés face aux menaces avancées (APT) réelles", "Rapports précis, métriques transparentes et prêts pour l'audit"],
      icon: ShieldCheckIcon,
      colorClasses: "from-blue-600 to-cyan-500",
    },
  ];

  return (
    <Container className="pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center animate-[fadeInUp_0.6s_ease-out]">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-x-0 -inset-y-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 blur-3xl opacity-20 dark:opacity-30 rounded-full"></div>
              <h2 className="relative text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-cyan-300 dark:to-blue-100 tracking-tight">
                {language === "en" ? "Your Global Cyber Partner" : "Votre Partenaire Cybersécurité"}
              </h2>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              {language === "en" 
                ? "Securing organizations worldwide with battle-tested expertise, elite engineering, and relentless innovation."
                : "Sécuriser les organisations à l'échelle mondiale avec une expertise éprouvée, une ingénierie d'élite et une innovation constante."}
            </p>
          </div>
        </div>

        {/* Expertise Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {expertiseItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 lg:p-10 shadow-lg shadow-slate-200/50 dark:shadow-[0_8px_30px_-15px_rgba(0,0,0,0.8)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-[fadeInUp_0.7s_ease-out_backwards]"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-cyan-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none transform translate-y-[-50%] translate-x-[50%] group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                  
                  <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.colorClasses} p-[2px] shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-500`}>
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                        <Icon className="h-7 w-7 text-transparent drop-shadow-sm select-none" style={{ stroke: 'url(#gradient-' + index + ')' }} />
                        <svg width="0" height="0" className="absolute">
                          <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop stopColor={item.colorClasses.includes('cyan') ? '#06b6d4' : '#3b82f6'} offset="0%" />
                            <stop stopColor={item.colorClasses.includes('indigo') ? '#4f46e5' : '#0ea5e9'} offset="100%" />
                          </linearGradient>
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 dark:group-hover:from-cyan-400 dark:group-hover:to-blue-400 transition-all duration-300">
                        {item.title}
                      </h4>
                      <ul className="space-y-3">
                        {item.bullets.map((line, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm lg:text-base text-gray-600 dark:text-gray-300">
                            <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                            <span className="leading-relaxed">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conclusion */}
        <div className="animate-[fadeInUp_0.8s_ease-out_0.6s_backwards] max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
            <div className="relative bg-white/90 dark:bg-[#0b101d]/95 backdrop-blur-3xl p-10 lg:p-14 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-[0_40px_100px_-40px_rgba(14,165,233,0.3)] text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 mix-blend-screen"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner mb-8">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-3 rounded-xl shadow-lg shadow-blue-900/40">
                    <ShieldCheckIcon className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-slate-700 dark:from-white dark:to-slate-300 mb-6">
                  {language === "en" ? "Ready to secure your future?" : "Prêt à sécuriser votre avenir ?"}
                </h3>
                
                <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed font-light">
                  {language === "en"
                    ? "Join the organizations worldwide that trust Skynet Consulting for their most critical cybersecurity operations."
                    : "Rejoignez les organisations du monde entier qui font confiance à Skynet Consulting pour leurs opérations de cybersécurité les plus critiques."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

