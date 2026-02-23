import { notFound, redirect } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import { getAllBlogPosts } from "@/lib/blog";
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

function extractFAQs(htmlContent: string) {
  const faqs: { question: string; answer: string }[] = [];
  const regex = /<h[23][^>]*>(.*?)\?<\/h[23]>\s*<p>(.*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const question = match[1].replace(/<[^>]*>?/gm, '').trim() + '?';
    const answer = match[2].replace(/<[^>]*>?/gm, '').trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
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

  // Fetch related posts
  const allPosts = await getAllBlogPosts();
  const currentTags = post.metadata.tags || [];
  
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .map(p => {
      const sharedTags = (p.metadata.tags || []).filter(t => currentTags.includes(t)).length;
      const samePillar = p.metadata.pillar === post.metadata.pillar ? 1 : 0;
      return { post: p, score: sharedTags * 2 + samePillar };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(p => p.post);

  const contentToParse = lang === "fr" && post.translatedContent?.fr ? post.translatedContent.fr : post.content;
  const faqs = extractFAQs(contentToParse);
  const faqJsonLd = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
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
