"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";
import { ServerIcon, ShieldCheckIcon, CubeTransparentIcon, CpuChipIcon } from "@heroicons/react/24/outline";

export const TechEngine = () => {
  const { language } = useLanguage();

  const isEn = language === "en";

  const title = isEn ? "Powered by OpenClaw™ Technology" : "Propulsé par la technologie OpenClaw™";
  const subtitle = isEn ? "The Next Generation of Managed Security" : "La Nouvelle Génération de la Cybersécurité Gérée";
  const description = isEn 
    ? "Unlike traditional consulting firms that rely solely on costly manual labor, Skynet Consulting leverages algorithmic orchestration to deliver military-grade security at scale. Our centralized intelligence executes through highly secured, ephemeral environments."
    : "Contrairement aux SSII traditionnelles reposant sur du temps-homme coûteux, Skynet Consulting s'appuie sur une orchestration algorithmique pour délivrer une sécurité de niveau militaire à grande échelle. Notre intelligence centrale s'exécute via des environnements éphémères hautement sécurisés.";

  const features = [
    {
      icon: CubeTransparentIcon,
      title: isEn ? "Ephemeral VMs (Zero-Trust)" : "VMs Éphémères (Zero-Trust)",
      desc: isEn 
        ? "Each client mission operates in an isolated, temporary infrastructure built dynamically and completely destroyed post-mission. Zero data overlap, total privacy."
        : "Chaque mission client est isolée dans une infrastructure temporaire, détruite à l'issue de l'intervention. Aucun chevauchement de données, confidentialité totale."
    },
    {
      icon: CpuChipIcon,
      title: isEn ? "Algorithmic Orchestration" : "Orchestration Algorithmique",
      desc: isEn
        ? "Our proprietary AI engine coordinates highly trained operators with strict read-only parameters, eliminating human error and ensuring consistent execution."
        : "Notre moteur IA exclusif coordonne des opérateurs formés sous des paramètres 'read-only' stricts, éliminant l'erreur humaine et garantissant une exécution parfaite."
    },
    {
      icon: ShieldCheckIcon,
      title: isEn ? "Military-Grade IP Protection" : "Protection IP Militaire",
      desc: isEn
        ? "Powered by binary compilation and temporal TOTP tokens, our toolkits are heavily guarded. The architecture guarantees zero destructive actions on client infrastructure."
        : "Sécurisés par compilation binaire et tokens temporels TOTP, nos outils sont inviolables. L'architecture garantit l'impossibilité d'effectuer des tests destructifs chez le client."
    },
    {
      icon: ServerIcon,
      title: isEn ? "Seamless Scalability" : "Scalabilité Infinie",
      desc: isEn
        ? "We separate central expertise from field execution. This decoupled model allows us to deliver high-end SOC and compliance audits with unprecedented velocity."
        : "Nous séparons l'expertise centrale de l'exécution terrain. Ce modèle découplé nous permet de livrer des SOC et audits haut de gamme avec une rapidité sans précédent."
    }
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-slate-900 border-t border-b border-cyan-900/50 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15),transparent_50%)]" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-900/40 border border-cyan-800/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-widest">
                Our Engine
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
              {title}
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {description}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl backdrop-blur-sm hover:bg-slate-800 transition-colors">
                  <feat.icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-white font-bold mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual/Diagram */}
          <div className="relative h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center p-8 group">
             {/* Glowing lines */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>
             
             {/* A mock structure of OpenClaw pushing to Ephemeral VMs */}
             <div className="relative w-full h-full flex flex-col justify-between items-center z-10">
                {/* Central AI Host */}
                <div className="p-4 bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col items-center">
                  <CpuChipIcon className="w-10 h-10 text-cyan-400 mb-2" />
                  <div className="text-white font-bold font-mono text-sm tracking-widest">OPENCLAW™ CORE</div>
                </div>

                {/* Connecting Lines */}
                <div className="flex-grow w-px border-l-2 border-dashed border-cyan-800 relative">
                   <div className="absolute top-0 left-[-2px] w-1 h-8 bg-cyan-400 animate-[bounce_3s_infinite]"></div>
                </div>

                {/* Ephemeral Instances */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  {[1,2,3].map((val) => (
                    <div key={val} className="p-4 bg-slate-900 border border-slate-700 rounded-xl relative group-hover:border-blue-500/50 transition-colors duration-500 flex flex-col items-center justify-center text-center">
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <CubeTransparentIcon className="w-6 h-6 text-slate-400 mb-2 group-hover:text-blue-400 transition-colors" />
                      <div className="text-white font-mono text-[10px] uppercase">Client VM 0{val}</div>
                      <div className="text-slate-500 text-[9px] uppercase mt-1">TTL: 24hrs</div>
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
