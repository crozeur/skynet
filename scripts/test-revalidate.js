#!/usr/bin/env node

// Usage:
//   REVALIDATE_SECRET=... node scripts/test-revalidate.js --slug my-post-slug
// Optional:
//   SITE_URL=https://www.skynet-consulting.net
//   node scripts/test-revalidate.js --slug my-post-slug --site https://www.skynet-consulting.net

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(name);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

const slugArg = getArg("--slug") || process.env.SLUG || "";
const siteArg = getArg("--site") || process.env.SITE_URL || "https://www.skynet-consulting.net";
const secret = (process.env.REVALIDATE_SECRET || "").trim();

if (!slugArg.trim()) {
  console.error("❌ Missing slug. Example: node scripts/test-revalidate.js --slug 30-question-security-audit-checklist-sme-it-managers");
  process.exit(1);
}

if (!secret) {
  console.error("❌ Missing REVALIDATE_SECRET env var. Example (PowerShell):");
  console.error('   $env:REVALIDATE_SECRET = "<your secret>"');
  console.error('   node scripts/test-revalidate.js --slug "' + slugArg + '"');
  process.exit(1);
}

async function main() {
  const url = new URL("/api/revalidate", siteArg).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": secret,
    },
    body: JSON.stringify({ slug: slugArg.trim() }),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    console.error(`❌ Revalidate failed: HTTP ${res.status}`);
    console.error(json);
    process.exit(1);
  }

  console.log("✅ Revalidate OK");
  console.log(json);
}

main().catch((err) => {
  console.error("❌ Unexpected error", err);
  process.exit(1);
});
