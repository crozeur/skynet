"use server";

import fs from "node:fs";
import path from "node:path";

export type Pillar = "SOC" | "AUDIT" | "CLOUD";

export interface PostMetadata {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  pillar: Pillar;
  tags?: string[];
  coverImage?: string; // /img/blog/...
}

export interface PostSummary {
  slug: string;
  metadata: PostMetadata;
  readingTimeMinutes?: number;
}

export interface PostData extends PostSummary {
  Content: React.ComponentType<any>;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function extractMetadataFromMDX(source: string): PostMetadata | null {
  const match = source.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})/);
  if (!match) return null;
  const objSource = match[1];
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

export async function getAllBlogPosts(): Promise<PostSummary[]> {
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
