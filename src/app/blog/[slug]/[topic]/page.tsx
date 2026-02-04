import { notFound } from "next/navigation";
import { getAllBlogPosts } from "@/lib/blog";
import { BlogIndexClient } from "@/components/BlogIndexClient";
import { topicToSlug } from "@/lib/topicSlug";
import { getTopicLabel } from "@/lib/topicI18n";

export const dynamic = "force-dynamic";

const PILLARS = ["SOC", "AUDIT", "CLOUD"] as const;

type Pillar = (typeof PILLARS)[number];

function pillarFromSlug(slug: string): Pillar | null {
  const normalized = slug.trim().toUpperCase();
  return (PILLARS as readonly string[]).includes(normalized) ? (normalized as Pillar) : null;
}

export default async function BlogTopicPage({
  params,
}: {
  params: { slug: string; topic: string };
}) {
  const pillar = pillarFromSlug(params.slug);
  if (!pillar) notFound();

  const posts = await getAllBlogPosts();
  const topicParam = params.topic.trim().toLowerCase();

  const matching = posts.filter(
    (p) =>
      p.metadata.pillar === pillar &&
      Boolean(p.metadata.topic) &&
      topicToSlug(p.metadata.topic ?? "") === topicParam
  );

  const topicLabel = matching[0]?.metadata.topic;
  if (!topicLabel) notFound();

  return (
    <BlogIndexClient
      posts={posts}
      initialPillar={pillar}
      initialTopic={topicLabel}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; topic: string };
}) {
  const pillar = pillarFromSlug(params.slug);
  if (!pillar) return { title: "Blog" };

  try {
    const posts = await getAllBlogPosts();
    const topicParam = params.topic.trim().toLowerCase();
    const match = posts.find(
      (p) =>
        p.metadata.pillar === pillar &&
        Boolean(p.metadata.topic) &&
        topicToSlug(p.metadata.topic ?? "") === topicParam
    );

    const label = match?.metadata.topic ?? params.topic;
    const frLabel = getTopicLabel(label, "fr");
    return {
      title: `${pillar} — ${frLabel}`,
      description: `Articles ${pillar} sur ${frLabel}.`,
    };
  } catch {
    return { title: `${pillar} — ${params.topic}` };
  }
}
