#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(process.cwd(), "public", "blog-data");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isSuspiciousTitle(titleFr) {
  const t = String(titleFr || "").trim();
  if (!t) return true;
  const lower = t.toLowerCase();

  // Common signs of bad FR title translation: leftover EN verbs, word order, or untranslated “review first”.
  const enSignals = [
    "secure ",
    " review ",
    " review",
    " first",
    " one afternoon",
    "settings",
  ];
  if (enSignals.some((s) => lower.includes(s.trim()))) return true;

  // Titles with multiple consecutive capitalized tokens often come from literal word-by-word translations.
  const weirdCaps = /\b(?:[A-Z][a-z]{0,2}|[A-Z]{2,})\b(?:\s+\b(?:[A-Z][a-z]{0,2}|[A-Z]{2,})\b){5,}/.test(t);
  if (weirdCaps) return true;

  return false;
}

(function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.error(`Missing ${OUTPUT_DIR}. Run: node scripts/build-blog.js`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

  const rows = [];
  for (const file of files) {
    const fullPath = path.join(OUTPUT_DIR, file);
    const post = readJson(fullPath);
    const slugEn = post.slugEn || file.replace(/\.json$/, "");
    const titleFr = post?.translatedMetadata?.fr?.title || "";
    rows.push({ slugEn, titleFr, suspicious: isSuspiciousTitle(titleFr) });
  }

  rows.sort((a, b) => a.slugEn.localeCompare(b.slugEn));

  const suspicious = rows.filter((r) => r.suspicious);
  if (suspicious.length === 0) {
    console.log(`✅ FR title audit: all good (${rows.length} posts).`);
    return;
  }

  console.log(`⚠️  FR title audit: ${suspicious.length}/${rows.length} look suspicious.`);
  for (const r of suspicious) {
    console.log(`- ${r.slugEn}: ${r.titleFr}`);
  }
})();
