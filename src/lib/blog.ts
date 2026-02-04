"use server";

import fs from "node:fs";
import path from "node:path";

export type Pillar = "SOC" | "AUDIT" | "CLOUD";

export interface PostMetadata {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  pillar: Pillar;
  topic?: string; // Sub-category within a pillar (e.g., "Alert Triage")
  tags?: string[];
  coverImage?: string; // /img/blog/...
  coverAlt?: string;
}

export interface TranslatedMetadata {
  fr?: PostMetadata;
}

export interface PostSummary {
  slug: string;
  slugEn?: string;
  slugFr?: string;
  metadata: PostMetadata;
  translatedMetadata?: TranslatedMetadata;
  readingTimeMinutes?: number;
}

export interface PostData extends PostSummary {
  content: string; // HTML content
  translatedContent?: {
    fr?: string;
  };
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const BLOG_DATA_DIR = path.join(process.cwd(), "public", "blog-data");

function extractMetadataFromMDX(source: string): PostMetadata | null {
  // Match export const metadata = { ... };
  // Use a more robust regex that counts braces to find the matching closing brace
  const startMatch = source.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!startMatch) return null;
  
  const startIdx = startMatch.index! + startMatch[0].length - 1;
  let braceCount = 0;
  let endIdx = -1;
  
  for (let i = startIdx; i < source.length; i++) {
    if (source[i] === '{') braceCount++;
    if (source[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIdx = i;
        break;
      }
    }
  }
  
  if (endIdx === -1) return null;
  const objSource = source.substring(startIdx, endIdx + 1);
  
  try {
    // Evaluate the object literal in a sandboxed Function
    const meta = Function(`return (${objSource})`)();
    return meta as PostMetadata;
  } catch {
    return null;
  }
}

function computeReadingTimeMinutes(source: string): number {
  // Remove the metadata export block
  const cleaned = source.replace(/export\s+const\s+metadata[\s\S]*?};\s*/m, "");
  // Strip markdown code blocks and front-matter like sections
  const textOnly = cleaned
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-]+/g, " ")
    .replace(/\s+/g, " ");
  const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200; // typical reading speed
  return Math.max(1, Math.round(words / wordsPerMinute));
}

function computeReadingTimeMinutesFromHtml(html: string): number {
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

function safeReadJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getAllBlogPosts(): Promise<PostSummary[]> {
  // Prefer precompiled JSON (includes translatedMetadata and matches /blog/[slug])
  const jsonFiles = fs.existsSync(BLOG_DATA_DIR)
    ? fs.readdirSync(BLOG_DATA_DIR).filter((f) => f.endsWith(".json"))
    : [];

  if (jsonFiles.length > 0) {
    const posts: PostSummary[] = [];
    for (const file of jsonFiles.filter((f) => !f.startsWith("_"))) {
      const slug = file.replace(/\.json$/i, "");
      const fullPath = path.join(BLOG_DATA_DIR, file);
      const data = safeReadJsonFile<PostData>(fullPath);
      if (!data?.metadata) continue;
      posts.push({
        slug,
        slugEn: (data as any).slugEn || slug,
        slugFr: (data as any).slugFr || undefined,
        metadata: data.metadata,
        translatedMetadata: data.translatedMetadata,
        readingTimeMinutes: data.content
          ? computeReadingTimeMinutesFromHtml(data.content)
          : undefined,
      });
    }

    return posts.sort((a, b) => (a.metadata.date < b.metadata.date ? 1 : -1));
  }

  // Fallback: parse MDX directly (e.g., dev without running build:blog)
  const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR) : [];
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const posts: PostSummary[] = [];

  for (const file of mdxFiles) {
    const slug = file.replace(/\.mdx$/i, "");
    const fullPath = path.join(BLOG_DIR, file);
    const source = fs.readFileSync(fullPath, "utf8");
    const metadata = extractMetadataFromMDX(source);
    if (!metadata) continue;
    const readingTimeMinutes = computeReadingTimeMinutes(source);
    posts.push({ slug, metadata, readingTimeMinutes });
  }

  return posts.sort((a, b) => (a.metadata.date < b.metadata.date ? 1 : -1));
}
