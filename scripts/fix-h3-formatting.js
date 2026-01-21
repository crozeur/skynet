#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/**
 * Convert numbered items (1), 2), 3), etc.) to proper h3 markdown (### 1), ### 2), etc.)
 * Only converts when the number is followed by ) and text on the same line
 */
function fixH3Formatting(content) {
  // Pattern: line starting with numbers like "1) Title" or "2) Title"
  // But NOT lines that are already "### 1) Title"
  return content.replace(/^(\d+)\)\s+(.*)$/gm, (match, number, text) => {
    // Check if this line is preceded by proper h2 (##) context
    // Only convert if it looks like a numbered subsection (not a list item in content)
    return `### ${number}) ${text}`;
  });
}

/**
 * Process a single MDX file
 */
function fixArticle(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const fixed = fixH3Formatting(content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, "utf8");
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return false;
  }
}

/**
 * Main function
 */
async function fixAllArticles() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  let fixed = 0;

  console.log(`🔍 Checking ${files.length} articles for h3 formatting...\n`);

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    if (fixArticle(filePath)) {
      console.log(`✅ Fixed: ${file}`);
      fixed++;
    } else {
      console.log(`⏭️  Already correct: ${file}`);
    }
  }

  console.log(`\n✨ Fixed ${fixed} article(s)`);
  if (fixed > 0) {
    console.log("💡 Tip: Run 'npm run build:blog' to recompile and test.");
  }
}

fixAllArticles();
