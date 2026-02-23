import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import { getAllBlogPosts } from "@/lib/blog";
import type { PostData, PostSummary } from "@/lib/blog";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getBlogSlugForLang } from "@/lib/blogSlugIndexServer";

export const dynamic = "force-dynamic";

function extractFAQs(htmlContent: string) {
  const faqs: { question: string; answer: string }[] = [];
  // Match <h2> or <h3> containing a question mark, followed by a <p>
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    // Read blog data directly from the compiled JSON files
    const BLOG_DATA_DIR = join(process.cwd(), 'public', 'blog-data');
    const filePath = join(BLOG_DATA_DIR, `${params.slug}.json`);
    
    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (!data || !data.metadata) {
      console.error(`Invalid blog data for: ${params.slug}`, data);
      notFound();
    }

    const post: PostData = {
      slug: params.slug,
      slugEn: data.slugEn ?? params.slug,
      slugFr: data.slugFr ?? undefined,
      metadata: data.metadata,
      translatedMetadata: data.translatedMetadata,
      content: data.content || '<p>No content</p>',
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
      
    const faqs = extractFAQs(post.content);
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
  } catch (error) {
    console.error('Error loading blog post:', params.slug, error);
    notFound();
  }
}


export async function generateStaticParams() {
  // Generate static params for all blog slugs during build time
  const fs = (await import('node:fs')).default;
  const path = (await import('node:path')).default;
  const BLOG_DIR = path.join(process.cwd(), 'public', 'blog-data');
  
  try {
    if (fs.existsSync(BLOG_DIR)) {
      const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.json') && !f.startsWith('_'));
      console.log(`[generateStaticParams] Found ${files.length} blog posts`);
      return files.map((f) => {
        const slug = f.replace(/\.json$/, '');
        return { slug };
      });
    }
  } catch (error) {
    console.error('Error generating static params:', error);
  }
  
  return [];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const SITE_ORIGIN = "https://skynet-consulting.net";
    const BLOG_DATA_DIR = join(process.cwd(), "public", "blog-data");
    const filePath = join(BLOG_DATA_DIR, `${params.slug}.json`);
    const fileContent = readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const { title, description, coverImage } = data?.metadata || {};

    const slugEn = String(data?.slugEn || params.slug);
    const slugFr = String(data?.slugFr || getBlogSlugForLang(slugEn, "fr"));
    const enUrl = `${SITE_ORIGIN}/blog/${slugEn}`;
    const frUrl = `${SITE_ORIGIN}/fr/blog/${slugFr}`;
    const url = enUrl;
    const absoluteImage = coverImage && coverImage.startsWith('/')
      ? `${SITE_ORIGIN}${coverImage}`
      : coverImage;
    
    return {
      title: title ?? params.slug,
      description: description ?? undefined,
      alternates: {
        canonical: enUrl,
        languages: {
          en: enUrl,
          fr: frUrl,
        },
      },
      openGraph: {
        title: title ?? params.slug,
        description: description ?? undefined,
        type: "article",
        url,
        images: absoluteImage ? [{ url: absoluteImage }] : undefined,
        locale: "en_US",
      },
      twitter: {
        card: absoluteImage ? "summary_large_image" : "summary",
        title: title ?? params.slug,
        description: description ?? undefined,
        images: absoluteImage ? [absoluteImage] : undefined,
      },
    } as any;
  } catch {
    return {
      title: params.slug,
    };
  }
}
