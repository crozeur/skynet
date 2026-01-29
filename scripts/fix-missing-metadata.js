#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Extraction du slug depuis le nom du fichier
function slugFromFilename(filename) {
  return filename.replace(/\.mdx$/, "");
}

function slugToTitle(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
  for (const line of lines) {
    const trimmed = line.trim();
    const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (heading && heading[1]) return stripMarkdown(heading[1]);
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
  if (s.includes("soc") || s.includes("alert") || s.includes("triage")) return "SOC";
  if (s.includes("cloud") || s.includes("aws") || s.includes("m365") || s.includes("microsoft-365")) return "CLOUD";
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
