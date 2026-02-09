#!/usr/bin/env node
/*
Validate that precompiled blog artifacts in public/blog-data are in sync with content/blog.

Checks:
- Every content/blog/*.mdx has a corresponding public/blog-data/<slug>.json
- No unexpected extra JSON files exist (except _index.json and _aliases_fr.json)
- _index.json contains one entry per slugEn and matches the set of MDX slugs
- _aliases_fr.json maps every slugFr in _index.json back to its slugEn
*/

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const DATA_DIR = path.join(ROOT, "public", "blog-data");

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    fail(`Invalid JSON: ${filePath} (${err && err.message ? err.message : String(err)})`);
  }
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) fail(`Missing blog dir: ${BLOG_DIR}`);
  if (!fs.existsSync(DATA_DIR)) fail(`Missing blog-data dir: ${DATA_DIR}`);

  const mdxSlugs = new Set(
    fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/i, ""))
  );

  const jsonFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  const allowedMeta = new Set(["_index.json", "_aliases_fr.json"]);

  const jsonSlugs = new Set(
    jsonFiles
      .filter((f) => !allowedMeta.has(f))
      .map((f) => f.replace(/\.json$/i, ""))
  );

  const missingJson = [];
  for (const slug of mdxSlugs) {
    if (!jsonSlugs.has(slug)) missingJson.push(slug);
  }

  const extraJson = [];
  for (const slug of jsonSlugs) {
    if (!mdxSlugs.has(slug)) extraJson.push(slug);
  }

  if (missingJson.length > 0) {
    fail(
      `Missing blog-data JSON for ${missingJson.length} post(s): ${missingJson
        .slice(0, 20)
        .join(", ")}${missingJson.length > 20 ? " …" : ""}. Run: node scripts/build-blog.js --skip-translation`
    );
  }

  if (extraJson.length > 0) {
    fail(
      `Extra blog-data JSON without matching MDX (${extraJson.length}): ${extraJson
        .slice(0, 20)
        .join(", ")}${extraJson.length > 20 ? " …" : ""}. Run: node scripts/build-blog.js --skip-translation`
    );
  }

  const indexPath = path.join(DATA_DIR, "_index.json");
  const aliasesPath = path.join(DATA_DIR, "_aliases_fr.json");
  if (!fs.existsSync(indexPath)) fail(`Missing ${indexPath}`);
  if (!fs.existsSync(aliasesPath)) fail(`Missing ${aliasesPath}`);

  const index = readJson(indexPath);
  const aliases = readJson(aliasesPath);

  if (!Array.isArray(index)) fail("_index.json must be an array");
  if (typeof aliases !== "object" || aliases === null || Array.isArray(aliases)) {
    fail("_aliases_fr.json must be an object");
  }

  const indexSlugEn = new Set();
  const badIndex = [];
  for (const entry of index) {
    const slugEn = entry && typeof entry.slugEn === "string" ? entry.slugEn : "";
    const slugFr = entry && typeof entry.slugFr === "string" ? entry.slugFr : "";
    if (!slugEn || !slugFr) {
      badIndex.push(JSON.stringify(entry));
      continue;
    }
    indexSlugEn.add(slugEn);
    if (aliases[slugFr] !== slugEn) {
      fail(`Alias mismatch: _aliases_fr.json[${JSON.stringify(slugFr)}] should be ${JSON.stringify(slugEn)}`);
    }
  }

  if (badIndex.length > 0) {
    fail(`Invalid entries in _index.json (${badIndex.length}). Run: node scripts/build-blog.js --skip-translation`);
  }

  const missingInIndex = [];
  for (const slug of mdxSlugs) {
    if (!indexSlugEn.has(slug)) missingInIndex.push(slug);
  }

  if (missingInIndex.length > 0) {
    fail(
      `Missing _index.json entries for ${missingInIndex.length} slug(s): ${missingInIndex
        .slice(0, 20)
        .join(", ")}${missingInIndex.length > 20 ? " …" : ""}. Run: node scripts/build-blog.js --skip-translation`
    );
  }

  console.log(`✅ Blog data sync OK (${mdxSlugs.size} post(s))`);
}

main();
