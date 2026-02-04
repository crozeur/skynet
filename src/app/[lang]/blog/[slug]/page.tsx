import { notFound, redirect } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import type { PostData } from "@/lib/blog";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getBlogSlugForLang, resolveBlogSlugToEn } from "@/lib/blogSlugIndexServer";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["en", "fr"] as const);
const SITE_ORIGIN = "https://skynet-consulting.net";

function loadPostJsonBySlugEn(slugEn: string): any {
  const BLOG_DATA_DIR = join(process.cwd(), "public", "blog-data");
  const filePath = join(BLOG_DATA_DIR, `${slugEn}.json`);
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export default async function LocalizedBlogPostPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang = params.lang as "en" | "fr";
  if (!ALLOWED.has(lang)) notFound();

  const slugEn = resolveBlogSlugToEn(lang, params.slug);
  if (!slugEn) notFound();

  // Canonicalize URL paths to avoid duplicate content
  if (lang === "en") {
    redirect(`/blog/${slugEn}`);
  }

  let data: any;
  try {
    data = loadPostJsonBySlugEn(slugEn);
  } catch {
    notFound();
  }
  if (!data || !data.metadata) notFound();

  const canonicalFr = String(data.slugFr || getBlogSlugForLang(slugEn, "fr"));
  if (lang === "fr" && params.slug !== canonicalFr) {
    redirect(`/fr/blog/${canonicalFr}`);
  }

  const post: PostData = {
    slug: slugEn,
    slugEn: data.slugEn ?? slugEn,
    slugFr: data.slugFr ?? undefined,
    metadata: data.metadata,
    translatedMetadata: data.translatedMetadata,
    content: data.content || "<p>No content</p>",
    translatedContent: data.translatedContent,
  };

  return <BlogPostClient post={post} />;
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang = params.lang as "en" | "fr";
  if (!ALLOWED.has(lang)) return { title: params.slug };

  const slugEn = resolveBlogSlugToEn(lang, params.slug);
  if (!slugEn) return { title: params.slug };

  try {
    const data = loadPostJsonBySlugEn(slugEn);
    const meta = data?.metadata ?? {};
    const title = meta.title ?? slugEn;
    const description = meta.description ?? undefined;
    const coverImage = meta.coverImage as string | undefined;

    const slugFr = data?.slugFr ? String(data.slugFr) : getBlogSlugForLang(slugEn, "fr");
    const enUrl = `${SITE_ORIGIN}/blog/${slugEn}`;
    const frUrl = `${SITE_ORIGIN}/fr/blog/${slugFr}`;
    const url = lang === "fr" ? frUrl : enUrl;

    const absoluteImage = coverImage && coverImage.startsWith("/") ? `${SITE_ORIGIN}${coverImage}` : coverImage;

    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          en: enUrl,
          fr: frUrl,
        },
      },
      openGraph: {
        title,
        description,
        type: "article",
        url,
        images: absoluteImage ? [{ url: absoluteImage }] : undefined,
        locale: lang === "fr" ? "fr_FR" : "en_US",
      },
      twitter: {
        card: absoluteImage ? "summary_large_image" : "summary",
        title,
        description,
        images: absoluteImage ? [absoluteImage] : undefined,
      },
    } as any;
  } catch {
    return { title: params.slug };
  }
}
