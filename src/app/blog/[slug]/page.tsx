import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import type { PostData } from "@/lib/blog";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
      metadata: data.metadata,
      content: data.content || '<p>No content</p>',
    };
    
    return <BlogPostClient post={post} />;
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
      const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.json'));
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
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blog/${params.slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        title: params.slug,
      };
    }

    const data = await response.json();
    const { title, description, coverImage } = data.metadata || {};
    const url = `https://www.skynet-consulting.net/blog/${params.slug}`;
    const absoluteImage = coverImage && coverImage.startsWith('/')
      ? `https://www.skynet-consulting.net${coverImage}`
      : coverImage;
    
    return {
      title: title ?? params.slug,
      description: description ?? undefined,
      openGraph: {
        title: title ?? params.slug,
        description: description ?? undefined,
        type: "article",
        url,
        images: absoluteImage ? [{ url: absoluteImage }] : undefined,
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
