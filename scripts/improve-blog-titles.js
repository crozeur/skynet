#!/usr/bin/env node
/**
 * improve-blog-titles.js
 *
 * Runs on every new/updated MDX article and:
 *  1. Fixes mojibake (â€™ → ', â€œ → ", etc.) in title + description + coverAlt
 *  2. Normalises tech acronyms (kql, aws, soc, etc. → upper-case)
 *  3. Smart-trims titles that exceed MAX_TITLE_LEN chars (keeps the subtitle
 *     if the short form would be too short, otherwise drops it)
 *  4. Writes the MDX file back in place (idempotent)
 *
 * Usage :  node scripts/improve-blog-titles.js [--check]
 *          node scripts/improve-blog-titles.js path/to/article.mdx  (single file)
 */

const fs   = require("fs");
const path = require("path");

const BLOG_DIR      = path.join(process.cwd(), "content", "blog");
const MAX_TITLE_LEN = 90;   // chars; beyond this we try to shorten
const CHECK         = process.argv.includes("--check");

// ─────────────────────────────────────────────────────────────────────────────
//  1. Mojibake healing map
//     Source: UTF-8 smart-typography bytes mis-decoded as Windows-1252
// ─────────────────────────────────────────────────────────────────────────────
// All keys are expressed as \uXXXX escapes to avoid encoding issues when the
// source file is committed/transmitted across platforms (curly quotes like
// U+201C/U+201D look identical to straight quotes and cause SyntaxErrors).
//
// How to read each entry:
//   UTF-8 bytes of the original char → mis-decoded as cp1252 → Unicode codepoints used here
//
const MOJIBAKE_MAP = [
  // Right single quote ' U+2019: UTF-8 E2 80 99 → cp1252 U+00E2 U+20AC U+2122
  ["\u00e2\u20ac\u2122", "\u2019"],
  // Left single quote ' U+2018: UTF-8 E2 80 98 → cp1252 U+00E2 U+20AC U+02DC
  ["\u00e2\u20ac\u02dc", "\u2018"],
  // Left double quote " U+201C: UTF-8 E2 80 9C → cp1252 U+00E2 U+20AC U+0153
  ["\u00e2\u20ac\u0153", "\u201c"],
  // Right double quote " U+201D: UTF-8 E2 80 9D → cp1252 U+00E2 U+20AC U+009D
  ["\u00e2\u20ac\u009d", "\u201d"],
  // Em dash — U+2014: UTF-8 E2 80 94 → cp1252 U+00E2 U+20AC U+201D
  ["\u00e2\u20ac\u201d", "\u2014"],
  // En dash – U+2013: UTF-8 E2 80 93 → cp1252 U+00E2 U+20AC U+201C
  ["\u00e2\u20ac\u201c", "\u2013"],
  // Bullet • U+2022: UTF-8 E2 80 A2 → cp1252 U+00E2 U+20AC U+00A2
  ["\u00e2\u20ac\u00a2", "\u2022"],
  // Ellipsis … U+2026: UTF-8 E2 80 A6 → cp1252 U+00E2 U+20AC U+00A6
  ["\u00e2\u20ac\u00a6", "\u2026"],
  // Trailing 2-char fragment fallback (when the 3rd byte was dropped/undefined)
  ["\u00e2\u20ac", "\u201d"],
  // Accented Latin
  ["\u00c3\u00a9", "\u00e9"],  // é
  ["\u00c3\u00a0", "\u00e0"],  // à
  ["\u00c3\u00a8", "\u00e8"],  // è
  ["\u00c3\u00b4", "\u00f4"],  // ô
  ["\u00c3\u00a7", "\u00e7"],  // ç
  ["\u00c3\u00bb", "\u00fb"],  // û
  ["\u00c3\u00ae", "\u00ee"],  // î
  ["\u00c3\u00aa", "\u00ea"],  // ê
  // Trademark/copyright/registered
  ["\u00e2\u201e\u00a2", "\u2122"],  // ™  UTF-8 E2 84 A2 → cp1252 U+00E2 U+201E U+00A2
  ["\u00c2\u00a9", "\u00a9"],        // ©  UTF-8 C2 A9 → cp1252 U+00C2 U+00A9
  ["\u00c2\u00ae", "\u00ae"],        // ®  UTF-8 C2 AE → cp1252 U+00C2 U+00AE
];

