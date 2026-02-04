#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(process.cwd(), "public", "blog-data");
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

function slugTokens(slug) {
  return String(slug || "")
    .split("-")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function loadForbiddenMap() {
  const raw = readJsonFileSafe(FR_EN_TOKEN_MAP_PATH, null);
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

(function main() {
  const forbiddenMap = loadForbiddenMap();
  const forbidden = new Set(Object.keys(forbiddenMap));

  if (forbidden.size === 0) {
    console.log("✅ No forbidden EN token map configured; nothing to audit.");
    return;
  }

  const findings = [];

  // 1) Scan overrides (these define canonicals; must be clean)
  const overrides = readJsonFileSafe(OVERRIDES_PATH, null);
  if (isPlainObject(overrides)) {
    for (const [slugEn, slugFr] of Object.entries(overrides)) {
      const hits = slugTokens(slugFr).filter((t) => forbidden.has(t));
      if (hits.length > 0) {
        findings.push({
          kind: "override",
          slugEn,
          slugFr,
          hits,
        });
      }
    }
  }

  // 2) Scan built post artifacts (public/blog-data/*.json excluding _*)
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs
      .readdirSync(OUTPUT_DIR)
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

    for (const file of files) {
      const fullPath = path.join(OUTPUT_DIR, file);
      const post = readJsonFileSafe(fullPath, null);
      if (!post || typeof post !== "object") continue;

      const slugEn = post.slugEn;
      const slugFr = post.slugFr;
      const hits = slugTokens(slugFr).filter((t) => forbidden.has(t));
      if (hits.length > 0) {
        findings.push({
          kind: "post",
          slugEn,
          slugFr,
          hits,
        });
      }
    }
  }

  if (findings.length === 0) {
    console.log(`✅ FR slug audit passed (no English token leaks in ${forbidden.size} tracked terms).`);
    return;
  }

  console.error(`❌ FR slug audit failed: ${findings.length} item(s) contain English token(s).`);
  for (const f of findings) {
    const uniqueHits = Array.from(new Set(f.hits));
    const hints = uniqueHits
      .map((t) => (forbiddenMap[t] ? `${t}→${forbiddenMap[t]}` : t))
      .join(", ");
    console.error(`- [${f.kind}] ${f.slugEn}: ${f.slugFr} (${hints})`);
  }

  process.exit(1);
})();
