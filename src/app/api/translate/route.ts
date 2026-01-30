import { NextRequest, NextResponse } from "next/server";

// Professional French glossary
const frenchGlossary: Record<string, string> = {
  // Keep common acronyms / product names as-is
  "mfa": "MFA",
  "2fa": "2FA",
  "sso": "SSO",
  "iam": "IAM",
  "siem": "SIEM",
  "soc": "SOC",
  "edr": "EDR",
  "xdr": "XDR",
  "mdr": "MDR",
  "dspm": "DSPM",
  "dmarc": "DMARC",
  "dkim": "DKIM",
  "spf": "SPF",
  "cve": "CVE",
  "cisa": "CISA",
  "nist": "NIST",
  "iso": "ISO",
  "cis": "CIS",

  // Cloud / vendors
  "microsoft 365": "Microsoft 365",
  "m365": "Microsoft 365",
  "office 365": "Microsoft 365",
  "azure": "Azure",
  "azure ad": "Microsoft Entra ID",
  "entra id": "Microsoft Entra ID",
  "aws": "AWS",
  "amazon web services": "AWS",
  "gcp": "GCP",
  "google cloud": "Google Cloud",
  "cloudflare": "Cloudflare",
  "github": "GitHub",

  // Microsoft security stack
  "microsoft defender": "Microsoft Defender",
  "defender for endpoint": "Microsoft Defender for Endpoint",
  "defender for office 365": "Microsoft Defender for Office 365",
  "microsoft sentinel": "Microsoft Sentinel",
  "intune": "Intune",
  "powershell": "PowerShell",

  // Common IT/security phrases
  "identity and access management": "gestion des identités et des accès",
  "endpoint detection and response": "détection et réponse sur les terminaux",
  "security information and event management": "gestion des informations et des événements de sécurité",
  "single sign-on": "authentification unique",
  "multi-factor authentication": "authentification multifacteur",
  "conditional access": "accès conditionnel",
  "zero trust": "Zero Trust",
  "attack surface": "surface d'attaque",
  "attack chain": "chaîne d'attaque",
  "threat actor": "acteur malveillant",
  "kill chain": "kill chain",
  "lateral movement": "mouvement latéral",
  "privilege escalation": "élévation de privilèges",
  "account takeover": "prise de contrôle de compte",
  "data exfiltration": "exfiltration de données",
  "incident ticket": "ticket d'incident",
  "false positive": "faux positif",
  "true positive": "vrai positif",
  "baseline": "ligne de base",
  "hardening": "durcissement",
  "logging": "journalisation",
  "audit logs": "journaux d'audit",
  "audit trail": "piste d'audit",
  "threat hunting": "chasse aux menaces",
  "alert triage": "triage des alertes",
  "playbook": "playbook",
  "runbook": "runbook",
  "tabletop exercise": "exercice sur table",

  // Identity / auth / access wording
  "sign-in": "connexion",
  "login": "connexion",
  "failed login": "échec de connexion",
  "password reset": "réinitialisation de mot de passe",
  "session": "session",
  "sessions": "sessions",
  "token": "jeton",
  "tokens": "jetons",
  "revoke": "révoquer",
  "revocation": "révocation",
  "role": "rôle",
  "roles": "rôles",
  "role assignment": "attribution de rôles",
  "privileged": "privilégié",
  "privileged access": "accès privilégié",
  "admin": "admin",
  "administrator": "administrateur",

  // Operations wording
  "query": "requête",
  "queries": "requêtes",
  "rule": "règle",
  "rules": "règles",
  "inbox rule": "règle de boîte de réception",
  "forwarding": "transfert",
  "mailbox": "boîte mail",
  "mailbox rule": "règle de boîte mail",
  "telemetry": "télémétrie",
  "timeline": "chronologie",
  "artifact": "artefact",
  "artifacts": "artefacts",
  "root cause": "cause racine",
  "follow-on": "suite",
  "blast radius": "rayon d'impact",
  "tuning": "tuning",
  "noise": "bruit",
  "signal": "signal",

  cybersecurity: "cybersécurité",
  cybersecure: "cybersécurisé",
  "threat detection": "détection des menaces",
  "incident response": "réponse aux incidents",
  incident: "incident",
  vulnerability: "vulnérabilité",
  compliance: "conformité",
  phishing: "hameçonnage",
  ransomware: "rançongiciel",
  malware: "malveillance",
  breach: "violation",
  audit: "audit",
  monitoring: "surveillance",
  detection: "détection",
  alert: "alerte",
  endpoint: "terminal",
  network: "réseau",
  threat: "menace",
  attack: "attaque",
  response: "réponse",
  recovery: "récupération",
  backup: "sauvegarde",
  framework: "cadre",
  assessment: "évaluation",
  posture: "posture",
};

