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
  const expected = process.env.REVALIDATE_SECRET?.trim();

  if (!expected) {
    return Response.json(
      { revalidated: false, message: "Missing REVALIDATE_SECRET" },
      { status: 500 }
    );
  }

  const token = getToken(request);
  if (!token) {
    return Response.json(
      { revalidated: false, message: "Missing authorization token" },
      { status: 401 }
    );
  }

  if (token !== expected) {
    return Response.json(
      { revalidated: false, message: "Invalid token" },
      { status: 401 }
    );
  }

  let body: Body = {};
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { revalidated: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const pathsSet = new Set<string>();

  if (body.slug && typeof body.slug === "string") {
    const slug = body.slug.replace(/^\//, "");
    pathsSet.add("/blog");
    pathsSet.add(`/blog/${slug}`);
  }

  if (Array.isArray(body.paths)) {
    for (const p of body.paths) {
      if (typeof p === "string") {
        pathsSet.add(p.startsWith("/") ? p : `/${p}`);
      }
    }
  }

  const tagsSet = new Set(normalizeTags(body.tags));
  if (body.slug) tagsSet.add("blog");

  if (pathsSet.size === 0 && tagsSet.size === 0) {
    return Response.json(
      {
        revalidated: false,
        message: 'Nothing to revalidate. Provide either "slug", "paths", or "tags".',
      },
      { status: 400 }
    );
  }

  for (const path of Array.from(pathsSet)) {
    try {
      revalidatePath(path);
    } catch (err) {
      console.error(`Failed to revalidate path ${path}:`, err);
    }
  }

  for (const tag of Array.from(tagsSet)) {
    try {
      revalidateTag(tag);
    } catch (err) {
      console.error(`Failed to revalidate tag ${tag}:`, err);
    }
  }

  return Response.json(
    {
      revalidated: true,
      paths: Array.from(pathsSet),
      tags: Array.from(tagsSet),
      now: Date.now(),
    },
    { status: 200 }
  );
}
