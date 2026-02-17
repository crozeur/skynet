#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const TOPICS_BY_PILLAR = {
  SOC: new Set([
    "SOC Setup",
    "Alert Triage",
    "Escalation & Comms",
    "Noise Reduction",
    "Incident Response",
    "Reporting & KPIs",
  ]),
  AUDIT: new Set([
    "Audit Checklists",
    "Evidence Collection",
    "SaaS/Vendor Review",
    "Remediation Roadmap",
    "Risk Prioritization",
  ]),
  CLOUD: new Set([
    "Cloud Foundations",
    "Misconfigurations",
    "Migration Delivery",
    "Planning & Waves",
    "Hypercare & Stabilization",
  ]),
};

function extractMetadataFromMDX(source) {
  const startMatch = source.match(/export\s+const\s+metadata\s*=\s*\{/);
  if (!startMatch) return null;

  const startIdx = startMatch.index + startMatch[0].length - 1;
  let braceCount = 0;
  let endIdx = -1;
  let inStr = false;
  let strCh = "";
  let escape = false;

  for (let i = startIdx; i < source.length; i++) {
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
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx === -1) return null;
  const objSource = source.substring(startIdx, endIdx + 1);

  try {
    return Function(`return (${objSource})`)();
  } catch {
    return null;
  }
}

function inferPillarFromSlug(slug) {
  const s = String(slug || "").toLowerCase();
  if (s.includes("audit")) return "AUDIT";
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

function isBadTitle(title) {
  const t = String(title || "").trim().toLowerCase();
  if (!t) return true;
  if (t === "intro" || t.startsWith("intro ") || t.startsWith("intro(") || t.startsWith("intro-") || t.startsWith("intro–")) return true;
  if (t === "introduction" || t.startsWith("introduction ") || t.startsWith("introduction(")) return true;
  return false;
}

function validateOne(filePath) {
  const slug = path.basename(filePath).replace(/\.mdx$/i, "");
  const source = fs.readFileSync(filePath, "utf8");
  const metadata = extractMetadataFromMDX(source);

  const errors = [];
  if (!metadata) {
    errors.push("Missing `export const metadata` block");
    return errors;
  }

  if (typeof metadata.title !== "string" || metadata.title.trim().length < 10 || isBadTitle(metadata.title)) {
    errors.push(`Bad title: ${JSON.stringify(metadata.title)}`);
  }

  if (typeof metadata.description !== "string" || metadata.description.trim().length < 20) {
    errors.push("Missing/too short description");
  }

  if (typeof metadata.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.date)) {
    errors.push(`Invalid date: ${JSON.stringify(metadata.date)}`);
  }

  const allowedPillars = new Set(["SOC", "AUDIT", "CLOUD"]);
  if (!allowedPillars.has(metadata.pillar)) {
    errors.push(`Invalid pillar: ${JSON.stringify(metadata.pillar)}`);
  } else {
    const expected = inferPillarFromSlug(slug);
    if (metadata.pillar !== expected) {
      errors.push(`Pillar mismatch for slug '${slug}': expected ${expected}, got ${metadata.pillar}`);
    }

    // Topic is required and must match the controlled vocabulary for the pillar.
    if (typeof metadata.topic !== "string" || metadata.topic.trim().length === 0) {
      errors.push("Missing/empty topic (sub-category)");
    } else {
      const allowedTopics = TOPICS_BY_PILLAR[metadata.pillar];
      if (allowedTopics && !allowedTopics.has(metadata.topic)) {
        errors.push(
          `Invalid topic for pillar ${metadata.pillar}: ${JSON.stringify(metadata.topic)}`
        );
      }
    }
  }

  return errors;
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog dir not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  const failures = [];
  const coverUsage = new Map();

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const errors = validateOne(fullPath);
    if (errors.length > 0) {
      failures.push({ file, errors });
    }

    const source = fs.readFileSync(fullPath, "utf8");
    const metadata = extractMetadataFromMDX(source);
    const coverImage =
      metadata && typeof metadata.coverImage === "string" ? metadata.coverImage.trim() : "";

    if (!coverImage) {
      failures.push({ file, errors: ["Missing/empty coverImage"] });
      continue;
    }

    if (!coverUsage.has(coverImage)) {
      coverUsage.set(coverImage, []);
    }
    coverUsage.get(coverImage).push(file);
  }

  for (const [coverImage, usedBy] of coverUsage.entries()) {
    if (usedBy.length > 1) {
      failures.push({
        file: usedBy.join(", "),
        errors: [`Duplicate coverImage across posts: ${coverImage}`],
      });
    }
  }

  if (failures.length > 0) {
    console.error(`❌ Blog metadata validation failed (${failures.length} file(s))`);
    for (const f of failures) {
      console.error(`- ${f.file}`);
      for (const e of f.errors) console.error(`  - ${e}`);
    }
    process.exit(1);
  }

  console.log(`✅ Blog metadata validation OK (${files.length} file(s))`);
}

main();
