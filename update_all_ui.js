const fs = require('fs');

function replaceInFile(path, search, replace) {
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(search, replace);
  fs.writeFileSync(path, c);
}

// 1. BlogPostClient
replaceInFile('src/components/BlogPostClient.tsx', 
  /rounded-full text-xs font-semibold text-white bg-gradient-to-r \$\{pillarColors\[metadata\.pillar\]\} shadow-md ring-1 ring-inset \$\{pillarRings\[metadata\.pillar\]\} mb-1/,
  'rounded-sm text-xs font-bold tracking-[0.2em] font-mono text-slate-800 dark:text-white uppercase bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.15)] px-4 py-2 mb-1 flex items-center gap-3 relative before:content-[""] before:w-2 before:h-2 before:bg-blue-500 before:rotate-45 before:animate-pulse'
);

replaceInFile('src/components/BlogPostClient.tsx',
  /<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-\[1\.2\] mb-6">/,
  '<h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-white tracking-tight leading-[1.05] uppercase mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">'
);

// 2. Cta.tsx
replaceInFile('src/components/Cta.tsx',
  /rounded-\[2\.5rem\] border border-slate-200\/80 dark:border-cyan-500\/20 bg-white\/90 dark:bg-slate-900\/60 backdrop-blur-2xl shadow-xl shadow-slate-200\/50 dark:shadow-cyan-900\/20/,
  'rounded-none border border-slate-200 dark:border-blue-900/50 bg-white/95 dark:bg-[#0B1120]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden'
);

replaceInFile('src/components/Cta.tsx',
  /<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">/,
  '<h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-white uppercase tracking-tight mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">'
);

// 3. Navbar.tsx
if(fs.existsSync('src/components/Navbar.tsx')){
  replaceInFile('src/components/Navbar.tsx',
    /bg-white\/80 dark:bg-gray-900\/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/,
    'bg-white/90 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-blue-900/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]'
  );
}

// 4. AuditForm.tsx
if(fs.existsSync('src/components/AuditForm.tsx')){
  replaceInFile('src/components/AuditForm.tsx',
    /bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl/,
    'bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-blue-900/50 rounded-sm shadow-[0_0_30px_rgba(59,130,246,0.1)]'
  );
  replaceInFile('src/components/AuditForm.tsx',
    /font-bold text-gray-900 dark:text-white/,
    'font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-blue-100 dark:to-white uppercase tracking-tight'
  );
}

console.log('done modifying files');