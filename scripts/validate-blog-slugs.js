#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(process.cwd(), "public", "blog-data");
const INDEX_PATH = path.join(OUTPUT_DIR, "_index.json");
const ALIASES_PATH = path.join(OUTPUT_DIR, "_aliases_fr.json");
const OVERRIDES_PATH = path.join(process.cwd(), "scripts", "blog_slug_overrides.fr.json");
const FR_EN_TOKEN_MAP_PATH = path.join(process.cwd(), "scripts", "fr_slug_en_to_fr_tokens.json");

function readJsonFileSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidSlug(value) {
  if (typeof value !== "string") return false;
  if (!value) return false;
  // Lowercase kebab-case ASCII only.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return false;
  if (value.length > 80) return false;
  if (value.includes("--")) return false;
  return true;
}

const SEO_FR_STOPWORDS = new Set([
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

function loadForbiddenEnTokenMap() {
  const raw = readJsonFileSafe(FR_EN_TOKEN_MAP_PATH, null);
  if (raw === null) return {};
  if (!isPlainObject(raw)) return {};
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = String(k || "").trim().toLowerCase();
    const val = String(v || "").trim();
    if (!key) continue;
    out[key] = val;
  }
  return out;
}

// SEO strict: avoid obvious EN tokens leaking into FR slugs.
// Mapping provides a suggested replacement for error messages.
const FORBIDDEN_EN_TOKEN_MAP = loadForbiddenEnTokenMap();
const SEO_FR_FORBIDDEN_EN_TOKENS = new Set(
  Object.keys(FORBIDDEN_EN_TOKEN_MAP).length > 0
    ? Object.keys(FORBIDDEN_EN_TOKEN_MAP)
    : ["phishing", "monitoring", "workflow", "playbook"]
);

function slugTokens(slug) {
  return String(slug || "")
    .split("-")
    .map((t) => t.trim())
    .filter(Boolean);
}

function hasToken(slug, token) {
  return slugTokens(slug).includes(String(token || ""));
}

function tokenIndex(slug, token) {
  return slugTokens(slug).indexOf(String(token || ""));
}

function expectedPrimaryTokens(post) {
  const slugEn = String(post?.slugEn || "").toLowerCase();
  const pillar = String(post?.metadata?.pillar || "").toLowerCase();
  const tags = Array.isArray(post?.metadata?.tags) ? post.metadata.tags : [];

  const required = [];

  if (pillar.includes("soc")) required.push("soc");
  if (pillar.includes("audit")) required.push("audit");
  if (pillar.includes("cloud")) required.push("cloud");

  const hasSmeTag = tags.some((t) => String(t || "").toLowerCase() === "sme");
  const mentionsSme = /(^|-)smes?(-|$)/.test(slugEn);
  if (hasSmeTag || mentionsSme) required.push("pme");

  if (/(^|-)aws(-|$)/.test(slugEn)) required.push("aws");
  if (/(^|-)m365(-|$)/.test(slugEn) || slugEn.includes("microsoft-365")) required.push("m365");

  const priority = ["pme", "soc", "audit", "cloud", "m365", "aws"];
  const uniq = Array.from(new Set(required));
  uniq.sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
  return uniq;
}

function failWith(errors, warnings) {
  for (const w of warnings) {
    console.warn(`⚠️  ${w}`);
  }
  for (const e of errors) {
    console.error(`❌ ${e}`);
  }
  console.error(`\nSlug validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

function okWith(warnings) {
  for (const w of warnings) {
    console.warn(`⚠️  ${w}`);
  }
  console.log("✅ Blog slugs validated");
}

(function main() {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(OUTPUT_DIR)) {
    warnings.push(`Missing output dir: ${OUTPUT_DIR}. Run: node scripts/build-blog.js`);
    return okWith(warnings);
  }

  const postFiles = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  if (postFiles.length === 0) {
    warnings.push("No per-post JSON found in public/blog-data. Did build-blog run?");
    return okWith(warnings);
  }

  const postsByEn = new Map();
  const slugEns = new Set();
  const slugFrs = new Set();

  for (const file of postFiles) {
    const base = file.replace(/\.json$/, "");
    const fullPath = path.join(OUTPUT_DIR, file);
    const post = readJsonFileSafe(fullPath, null);

    if (!post || typeof post !== "object") {
      errors.push(`Invalid JSON in ${fullPath}`);
      continue;
    }

    const slugEn = post.slugEn;
    const slugFr = post.slugFr;

    if (slugEn !== base) {
      errors.push(`Post ${file} has slugEn="${slugEn}" (expected "${base}")`);
    }

    if (!isValidSlug(slugEn)) {
      errors.push(`Invalid slugEn for ${file}: "${slugEn}"`);
    }
    if (!isValidSlug(slugFr)) {
      errors.push(`Invalid slugFr for ${file}: "${slugFr}"`);
    }

    // SEO strict: disallow low-value French stopwords in slugFr
    for (const t of slugTokens(slugFr)) {
      if (SEO_FR_STOPWORDS.has(t)) {
        errors.push(`slugFr contains stopword "${t}" for ${file}: "${slugFr}"`);
        break;
      }
    }

    // SEO strict: disallow certain EN tokens in FR slugs
    for (const t of slugTokens(slugFr)) {
      if (SEO_FR_FORBIDDEN_EN_TOKENS.has(t)) {
        const suggestion = FORBIDDEN_EN_TOKEN_MAP[t]
          ? ` (use "${FORBIDDEN_EN_TOKEN_MAP[t]}")`
          : "";
        errors.push(`slugFr contains EN token "${t}"${suggestion} for ${file}: "${slugFr}"`);
        break;
      }
    }

    // SEO strict: enforce key tokens (audience/pillar/platform)
    for (const required of expectedPrimaryTokens(post)) {
      if (!hasToken(slugFr, required)) {
        errors.push(`slugFr missing required token "${required}" for ${file}: "${slugFr}"`);
      }
    }

    // SEO strict: pillar keyword should appear early for relevance (within first 3 tokens)
    const pillar = String(post?.metadata?.pillar || "").toLowerCase();
    const primary = pillar.includes("soc")
      ? "soc"
      : pillar.includes("audit")
        ? "audit"
        : pillar.includes("cloud")
          ? "cloud"
          : "";
    if (primary) {
      const tokens = slugTokens(slugFr);
      const idx = tokens.indexOf(primary);
      if (idx === -1) {
        // missing already reported above
      } else {
        // Allow a leading "pme" token without harming keyword positioning.
        const offset = tokens[0] === "pme" ? 1 : 0;
        const effectiveIdx = Math.max(0, idx - offset);
        if (effectiveIdx > 2) {
          errors.push(
            `slugFr should place "${primary}" within first 3 significant tokens for SEO (${file}): "${slugFr}"`
          );
        }
      }
    }

    if (slugEns.has(slugEn)) {
      errors.push(`Duplicate slugEn across posts: "${slugEn}"`);
    }
    if (slugFrs.has(slugFr)) {
      errors.push(`Duplicate slugFr across posts: "${slugFr}"`);
    }

    slugEns.add(slugEn);
    slugFrs.add(slugFr);
    postsByEn.set(slugEn, post);
  }

  const index = readJsonFileSafe(INDEX_PATH, null);
  if (!Array.isArray(index)) {
    errors.push("Missing/invalid public/blog-data/_index.json (expected an array)");
  }

  const aliases = readJsonFileSafe(ALIASES_PATH, null);
  if (!isPlainObject(aliases)) {
    errors.push("Missing/invalid public/blog-data/_aliases_fr.json (expected an object)");
  }

  if (Array.isArray(index)) {
    const seenEn = new Set();
    const seenFr = new Set();

    for (const entry of index) {
      const slugEn = entry && entry.slugEn;
      const slugFr = entry && entry.slugFr;

      if (!isValidSlug(slugEn)) {
        errors.push(`Invalid slugEn in _index.json: "${slugEn}"`);
        continue;
      }
      if (!isValidSlug(slugFr)) {
        errors.push(`Invalid slugFr in _index.json for ${slugEn}: "${slugFr}"`);
        continue;
      }

      if (seenEn.has(slugEn)) errors.push(`Duplicate slugEn in _index.json: "${slugEn}"`);
      if (seenFr.has(slugFr)) errors.push(`Duplicate slugFr in _index.json: "${slugFr}"`);
      seenEn.add(slugEn);
      seenFr.add(slugFr);

      if (!postsByEn.has(slugEn)) {
        errors.push(`_index.json references unknown slugEn: "${slugEn}"`);
        continue;
      }

      const post = postsByEn.get(slugEn);
      if (post && post.slugFr !== slugFr) {
        errors.push(
          `slugFr mismatch for ${slugEn}: post has "${post.slugFr}", _index.json has "${slugFr}"`
        );
      }

      if (isPlainObject(aliases)) {
        if (aliases[slugFr] !== slugEn) {
          errors.push(
            `_aliases_fr.json missing or wrong mapping: "${slugFr}" -> "${aliases[slugFr]}" (expected "${slugEn}")`
          );
        }
      }
    }

    // Ensure every post is represented in the index.
    for (const slugEn of slugEns) {
      if (!seenEn.has(slugEn)) {
        errors.push(`Post missing from _index.json: "${slugEn}"`);
      }
    }
  }

  // Validate overrides (if present) only references real posts.
  const overrides = readJsonFileSafe(OVERRIDES_PATH, null);
  if (overrides !== null && !isPlainObject(overrides)) {
    errors.push("scripts/blog_slug_overrides.fr.json must be an object { slugEn: slugFr }");
  }
  if (isPlainObject(overrides)) {
    for (const [slugEn, slugFr] of Object.entries(overrides)) {
      if (!slugEns.has(slugEn)) {
        errors.push(`Override references unknown slugEn: "${slugEn}"`);
      }
      if (typeof slugFr !== "string" || !isValidSlug(slugFr)) {
        errors.push(`Override has invalid slugFr for ${slugEn}: "${slugFr}"`);
      }

      for (const t of slugTokens(slugFr)) {
        if (SEO_FR_STOPWORDS.has(t)) {
          errors.push(`Override slugFr contains stopword "${t}" for ${slugEn}: "${slugFr}"`);
          break;
        }
      }

      for (const t of slugTokens(slugFr)) {
        if (SEO_FR_FORBIDDEN_EN_TOKENS.has(t)) {
          const suggestion = FORBIDDEN_EN_TOKEN_MAP[t]
            ? ` (use "${FORBIDDEN_EN_TOKEN_MAP[t]}")`
            : "";
          errors.push(`Override slugFr contains EN token "${t}"${suggestion} for ${slugEn}: "${slugFr}"`);
          break;
        }
      }
    }
  }

  if (errors.length > 0) return failWith(errors, warnings);
  return okWith(warnings);
})();
