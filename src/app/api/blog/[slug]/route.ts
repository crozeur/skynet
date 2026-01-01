import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log(`[API] Loading blog article: ${slug}`);
    
    // Build URL using the request origin for proper base URL
    const baseUrl = new URL(request.url).origin;
    const fileUrl = `${baseUrl}/blog-data/${slug}.json`;
    console.log(`[API] Fetching from: ${fileUrl}`);
    
    const response = await fetch(fileUrl);
    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`[API] File not found for slug: ${slug}`);
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const data = await response.json();
    console.log(`[API] Successfully loaded article: ${slug}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Error loading blog article:', error);
    return NextResponse.json(
      { error: "Failed to load article", details: String(error) },
      { status: 500 }
    );
  }
}
