const fs = require('fs');

const file = 'scripts/build-blog.js';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
let start = lines.findIndex(l => l.includes('function markdownToHtml(markdown) {'));
let brackets = 0;
let end = -1;
for(let i=start;i<lines.length;i++) {
    brackets += (lines[i].match(/\{/g) || []).length;
    brackets -= (lines[i].match(/\}/g) || []).length;
    if(brackets===0) {
        end=i;
        break;
    }
}

const originalFunction = lines.slice(start, end + 1).join('\n');

const newFunction = `function markdownToHtml(markdown) {
  let html = markdown;

  // Horizontal rules
  html = html.replace(/^(-{3,}|\\*{3,}|_{3,})$/gm, '<hr />');

  // Code blocks first (before other replacements)
  const codeBlocks = [];
  html = html.replace(/\`\`\`([a-z]*)\\n([\\s\\S]*?)\`\`\`/gm, (match, lang, code) => {
    const escaped = code.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlocks.push(\`<pre><code class="language-\${lang || 'plaintext'}">\${escaped}</code></pre>\`);
    return \`___CODE_BLOCK_\${codeBlocks.length - 1}___\`;
  });

  // Blockquotes & Callouts
  html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/(<blockquote>.*?<\\/blockquote>)/gs, (match) => {
    const content = match.replace(/<blockquote>/g, '').replace(/<\\/blockquote>/g, '\\n').trim();
    if (content.startsWith('⚠️') || content.toLowerCase().startsWith('attention')) {
      return \`<div class="article-callout article-callout-warning"><div class="callout-icon">⚠️</div><div class="callout-content">\${content.replace(/^⚠️\\s*/, '').replace(/^attention\\s*:\\s*/i, '')}</div></div>\`;
    } else if (content.startsWith('💡') || content.toLowerCase().startsWith('pro-tip') || content.toLowerCase().startsWith('astuce')) {
      return \`<div class="article-callout article-callout-info"><div class="callout-icon">💡</div><div class="callout-content">\${content.replace(/^💡\\s*/, '').replace(/^(pro-tip|astuce)\\s*:\\s*/i, '')}</div></div>\`;
    } else if (content.startsWith('✅') || content.toLowerCase().startsWith('succès') || content.toLowerCase().startsWith('success')) {
      return \`<div class="article-callout article-callout-success"><div class="callout-icon">✅</div><div class="callout-content">\${content.replace(/^✅\\s*/, '').replace(/^(succès|success)\\s*:\\s*/i, '')}</div></div>\`;
    }
    return \`<blockquote class="article-blockquote">\${content}</blockquote>\`;
  });

  // Images with loading lazy
  html = html.replace(/!\\[(.*?)\\]\\((.*?)\\)/g, '<img src="$2" alt="$1" class="article-img" loading="lazy" />');

  // Links
  html = html.replace(/\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2">$1</a>');

  // Headings with ID generation
  html = html.replace(/^### (.*?)$/gm, (match, text) => {
    const id = generateId(text);
    return \`<h3 id="\${id}">\${text}</h3>\`;
  });
  html = html.replace(/^## (.*?)$/gm, (match, text) => {
    const id = generateId(text);
    return \`<h2 id="\${id}">\${text}</h2>\`;
  });
  html = html.replace(/^# (.*?)$/gm, (match, text) => {
    const id = generateId(text);
    return \`<h1 id="\${id}">\${text}</h1>\`;
  });

  // Bold and italic (in correct order)
  html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/\\*(.*?)\\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/\`(.*?)\`/g, '<code>$1</code>');

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

  // Lists (bullets and numbered)
  const lines = html.split('\\n');
  let inList = false;
  let inOrderedList = false;
  const processedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^\\s*[-*+] (.*)/);
    const numberedMatch = line.match(/^\\s*\\d+\\. (.*)/);

    if (bulletMatch) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push(\`<li>\${bulletMatch[1]}</li>\`);
    } else if (numberedMatch) {
      if (!inOrderedList) {
        processedLines.push('<ol>');
        inOrderedList = true;
      }
      processedLines.push(\`<li>\${numberedMatch[1]}</li>\`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      if (inOrderedList) {
        processedLines.push('</ol>');
        inOrderedList = false;
      }
      processedLines.push(line);
    }
  }

  if (inList) processedLines.push('</ul>');
  if (inOrderedList) processedLines.push('</ol>');
  html = processedLines.join('\\n');

  // Paragraphs
  html = html
    .split('\\n\\n')
    .map(para => {
      if (
        para.includes('<h') ||
        para.includes('<li>') ||
        para.includes('<ul>') ||
        para.includes('<ol>') ||
        para.includes('<code>') ||
        para.includes('<blockquote>') ||
        para.includes('<pre>') ||
        para.includes('___CODE_BLOCK_') ||
        para.includes('<img') ||
        para.includes('<hr') ||
        para.trim() === ''
      ) {
        return para;
      }
      if (para.trim()) {
        return \`<p>\${para.trim()}</p>\`;
      }
      return '';
    })
    .join('\\n');

  // Restore Code Blocks
  html = html.replace(/___CODE_BLOCK_(\\d+)___/g, (match, id) => codeBlocks[parseInt(id)]);

  return html;
}`;

content = content.replace(originalFunction, newFunction);
fs.writeFileSync(file, content, 'utf8');
console.log('Replaced markdownToHtml successfully');
