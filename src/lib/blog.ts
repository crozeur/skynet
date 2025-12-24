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
}

export interface PostSummary {
  slug: string;
  metadata: PostMetadata;
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
    posts.push({ slug, metadata });
  }

  return posts.sort((a, b) => (a.metadata.date < b.metadata.date ? 1 : -1));
}
