/**
 * Translation service for blog articles
 * Uses Google Translate API via RapidAPI (free tier available)
 * Falls back to client-side browser API if needed
 */

import type { PostMetadata } from "@/lib/blog";

interface TranslationCache {
  [key: string]: string;
}

const cache: TranslationCache = {};

// Improve French translation quality
function improveTranslationQuality(text: string, lang: string): string {
  if (lang !== "fr") return text;
  const terms: Record<string, string> = {
    "threat detection": "détection des menaces",
    "threat": "menace",
    "incident response": "réponse aux incidents",
    "security audit": "audit de sécurité",
    "cybersecurity": "cybersécurité",
    "vulnerability": "vulnérabilité",
    "compliance": "conformité",
    "monitoring": "surveillance",
    "ransomware": "ransomware",
    "critical": "critique",
  };
  let result = text;
  Object.entries(terms).forEach(([en, fr]) => {
    result = result.replace(new RegExp(`\\b${en}\\b`, "gi"), fr);
  });
  return result;
}

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en" || !text || text.trim().length === 0) return text;

  const cacheKey = `${text.substring(0, 100)}_${targetLang}`;

  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang === "fr" ? "fr" : targetLang}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        let translatedText = data.responseData.translatedText;
        translatedText = improveTranslationQuality(translatedText, targetLang);
        cache[cacheKey] = translatedText;
        return translatedText;
      }
    }

    return text;
  } catch (error) {
    console.warn("Translation error:", error);
    return text;
  }
}

/**
 * Translate HTML content while preserving tags
 */
export async function translateHtmlContent(
  html: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en" || !html) return html;

  // Split into text and tags
  const parts = html.split(/(<[^>]+>)/);
  const translated = await Promise.all(
    parts.map(async (part) => {
      // If it's a tag or empty, return as-is
      if (part.startsWith("<") || !part.trim()) {
        return part;
      }
      // Translate text
      return await translateText(part, targetLang);
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
