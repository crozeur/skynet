import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "blog-data",
      `${slug}.json`
    );

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load article" },
      { status: 500 }
    );
  }
}
