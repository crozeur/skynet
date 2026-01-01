#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Professional markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Code blocks first (before other replacements)
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, lang, code) => {
    const escaped = code.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre><code class="language-${lang || 'plaintext'}">${escaped}</code></pre>`;
  });

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/(<blockquote>.*?<\/blockquote>)/gs, (match) => {
    const content = match.replace(/<blockquote>/g, '').replace(/<\/blockquote>/g, '\n');
    return `<blockquote class="article-blockquote">${content.trim()}</blockquote>`;
  });

  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="article-img" />');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Headings with ID generation
  html = html.replace(/^### (.*?)$/gm, (match, text) => {
    const id = generateId(text);
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.*?)$/gm, (match, text) => {
    const id = generateId(text);
    return `<h2 id="${id}">${text}</h2>`;
  });
  html = html.replace(/^# (.*?)$/gm, (match, text) => {
    const id = generateId(text);
    return `<h1 id="${id}">${text}</h1>`;
  });

  // Bold and italic (in correct order)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Lists (bullets and numbered)
  const lines = html.split('\n');
  let inList = false;
  let inOrderedList = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^\s*[-*+] (.*)/);
    const numberedMatch = line.match(/^\s*\d+\. (.*)/);

    if (bulletMatch) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(`<li>${bulletMatch[1]}</li>`);
    } else if (numberedMatch) {
      if (!inOrderedList) {
        processedLines.push('<ol>');
        inOrderedList = true;
      }
      processedLines.push(`<li>${numberedMatch[1]}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (inOrderedList) {
        processedLines.push('</ol>');
        inOrderedList = false;
      }
      processedLines.push(line);
    }
  }

  if (inList) processedLines.push('</ul>');
  if (inOrderedList) processedLines.push('</ol>');
  html = processedLines.join('\n');

  // Paragraphs
  html = html
    .split('\n\n')
    .map(para => {
      if (
        para.includes('<h') ||
        para.includes('<li>') ||
        para.includes('<ul>') ||
        para.includes('<ol>') ||
        para.includes('<code>') ||
        para.includes('<blockquote>') ||
        para.includes('<pre>') ||
        para.includes('<img') ||
        para.trim() === ''
      ) {
        return para;
      }
      if (para.trim()) {
        return `<p>${para.trim()}</p>`;
      }
      return '';
    })
    .join('\n');

  return html;
}

function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
