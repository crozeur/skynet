"use client";

export type BlogSlugIndexEntry = {
  slugEn: string;
  slugFr: string;
};

let cache: BlogSlugIndexEntry[] | null = null;
let inFlight: Promise<BlogSlugIndexEntry[]> | null = null;

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
