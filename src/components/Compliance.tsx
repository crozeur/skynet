"use client";

import { Container } from "@/components/Container";
import { useLanguage } from "./LanguageProvider";

export const Compliance = () => {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Conformité & Sécurité",
      subtitle: "Réglementations",
      intro:
        "ISO 27001, NIS2, GDPR : des contrôles concrets sont exigés. Ne pas s'y conformer expose à des sanctions et fragilise la résilience de l'organisation.",
      risksTitle: "Risques",
      risks: [
        {
          title: "Amendes lourdes et suspension d'activité",
          desc: "Contrôles et sanctions financières, arrêt temporaire des activités critiques, notifications aux régulateurs.",
        },
        {
          title: "Perte de données critiques, coûts élevés",
          desc: "Exfiltration, rançongiciel, restauration lente, mobilisation d'équipes et prestataires en urgence.",
        },
        {
          title: "Réputation et confiance fragilisées",
          desc: "Perte de contrats, audits clients plus intrusifs, exposition médiatique et pression des partenaires.",
        },
      ],
      helpTitle: "Notre Approche",
      help: [
        {
          title: "Audit & identification des failles",
          desc: "Cartographie des risques techniques et organisationnels, priorisation et quick wins à 30/60/90 jours.",
        },
        {
          title: "Exécution IA avec preuves traçables",
          desc: "Détection, journalisation et réponse documentée, dossiers de preuve pour audits et contrôles.",
        },
        {
          title: "Plan d'actions et préparation ISO",
          desc: "Playbooks, politiques, plans de remédiation et accompagnement jusqu'à la certification ou l'attestation.",
        },
      ],
      conclusion:
        "Nous sécurisons vos systèmes, produisons les preuves attendues et réduisons les risques de sanction.",
      cta: "Audit de sécurité gratuit disponible",
    },
    en: {
      title: "Compliance & Security",
      subtitle: "Regulations",
      intro:
        "ISO 27001, NIS2, GDPR: concrete controls are required. Non-compliance leads to sanctions and weak resilience.",
      risksTitle: "Risks",
      risks: [
        {
          title: "Heavy fines and business suspension",
          desc: "Financial penalties, regulator notifications, temporary shutdown of critical operations.",
        },
        {
          title: "Critical data loss, high costs",
          desc: "Exfiltration, ransomware, slow restoration, emergency mobilization of teams and vendors.",
        },
        {
          title: "Damaged reputation and trust",
          desc: "Lost deals, tougher customer audits, media exposure, and partner pressure.",
        },
      ],
      helpTitle: "Our Approach",
      help: [
        {
          title: "Audit & gap identification",
          desc: "Risk map across technical and organizational controls, priority list with 30/60/90-day wins.",
        },
        {
          title: "AI Execution with traceable evidence",
          desc: "Detection, logging, and documented response with audit-ready evidence for regulators.",
        },
        {
          title: "Action plan & ISO preparation",
          desc: "Playbooks, policies, remediation tracks, and guidance through certification or attestation.",
        },
      ],
      conclusion:
        "We secure your systems, produce the required evidence, and lower sanction risk.",
      cta: "Free security audit available",
    },
  };

  const t = content[language];

  return (
    <Container className="py-10 lg:py-14">
      <div className="relative mx-auto max-w-4xl animate-[fadeInUp_0.6s_ease-out]">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-4 h-28 w-80 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" aria-hidden />
        </div>
        <div className="rounded-2xl border border-gray-200/80 dark:border-blue-900/70 bg-white/70 dark:bg-slate-950/55 px-6 py-7 lg:px-10 lg:py-9 text-center backdrop-blur-sm shadow-[0_18px_70px_-45px_rgba(30,64,175,0.7)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-800/80 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 text-xs font-bold tracking-[0.18em] uppercase text-blue-700 dark:text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            {t.subtitle}
          </div>
          <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white">
            {t.title}
          </h2>
          <div className="mx-auto mt-5 h-[2px] w-28 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 lg:mt-12">
        <div className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-blue-900/70 bg-white/95 dark:bg-slate-950/90 backdrop-blur shadow-[0_30px_95px_-45px_rgba(15,23,42,0.9)] animate-[fadeInUp_0.8s_ease-out] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_34px_110px_-45px_rgba(15,23,42,1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-500/8 to-cyan-500/10 dark:from-blue-500/14 dark:via-indigo-500/10 dark:to-cyan-500/14" aria-hidden />
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-500/16 blur-3xl transition-transform duration-700 group-hover:scale-110" aria-hidden />
          <div className="absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-cyan-400/16 blur-3xl transition-transform duration-700 group-hover:scale-110" aria-hidden />

          <div className="relative px-6 py-8 lg:px-10 lg:py-12 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                ISO 27001 · NIS2 · GDPR
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-200/95 font-medium">
                {t.intro}
              </span>
            </div>

            <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_1fr]">
              {/* Risks */}
              <div className="rounded-2xl border border-gray-200 dark:border-rose-900/70 bg-white dark:bg-slate-900/90 p-6 lg:p-7 shadow-[0_18px_60px_-45px_rgba(220,38,38,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-45px_rgba(220,38,38,0.58)]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-200 font-bold">
                    ⚠️
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.risksTitle}</h3>
                </div>
                <ul className="space-y-4">
                  {t.risks.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1">
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-100 text-sm font-bold">
                        ✗
                      </span>
                        <div>
                          <p className="text-base font-semibold text-gray-900 dark:text-white leading-snug">{risk.title}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{risk.desc}</p>
                        </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Approach */}
              <div className="rounded-2xl border border-gray-200 dark:border-emerald-900/70 bg-white dark:bg-slate-900/90 p-6 lg:p-7 shadow-[0_18px_60px_-45px_rgba(16,185,129,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_70px_-45px_rgba(16,185,129,0.58)]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 font-bold">
                    ✓
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t.helpTitle}</h3>
                </div>
                <ul className="space-y-4">
                  {t.help.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 transition-transform duration-300 hover:translate-x-1">
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-100 text-sm font-bold">
                        ✓
                      </span>
                        <div>
                          <p className="text-base font-semibold text-gray-900 dark:text-white leading-snug">{item.title}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{item.desc}</p>
                        </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-2xl border border-blue-200/70 dark:border-blue-700/70 bg-blue-50/90 dark:bg-blue-950/50 transition-all duration-300 hover:border-blue-300/80 dark:hover:border-blue-600/80">
              <div className="text-gray-900 dark:text-white text-lg font-semibold">
                {t.conclusion}
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block text-sm font-medium text-blue-700 dark:text-blue-200">
                  {t.cta}
                </span>
                <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