function looksLikeFrench(text: string): boolean {
  // Heuristic: avoid translating text that is already in French.
  const sample = text.slice(0, 1200).toLowerCase();
  const tokens = [
    " le ",
    " la ",
    " les ",
    " des ",
    " une ",
    " un ",
    " et ",
    " pour ",
    " avec ",
    " sur ",
    " dans ",
    " que ",
    " est ",
    " sont ",
    " d'",
    " l'",
    " sécurité",
    " alerte",
  ];

  const hits = tokens.reduce((acc, t) => acc + (sample.includes(t) ? 1 : 0), 0);
  const hasFrenchDiacritics = /[àâäçéèêëîïôöùûüÿœæ]/i.test(sample);
  return hits >= 5 || (hits >= 3 && hasFrenchDiacritics);
}

function postProcessFrenchTypography(text: string): string {
  // Conservative cleanup of common spacing artifacts.
  let out = text;
  out = out.replace(/\s+,/g, ",");
  out = out.replace(/\s+\./g, ".");
  out = out.replace(/\(\s+/g, "(");
  out = out.replace(/\s+\)/g, ")");
  out = out.replace(/([.!?])([A-Za-zÀ-ÖØ-öø-ÿ])/g, "$1 $2");
  out = out.replace(/\s{2,}/g, " ");
  return out;
}

