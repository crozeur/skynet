const fs = require("fs");
let html = fs.readFileSync("src/components/Services.tsx", "utf8");

const t_search = `<p className="text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">`;
const t_repl = `<p className="text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed tracking-wide">`;

const t_b_search = `<ul className="space-y-3">
                        {blocks.bullets.map((b) => (
                          <li key={b} className="flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">`;
const t_b_repl = `<ul className="space-y-4">
                        {blocks.bullets.map((b) => (
                          <li key={b} className="flex gap-4 text-[15px] font-medium text-slate-700 dark:text-slate-300 items-start">`;

html = html.replace(t_search, t_repl);
html = html.replace(t_b_search, t_b_repl);

// Fix bullet point styling (color and size)
const bullet_search = `<div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />`;
const bullet_repl = `<div className="mt-2 h-2 w-2 flex-shrink-0 rounded-sm bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] rotate-45" />`;

html = html.replace(bullet_search, bullet_repl);
html = html.replace(bullet_search, bullet_repl);

fs.writeFileSync("src/components/Services.tsx", html);
console.log("Success");

