import { notFound } from "next/navigation";
import { BlogPostClient } from "@/components/BlogPostClient";
import type { PostData } from "@/lib/blog";

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
