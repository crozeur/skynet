const fs = require('fs');

const heroFile = 'src/components/Hero.tsx';
let content = fs.readFileSync(heroFile, 'utf8');

const startTag = '{/* Right: form card */}';
const targetStart = content.indexOf(startTag);

if (targetStart === -1) {
  console.log('Start tag not found.');
  process.exit(1);
}

// Find the corresponding closing div for the right column. 
// It ends just before "{/* Scroll hint - guide users to navigation */}"
const endTag = '{/* Scroll hint - guide users to navigation */}';
const targetEnd = content.indexOf(endTag);

if (targetEnd === -1) {
  console.log('End tag not found.');
  process.exit(1);
}

const newRightColumn = `{/* Right: Technical Terminal / Interactive block */}
          <div className="animate-[fadeInUp_0.75s_ease-out_0.1s_backwards] h-full flex flex-col pt-10 lg:pt-0 lg:ml-10">    
              {/* Terminal Window */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_0_50px_-12px_rgba(6,182,212,0.25)]">
                
                {/* Terminal Header */}
                <div className="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                   </div>
                   <div className="mx-auto text-xs font-mono text-slate-500 flex items-center gap-2">
                     <svg className="w-3 h-3 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
                     openclaw-core-v3.2
                   </div>
                </div>

                {/* Terminal Body */}
                <div className="p-5 font-mono text-sm leading-relaxed text-slate-300 h-[260px] sm:h-[300px] overflow-hidden relative">
                   <div className="space-y-2.5 opacity-90">
                      <div className="text-cyan-400">skynet@orchestrator:~$ <span className="text-white">init_mission --target enterprise</span></div>
                      <div className="text-slate-500">[2026-03] Booting ephemeral infrastructure...</div>
                      <div className="text-slate-500">[2026-03] Provisioning zero-trust VMs... <span className="text-emerald-400/80">[OK]</span></div>
                      <div className="text-slate-400">Loading AI playbooks: <span className="text-emerald-400 font-bold">Read-Only Enforced</span></div>
                      <div className="text-slate-400">Deploying scan agents... <span className="text-emerald-400">Success</span></div>
                      <div className="text-cyan-400 mt-4">skynet@orchestrator:~$ <span className="text-white">run_audit --deep</span></div>
                      <div className="text-yellow-400">[WARN] Critical vulnerability detected (CVE-2025-XXXX)</div>
                      <div className="text-emerald-400 mt-2 font-bold">[SUCCESS] Perimeter secured. 12 vulnerabilities mapped.</div>
                      <div className="text-cyan-400 mt-2 flex items-center">
                        skynet@orchestrator:~$ <span className="w-2 h-4 bg-cyan-400 ml-2 animate-pulse"></span>
                      </div>
                   </div>
                   
                   {/* Gradient fade out at bottom */}
                   <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Call to action boxes */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
                <a
                  href="https://calendly.com/skynet-consulting-dz/30min" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto relative group inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all outline-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 -skew-x-12 -ml-4 w-1/4"></div>
                  {language === "en" ? "Demand an Assessment" : "Demander un Diagnostic"}
                </a>
                
                <a 
                  href="#services-overview"
                  className="w-full sm:w-auto group inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-white font-bold text-sm shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  {language === "en" ? "Discover the Engine" : "Découvrir le Moteur"}
                </a>
              </div>
          </div>
        </div>

        `;

content = content.substring(0, targetStart) + newRightColumn + content.substring(targetEnd);

fs.writeFileSync(heroFile, content);
console.log('Updated Hero!');