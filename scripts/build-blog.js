#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const SKIP_TRANSLATION =
  process.argv.includes("--skip-translation") ||
  process.env.SKIP_TRANSLATION === "1" ||
  process.env.SKIP_TRANSLATION === "true";

// Professional French glossary
const frenchGlossary = {
  cybersecurity: "cybersécurité",
  cybersecure: "cybersécurisé",
  "threat detection": "détection des menaces",
  "incident response": "réponse aux incidents",
  incident: "incident",
  vulnerability: "vulnérabilité",
  compliance: "conformité",
  soc: "SOC",
  siem: "SIEM",
  phishing: "hameçonnage",
  ransomware: "rançongiciel",
  malware: "malveillance",
  breach: "violation",
  audit: "audit",
  monitoring: "surveillance",
  detection: "détection",
  alert: "alerte",
  endpoint: "terminal",
  network: "réseau",
  threat: "menace",
  attack: "attaque",
  response: "réponse",
  recovery: "récupération",
  backup: "sauvegarde",
  framework: "cadre",
  assessment: "évaluation",
  posture: "posture",
};

// Apply glossary to text
function applyGlossary(text) {
  let result = text;
  const sortedTerms = Object.entries(frenchGlossary).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [en, fr] of sortedTerms) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    result = result.replace(regex, fr);
  }

  return result;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Translate a single text using Google Translate
async function translateText(text) {
  if (!text) return text;

  if (SKIP_TRANSLATION) return applyGlossary(text);

  try {
    // Try Google Translate
    const encoded = encodeURIComponent(text);
    const response = await fetchWithTimeout(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=${encoded}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
      12000
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map((chunk) => chunk[0] || "").join("");
        if (translated) {
          return applyGlossary(translated);
        }
      }
    }
  } catch (err) {
    console.warn(`  ⚠️  Translation failed for: ${text.substring(0, 30)}...`);
  }

  // Fallback to glossary only
  return applyGlossary(text);
}

// Translate metadata to French (with Google Translate fallback)
async function translateMetadata(metadata) {
  const translated = { ...metadata };

  if (SKIP_TRANSLATION) {
    // Keep EN text; still apply glossary so common cybersecurity terms look consistent.
    translated.title = applyGlossary(translated.title);
    translated.description = applyGlossary(translated.description);
    if (Array.isArray(translated.tags)) {
      translated.tags = translated.tags.map((t) => applyGlossary(t));
    }
    if (translated.coverAlt) {
      translated.coverAlt = applyGlossary(translated.coverAlt);
    }
    return translated;
  }

  // Translate title
  if (metadata.title) {
    translated.title = await translateText(metadata.title);
  }

  // Translate description
  if (metadata.description) {
    translated.description = await translateText(metadata.description);
  }

  // Translate tags
  if (metadata.tags && Array.isArray(metadata.tags)) {
    translated.tags = await Promise.all(
      metadata.tags.map((tag) => translateText(tag))
    );
  }

  // Translate coverAlt
  if (metadata.coverAlt) {
    translated.coverAlt = await translateText(metadata.coverAlt);
  }

  return translated;
}

// Translate HTML content while preserving tags
async function translateHtmlContent(html) {
  if (!html) return html;

  if (SKIP_TRANSLATION) return html;

  // Split HTML into chunks (text vs tags)
  const chunks = [];
  const regex = /(<[^>]+>)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const text = html.substring(lastIndex, match.index);
      if (text.trim()) {
        chunks.push({ text, isTag: false });
      }
    }
    chunks.push({ text: match[0], isTag: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    const text = html.substring(lastIndex);
    if (text.trim()) {
      chunks.push({ text, isTag: false });
    }
  }

  // Translate text chunks in parallel (batch them to avoid too many requests)
  const batchSize = 5;
  const translatedChunks = [];

  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].isTag || !chunks[i].text.trim()) {
      translatedChunks.push(chunks[i].text);
    } else {
      translatedChunks.push(await translateText(chunks[i].text));
    }
  }

  return translatedChunks.join("");
}

