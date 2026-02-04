import { notFound, redirect } from "next/navigation";
import { getAllBlogPosts } from "@/lib/blog";
import { BlogIndexClient } from "@/components/BlogIndexClient";

export const dynamic = "force-dynamic";

const ALLOWED = new Set(["en", "fr"]);

export default async function LocalizedBlogIndexPage({
  params,
}: {
  params: { lang: string };
}) {
  if (!ALLOWED.has(params.lang)) notFound();

  if (params.lang === "en") {
    redirect("/blog");
  }

  const posts = await getAllBlogPosts();
  return <BlogIndexClient posts={posts} />;
}