function fixMojibake(text) {
  let s = String(text || "");
  for (const [bad, good] of MOJIBAKE_MAP) {
    s = s.split(bad).join(good);
  }
  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
//  2. Tech-acronym normalisation  (applied to every word in the title)
// ─────────────────────────────────────────────────────────────────────────────
const ACRONYM_MAP = new Map(
  [
    "SOC","SIEM","EDR","XDR","MDR","TDR","MSSP","CSIRT","CIRT",
    "AWS","GCP","GKE","EKS","IAM","S3","EC2","VPC","VPN","DNS",
    "AZURE","M365","AAD","MFA","SSO","SAML","OIDC","OAuth","JWT",
    "KQL","API","REST","SDK","CLI","CI","CD","YAML","JSON","CSV",
    "SOC2","PCI","GDPR","NIS2","DORA","ISO27001",
    "SaaS","IaaS","PaaS","FaaS","CaaS",
    "MDM","MAM","BYOD","CDR","DLP","CASB","CNAPP","CSPM","CWPP",
    "ENTRA","DEFENDER","SENTINEL","CLOUDTRAIL","CLOUDWATCH",
    "TLS","SSL","PKI","MTLS","2FA","OTP","TOTP",
    "SME","IT","OT","SCADA","ICS","CVE","CVSS","MITRE","ATT&CK",
    "OSQUERY","SPLUNK","ELASTIC","GRAFANA",
  ].map((a) => [a.toLowerCase(), a])
);

function normAcronyms(title) {
  // Walk word by word — preserve casing for words not in the map
  return title.replace(/\b[A-Za-z][A-Za-z0-9&.]*\b/g, (word) => {
    const key = word.toLowerCase();
    return ACRONYM_MAP.has(key) ? ACRONYM_MAP.get(key) : word;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  3. Smart title shortening
//     "Long headline: Very Long Subtitle That Pads The Title" → "Long headline"
//     (only if the main clause alone is ≥ 40 chars)
// ─────────────────────────────────────────────────────────────────────────────
function shortenTitle(title) {
  if (title.length <= MAX_TITLE_LEN) return title;

  // Try splitting on the first colon or em-dash separator
  const SEP_RE = /\s*[:—]\s*/;
  const parts = title.split(SEP_RE);
  if (parts.length >= 2) {
    const main = parts[0].trim();
    if (main.length >= 40) return main;
    // Keep first two parts if they fit
    const twopart = (parts[0] + ": " + parts[1]).trim();
    if (twopart.length <= MAX_TITLE_LEN) return twopart;
    return main;
  }

  // No separator — hard-truncate at last space before MAX_TITLE_LEN
  const cut = title.slice(0, MAX_TITLE_LEN);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
}

// ─────────────────────────────────────────────────────────────────────────────
//  4. Metadata block parser (same logic as fix-missing-metadata.js)
// ─────────────────────────────────────────────────────────────────────────────
function findMetadataBlock(source) {
  const m = source.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!m || typeof m.index !== "number") return null;
  const blockStart = m.index;
  const braceStart = blockStart + m[0].length - 1;

  let braceCount = 0, inStr = false, strCh = "", escape = false, end = -1;
  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === strCh) { inStr = false; strCh = ""; }
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; strCh = ch; continue; }
    if (ch === "{") braceCount++;
    if (ch === "}") { braceCount--; if (braceCount === 0) { end = i; break; } }
  }
  if (end === -1) return null;

  let blockEnd = end + 1;
  if (source[blockEnd] === ";") blockEnd++;
  while (blockEnd < source.length && " \t\n\r".includes(source[blockEnd])) blockEnd++;

  return { blockStart, blockEnd, raw: source.slice(blockStart, end + 1) };
}

// Very small eval-safe extractor : grabs string values for known string fields
function extractStringField(objSource, fieldName) {
  const re = new RegExp(`\\b${fieldName}\\s*:\\s*["']([^"'\\\\]*(\\\\.[^"'\\\\]*)*)["']`);
  const m = objSource.match(re);
  return m ? m[1].replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\'/g, "'") : null;
}

function replaceStringField(objSource, fieldName, newValue) {
  // Replace the string value for a specific field key (single or double quotes)
  const re = new RegExp(`(\\b${fieldName}\\s*:\\s*)["']([^"'\\\\]*(\\\\.[^"'\\\\]*)*)["']`);
  const escaped = String(newValue).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return objSource.replace(re, `$1"${escaped}"`);
}

// ─────────────────────────────────────────────────────────────────────────────
//  5. Process a single MDX file
// ─────────────────────────────────────────────────────────────────────────────
function processFile(filePath, filename) {
  const source = fs.readFileSync(filePath, "utf-8");
  const block  = findMetadataBlock(source);
  if (!block) {
    console.log(`  skip  ${filename} (no metadata block)`);
    return false;
  }

  let obj = block.raw;

  // Fields we touch
  const FIELDS = ["title", "description", "coverAlt"];
  let changed = false;

  for (const field of FIELDS) {
    const original = extractStringField(obj, field);
    if (!original) continue;

    let improved = fixMojibake(original);
    if (field === "title") {
      improved = normAcronyms(improved);
      improved = shortenTitle(improved);
    }
    improved = improved.trim();

    if (improved !== original) {
      obj = replaceStringField(obj, field, improved);
      changed = true;
    }
  }

  if (!changed) {
    console.log(`  ok    ${filename}`);
    return false;
  }

  if (CHECK) {
    console.error(`  NEEDS UPDATE  ${filename}`);
    return true;
  }

  const newSource =
    source.slice(0, block.blockStart) +
    obj +
    source.slice(block.blockStart + block.raw.length);

  fs.writeFileSync(filePath, newSource, "utf-8");
  console.log(`  fixed ${filename}`);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
//  6. Entry point
// ─────────────────────────────────────────────────────────────────────────────
function main() {
  // Support single-file mode: node improve-blog-titles.js content/blog/foo.mdx
  const singleFile = process.argv.slice(2).find((a) => a.endsWith(".mdx"));

  const files = singleFile
    ? [path.resolve(singleFile)]
    : fs.readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => path.join(BLOG_DIR, f));

  console.log(`\n🔤 Amélioration des titres (${files.length} fichier(s))...\n`);

  let changed = 0;
  for (const fp of files) {
    const name = path.basename(fp);
    try {
      if (processFile(fp, name)) changed++;
    } catch (err) {
      console.error(`  ERROR ${name}:`, err.message);
    }
  }

  console.log(`\n✨ ${changed} fichier(s) mis à jour.\n`);

  if (CHECK && changed > 0) process.exit(1);
}

main();