function protectTechnicalTokens(input: string): { text: string; restore: (s: string) => string } {
  const replacements: Array<{ key: string; value: string }> = [];
  let text = input;

  // Protect URLs, emails, IPs, hashes, CVEs, Windows Event IDs, code-ish tokens
  const patterns: RegExp[] = [
    /https?:\/\/[^\s)\]]+/gi,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    /\b\d{1,3}(?:\.\d{1,3}){3}\b/g,
    /\b(?:[A-Fa-f0-9]{32}|[A-Fa-f0-9]{40}|[A-Fa-f0-9]{64})\b/g,
    /\bCVE-\d{4}-\d{4,7}\b/gi,
    /\bEvent\s*ID\s*\d{1,6}\b/gi,
    /\bKB\d{4,8}\b/gi,
    /\b[Tt]enant\s*ID\b/gi,
    /\b[A-Z]{2,10}-\d{2,}\b/g,
    /`[^`]+`/g,
  ];

  const protectMatch = (m: string) => {
    const key = `__SKY_TOK_${replacements.length}__`;
    replacements.push({ key, value: m });
    return key;
  };

  for (const re of patterns) {
    text = text.replace(re, protectMatch);
  }

  // Protect common product names / acronyms in running text (avoid weird declensions)
  const protectedLiterals = [
    "Microsoft 365",
    "Office 365",
    "Microsoft Entra ID",
    "Azure AD",
    "Azure",
    "AWS",
    "GCP",
    "Google Cloud",
    "Cloudflare",
    "GitHub",
    "PowerShell",
    "SIEM",
    "SOC",
    "EDR",
    "XDR",
    "MDR",
    "MFA",
    "2FA",
    "SSO",
    "IAM",
    "SPF",
    "DKIM",
    "DMARC",
    "NIST",
    "CIS",
    "ISO",
    "CISA",
  ].sort((a, b) => b.length - a.length);

  for (const lit of protectedLiterals) {
    const escaped = lit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "g");
    text = text.replace(re, protectMatch);
  }

  const restore = (s: string) => {
    let out = s;
    for (const { key, value } of replacements) {
      out = out.split(key).join(value);
    }
    return out;
  };

  return { text, restore };
}

async function translateWithGoogle(text: string, targetLang: string): Promise<string | null> {
  try {
    // Google Translate via gtx endpoint
    const encoded = encodeURIComponent(text);
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    
    // Google returns nested array structure
    if (Array.isArray(data) && data[0]) {
      let result = "";
      if (Array.isArray(data[0])) {
        // data[0] is array of [translated, original] pairs
        result = data[0].map((chunk: any[]) => chunk[0] || "").join("");
      }
      return result || null;
    }

    return null;
  } catch (error) {
    console.error("Google Translate error:", error);
    return null;
  }
}

function splitIntoSafeChunks(text: string, maxLen = 1800): string[] {
  if (text.length <= maxLen) return [text];

  const parts = text.split(/\n\s*\n/g);
  const chunks: string[] = [];
  let current = "";

  const flush = () => {
    if (current.trim()) chunks.push(current);
    current = "";
  };

  for (const part of parts) {
    const candidate = current ? `${current}\n\n${part}` : part;
    if (candidate.length <= maxLen) {
      current = candidate;
      continue;
    }

    flush();

    if (part.length <= maxLen) {
      current = part;
      continue;
    }

    const sentences = part.split(/(?<=[.!?])\s+/g);
    let buf = "";
    for (const s of sentences) {
      const c = buf ? `${buf} ${s}` : s;
      if (c.length <= maxLen) {
        buf = c;
      } else {
        if (buf) chunks.push(buf);
        buf = s;
      }
    }
    if (buf) chunks.push(buf);
  }

  flush();
  return chunks.length ? chunks : [text];
}

async function translatePossiblyLongText(text: string, targetLang: string): Promise<string | null> {
  const chunks = splitIntoSafeChunks(text);
  if (chunks.length === 1) return translateWithGoogle(text, targetLang);

  const translatedChunks: string[] = [];
  for (const chunk of chunks) {
    const t = await translateWithGoogle(chunk, targetLang);
    if (!t) return null;
    translatedChunks.push(t);
  }
  return translatedChunks.join("\n\n");
}

async function translateWithMyMemory(text: string, targetLang: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `en|${targetLang}`,
    });

    const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Check for quota error
    if (data.responseStatus === 429 || data.responseData?.translatedText?.includes("MYMEMORY WARNING")) {
      return null;
    }

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return null;
  } catch (error) {
    console.error("MyMemory error:", error);
    return null;
  }
}

function applyGlossary(text: string): string {
  let result = text;

  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = Object.entries(frenchGlossary).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [en, fr] of sortedTerms) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    result = result.replace(regex, fr);
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang = "fr" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid text" }, { status: 400 });
    }

    if (targetLang === "fr" && looksLikeFrench(text)) {
      return NextResponse.json({ translated: text });
    }

    // Protect technical tokens so translators don't mangle them
    const { text: protectedText, restore } = protectTechnicalTokens(text);

    // Try Google Translate first (most reliable)
    let translated = await translatePossiblyLongText(protectedText, targetLang);

    // If Google fails, try MyMemory
    if (!translated) {
      translated = await translateWithMyMemory(protectedText, targetLang);
    }

    // If both fail, use glossary only
    if (!translated) {
      translated = applyGlossary(protectedText);
    } else {
      // Apply glossary to improve translation quality
      translated = applyGlossary(translated);
    }

    // Restore protected tokens
    translated = restore(translated);

    if (targetLang === "fr") {
      translated = postProcessFrenchTypography(translated);
    }

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
