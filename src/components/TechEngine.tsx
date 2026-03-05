"use client";

import { useState } from "react";
import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";
import { ServerIcon, ShieldCheckIcon, CubeTransparentIcon, CpuChipIcon } from "@heroicons/react/24/outline";

export const TechEngine = () => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [isPulseLine, setIsPulseLine] = useState(false);

  const handleNodeClick = (e: React.MouseEvent) => {
    // Declenchons seulement l'animation, sans empêcher le lien de fonctionner.
    if (isPulseLine) return;
    setIsPulseLine(true);
    setTimeout(() => {
      setIsPulseLine(false);
    }, 1000);
  };

  const title = isEn ? "Technology Built for the Enterprise" : "Ingénierie Cyber Déployée à l'Échelle";
  const subtitle = isEn ? "The Next Generation of Managed Security" : "Le Nouveau Standard du Service Managé (MSSP)";
  const description = isEn
    ? "Unlike traditional consulting firms that rely solely on costly manual labor, Skynet Consulting has engineered a proprietary delivery model that combines AI-driven intelligence with a rigorous operational framework — delivering enterprise-grade security at unprecedented speed and scale."
    : "Contrairement aux cabinets traditionnels facturant au jour-homme, Skynet Consulting a développé une plateforme d'exécution exclusive alliant analytique IA et rigueur méthodologique — pour délivrer une posture cyber premium avec une vélocité sans précédent.";

  const features = [
    {
      icon: CubeTransparentIcon,
      title: isEn ? "Total Client Data Isolation" : "Isolation Native et Zéro-Trace",
      desc: isEn
        ? "Each engagement operates within a fully isolated environment, scoped exclusively to the client in scope. Once the mission concludes, all associated data is permanently and verifiably destroyed."
        : "Chaque mission s'opère dans une Clean Room (VM) strictement isolée sur le périmètre client. En fin d'intervention, l'infrastructure est détruite, garantissant l'absence de traces (Zéro Data Leakage).",
    },
    {
      icon: CpuChipIcon,
      title: isEn ? "AI-Driven Security Intelligence" : "Intelligence Cyber augmentée à l'IA",
      desc: isEn
        ? "Our proprietary platform continuously correlates threat signals, automates analysis workflows, and surfaces actionable insights — reducing the response timeline from weeks to hours."
        : "Notre plateforme corrèle en continu les TTPs (Tactiques, Techniques et Procédures) et automatise les workflows d'analyse pour produire des actions concrètes (Remediation) en quelques heures plutôt qu'en semaines.",
    },
    {
      icon: ShieldCheckIcon,
      title: isEn ? "Guaranteed IP & Tool Protection" : "Protection Garantie et Résilience",
      desc: isEn
        ? "Our proprietary tooling is protected through layered access controls and exclusive licensing mechanisms. No third party can replicate, extract, or leverage our methodologies without authorization."
        : "Nos outils d'audit sont protégés par du contrôle d'accès multicouches (RBAC) pour s'assurer que seules les équipes légitimement affectées à votre environnement puissent manipuler vos données.",
    },
    {
      icon: ServerIcon,
      title: isEn ? "Speed & Scalability by Design" : "Scalabilité et Exécution Massive",
      desc: isEn
        ? "Our operational model decouples strategic expertise from field execution, allowing us to deploy expert-level security operations simultaneously across multiple clients, geographies, and regulatory environments."
        : "Notre modèle dissocie l'expertise stratégique de la phase d'exécution à grande échelle, nous permettant de garantir le même niveau élevé de prestation technique, peu importe la complexité ou la taille du SI.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-cyan-900/50 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_50%)]" aria-hidden="true"></div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-100/50 dark:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold font-mono text-cyan-700 dark:text-cyan-300 uppercase tracking-widest">
                {isEn ? "Our Platform" : "Notre Plateforme"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
              {description}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-900/50 dark:border-cyan-900/50 transition-colors group">
                  <feat.icon className="w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-slate-900 dark:text-white font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual: Abstract Platform Architecture */}
          <div className="relative h-[480px] lg:h-[560px] w-full rounded-3xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-center p-8 group">
            {/* Glowing center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative w-full h-full flex flex-col justify-between items-center z-10">

              {/* Central Platform Hub */}
              <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-cyan-300 dark:border-cyan-500/40 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col items-center w-full max-w-xs mx-auto">
                <CpuChipIcon className="w-10 h-10 text-cyan-600 dark:text-cyan-400 mb-2" />
                <div className="text-slate-900 dark:text-white font-bold font-mono text-sm tracking-widest text-center">
                  {isEn ? "SKYNET SECURITY PLATFORM" : "PLATEFORME SKYNET"}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px] font-mono mt-1 uppercase tracking-widest">
                  AI · Autonomous · Scalable
                </div>
              </div>

              {/* Connecting line */}
              <div className="flex-grow w-px border-l-2 border-dashed border-cyan-200 dark:border-cyan-800/60 relative">
                {/* Default bouncing trait */}
                <div 
                  className={`absolute top-0 left-[-2px] w-1 h-8 bg-cyan-500 dark:bg-cyan-400 transition-opacity duration-300 ${
                    isPulseLine ? 'opacity-0' : 'animate-[bounce_3s_infinite] opacity-100'
                  }`}
                ></div>
                {/* On-click animated beam */}
                <div 
                  className={`absolute left-[-2px] w-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] transition-all duration-700 ease-in-out ${
                    isPulseLine ? 'top-full h-24 opacity-0' : 'top-0 h-4 opacity-0'
                  }`}
                ></div>
              </div>

              {/* Client Engagement Nodes */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {[
                  { label: isEn ? "Audit" : "Audit", color: "border-blue-500/40", link: "#audit" },
                  { label: isEn ? "SOC" : "SOC", color: "border-cyan-300 dark:border-cyan-500/40", link: "#soc" },
                  { label: isEn ? "Cloud" : "Cloud", color: "border-indigo-500/40", link: "#cloud" },
                ].map((node, i) => (
                  <a href={node.link} key={i} onClick={handleNodeClick} className={`p-4 bg-slate-50 dark:bg-slate-900 border ${node.color} rounded-xl flex flex-col items-center justify-center text-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-cyan-500/20 hover:border-cyan-400 group/node`}>
                    <ShieldCheckIcon className="w-6 h-6 text-slate-600 dark:text-slate-400 mb-2 group-hover/node:text-cyan-400 transition-colors" />
                    <div className="text-slate-900 dark:text-white font-mono text-[11px] uppercase tracking-wider group-hover/node:font-bold">{node.label}</div>
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 group-hover/node:animate-ping group-hover/node:bg-cyan-400"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
