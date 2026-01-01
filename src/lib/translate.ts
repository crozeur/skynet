/**
 * Translation service for blog articles
 * Uses Google Translate API via RapidAPI (free tier available)
 * Falls back to client-side browser API if needed
 */

import type { PostMetadata } from "@/lib/blog";

const TRANSLATE_API_URL = "https://api.mymemory.translated.net/get";

interface TranslationCache {
  [key: string]: string;
}

const cache: TranslationCache = {};

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en") return text;

  const cacheKey = `${text.substring(0, 50)}_${targetLang}`;

  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    // Use MyMemory Translation API (free, no key required)
    const response = await fetch(
      `${TRANSLATE_API_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang.toUpperCase()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.warn("Translation API error, returning original text");
      return text;
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      const translatedText = data.responseData.translatedText;
      cache[cacheKey] = translatedText;
      return translatedText;
    }

    return text;
  } catch (error) {
    console.warn("Translation failed, returning original text", error);
    return text;
  }
}

/**
 * Translate HTML content while preserving tags
 * Splits content into text nodes and HTML tags, translates only text
 */
export async function translateHtmlContent(
  html: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en") return html;

  // Split HTML into tokens (tags and text)
  const tokens = html.split(/(<[^>]+>)/);

  const translatedTokens = await Promise.all(
    tokens.map(async (token) => {
      // Skip HTML tags and empty strings
      if (token.startsWith("<") || !token.trim()) {
        return token;
      }

      // Translate text content
      return await translateText(token, targetLang);
    })
  );

  return translatedTokens.join("");
}

/**
 * Translate article title and metadata
 */
export async function translateArticleMetadata(
  metadata: PostMetadata,
  targetLang: string
): Promise<PostMetadata> {
  if (targetLang === "en") return metadata;

  const translated: PostMetadata = { ...metadata };

  // Translate key fields
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

  return translated;
}
