export type LanguageCode = "en" | "fr" | (string & {});

const TOPIC_LABELS: Record<string, { en: string; fr: string }> = {
  "SOC Setup": { en: "SOC Setup", fr: "Mise en place du SOC" },
  "Alert Triage": { en: "Alert Triage", fr: "Triage des alertes" },
  "Escalation & Comms": { en: "Escalation & Comms", fr: "Escalade & communication" },
  "Noise Reduction": { en: "Noise Reduction", fr: "Réduction du bruit" },
  "Incident Response": { en: "Incident Response", fr: "Réponse aux incidents" },
  "Reporting & KPIs": { en: "Reporting & KPIs", fr: "Reporting & KPI" },

  "Audit Checklists": { en: "Audit Checklists", fr: "Checklists d'audit" },
  "Evidence Collection": { en: "Evidence Collection", fr: "Collecte d'éléments de preuve" },
  "SaaS/Vendor Review": { en: "SaaS/Vendor Review", fr: "Revue SaaS & fournisseurs" },
  "Remediation Roadmap": { en: "Remediation Roadmap", fr: "Feuille de route de remédiation" },
  "Risk Prioritization": { en: "Risk Prioritization", fr: "Priorisation des risques" },

  "Cloud Foundations": { en: "Cloud Foundations", fr: "Fondations cloud" },
  "Misconfigurations": { en: "Misconfigurations", fr: "Erreurs de configuration" },
  "Migration Delivery": { en: "Migration Delivery", fr: "Exécution des migrations" },
  "Planning & Waves": { en: "Planning & Waves", fr: "Planification & vagues" },
  "Hypercare & Stabilization": { en: "Hypercare & Stabilization", fr: "Hypercare & stabilisation" },
};

export function getTopicLabel(topic: string | null | undefined, language: LanguageCode): string {
  const raw = String(topic ?? "").trim();
  if (!raw) return "";
  const entry = TOPIC_LABELS[raw];
  if (!entry) return raw;
  return language === "fr" ? entry.fr : entry.en;
}
