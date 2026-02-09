#!/usr/bin/env node
/*
Auto-assign controlled `topic` (sub-category) + enrich `tags` for blog MDX files.

- Idempotent: running multiple times yields no further changes.
- Safe defaults: keeps existing tags and appends inferred ones.
- Modes:
  - default: modifies files in place
  - --check: exits non-zero if changes would be made

This script is intentionally dependency-free.
*/

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");

const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");

const TOPICS_BY_PILLAR = {
  SOC: [
    "SOC Setup",
    "Alert Triage",
    "Escalation & Comms",
    "Noise Reduction",
    "Incident Response",
    "Reporting & KPIs",
  ],
  AUDIT: [
    "Audit Checklists",
    "Evidence Collection",
    "SaaS/Vendor Review",
    "Remediation Roadmap",
    "Risk Prioritization",
  ],
  CLOUD: [
    "Cloud Foundations",
    "Misconfigurations",
    "Migration Delivery",
    "Planning & Waves",
    "Hypercare & Stabilization",
  ],
};

// Tags managed by this script. We remove these before re-inferring so we can
// correct earlier bad inference without wiping any custom tags the author added.
const MANAGED_TAGS = new Set(
  [
    // Base
    "sme",
    "security",

    // Formats
    "checklist",
    "playbook",
    "template",
    "plan",
    "runbook",
    "guide",

    // SOC
    "incident-response",
    "triage",
    "alerts",
    "noise-reduction",
    "escalation",
    "soc-setup",
    "operations",
    "phishing",
    "workflow",

    // AUDIT
    "security-audit",
    "evidence",
    "vendor-review",
    "saas",
    "roadmap",
    "prioritization",

    // CLOUD
    "foundations",
    "misconfigurations",
    "iam",
    "storage",
    "m365",
    "aws",
    "day-1",
    "baseline",
    "migration",
    "cutover",
    "hypercare",
  ].map((t) => t.toLowerCase())
);

function extractMetadataBlock(source) {
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

  // Find the trailing semicolon after the object literal, if present
  let semiIdx = endIdx + 1;
  while (semiIdx < source.length && /\s/.test(source[semiIdx])) semiIdx++;
  if (source[semiIdx] === ";") semiIdx++;

  const objSource = source.substring(startIdx, endIdx + 1);
  const fullBlock = source.substring(startMatch.index, semiIdx);

  let metadata;
  try {
    metadata = Function(`return (${objSource})`)();
  } catch {
    return null;
  }

  return {
    metadata,
    start: startMatch.index,
    end: semiIdx,
    objSource,
    fullBlock,
  };
}

