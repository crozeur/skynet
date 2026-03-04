const fs = require("fs");
let html = fs.readFileSync("src/components/Services.tsx", "utf8");

// Change the Challenge block
const c_search = `<p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">`;
const c_repl = `<p className="text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed tracking-wide">`;

const c_b_search = `<ul className="mt-5 space-y-3">
                        {blocks.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">`;
const c_b_repl = `<ul className="mt-6 space-y-4">
                        {blocks.bullets.map((b) => (
                          <li key={b} className="flex gap-4 text-[15px] font-medium text-slate-700 dark:text-slate-300 items-start">`;

html = html.replace(c_search, c_repl);
html = html.replace(c_b_search, c_b_repl);

const c_bullet_search = `<div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />`;
const c_bullet_repl = `<div className="mt-2 h-2 w-2 flex-shrink-0 rounded-sm bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)] rotate-45" />`;

html = html.replace(c_bullet_search, c_bullet_repl);

fs.writeFileSync("src/components/Services.tsx", html);
console.log("Success2");

