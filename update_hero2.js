const fs = require('fs');
let c = fs.readFileSync('src/components/Hero.tsx', 'utf8');

c = c.replace(
  /<div className="text-center max-w-5xl mx-auto mb-12 lg:mb-14">[\s\S]*?<h1 className="mt-6 text-3xl/,
  `<div className="text-center max-w-5xl mx-auto mb-12 lg:mb-14">\n            <div className="inline-flex items-center gap-4 px-6 py-2 rounded-sm border border-slate-200/80 dark:border-blue-900/30 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl shadou-[0_0_15px_rgba(59,130,246,0.15)] animate-[fadeInUp_0.4s_ease-out]">\n              <div className="h-2 w-2 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rotate-45 animate-pulse"></div>\n              <span className="text-xs sm:text-sm font-bold font-mono tracking-[0.2em] text-slate-800 dark:text-blue-300 uppercase">\n                {heroTag}\n              </span>\n            </div>\n            <h1 className="mt-6 text-3xl`\n);

c = c.replace(
  /<h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-\[1.2\] sm:leading-\1.15\] tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-blue-50 dark:to-white bg-clip-text text-transparent animate-\fadeInUp_0.6s_ease-out\] drop-shadow-sm break-words">/,
  `<h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-white animate-[fadeInUp_0.6s_ease-out] drop-shadow-[0_0_15px_rgba(255,255,255,0.08)] uppercase break-words relative">\n              <span className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-blue-600/20 blur-2xl rounded-full opacity-0 dark:opacity-60 -z-10"></span>`
);

c = c.replace(
  /<p className="mt-5 sm:mt-4 text-base sm:text-lg lg:text-xl leading-\[1.7\] sm:leading-relaxed text-gray-600 dark:text-blue-100/90 max-w-4xl mx-auto animate-\[fadeInUp_0.8s_ease-out\] font-medium">/,
  `<p className="mt-5 sm:mt-6 text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 dark:text-slate-300 max-w-3xl mx-auto animate-[fadeInUp_0.8s_ease-out] font-semibold tracking-wide border-x-2 border-blue-500/20 px-4">`
);

fs.writeFileSync('src/components/Hero.tsx', c);

console.log('dome');