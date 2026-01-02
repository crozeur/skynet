import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

interface ArticleWebhookPayload {
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
}

const WEBHOOK_SECRET = process.env.ARTICLE_WEBHOOK_SECRET || "default-secret";

export async function POST(request: NextRequest) {
  try {
    // Validate secret
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid authorization" }, { status: 401 });
    }

    const body: ArticleWebhookPayload = await request.json();

    if (!body.slug) {
      return NextResponse.json(
        { error: "Missing slug parameter" },
        { status: 400 }
      );
    }

    console.log(`🔄 Webhook received for article: ${body.slug}`);
    if (body.imageUrl) {
      console.log(`📸 Image URL: ${body.imageUrl}`);
    }

    // Revalidate the blog post page
    revalidatePath(`/blog/${body.slug}`);
    
    // Revalidate the blog index
    revalidatePath("/blog");
    
    // Revalidate the home page (if it shows latest articles)
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: `Article "${body.slug}" revalidated successfully`,
      slug: body.slug,
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