function toJsValue(value, indentLevel = 0) {
  const indent = "  ".repeat(indentLevel);

  if (value === null) return "null";
  if (typeof value === "string") {
    // Keep it simple: escape backslashes + quotes + newlines
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/\r\n/g, "\\n")
      .replace(/\n/g, "\\n")
      .replace(/"/g, "\\\"");
    return `"${escaped}"`;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map((v) => toJsValue(v, indentLevel)).join(", ");
    return `[${items}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const inner = entries
      .map(([k, v]) => `${indent}  ${k}: ${toJsValue(v, indentLevel + 1)},`)
      .join("\n");
    return `\n${indent}{\n${inner}\n${indent}}`;
  }
  return "undefined";
}

function renderMetadataBlock(metadataObj, newline = "\n") {
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

  // Stable key order for diff-friendly output
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

  // Important: do NOT force an extra trailing newline here.
  // The source file typically already has one or more newlines after the block;
  // adding another makes the script non-idempotent (each run adds blank lines).
  return `export const metadata = {${newline}${lines.join(newline)}${newline}};`;
}

function dedupePreserveOrder(values) {
  const seen = new Set();
  const out = [];
  for (const v of values) {
    const key = String(v).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function stripManagedTags(existing) {
  const tags = Array.isArray(existing) ? existing.slice() : [];
  return tags.filter((t) => !MANAGED_TAGS.has(normalizeToken(t)));
}

function ensureBaseTags(existing) {
  const tags = Array.isArray(existing) ? existing.slice() : [];
  const lower = new Set(tags.map((t) => String(t).toLowerCase()));

  // Keep the UI chips useful: always show SME + Security first.
  const base = [];
  if (!lower.has("sme")) base.push("SME");
  if (!lower.has("security")) base.push("Security");

  return dedupePreserveOrder([...base, ...tags]);
}

function inferTopicAndTags({ slug, pillar, title, source }) {
  // Important: infer from slug/title only.
  // Using full source caused extremely broad matches (e.g. "SaaS" in examples)
  // and misclassified most posts.
  const slugText = normalizeToken(slug);
  const titleText = normalizeToken(title);
  const text = `${slugText} ${titleText}`;

  function hasAny(...needles) {
    return needles.some((n) => text.includes(String(n).toLowerCase()));
  }

  const formatTags = [];
  if (hasAny("checklist")) formatTags.push("checklist");
  if (hasAny("playbook")) formatTags.push("playbook");
  if (hasAny("template")) formatTags.push("template");
  if (hasAny("runbook")) formatTags.push("runbook");
  if (hasAny("guide")) formatTags.push("guide");
  if (hasAny("plan")) formatTags.push("plan");

  if (pillar === "SOC") {
    // Specific beats generic. Order matters.
    if (hasAny("build-practical", "monitor-run", "minimum-viable", "soc setup", "soc-setup")) {
      return { topic: "SOC Setup", tags: dedupePreserveOrder(["soc-setup", "operations", ...formatTags]) };
    }
    if (hasAny("noise")) {
      return { topic: "Noise Reduction", tags: dedupePreserveOrder(["triage", "noise-reduction", ...formatTags]) };
    }
    if (hasAny("escalat", "handoff")) {
      return { topic: "Escalation & Comms", tags: dedupePreserveOrder(["escalation", "triage", ...formatTags]) };
    }
    if (hasAny("incident-response", "incident response")) {
      return { topic: "Incident Response", tags: dedupePreserveOrder(["incident-response", "playbook", ...formatTags]) };
    }
    if (hasAny("phishing")) {
      return { topic: "Alert Triage", tags: dedupePreserveOrder(["triage", "alerts", "phishing", "playbook", ...formatTags]) };
    }
    if (hasAny("triage", "alert")) {
      const extra = [];
      if (hasAny("workflow")) extra.push("workflow");
      return { topic: "Alert Triage", tags: dedupePreserveOrder(["triage", "alerts", ...extra, ...formatTags]) };
    }

    return { topic: "SOC Setup", tags: dedupePreserveOrder(["soc-setup", "operations", ...formatTags]) };
  }

  if (pillar === "AUDIT") {
    if (hasAny("evidence", "prep", "gather", "template", "proof")) {
      return { topic: "Evidence Collection", tags: dedupePreserveOrder(["evidence", "template", ...formatTags]) };
    }
    if (hasAny("saas", "vendor", "third-party")) {
      return { topic: "SaaS/Vendor Review", tags: dedupePreserveOrder(["saas", "vendor-review", "checklist", ...formatTags]) };
    }
    if (hasAny("30-days", "30 days", "roadmap")) {
      return { topic: "Remediation Roadmap", tags: dedupePreserveOrder(["roadmap", "prioritization", ...formatTags]) };
    }
    if (hasAny("checklist", "question")) {
      return { topic: "Audit Checklists", tags: dedupePreserveOrder(["security-audit", "checklist", ...formatTags]) };
    }

    return { topic: "Audit Checklists", tags: dedupePreserveOrder(["security-audit", "checklist", ...formatTags]) };
  }

  if (pillar === "CLOUD") {
    if (hasAny("migration", "cutover")) {
      const t = ["migration"];
      if (hasAny("cutover")) t.push("cutover");
      if (hasAny("runbook")) t.push("runbook");
      if (hasAny("hypercare")) t.push("hypercare");
      return { topic: "Migration Delivery", tags: dedupePreserveOrder([...t, ...formatTags]) };
    }

    if (hasAny("misconfiguration", "misconfigurations", "misconfig")) {
      const extra = [];
      if (hasAny("iam")) extra.push("iam");
      if (hasAny("storage")) extra.push("storage");
      return { topic: "Misconfigurations", tags: dedupePreserveOrder(["misconfigurations", ...extra, ...formatTags]) };
    }

    // Foundations (day-1 / baseline hardening)
    const foundationTags = [];
    if (hasAny("m365", "microsoft-365", "microsoft 365", "tenant")) foundationTags.push("m365");
    if (hasAny("aws")) foundationTags.push("aws");
    if (hasAny("day-one", "day one", "day-1")) foundationTags.push("day-1");
    if (hasAny("settings", "baseline")) foundationTags.push("baseline");

    return {
      topic: "Cloud Foundations",
      tags: dedupePreserveOrder(["foundations", ...foundationTags, ...formatTags]),
    };
  }

  // Fallback
  return { topic: "Cloud Foundations", tags: ["foundations"] };
}

function normalizePillar(pillar, slug) {
  const p = String(pillar || "").toUpperCase();
  if (p === "SOC" || p === "AUDIT" || p === "CLOUD") return p;

  const s = String(slug || "").toLowerCase();
  if (s.includes("audit")) return "AUDIT";
  if (s.includes("cloud") || s.includes("aws") || s.includes("azure") || s.includes("gcp") || s.includes("m365") || s.includes("microsoft-365")) return "CLOUD";
  if (s.includes("soc") || s.includes("alert") || s.includes("triage") || s.includes("playbook")) return "SOC";
  return "SOC";
}

function validateTopicForPillar(pillar, topic) {
  const allowed = TOPICS_BY_PILLAR[pillar] || [];
  return allowed.includes(topic);
}

function upsertBlogFile(filePath) {
  const slug = path.basename(filePath).replace(/\.mdx$/i, "");
  const source = fs.readFileSync(filePath, "utf8");
  const block = extractMetadataBlock(source);
  if (!block) return { changed: false, error: "Missing/invalid metadata block" };

  const metadata = { ...(block.metadata || {}) };
  metadata.pillar = normalizePillar(metadata.pillar, slug);

  const inferred = inferTopicAndTags({
    slug,
    pillar: metadata.pillar,
    title: metadata.title,
    source,
  });

  // Topic: auto-correct to the inferred topic unless the author explicitly locks it.
  // This lets us fix earlier bad inference while still allowing manual override.
  const isTopicLocked = metadata.topicLocked === true;
  if (!isTopicLocked) {
    metadata.topic = inferred.topic;
  }

  // Safety: if topic is missing or invalid for the pillar, force it.
  if (typeof metadata.topic !== "string" || metadata.topic.trim() === "") {
    metadata.topic = inferred.topic;
  }
  if (!validateTopicForPillar(metadata.pillar, metadata.topic)) {
    metadata.topic = inferred.topic;
  }

  // Tags: keep existing but ensure SME+Security first, then add inferred tags.
  const unmanaged = stripManagedTags(metadata.tags);
  const tags = ensureBaseTags(unmanaged);
  metadata.tags = dedupePreserveOrder([...tags, ...inferred.tags]);

  const newBlock = renderMetadataBlock(metadata, "\n");

  const updated = source.slice(0, block.start) + newBlock + source.slice(block.end);
  if (updated === source) return { changed: false };

  if (!CHECK) {
    fs.writeFileSync(filePath, updated, "utf8");
  }

  return { changed: true };
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog dir not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(BLOG_DIR, f));

  let changed = 0;
  const failures = [];

  for (const filePath of files) {
    const res = upsertBlogFile(filePath);
    if (res.error) failures.push({ file: path.basename(filePath), error: res.error });
    if (res.changed) changed++;
  }

  if (failures.length > 0) {
    console.error(`❌ auto-tagging failed (${failures.length} file(s))`);
    for (const f of failures) console.error(`- ${f.file}: ${f.error}`);
    process.exit(1);
  }

  if (CHECK && changed > 0) {
    console.error(`❌ auto-tagging needed changes in ${changed} file(s). Run without --check to apply.`);
    process.exit(2);
  }

  console.log(`✅ auto-tagging complete (${changed} file(s) ${CHECK ? "would be" : ""} updated)`);
}

main();
