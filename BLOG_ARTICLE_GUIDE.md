# Blog Article Format Guide

## Metadata (Required at top of each .mdx file)

```javascript
export const metadata = {
  title: "Your Article Title",
  description: "Short description (one sentence)",
  date: "YYYY-MM-DD",
  pillar: "SOC" | "AUDIT" | "CLOUD",
  tags: ["Tag1", "Tag2"],
};
```

## Heading Hierarchy (Very Important)

Articles use **strict heading hierarchy** to generate a proper table of contents (TOC).

### ✅ CORRECT Format:

```markdown
## Main Section
Content here...

### Subsection 1) Topic
Content...

### Subsection 2) Another Topic
Content...

## Another Main Section
Content...

### Subsection 1) Topic
Content...
```

### ❌ WRONG Format (Don't do this):

```markdown
## Main Section
1) This topic
2) Another topic  ← These won't appear in TOC! Use ### instead

## Another Main Section
1) Topic
```

### Key Rules:

1. **`##` = Major sections** (these appear as top-level items in TOC)
   - Examples: "Quick take", "Identity controls", "Logging and detection"

2. **`###` = Subsections** (numbered like "### 1)", "### 2)", etc.)
   - These are indented in the TOC
   - Even if they're just numbered points, use `###`

3. **No numbered lists at h2 level**
   - ❌ `## 1) Topic` 
   - ✅ `### 1) Topic`

## Section Structure Example

```markdown
## Identity and admin access: reduce blast radius first
Identity is your control plane...

### 1) Enforce multi-factor authentication
Details here...

### 2) Disable legacy authentication  
Details here...

### 3) Right-size admin roles
Details here...

## Data sharing controls
Content...

### 1) External sharing defaults
Details...

### 2) Email forwarding rules
Details...
```

## Automatic Formatting

Before each Tuesday build, the script `scripts/fix-h3-formatting.js` automatically converts any `1)`, `2)`, `3)` at the start of lines into proper `### 1)`, `### 2)`, `### 3)` headings.

**But it's better to write correctly from the start!**

## Why This Matters

- The TOC extracts **h2** and **h3** headings automatically
- Proper h3 formatting ensures readers can navigate your article with the table of contents
- Improves readability and user experience
- Makes the blog more professional and scannable

## Testing Your Article

After writing, run:
```bash
npm run build:blog
```

Then visit your article page and check that the **Contents** sidebar shows all your major sections and subsections properly indented.

If subsections don't appear → check that you used `### ` (not just `##` or plain text).
