#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function normalizeNewlines(text) {
  return String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

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
  "account takeover": "prise de contrôle de compte",
  "business email compromise": "compromission de messagerie",
  "password spraying": "pulvérisation de mots de passe",
  "tenant-wide": "à l'échelle de l'entité",
  "multi-tenant": "multi-entité",
  "multi tenant": "multi-entité",
  tenants: "entités",
  tenant: "entité",
  locataires: "entités",
  locataire: "entité",
  incident: "incident",
  vulnerability: "vulnérabilité",
  compliance: "conformité",
  soc: "SOC",
  siem: "SIEM",
  phishing: "hameçonnage",
  ransomware: "rançongiciel",
  malware: "logiciel malveillant",
  breach: "compromission",
  endpoint: "terminal",
  backup: "sauvegarde",
  audit: "audit",
  monitoring: "surveillance",
  detection: "détection",
  alert: "alerte",
  network: "réseau",
  threat: "menace",
  attack: "attaque",
  response: "réponse",
  recovery: "récupération",
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
const SLUG_OVERRIDES_PATH = path.join(process.cwd(), "scripts", "blog_slug_overrides.fr.json");
const SLUG_ALIASES_SEED_PATH = path.join(process.cwd(), "scripts", "blog_slug_aliases.fr.json");
const TITLE_OVERRIDES_FR_PATH = path.join(process.cwd(), "scripts", "blog_title_overrides.fr.json");

function readJsonFileSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const slugOverridesFr = readJsonFileSafe(SLUG_OVERRIDES_PATH, {});
const slugAliasesFrSeed = readJsonFileSafe(SLUG_ALIASES_SEED_PATH, {});
const titleOverridesFr = readJsonFileSafe(TITLE_OVERRIDES_FR_PATH, {});

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Clean previously generated JSON files so deleted posts don't linger
try {
  const existing = fs.readdirSync(OUTPUT_DIR);
  for (const file of existing) {
    // Keep index files (prefixed with _) that aren't per-post artifacts
    if (file.endsWith(".json") && !file.startsWith("_")) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
    }
  }
} catch (err) {
  console.warn(`  ⚠️  Could not clean ${OUTPUT_DIR}: ${err.message}`);
}

