import type { PostMetadata } from "@/lib/blog";

// Small, opinionated set of post-edits to make FR strings sound natural in IT/SecOps.
// Goal: fix common literal translations (e.g., "locataire" for M365 tenant) and normalize product names/acronyms.

type ReplaceRule = {
  pattern: RegExp;
  replace: string;
};

const ACRONYM_RULES: ReplaceRule[] = [
  { pattern: /\bsoc\b/gi, replace: "SOC" },
  { pattern: /\bsiem\b/gi, replace: "SIEM" },
  { pattern: /\bm365\b/gi, replace: "Microsoft 365" },
  { pattern: /\baws\b/gi, replace: "AWS" },
  { pattern: /\bazure\b/gi, replace: "Azure" },
  { pattern: /\bgcp\b/gi, replace: "GCP" },
  { pattern: /\biam\b/gi, replace: "IAM" },
  { pattern: /\bmfa\b/gi, replace: "MFA" },
];

const PRODUCT_RULES: ReplaceRule[] = [
  // Microsoft naming
  { pattern: /\bOffice\s*365\b/gi, replace: "Microsoft 365" },
  { pattern: /\bBureau\s*365\b/gi, replace: "Microsoft 365" },
  { pattern: /\bMicrosoft\s*365\s*(?:locataire|tenant)\b/gi, replace: "tenant Microsoft 365" },

  // Tenant: Google often uses "locataire" which is wrong in IT French.
  { pattern: /\blocataire\b/gi, replace: "tenant" },
];

const SECURITY_TERMS_RULES: ReplaceRule[] = [
  // Keep common IT terms as used by practitioners
  { pattern: /\bplaybook\b/gi, replace: "playbook" },
  { pattern: /\brunbook\b/gi, replace: "runbook" },
  { pattern: /\bworkflow\b/gi, replace: "workflow" },

  // Fix a few common awkward translations we’ve seen in the wild
  { pattern: /\bmalveillance\b/gi, replace: "malware" },
  { pattern: /\bterminal\b/gi, replace: "endpoint" },

  // Cutover in cloud migration context
  { pattern: /\bcoupure\b/gi, replace: "bascule" },
];

const PHRASE_RULES: ReplaceRule[] = [
  // Prefer more standard IT phrasing
  { pattern: /\br[ée]ponse\s+aux?\s+incident\b/gi, replace: "réponse aux incidents" },
  { pattern: /\btriage\s+d['’]?alertes\b/gi, replace: "triage des alertes" },
  { pattern: /\bfeuille\s+de\s+route\s+de\s+rem[ée]diation\b/gi, replace: "feuille de route de remédiation" },
];

function applyRules(input: string, rules: ReplaceRule[]): string {
  let out = input;
  for (const rule of rules) out = out.replace(rule.pattern, rule.replace);
  return out;
}

export function polishFrenchITText(text: string | null | undefined): string {
  const raw = String(text ?? "");
  if (!raw.trim()) return raw;

  // Order matters: products/acronyms first, then term-level edits, then phrase-level tweaks.
  let out = raw;
  out = applyRules(out, PRODUCT_RULES);
  out = applyRules(out, ACRONYM_RULES);
  out = applyRules(out, SECURITY_TERMS_RULES);
  out = applyRules(out, PHRASE_RULES);

  // Light cleanup: avoid double spaces introduced by replacements.
  out = out.replace(/\s{2,}/g, " ");

  return out;
}

export function polishFrenchITMetadata(meta: Partial<PostMetadata>): Partial<PostMetadata> {
  return {
    ...meta,
    title: meta.title ? polishFrenchITText(meta.title) : meta.title,
    description: meta.description ? polishFrenchITText(meta.description) : meta.description,
    coverAlt: meta.coverAlt ? polishFrenchITText(meta.coverAlt) : meta.coverAlt,
    tags: Array.isArray(meta.tags) ? meta.tags.map((t) => polishFrenchITText(t)) : meta.tags,
  };
}
