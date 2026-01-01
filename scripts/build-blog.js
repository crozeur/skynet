#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Minimal markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown
    // Headings
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Code inline
    .replace(/`(.*?)`/g, "<code>$1</code>")
    // Lists
    .replace(/^\- (.*?)$/gm, "<li>$1</li>")
    // Line breaks and paragraphs
    .split("\n\n")
    .map(para => {
      if (para.includes("<h") || para.includes("<li>")) {
        return para;
      }
      if (para.trim()) {
        return `<p>${para.trim()}</p>`;
      }
      return "";
    })
    .join("\n");

  return html;
}

// This script pre-compiles all blog posts to JSON for Vercel deployment
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const OUTPUT_DIR = path.join(process.cwd(), "public", "blog-data");

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function extractMetadataFromMDX(source) {
  const startMatch = source.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!startMatch) return null;

  const startIdx = startMatch.index + startMatch[0].length - 1;
  let braceCount = 0;
  let endIdx = -1;

  for (let i = startIdx; i < source.length; i++) {
    if (source[i] === "{") braceCount++;
    if (source[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx === -1) return null;
  const objSource = source.substring(startIdx, endIdx + 1);

  try {
    const meta = Function(`return (${objSource})`)();
    return meta;
  } catch {
    return null;
  }
}

function extractContent(source) {
  // Remove the metadata export block
  const cleaned = source.replace(
    /export\s+const\s+metadata[\s\S]*?};\s*/m,
    ""
  );
  return cleaned.trim();
}

// Get all MDX files
const files = fs.existsSync(BLOG_DIR)
  ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
  : [];

console.log(`📝 Building ${files.length} blog posts...`);

files.forEach((file) => {
  const slug = file.replace(/\.mdx$/, "");
  const filePath = path.join(BLOG_DIR, file);
  const source = fs.readFileSync(filePath, "utf8");

  const metadata = extractMetadataFromMDX(source);
  if (!metadata) {
    console.warn(`⚠️  No metadata found for ${file}`);
    return;
  }

  const markdownContent = extractContent(source);
  const htmlContent = markdownToHtml(markdownContent);

  // Write JSON file
  const jsonPath = path.join(OUTPUT_DIR, `${slug}.json`);
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        slug,
        metadata,
        content: htmlContent,
      },
      null,
      2
    )
  );

  console.log(`✓ ${slug}`);
});

console.log(`✅ Blog posts compiled to ${OUTPUT_DIR}`);
