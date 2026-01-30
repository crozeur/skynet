import { getAllBlogPosts } from "@/lib/blog";
import { BlogIndexClient } from "@/components/BlogIndexClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  return <BlogIndexClient posts={posts} />;
}
