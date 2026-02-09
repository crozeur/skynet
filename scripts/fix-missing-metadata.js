#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");

function findMetadataBlock(source) {
  const m = source.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!m || typeof m.index !== "number") return null;

  const blockStart = m.index;
  const braceStart = blockStart + m[0].length - 1; // points at '{'

  let braceCount = 0;
  let inStr = false;
  let strCh = "";
  let escape = false;
  let endBraceIdx = -1;

  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === strCh) {
        inStr = false;
        strCh = "";
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inStr = true;
      strCh = ch;
      continue;
    }

    if (ch === "{") braceCount++;
    if (ch === "}") {
      braceCount--;
      if (braceCount === 0) {
        endBraceIdx = i;
        break;
      }
    }
  }

  if (endBraceIdx === -1) return null;

  let blockEnd = endBraceIdx + 1;
  if (source[blockEnd] === ";") blockEnd++;

  // Include trailing blank space/newlines after the metadata block so we don't
  // rewrite on every run due to newline range mismatch.
  while (
    blockEnd < source.length &&
    (source[blockEnd] === "\n" ||
      source[blockEnd] === "\r" ||
      source[blockEnd] === " " ||
      source[blockEnd] === "\t")
  ) {
    blockEnd++;
  }

  return {
    blockStart,
    blockEnd,
    objSource: source.slice(braceStart, endBraceIdx + 1),
  };
}

function tryParseMetadataObject(objSource) {
  try {
    // eslint-disable-next-line no-new-func
    return Function(`return (${objSource})`)();
  } catch {
    return null;
  }
}

function toJsValue(value, indentLevel = 0) {
  const indent = "  ".repeat(indentLevel);
  const indentNext = "  ".repeat(indentLevel + 1);

  if (value === null) return "null";
  if (typeof value === "string") return `"${escapeJsString(value)}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const simple = value.every((v) => v === null || ["string", "number", "boolean"].includes(typeof v));
    if (simple) return `[${value.map((v) => toJsValue(v, 0)).join(", ")}]`;

    const items = value.map((v) => `${indentNext}${toJsValue(v, indentLevel + 1)}`).join(",\n");
    return `[\n${items}\n${indent}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const lines = entries
      .map(([k, v]) => {
        const key = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
        return `${indentNext}${key}: ${toJsValue(v, indentLevel + 1)}`;
      })
      .join(",\n");
    return `{\n${lines}\n${indent}}`;
  }

  return JSON.stringify(value);
}

function renderMetadataBlock(metadataObj, newline = "\n") {
  // Keep output compatible with scripts/auto_tag_blog_posts.js (stable key order)
  const {
    title,
    description,
    date,
    pillar,
    topic,
    tags,
    coverAlt,
    coverImage,
    ...rest
  } = metadataObj || {};
  const ordered = {
    title,
    description,
    date,
    pillar,
    topic,
    tags,
    coverAlt,
    coverImage,
    ...rest,
  };

  const lines = Object.entries(ordered)
    .filter(([, v]) => typeof v !== "undefined")
    .map(([k, v]) => `  ${k}: ${toJsValue(v, 1)},`);

  return `export const metadata = {${newline}${lines.join(newline)}${newline}};${newline}${newline}`;
}