// Professional markdown to HTML converter
function markdownToHtml(markdown) {
  let html = markdown;
  
  // Horizontal rules
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '<hr />');
  
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

  // Images with loading lazy
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="article-img" loading="lazy" />');

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

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

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
        para.includes('<hr') ||
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

// Clean previously generated JSON files so deleted posts don't linger
try {
  const existing = fs.readdirSync(OUTPUT_DIR);
  for (const file of existing) {
    if (file.endsWith(".json")) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
} catch (err) {
  console.warn(`  ⚠️  Could not clean ${OUTPUT_DIR}: ${err.message}`);
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

  // Normalize generated section headings so UI doesn't show prompt instructions
  // (e.g. "Intro (3–5 sentences)" in the Contents box)
  const normalized = cleaned
    // With markdown heading
    .replace(/^##\s+Intro\s*\(\s*3\s*[–-]\s*5\s+sentences\s*\)\s*$/gmi, "## Intro")
    .replace(
      /^##\s+Quick\s+take\s*\(\s*exactly\s+5\s+bullet\s+points\s*\)\s*$/gmi,
      "## Quick take"
    )
    .replace(
      /^##\s+Checklist\s*\(\s*8\s*[–-]\s*12\s+checkbox\s+items\s+using\s+"-\s*\[\s*\]\"\s*\)\s*$/gmi,
      "## Checklist"
    )
    .replace(
      /^##\s+FAQ\s*\(\s*3\s+questions\s+with\s+short\s+answers\s*\)\s*$/gmi,
      "## FAQ"
    )

    // Convert generated numbered subsection lines into proper H3 headings so they
    // appear in the article TOC (e.g. "1) Topic" -> "### 1) Topic").
    // This is done at build-time to avoid mutating source MDX files.
    .replace(/^(\d+)\)\s+(.+)$/gm, "### $1) $2")

    // Without markdown heading (some older posts)
    .replace(/^Intro\s*\(\s*3\s*[–-]\s*5\s+sentences\s*\)\s*$/gmi, "Intro")
    .replace(
      /^Quick\s+take\s*\(\s*exactly\s+5\s+bullet\s+points\s*\)\s*$/gmi,
      "Quick take"
    )
    .replace(
      /^Checklist\s*\(\s*8\s*[–-]\s*12\s+checkbox\s+items\s+using\s+"-\s*\[\s*\]\"\s*\)\s*$/gmi,
      "Checklist"
    )
    .replace(
      /^FAQ\s*\(\s*3\s+questions\s+with\s+short\s+answers\s*\)\s*$/gmi,
      "FAQ"
    );

  return normalized.trim();
}

// Get all MDX files
const files = fs.existsSync(BLOG_DIR)
  ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
  : [];

console.log(`📝 Building ${files.length} blog posts...`);

// Process files asynchronously
(async () => {
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, file);
    const source = fs.readFileSync(filePath, "utf8");

    const metadata = extractMetadataFromMDX(source);
    if (!metadata) {
      console.warn(`⚠️  No metadata found for ${file}`);
      continue;
    }

    const markdownContent = extractContent(source);
    const htmlContent = markdownToHtml(markdownContent);

    // Translate metadata and content for French version
    console.log(`  🔄 Translating ${slug}...`);
    const translatedMetadata = await translateMetadata(metadata);
    const translatedContent = await translateHtmlContent(htmlContent);

    // Write JSON file with both EN and FR translations
    const jsonPath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          slug,
          metadata,
          translatedMetadata: {
            fr: translatedMetadata,
          },
          content: htmlContent,
          translatedContent: {
            fr: translatedContent,
          },
        },
        null,
        2
      )
    );

    console.log(`✓ ${slug}`);
  }

  console.log(`✅ Blog posts compiled to ${OUTPUT_DIR}`);
})();
