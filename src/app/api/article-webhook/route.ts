import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getClientIp, rateLimit, readJsonWithLimit } from "@/lib/requestSecurity";

interface ArticleWebhookPayload {
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
}

const WEBHOOK_SECRET = process.env.ARTICLE_WEBHOOK_SECRET?.trim();

export async function POST(request: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing ARTICLE_WEBHOOK_SECRET" }, { status: 500 });
    }

    const ip = getClientIp(request);
    const rl = rateLimit(`article-webhook:${ip}`, { windowMs: 60_000, max: 30 });
    if (!rl.ok) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    // Validate secret
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid authorization" }, { status: 401 });
    }

    const rawBody: unknown = await readJsonWithLimit(request, 24_000);
    const body = rawBody as Partial<ArticleWebhookPayload> & {
      posts?: Array<Partial<ArticleWebhookPayload>>;
      Posts?: Array<Partial<ArticleWebhookPayload>>;
    };

    const firstWrapped =
      (Array.isArray(body.posts) && body.posts[0]) ||
      (Array.isArray(body.Posts) && body.Posts[0]) ||
      undefined;

    const payload: ArticleWebhookPayload = {
      slug: (body.slug || firstWrapped?.slug || "").trim(),
      imageUrl: body.imageUrl ?? firstWrapped?.imageUrl,
      imageAlt: body.imageAlt ?? firstWrapped?.imageAlt,
      title: body.title ?? firstWrapped?.title,
      description: body.description ?? firstWrapped?.description,
    };

    if (!payload.slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/i.test(payload.slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    console.log(`🔄 Webhook received for article: ${payload.slug}`);
    if (payload.imageUrl) {
      console.log(`📸 Image URL: ${payload.imageUrl}`);
    }

    // Revalidate the blog post page
    revalidatePath(`/blog/${payload.slug}`);
    
    // Revalidate the blog index
    revalidatePath("/blog");
    
    // Revalidate the home page (if it shows latest articles)
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: `Article "${payload.slug}" revalidated successfully`,
      slug: payload.slug,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

// Health check
export async function GET(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ status: "error", message: "Missing ARTICLE_WEBHOOK_SECRET" }, { status: 500 });
  }
  return NextResponse.json({
    status: "ok",
    message: "Article webhook endpoint is active",
    usage: {
      method: "POST",
      endpoint: "/api/article-webhook",
      headers: {
        "Authorization": "Bearer YOUR_SECRET",
        "Content-Type": "application/json",
      },
      body: {
        slug: "article-slug-name",
        imageUrl: "https://example.com/image.jpg (optional)",
        imageAlt: "Image description (optional)",
        title: "Article title (optional)",
        description: "Article description (optional)",
      },
    },
  });
}
