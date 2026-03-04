const fs = require('fs');
let c = fs.readFileSync('src/components/Hero.tsx', 'utf8');

c = c.replace(/<div className="text-center max-w-5xl mx-auto mb-12 lg:mb-14">[\s\S]*?<h1 className="mt-6/, `<div className="text-center max-w-5xl mx-auto mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-sm border border-slate-200/80 dark:border-blue-900/30 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-[fadeInUp_0.4s_ease-out]">
            <div className="h-2 w-2 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rotate-45 animate-pulse"></div>
            <span className="text-xs sm:text-sm font-bold font-mono tracking-[0.2em] text-slate-800 dark:text-blue-300 uppercase">
              {heroTag}
            </span>
          </div>
          <h1 className="mt-6`);

fs.writeFileSync('src/components/Hero.tsx', c);
console.log('done');