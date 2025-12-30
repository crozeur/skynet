import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

type Body = {
  slug?: string;
  paths?: string[];
  tags?: string[] | string;
};

function getToken(request: NextRequest) {
  const auth = request.headers.get("authorization") || "";
  if (auth.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return (request.headers.get("x-revalidate-secret") || "").trim();
}

function normalizeTags(tags: Body["tags"]): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return Response.json(
      { revalidated: false, message: "Missing REVALIDATE_SECRET" },
      { status: 500 }
    );
  }

  const token = getToken(request);
  if (!token || token !== expected) {
    return Response.json(
      { revalidated: false, message: "Invalid token" },
      { status: 401 }
    );
  }

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    body = {};
  }

  const pathsToRevalidate = new Set<string>();
  const tagsToRevalidate = new Set<string>(normalizeTags(body.tags));

  // Main behavior: slug => revalidate /blog + /blog/<slug> + tag "blog"
  if (body.slug) {
    const slug = String(body.slug).trim();
    if (slug) {
      pathsToRevalidate.add("/blog");
      pathsToRevalidate.add(`/blog/${slug}`);
      tagsToRevalidate.add("blog");
    }
  }

  // Optional: extra paths
  if (Array.isArray(body.paths)) {
    for (const p of body.paths) {
      const path = String(p).trim();
      if (path) pathsToRevalidate.add(path);
    }
  }

  // Optional: extra tags (array or comma-separated string)
  for (const t of normalizeTags(body.tags)) {
    tagsToRevalidate.add(t);
  }

  if (pathsToRevalidate.size === 0 && tagsToRevalidate.size === 0) {
    return Response.json(
      {
        revalidated: false,
        message: "Nothing to revalidate. Provide slug, paths, or tags.",
      },
      { status: 400 }
    );
  }

  // Execute revalidation
  for (const p of Array.from(pathsToRevalidate)) revalidatePath(p);
  for (const t of Array.from(tagsToRevalidate)) revalidateTag(t);

  return Response.json({
    revalidated: true,
    paths: Array.from(pathsToRevalidate),
    tags: Array.from(tagsToRevalidate),
    now: Date.now(),
  });
}
