"use client";

import { useLanguage } from "./LanguageProvider";

export const TrustBadges = () => {
  const { language } = useLanguage();

  const badges = [
    { text: "Zero-Trust Architecture", icon: "🛡️" },
    { text: "NIS 2 Ready", icon: "📋" },
    { text: "GDPR Compliant by Design", icon: "🇪🇺" },
    { text: "100% Data Isolation", icon: "🔒" },
    { text: "Automated Orchestration", icon: "⚡" },
  ];

  return (
        <div className="w-full bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md border-y border-slate-200/50 dark:border-slate-800/50 py-5 overflow-hidden flex relative z-20">
      <div className="absolute left-0 w-24 h-full bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 hidden md:block"></div>
      <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 hidden md:block"></div>
      
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="flex flex-wrap justify-center md:justify-between gap-6 md:gap-8 items-center">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 group">
              <span className="text-xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">{badge.icon}</span>
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase opacity-90 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors uppercase font-mono">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
