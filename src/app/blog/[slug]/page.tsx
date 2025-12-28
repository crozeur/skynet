import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import type { PostData } from "@/lib/blog";
import fs from "node:fs";
import path from "node:path";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const mod: any = await import(
      /* webpackInclude: /\\.mdx$/ */ `../../../../content/blog/${params.slug}.mdx`
    );
    const post: PostData = {
      slug: params.slug,
      metadata: mod.metadata,
      Content: mod.default,
    };
    return <BlogPostClient post={post} />;
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  const BLOG_DIR = path.join(process.cwd(), "content", "blog");
  const files = fs.existsSync(BLOG_DIR) ? fs.readdirSync(BLOG_DIR) : [];
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/i, "") }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const mod: any = await import(
      /* webpackInclude: /\\.mdx$/ */ `../../../../content/blog/${params.slug}.mdx`
    );
    const { title, description, coverImage } = mod.metadata || {};
    const url = `https://www.skynet-consulting.net/blog/${params.slug}`;
    return {
      title: title ?? params.slug,
      description: description ?? undefined,
      openGraph: {
        title: title ?? params.slug,
        description: description ?? undefined,
        type: "article",
        url,
        images: coverImage ? [{ url: coverImage }] : undefined,
      },
      twitter: {
        card: coverImage ? "summary_large_image" : "summary",
        title: title ?? params.slug,
        description: description ?? undefined,
        images: coverImage ? [coverImage] : undefined,
      },
    } as any;
  } catch {
    return {
      title: params.slug,
    };
  }
}
