const fs = require("fs");
let html = fs.readFileSync("src/components/About.tsx", "utf8");

const fromString = "<div className=\"mb-16 text-center animate-[fadeInUp_0.6s_ease-out]\">";
const toString = "        {/* Expertise Section */}";

const startIdx = html.indexOf(fromString);
const endIdx = html.indexOf(toString);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `        <div className="mb-24 text-center animate-[fadeInUp_0.8s_ease-out]">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-50 dark:bg-slate-900 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] mb-10 group hover:border-blue-500/40 transition-colors">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
            <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-[0.2em] uppercase font-mono">
              {language === "en" ? "Boutique Cyber Firm" : "Cabinet d\\"Ingénierie Cyber"}
            </span>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-indigo-600/10 dark:from-blue-600/20 dark:via-cyan-500/20 dark:to-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <h2 className="relative text-4xl md:text-6xl lg:text-[4.5rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 dark:from-white dark:via-slate-100 dark:to-slate-400 tracking-tight leading-[1.1] mb-10 pb-2">
              {language === "en" ? "Engineering Defensive Supremacy" : "L\\"Ingénierie de la Suprématie Défensive"}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto relative mt-8">
            <div className="absolute left-0 top-0 w-16 h-[3px] bg-gradient-to-r from-blue-600 dark:from-blue-400 to-transparent rounded-full"></div>
            <div className="absolute right-0 bottom-0 w-16 h-[3px] bg-gradient-to-l from-cyan-500 dark:from-cyan-400 to-transparent rounded-full"></div>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-light border-l-2 border-blue-500/30 pl-6 md:pl-8 text-left py-2 md:text-justify lg:text-center lg:border-l-0 lg:pl-0">
              {language === "en"
                ? "We do not just consult. We architect, build, and run resilient cyber operations for organizations that cannot afford a breach. Elite tactical engineering meets strategic alignment."
                : "Nous ne faisons pas que conseiller. Nous concevons, construisons et pilotons des opérations cyber résilientes pour les organisations qui ne peuvent se permettre la moindre faille. L\\"ingénierie tactique d\\"élite au service de votre stratégie."
              }
            </p>
          </div>
        </div>\n`;

  const newHtml = html.substring(0, startIdx) + replacement + html.substring(endIdx);
  fs.writeFileSync("src/components/About.tsx", newHtml);
  console.log("Success");
} else {
  console.log("Could not find delimiters");
}
