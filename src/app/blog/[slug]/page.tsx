import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import type { PostData } from "@/lib/blog";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    // Fetch blog data from the compiled JSON
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/blog/${params.slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`Failed to fetch blog post: ${params.slug}`, response.status, response.statusText);
      notFound();
    }

    const data = await response.json();
    
    if (!data || !data.metadata) {
      console.error(`Invalid blog data for: ${params.slug}`, data);
      notFound();
    }

    // Create a simple React component from the HTML content
    const Content = () => (
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content || '<p>No content</p>' }}
      />
    );

    const post: PostData = {
      slug: params.slug,
      metadata: data.metadata,
      Content,
    };
    
    return <BlogPostClient post={post} />;
  } catch (error) {
    console.error('Error loading blog post:', params.slug, error);
    notFound();
  }
}


export async function generateStaticParams() {
  // Get all blog slugs from the compiled JSON files
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  
  try {
    // Read from the blog data directory or API
    const blogDataPath = process.env.NODE_ENV === 'production'
      ? `${baseUrl}/api/blog` 
      : null;
    
    // For build time, read from the filesystem
    if (process.env.NODE_ENV !== 'production') {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const BLOG_DIR = path.join(process.cwd(), 'public', 'blog-data');
      
      if (fs.default.existsSync(BLOG_DIR)) {
        const files = fs.default.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.json'));
        return files.map((f) => ({ slug: f.replace(/\.json$/, '') }));
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
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
