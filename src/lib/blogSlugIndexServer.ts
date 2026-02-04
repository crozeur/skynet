import fs from "node:fs";
import path from "node:path";

export type BlogSlugIndexEntry = {
  slugEn: string;
  slugFr: string;
};

const INDEX_PATH = path.join(process.cwd(), "public", "blog-data", "_index.json");
const ALIASES_FR_PATH = path.join(process.cwd(), "public", "blog-data", "_aliases_fr.json");

let cache: BlogSlugIndexEntry[] | null = null;
let aliasesFrCache: Record<string, string> | null = null;

export function getBlogSlugIndexServer(): BlogSlugIndexEntry[] {
  if (cache) return cache;
  try {
    if (!fs.existsSync(INDEX_PATH)) {
      cache = [];
      return cache;
    }
    const raw = fs.readFileSync(INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed) ? (parsed as BlogSlugIndexEntry[]) : [];
    return cache;
  } catch {
    cache = [];
    return cache;
  }
}

export function getBlogFrAliasesServer(): Record<string, string> {
  if (aliasesFrCache) return aliasesFrCache;
  try {
    if (!fs.existsSync(ALIASES_FR_PATH)) {
      aliasesFrCache = {};
      return aliasesFrCache;
    }
    const raw = fs.readFileSync(ALIASES_FR_PATH, "utf8");
    const parsed = JSON.parse(raw);
    aliasesFrCache = parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
    return aliasesFrCache;
  } catch {
    aliasesFrCache = {};
    return aliasesFrCache;
  }
}

export function resolveBlogSlugToEn(lang: "en" | "fr", slug: string): string | null {
  const clean = String(slug || "").trim();
  if (!clean) return null;
  if (lang === "en") return clean;

  const aliases = getBlogFrAliasesServer();
  const viaAliases = aliases[clean];
  if (viaAliases) return viaAliases;

  const index = getBlogSlugIndexServer();
  const match = index.find((e) => e.slugFr === clean);
  return match?.slugEn ?? null;
}

export function getBlogSlugForLang(slugEn: string, lang: "en" | "fr"): string {
  const clean = String(slugEn || "").trim();
  if (!clean) return clean;
  if (lang === "en") return clean;

  const index = getBlogSlugIndexServer();
  const match = index.find((e) => e.slugEn === clean);
  return match?.slugFr ?? clean;
}
