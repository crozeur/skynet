#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Extraction du slug depuis le nom du fichier
function slugFromFilename(filename) {
  return filename.replace(/\.mdx$/, "");
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
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    description: "Security insights for small and mid-sized businesses",
    pillar: "SOC"
  };

  // Extraire le premier paragraphe comme description si nécessaire
  const paragraphs = content.split("\n\n").filter(p => p.trim());
  const firstParagraph = paragraphs
    .find(p => !p.startsWith("##") && !p.startsWith("#"))
    ?.slice(0, 160) || config.description;

  return {
    title: config.title,
    description: firstParagraph,
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
  title: "${metadata.title}",
  description: "${metadata.description}",
  date: "${metadata.date}",
  pillar: "${metadata.pillar}",
  tags: ${JSON.stringify(metadata.tags)},
};

`;

    const newContent = metadataString + content;
    fs.writeFileSync(filePath, newContent, "utf-8");
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
