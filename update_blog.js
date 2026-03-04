const fs = require('fs');
let content = fs.readFileSync('src/components/BlogIndexClient.tsx', 'utf8');

content = content.replace(
  /<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-\[1\.1\] mb-8 tracking-tight">[\s\S]*?<\/h1>/,
  \<h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight mb-8 uppercase">
    <span className="block text-slate-900 dark:text-white mb-2">
      {language === "en" ? "Strategic" : "Cyber"}
    </span>
    <span className="block relative inline-block">
      <span className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-600/30 blur-2xl rounded-full opacity-60"></span>
      <span className="relative bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {language === "en" ? "Intelligence." : "Intelligence."}
      </span>
    </span>
  </h1>\
);

// Badge
content = content.replace(
  /<div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900\/5 dark:bg-slate-800\/50 border border-slate-200 dark:border-slate-700\/50 backdrop-blur-md shadow-sm">[\s\S]*?Renseignement & Stratégie"}\s*<\/span>\s*<\/div>/,
  \<div className="mb-8 inline-flex items-center gap-4 px-6 py-2 rounded-sm border border-slate-200/80 dark:border-blue-900/30 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <div className="h-2 w-2 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rotate-45 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-blue-300 tracking-[0.2em] uppercase">
                {language === "en" ? "Threat Intelligence" : "Veille Stratégique"}
              </span>
            </div>\
);

// Subtitle
content = content.replace(
  /<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">[\s\S]*?<\/p>/,
  \<p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-semibold tracking-wide leading-relaxed">
              {language === "en"
                ? "Actionable insights, raw intelligence, and elite architectural guidance for modern security apparatuses."
                : "Renseignement brut, analyses pointues et architecture défensive pour les infrastructures critiques."}
            </p>\
);

fs.writeFileSync('src/components/BlogIndexClient.tsx', content);
console.log('Update blog header done.');
