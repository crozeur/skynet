"use client";

export type BlogSlugIndexEntry = {
  slugEn: string;
  slugFr: string;
};

let cache: BlogSlugIndexEntry[] | null = null;
let inFlight: Promise<BlogSlugIndexEntry[]> | null = null;
let aliasesFrCache: Record<string, string> | null = null;
let aliasesFrInFlight: Promise<Record<string, string>> | null = null;

export async function getBlogSlugIndexClient(): Promise<BlogSlugIndexEntry[]> {
  if (cache) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const res = await fetch("/blog-data/_index.json", { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to load blog slug index");
    const data = (await res.json()) as BlogSlugIndexEntry[];
    cache = Array.isArray(data) ? data : [];
    return cache;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

export async function getBlogFrAliasesClient(): Promise<Record<string, string>> {
  if (aliasesFrCache) return aliasesFrCache;
  if (aliasesFrInFlight) return aliasesFrInFlight;

  aliasesFrInFlight = (async () => {
    const res = await fetch("/blog-data/_aliases_fr.json", { cache: "force-cache" });
    if (!res.ok) throw new Error("Failed to load blog FR aliases");
    const data = (await res.json()) as Record<string, string>;
    aliasesFrCache = data && typeof data === "object" ? data : {};
    return aliasesFrCache;
  })();

  try {
    return await aliasesFrInFlight;
  } finally {
    aliasesFrInFlight = null;
  }
}
