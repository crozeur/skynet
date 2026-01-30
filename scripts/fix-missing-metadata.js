#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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

// Vérifier si le fichier a déjà des métadonnées
function hasMetadata(content) {
  return /export\s+const\s+metadata\s*=\s*\{/.test(content);
}

// Ajouter les métadonnées au début du fichier
function addMetadataToFile(filePath, filename) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");

    if (hasMetadata(content)) {
      console.log(`✓ ${filename} - métadonnées déjà présentes`);
      return;
    }

    const metadata = generateMetadata(filename, content);
    const metadataString = `export const metadata = {
  title: "${escapeJsString(metadata.title)}",
  description: "${escapeJsString(metadata.description)}",
  date: "${escapeJsString(metadata.date)}",
  pillar: "${escapeJsString(metadata.pillar)}",
  tags: ${JSON.stringify(metadata.tags)},
};\n\n`;

    const newContent = metadataString + content;
    fs.writeFileSync(filePath, newContent.endsWith("\n") ? newContent : newContent + "\n", "utf-8");
    console.log(`✅ ${filename} - métadonnées ajoutées`);
  } catch (err) {
    console.error(`❌ Erreur pour ${filename}:`, err.message);
  }
}

// Traiter tous les fichiers MDX
async function fixAllMetadata() {
  try {
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".mdx"));
    
    console.log(`🔍 Vérification de ${files.length} fichiers MDX...\n`);

    files.forEach(file => {
      const filePath = path.join(BLOG_DIR, file);
      addMetadataToFile(filePath, file);
    });

    console.log(`\n✨ Vérification des métadonnées terminée!`);
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    process.exit(1);
  }
}

fixAllMetadata();
