const fs = require('fs');

function replaceInFile(path, replacerArray) {
    if (!fs.existsSync(path)) return;
    let c = fs.readFileSync(path, 'utf8');
    let original = c;
    for (const [search, replace] of replacerArray) {
        c = c.replace(search, replace);
    }
    if (c !== original) {
        fs.writeFileSync(path, c);
        console.log(`Updated ${path}`);
    }
}

// 1. Optimize Navbar (shrink logo, clean up mobile menu)
replaceInFile('src/components/Navbar.tsx', [
    // Shrink logo on mobile
    [
        /className="h-20 w-auto sm:h-24 md:h-28 lg:h-32 hover:opacity-90/g,
        'className="h-12 w-auto sm:h-16 md:h-20 lg:h-24 hover:opacity-90'
    ],
    // Consolidate mobile actions into one tight row
    [
        /<div className="md:hidden flex flex-col items-end gap-1">[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/,
        `<div className="md:hidden flex items-center justify-end gap-2 pr-1">
            <ThemeChanger />
            <LanguageSwitcher />
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center p-2 rounded-sm text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 focus:outline-none"
            >
              {open ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>`
    ],
    // Clean up mobile menu links background
    [
        /className=\{`md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800/,
        'className={`md:hidden bg-white dark:bg-[#0B1120] border-t border-slate-200 dark:border-blue-900/40'
    ]
]);

// 2. Optimize Hero text sizes and mobile padding
replaceInFile('src/components/Hero.tsx', [
    [
        /className="relative overflow-hidden py-16 sm:py-20 lg:py-24"/,
        'className="relative overflow-hidden py-10 sm:py-16 lg:py-24"'
    ],
    [
        /text-4xl sm:text-5xl lg:text-5xl xl:text-6xl/,
        'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
    ],
    [
        /padding on terminal block/,
        '' // just a note 
    ],
    [
        /className="animate-\[fadeInUp_0\.75s_ease-out_0\.1s_backwards\] h-full flex flex-col pt-10 lg:pt-0 lg:ml-10"/,
        'className="animate-[fadeInUp_0.75s_ease-out_0.1s_backwards] h-full flex flex-col mt-8 lg:mt-0 lg:ml-10"'
    ],
    [
        /mb-12 lg:mb-14/,
        'mb-8 lg:mb-14'
    ]
]);

// 3. Optimize Container component (global padding might be too wide on standard)
replaceInFile('src/components/Container.tsx', [
    // Ensure padding is standard
    [
        /className={`w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 \$\{className \|\| ""\}`}/,
        'className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className || ""}`}'
    ] // px-5 is a bit weird, px-4 is standard tailwind mobile
]);

// 4. Optimize Footer
replaceInFile('src/components/Footer.tsx', [
    [
        /py-12 sm:py-16 lg:py-24/,
        'py-8 sm:py-12 lg:py-16' // Save space on mobile
    ],
    [
        /h-16 w-auto mb-6/,
        'h-12 w-auto mb-4' // Scale down logo in footer too
    ]
]);

// 5. Optimize CTA wrapper
replaceInFile('src/components/Cta.tsx', [
    [
        /p-10 lg:p-16/g,
        'p-6 sm:p-10 lg:p-16' // Bring padding down for mobile
    ],
    [
        /text-4xl lg:text-5xl/,
        'text-3xl lg:text-5xl' // Reduce title size on mobile
    ]
]);

// 6. Optimize BlogPostClient header & img
replaceInFile('src/components/BlogPostClient.tsx', [
    [
        /text-3xl sm:text-5xl md:text-6xl font-black/,
        'text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black'
    ]
]);

console.log('done');