function normalizeForCompare(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    // Metadata blocks often have varying numbers of blank lines after `};`.
    // Collapse excessive blank lines so --check doesn't fail for cosmetic spacing.
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

// Extraction du slug depuis le nom du fichier
function slugFromFilename(filename) {
  return filename.replace(/\.mdx$/, "");
}

function slugToTitle(slug) {
  const acronyms = new Map([
    ["soc", "SOC"],
    ["sme", "SME"],
    ["smes", "SMEs"],
    ["m365", "M365"],
    ["aws", "AWS"],
    ["it", "IT"],
    ["saas", "SaaS"],
    ["iam", "IAM"],
    ["vpn", "VPN"],
    ["edr", "EDR"],
    ["mdm", "MDM"],
    ["siem", "SIEM"],
    ["api", "API"],
    ["sso", "SSO"],
  ]);

  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => {
      const lower = String(w).toLowerCase();
      if (acronyms.has(lower)) return acronyms.get(lower);
      if (/^\d+$/.test(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

function collapseWhitespace(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarkdown(text) {
  return collapseWhitespace(
    String(text || "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/^>\s+/gm, "")
      .replace(/^[-*+]\s+/gm, "")
  );
}

function escapeJsString(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/"/g, '\\"');
}

function inferTitleFromContent(content, fallbackSlug) {
  const lines = String(content || "").split(/\r?\n/);
  const badStarts = [
    "intro",
    "introduction",
    "quick take",
    "quick takeaways",
    "overview",
    "summary",
    "conclusion",
    "faq",
  ];

  function isBadHeadingTitle(title) {
    const t = collapseWhitespace(stripMarkdown(title)).toLowerCase();
    if (!t) return true;
    return badStarts.some((prefix) => t === prefix || t.startsWith(prefix + " ") || t.startsWith(prefix + "("));
  }

  // Prefer a real H1 as the article title.
  for (const line of lines) {
    const trimmed = line.trim();
    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1 && h1[1] && !isBadHeadingTitle(h1[1])) return stripMarkdown(h1[1]);
  }

  // If the author used H2/H3 as a title at the very top, accept it only if it's not generic.
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const trimmed = String(lines[i] || "").trim();
    if (!trimmed) continue;
    const heading = trimmed.match(/^#{2,3}\s+(.+)$/);
    if (heading && heading[1] && !isBadHeadingTitle(heading[1])) {
      const candidate = stripMarkdown(heading[1]);
      if (candidate.split(/\s+/).filter(Boolean).length >= 3) return candidate;
    }
    // Stop early once we hit normal text.
    if (!/^#{1,6}\s+/.test(trimmed)) break;
  }

  return slugToTitle(fallbackSlug);
}

function inferDescriptionFromContent(content) {
  const blocks = String(content || "")
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (/^#{1,6}\s+/.test(block)) continue;
    if (/^export\s+const\s+metadata\s*=/.test(block)) continue;

    const cleaned = stripMarkdown(block);
    if (cleaned.length >= 40) return cleaned.slice(0, 160);
  }

  return "Security insights for small and mid-sized businesses";
}

function inferPillarFromSlug(slug) {
  const s = String(slug || "").toLowerCase();
  if (s.includes("audit")) return "AUDIT";
  // Cloud keywords must win even if the slug also contains SOC-related terms.
  if (
    s.includes("cloud") ||
    s.includes("aws") ||
    s.includes("azure") ||
    s.includes("gcp") ||
    s.includes("m365") ||
    s.includes("microsoft-365") ||
    s.includes("iam") ||
    s.includes("storage")
  )
    return "CLOUD";
  if (s.includes("soc") || s.includes("alert") || s.includes("triage") || s.includes("playbook")) return "SOC";
  return "SOC";
}

// Génération des métadonnées basée sur le slug et le contenu
function generateMetadata(filename, content) {
  const slug = slugFromFilename(filename);
  
  // Mapping des articles avec leurs piliers et descriptions
  const articleConfig = {
    "cloud-misconfigurations-catch-first-microsoft-365-aws": {
      title: "Cloud Misconfigurations: Catch the First Microsoft 365 & AWS Incidents",
      description: "Learn to identify and fix the most common cloud misconfigurations in Microsoft 365 and AWS before they lead to security breaches.",
      pillar: "CLOUD"
    },
    "sme-security-audit-checklist-30-days": {
      title: "SME Security Audit Checklist: 30 Days to Better Visibility",
      description: "A practical 30-day security audit checklist designed for small and mid-sized businesses to identify and remediate critical security gaps.",
      pillar: "AUDIT"
    },
    "soc-playbook-triage-escalate-sme-alerts": {
      title: "SOC Playbook: Triage and Escalate SME Security Alerts",
      description: "Reduce alert fatigue and improve incident response with a lightweight SOC triage playbook tailored for small security teams.",
      pillar: "SOC"
    }
  };

  const config = articleConfig[slug] || {
    title: inferTitleFromContent(content, slug),
    description: inferDescriptionFromContent(content),
    pillar: inferPillarFromSlug(slug),
  };

  return {
    title: config.title,
    description: config.description,
    date: new Date().toISOString().split("T")[0],
    pillar: config.pillar,
    tags: ["SME", "Security"]
  };
}

function isBadTitle(title) {
  const t = String(title || "").trim().toLowerCase();
  if (!t) return true;
  if (t === "intro" || t.startsWith("intro ") || t.startsWith("intro(") || t.startsWith("intro-") || t.startsWith("intro–")) return true;
  if (t === "introduction" || t.startsWith("introduction ") || t.startsWith("introduction(")) return true;
  return false;
}

function normalizeMetadata(existing, filename, content) {
  const slug = slugFromFilename(filename);
  const expectedPillar = inferPillarFromSlug(slug);
  const inferred = generateMetadata(filename, content);

  const meta = (existing && typeof existing === "object") ? { ...existing } : {};

  const title = typeof meta.title === "string" ? meta.title.trim() : "";
  if (title.length < 10 || isBadTitle(title)) meta.title = inferred.title;

  const desc = typeof meta.description === "string" ? meta.description.trim() : "";
  if (desc.length < 20) meta.description = inferred.description;

  const date = typeof meta.date === "string" ? meta.date.trim() : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) meta.date = inferred.date;

  if (meta.pillar !== expectedPillar) meta.pillar = expectedPillar;

  if (!Array.isArray(meta.tags) || meta.tags.filter((t) => typeof t === "string" && t.trim()).length === 0) {
    meta.tags = inferred.tags;
  }

  return meta;
}

function upsertMetadataInFile(filePath, filename) {
  const content = fs.readFileSync(filePath, "utf-8");
  const block = findMetadataBlock(content);
  const newline = content.includes("\r\n") ? "\r\n" : "\n";

  if (!block) {
    const normalized = normalizeMetadata(null, filename, content);
    const newContent = renderMetadataBlock(normalized, newline) + content;
    if (CHECK) {
      console.error(`❌ ${filename} - métadonnées manquantes (run without --check to apply)`);
      return true;
    }
    fs.writeFileSync(filePath, newContent.endsWith("\n") ? newContent : newContent + "\n", "utf-8");
    console.log(`✅ ${filename} - métadonnées ajoutées`);
    return true;
  }

  const existingObj = tryParseMetadataObject(block.objSource);
  const normalized = normalizeMetadata(existingObj, filename, content);
  const newBlock = renderMetadataBlock(normalized, newline);
  const currentBlock = content.slice(block.blockStart, block.blockEnd);

  if (normalizeForCompare(currentBlock) === normalizeForCompare(newBlock)) {
    console.log(`✓ ${filename} - métadonnées OK`);
    return false;
  }

  const out = content.slice(0, block.blockStart) + newBlock + content.slice(block.blockEnd);
  if (CHECK) {
    console.error(`❌ ${filename} - métadonnées à normaliser (run without --check to apply)`);
    return true;
  }
  fs.writeFileSync(filePath, out.endsWith("\n") ? out : out + "\n", "utf-8");
  console.log(`✅ ${filename} - métadonnées normalisées`);
  return true;
}

// Traiter tous les fichiers MDX
async function fixAllMetadata() {
  try {
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"));
    
    console.log(`🔍 Vérification de ${files.length} fichiers MDX...\n`);

    let changed = 0;
    let failed = 0;
    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      try {
        if (upsertMetadataInFile(filePath, file)) changed++;
      } catch (err) {
        failed++;
        console.error(`❌ Erreur pour ${file}:`, err && err.message ? err.message : String(err));
      }
    }

    if (failed > 0) process.exit(1);

    if (CHECK && changed > 0) {
      console.error(`\n❌ fix-missing-metadata: changements requis dans ${changed} fichier(s). Exécute sans --check pour appliquer.`);
      process.exit(2);
    }

    console.log(`\n✨ Vérification des métadonnées terminée (${changed} modifié(s)).`);
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    process.exit(1);
  }
}

fixAllMetadata();
