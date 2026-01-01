/**
 * Advanced article translation with improved quality
 * Uses a hybrid approach: Professional dictionary + LibreTranslate API
 */

import type { PostMetadata } from "@/lib/blog";

interface TranslationCache {
  [key: string]: string;
}

const cache: TranslationCache = {};

/**
 * Professional French tech/security glossary
 */
const frenchGlossary: Record<string, string> = {
  // Core security terms
  "cybersecurity": "cybersécurité",
  "threat": "menace",
  "threat detection": "détection des menaces",
  "threat response": "réponse aux menaces",
  "incident": "incident",
  "incident response": "réponse aux incidents",
  "security": "sécurité",
  "security audit": "audit de sécurité",
  "audit": "audit",
  "vulnerability": "vulnérabilité",
  "vulnerability assessment": "évaluation des vulnérabilités",
  "attack": "attaque",
  "attacker": "attaquant",
  "breach": "violation",
  "data breach": "fuite de données",
  
  // Monitoring & Detection
  "monitoring": "surveillance",
  "detection": "détection",
  "alert": "alerte",
  "log": "journal",
  "logging": "journalisation",
  "soc": "soc",
  "siem": "siem",
  "idr": "idr",
  
  // Threats
  "ransomware": "ransomware",
  "malware": "malware",
  "trojan": "cheval de Troie",
  "phishing": "hameçonnage",
  "ddos": "ddos",
  "lateral movement": "mouvement latéral",
  
  // Compliance & Governance
  "compliance": "conformité",
  "gdpr": "rgpd",
  "iso": "iso",
  "framework": "cadre",
  "policy": "politique",
  "governance": "gouvernance",
  
  // Response & Recovery
  "response": "réponse",
  "recovery": "récupération",
  "backup": "sauvegarde",
  "restore": "restauration",
  "playbook": "playbook",
  
  // Infrastructure
  "infrastructure": "infrastructure",
  "server": "serveur",
  "network": "réseau",
  "firewall": "pare-feu",
  "endpoint": "terminal",
  "cloud": "cloud",
  
  // Assessment & Analysis
  "assessment": "évaluation",
  "analysis": "analyse",
  "report": "rapport",
  "checklist": "checklist",
  "review": "revue",
  "posture": "posture",
  
  // Other important terms
  "critical": "critique",
  "high": "élevé",
  "medium": "moyen",
  "low": "faible",
  "risk": "risque",
  "impact": "impact",
  "mitigation": "atténuation",
  "control": "contrôle",
};

/**
 * Apply professional glossary to text
 */
function applyGlossary(text: string): string {
  let result = text;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = Object.entries(frenchGlossary).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [en, fr] of sortedTerms) {
    // Case-insensitive word boundary replacement
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    result = result.replace(regex, fr);
  }

  return result;
}

/**
 * Translate text using backend API (which tries multiple services)
 */
export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en" || !text || text.trim().length === 0) return text;

  const cacheKey = `${text.substring(0, 100)}_${targetLang}`;

  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    // Call our backend API which tries multiple translation services
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLang: targetLang === "fr" ? "fr" : targetLang,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.translated && data.translated.trim()) {
        cache[cacheKey] = data.translated;
        return data.translated;
      }
    }

    // Fallback: Return original text if translation fails
    cache[cacheKey] = text;
    return text;
  } catch (error) {
    console.warn("Translation API call failed:", error);
    // Return original text on error
    return text;
  }
}

/**
 * Split HTML into chunks while preserving tags
 */
function splitHtmlIntoChunks(html: string): Array<{ text: string; isTag: boolean }> {
  const chunks: Array<{ text: string; isTag: boolean }> = [];
  const regex = /(<[^>]+>)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const text = html.substring(lastIndex, match.index);
      if (text.trim()) {
        chunks.push({ text, isTag: false });
      } else if (text) {
        chunks.push({ text, isTag: true });
      }
    }

    chunks.push({ text: match[0], isTag: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    const text = html.substring(lastIndex);
    if (text.trim()) {
      chunks.push({ text, isTag: false });
    } else if (text) {
      chunks.push({ text, isTag: true });
    }
  }

  return chunks;
}

/**
 * Translate HTML content while preserving tags
 */
export async function translateHtmlContent(
  html: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en" || !html) return html;

  const chunks = splitHtmlIntoChunks(html);
  
  // Translate all chunks in parallel for better performance
  const translated = await Promise.all(
    chunks.map(async (chunk) => {
      if (chunk.isTag || !chunk.text.trim()) {
        return chunk.text;
      }
      return await translateText(chunk.text, targetLang);
    })
  );

  return translated.join("");
}

/**
 * Translate article metadata
 */
export async function translateArticleMetadata(
  metadata: PostMetadata,
  targetLang: string
): Promise<PostMetadata> {
  if (targetLang === "en") return metadata;

  const translated: PostMetadata = { ...metadata };

  try {
    if (metadata.title) {
      translated.title = await translateText(metadata.title, targetLang);
    }

    if (metadata.description) {
      translated.description = await translateText(metadata.description, targetLang);
    }

    if (metadata.tags && Array.isArray(metadata.tags)) {
      translated.tags = await Promise.all(
        metadata.tags.map((tag: string) => translateText(tag, targetLang))
      );
    }

    if (metadata.coverAlt) {
      translated.coverAlt = await translateText(metadata.coverAlt, targetLang);
    }
  } catch (error) {
    console.warn("Metadata translation error:", error);
  }

  return translated;
}

/**
 * UI strings with full translations
 */
export const uiStrings: Record<string, Record<string, string>> = {
  en: {
    "Back to Blog": "Back to Blog",
    "min read": "min read",
    "Contents": "Contents",
    "Copy link": "Copy link",
    "Link copied!": "Link copied!",
    "Share": "Share",
    "Found this article valuable?": "Found this article valuable?",
    "Share it with your network": "Share it with your network",
    "Download the Cybersecurity Checklist": "Download the Cybersecurity Checklist",
    "Leave your email to receive our practical checklist to strengthen your cyber posture.": "Leave your email to receive our practical checklist to strengthen your cyber posture.",
    "Get the Checklist": "Get the Checklist",
  },
  fr: {
    "Back to Blog": "Retour au blog",
    "min read": "min de lecture",
    "Contents": "Sommaire",
    "Copy link": "Copier le lien",
    "Link copied!": "Lien copié !",
    "Share": "Partager",
    "Found this article valuable?": "Cet article vous a-t-il été utile ?",
    "Share it with your network": "Partagez-le avec votre réseau",
    "Download the Cybersecurity Checklist": "Télécharger la checklist cybersécurité",
    "Leave your email to receive our practical checklist to strengthen your cyber posture.": "Laissez votre email pour recevoir notre checklist pratique afin de renforcer votre posture cybersécurité.",
    "Get the Checklist": "Obtenir la checklist",
  },
};

/**
 * Get UI string for language
 */
export function getUIString(key: string, language: string): string {
  if (language === "en") return key;
  return uiStrings[language]?.[key] ?? key;
}
