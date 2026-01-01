import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Try to read from public/blog-data (accessible as static files on Vercel)
    const response = await fetch(
      new URL(`/blog-data/${slug}.json`, request.url).href
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading blog article:', error);
    return NextResponse.json(
      { error: "Failed to load article", details: String(error) },
      { status: 500 }
    );
  }
}