function slugify(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function makeUniqueSlug(base, used, fallback) {
  const normalizedBase = String(base || "").trim();
  const normalizedFallback = String(fallback || "").trim();
  let candidate = normalizedBase || normalizedFallback;
  if (!candidate) return "";

  // If already used, append -2/-3...
  if (!used.has(candidate)) {
    used.add(candidate);
    return candidate;
  }
  for (let i = 2; i < 1000; i++) {
    const next = `${candidate}-${i}`;
    if (!used.has(next)) {
      used.add(next);
      return next;
    }
  }
  // Very unlikely; give up.
  return candidate;
}

const SEO_FR_STOPWORDS = new Set([
  // Low-value French connector words commonly removed from slugs
  "a",
  "au",
  "aux",
  "de",
  "des",
  "du",
  "et",
  "la",
  "le",
  "les",
  "ou",
  "un",
  "une",
]);

function normalizeFrenchSlugTokens(slug) {
  const raw = String(slug || "").trim();
  if (!raw) return "";
  const tokens = raw.split("-").filter(Boolean);
  const cleaned = tokens.filter((t) => {
    const x = String(t || "").toLowerCase();
    return x && !SEO_FR_STOPWORDS.has(x);
  });
  return cleaned.join("-");
}

function getRequiredFrTokens(metadata, slugEn) {
  const required = [];
  const en = String(slugEn || "").toLowerCase();

  const pillar = String(metadata?.pillar || "").toLowerCase();
  if (pillar.includes("soc")) required.push("soc");
  if (pillar.includes("audit")) required.push("audit");
  if (pillar.includes("cloud")) required.push("cloud");

  // Audience cue
  const tags = Array.isArray(metadata?.tags) ? metadata.tags : [];
  const hasSmeTag = tags.some((t) => String(t || "").toLowerCase() === "sme");
  const mentionsSme = /(^|-)smes?(-|$)/.test(en);
  if (hasSmeTag || mentionsSme) required.push("pme");

  // Platform cues
  if (/(^|-)aws(-|$)/.test(en)) required.push("aws");
  if (/(^|-)m365(-|$)/.test(en) || en.includes("microsoft-365")) required.push("m365");

  // Stable order: audience first, then pillar/platform keywords
  const priority = ["pme", "soc", "audit", "cloud", "m365", "aws"];
  const uniq = Array.from(new Set(required));
  uniq.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
  return uniq;
}

function ensureRequiredTokensInSlug(slug, requiredTokens) {
  const raw = String(slug || "").trim();
  if (!raw) return "";
  const tokens = raw.split("-").filter(Boolean);
  const set = new Set(tokens);

  for (const req of requiredTokens || []) {
    if (!req) continue;
    if (set.has(req)) continue;

    // If slug starts with pme, insert SOC/Audit/Cloud right after it for readability.
    if (tokens[0] === "pme" && req !== "pme") {
      tokens.splice(1, 0, req);
    } else {
      tokens.unshift(req);
    }
    set.add(req);
  }

  return tokens.join("-");
}

function autoFrenchSlugFromEnSlug(slugEn) {
  const raw = String(slugEn || "").trim();
  if (!raw) return "";

  const tokens = raw.split("-").filter(Boolean);
  const out = [];

  const mapToken = (t) => {
    const x = String(t || "").toLowerCase();
    const dict = {
      // Audience
      sme: "pme",
      smes: "pme",

      // Cyber / IT keywords
      security: "securite",
      secure: "securiser",
      cybersecurity: "cybersecurite",
      audit: "audit",
      checklist: "checklist",
      evidence: "preuves",
      template: "modele",
      risks: "risques",
      risk: "risque",
      fixes: "correctifs",
      fix: "corriger",

      soc: "soc",
      triage: "triage",
      alert: "alertes",
      alerts: "alertes",
      phishing: "hameconnage",
      playbook: "guide",
      workflow: "processus",
      monitor: "surveillance",
      monitoring: "surveillance",
      ransomware: "rancongiciel",
      malware: "logiciel-malveillant",
      endpoint: "terminal",
      endpoints: "terminaux",
      breach: "compromission",
      backup: "sauvegarde",
      backups: "sauvegardes",
      identity: "identite",
      account: "compte",
      accounts: "comptes",
      password: "motdepasse",
      spray: "pulverisation",
      spraying: "pulverisation",
      takeover: "prise-controle",
      compromise: "compromission",
      compromised: "compromis",
      forward: "transfert",
      forwarding: "transfert",
      impersonation: "usurpation",
      spoofing: "usurpation",
      forensics: "investigation",
      credentials: "identifiants",
      credential: "identifiants",
      escalation: "escalade",
      escalate: "escalade",
      response: "reponse",
      recover: "recuperer",
      recovery: "recuperation",
      contain: "contenir",
      communicate: "communiquer",

      cloud: "cloud",
      migration: "migration",
      cutover: "bascule",
      runbook: "runbook",
      steps: "etapes",
      roles: "roles",
      hypercare: "hypercare",
      misconfigurations: "mauvaises-configurations",
      misconfiguration: "mauvaise-configuration",
      storage: "stockage",
      iam: "iam",
      basics: "bases",

      m365: "m365",
      microsoft: "microsoft",
      aws: "aws",
      tenant: "entite",

      minutes: "min",
      minute: "min",
      days: "jours",
      day: "jour",
    };

    if (dict[x]) return dict[x];
    return x;
  };

  const stop = new Set([
    "build",
    "practical",
    "run",
    "review",
    "first",
    "before",
    "now",
    "new",
    "apps",
    "app",
    "reduce",
    "noise",
    "fast",
    "one",
    "items",
    "gather",
    "prep",
    "internal",
    "small",
    "teams",
    "team",
    "it",
    "managers",
  ]);

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!t) continue;

    // Special: microsoft-365 -> m365
    if (t.toLowerCase() === "microsoft" && tokens[i + 1] === "365") {
      out.push("m365");
      i++;
      continue;
    }
    if (stop.has(t.toLowerCase())) continue;

    const mapped = mapToken(t);
    if (!mapped) continue;
    if (stop.has(mapped)) continue;
    out.push(mapped);
  }

  // Put the most meaningful tokens first when possible
  const prioritized = [
    "soc",
    "audit",
    "cloud",
    "m365",
    "aws",
    "hameconnage",
    "rancongiciel",
    "surveillance",
    "checklist",
    "guide",
    "processus",
    "runbook",
  ];
  const uniq = Array.from(new Set(out));
  uniq.sort((a, b) => {
    const ia = prioritized.indexOf(a);
    const ib = prioritized.indexOf(b);
    const pa = ia === -1 ? 999 : ia;
    const pb = ib === -1 ? 999 : ib;
    if (pa !== pb) return pa - pb;
    return 0;
  });

  return uniq.join("-");
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
  const slugIndex = [];
  const usedFrSlugs = new Set();

  const indexPath = path.join(OUTPUT_DIR, "_index.json");
  const aliasesPath = path.join(OUTPUT_DIR, "_aliases_fr.json");
  const prevIndex = readJsonFileSafe(indexPath, []);
  const prevAliases = readJsonFileSafe(aliasesPath, {});
  const aliases = { ...(slugAliasesFrSeed || {}), ...prevAliases };

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, file);
    // Normalize to LF so generated blog-data is deterministic across OS.
    const source = normalizeNewlines(fs.readFileSync(filePath, "utf8"));

    const metadata = extractMetadataFromMDX(source);
    if (!metadata) {
      console.warn(`⚠️  No metadata found for ${file}`);
      continue;
    }

    const markdownContent = normalizeNewlines(extractContent(source));
    const htmlContent = normalizeNewlines(markdownToHtml(markdownContent));

    // Translate metadata and content for French version
    console.log(`  🔄 Translating ${slug}...`);
    const translatedMetadata = await translateMetadata(metadata);
    const translatedContent = normalizeNewlines(await translateHtmlContent(htmlContent));

    // Optional: deterministic FR title overrides for awkward machine translations.
    const overrideTitleFr =
      typeof titleOverridesFr?.[slug] === "string" ? titleOverridesFr[slug].trim() : "";
    if (overrideTitleFr) {
      translatedMetadata.title = overrideTitleFr;
    }

    const slugEn = slug;
    const manualFr = typeof metadata?.slugFr === "string" ? metadata.slugFr : "";
    const overrideFr = typeof slugOverridesFr?.[slugEn] === "string" ? slugOverridesFr[slugEn] : "";
    const frTitle = translatedMetadata?.title || metadata?.title || slug;

    const autoFromEn = autoFrenchSlugFromEnSlug(slugEn);
    const requiredTokens = getRequiredFrTokens(metadata, slugEn);
    const rawBase = slugify(manualFr || overrideFr || autoFromEn || frTitle);
    const cleanedBase = normalizeFrenchSlugTokens(rawBase);
    const withRequired = ensureRequiredTokensInSlug(cleanedBase, requiredTokens);
    const slugFr = makeUniqueSlug(withRequired || slugEn, usedFrSlugs, slugEn);

    // Write JSON file with both EN and FR translations
    const jsonPath = path.join(OUTPUT_DIR, `${slug}.json`);
    fs.writeFileSync(
      jsonPath,
      JSON.stringify(
        {
          slug: slugEn,
          slugEn,
          slugFr,
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
      ) + "\n"
    );

    slugIndex.push({ slugEn, slugFr });

    // Keep aliases so old FR URLs don't break
    aliases[slugFr] = slugEn;
    const old = Array.isArray(prevIndex)
      ? prevIndex.find((e) => e && e.slugEn === slugEn)
      : null;
    if (old && typeof old.slugFr === "string" && old.slugFr && old.slugFr !== slugFr) {
      aliases[old.slugFr] = slugEn;
    }

    console.log(`✓ ${slug}`);
  }

  // Write slug index used by language switch + localized routes
  try {
    fs.writeFileSync(indexPath, JSON.stringify(slugIndex, null, 2) + "\n");
  } catch (err) {
    console.warn(`  ⚠️  Could not write slug index: ${err.message}`);
  }

  // Write FR aliases map (frSlug -> slugEn) for backwards-compatible routing
  try {
    const sorted = Object.fromEntries(
      Object.entries(aliases).sort((a, b) => String(a[0]).localeCompare(String(b[0])))
    );
    fs.writeFileSync(aliasesPath, JSON.stringify(sorted, null, 2) + "\n");
  } catch (err) {
    console.warn(`  ⚠️  Could not write FR aliases: ${err.message}`);
  }

  console.log(`✅ Blog posts compiled to ${OUTPUT_DIR}`);
})();
