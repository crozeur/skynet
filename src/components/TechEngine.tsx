"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";
import { ServerIcon, ShieldCheckIcon, CubeTransparentIcon, CpuChipIcon } from "@heroicons/react/24/outline";

export const TechEngine = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const title = isEn ? "Technology Built for the Enterprise" : "Une Technologie conçue pour l'Entreprise";
  const subtitle = isEn ? "The Next Generation of Managed Security" : "La Nouvelle Génération de la Cybersécurité Gérée";
  const description = isEn
    ? "Unlike traditional consulting firms that rely solely on costly manual labor, Skynet Consulting has engineered a proprietary delivery model that combines AI-driven intelligence with a rigorous operational framework — delivering enterprise-grade security at unprecedented speed and scale."
    : "Contrairement aux cabinets traditionnels qui reposent sur du temps-homme coûteux, Skynet Consulting a développé un modèle de livraison propriétaire alliant intelligence artificielle et rigueur opérationnelle — pour délivrer une sécurité de niveau entreprise à une vitesse et une échelle inégalées.";

  const features = [
    {
      icon: CubeTransparentIcon,
      title: isEn ? "Total Client Data Isolation" : "Isolation Totale des Données Client",
      desc: isEn
        ? "Each engagement operates within a fully isolated environment, scoped exclusively to the client in scope. Once the mission concludes, all associated data is permanently and verifiably destroyed."
        : "Chaque mission opère dans un environnement strictement dédié au client concerné. À la clôture de l'intervention, toutes les données associées sont détruites de manière permanente et vérifiable.",
    },
    {
      icon: CpuChipIcon,
      title: isEn ? "AI-Driven Security Intelligence" : "Intelligence de Sécurité Pilotée par l'IA",
      desc: isEn
        ? "Our proprietary platform continuously correlates threat signals, automates analysis workflows, and surfaces actionable insights — reducing the response timeline from weeks to hours."
        : "Notre plateforme propriétaire corrèle en continu les signaux de menace, automatise les workflows d'analyse et produit des recommandations actionnables — réduisant le délai de réponse de semaines à quelques heures.",
    },
    {
      icon: ShieldCheckIcon,
      title: isEn ? "Guaranteed IP & Tool Protection" : "Protection Garantie de la PI & des Outils",
      desc: isEn
        ? "Our proprietary tooling is protected through layered access controls and exclusive licensing mechanisms. No third party can replicate, extract, or leverage our methodologies without authorization."
        : "Nos outils propriétaires sont protégés par des contrôles d'accès multicouches et des mécanismes de licence exclusifs. Aucun tiers ne peut reproduire, extraire ou exploiter nos méthodologies sans autorisation.",
    },
    {
      icon: ServerIcon,
      title: isEn ? "Speed & Scalability by Design" : "Rapidité & Scalabilité par Conception",
      desc: isEn
        ? "Our operational model decouples strategic expertise from field execution, allowing us to deploy expert-level security operations simultaneously across multiple clients, geographies, and regulatory environments."
        : "Notre modèle opérationnel dissocie l'expertise stratégique de l'exécution terrain, nous permettant de déployer des opérations de sécurité de haut niveau simultanément sur plusieurs clients, géographies et environnements réglementaires.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-slate-900 border-t border-b border-cyan-900/50 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_50%)]" aria-hidden="true"></div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-900/40 border border-cyan-800/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">
                {isEn ? "Our Platform" : "Notre Plateforme"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              {description}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl backdrop-blur-sm hover:bg-slate-800 hover:border-cyan-900/50 transition-colors group">
                  <feat.icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual: Abstract Platform Architecture */}
          <div className="relative h-[480px] lg:h-[560px] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center p-8 group">
            {/* Glowing center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative w-full h-full flex flex-col justify-between items-center z-10">

              {/* Central Platform Hub */}
              <div className="p-5 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center w-full max-w-xs mx-auto">
                <CpuChipIcon className="w-10 h-10 text-cyan-400 mb-2" />
                <div className="text-white font-bold font-mono text-sm tracking-widest text-center">
                  {isEn ? "SKYNET SECURITY PLATFORM" : "PLATEFORME SKYNET"}
                </div>
                <div className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-widest">
                  AI · Autonomous · Scalable
                </div>
              </div>

              {/* Connecting line */}
              <div className="flex-grow w-px border-l-2 border-dashed border-cyan-800/60 relative">
                <div className="absolute top-0 left-[-2px] w-1 h-8 bg-cyan-400 animate-[bounce_3s_infinite]"></div>
              </div>

              {/* Client Engagement Nodes */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {[
                  { label: isEn ? "Audit" : "Audit", color: "border-blue-500/40" },
                  { label: isEn ? "SOC" : "SOC", color: "border-cyan-500/40" },
                  { label: isEn ? "Compliance" : "Conformité", color: "border-indigo-500/40" },
                ].map((node, i) => (
                  <div key={i} className={`p-4 bg-slate-900 border ${node.color} rounded-xl flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform duration-300`}>
                    <ShieldCheckIcon className="w-6 h-6 text-slate-400 mb-2" />
                    <div className="text-white font-mono text-[11px] uppercase tracking-wider">{node.label}</div>
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
