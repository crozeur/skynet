let html = `hello

\`\`\`bash
# Example
- Item
\`\`\`

# Actual Heading
`;
const codeBlocks = [];
html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, lang, code) => { 
  codeBlocks.push('<pre><code>' + code.trim() + '</code></pre>'); 
  return `___CODE_BLOCK_${codeBlocks.length - 1}___`; 
}); 
html = html.replace(/^# (.*)/gm, '<h1>$1</h1>'); 
console.log(html.replace(/___CODE_BLOCK_(\d+)___/g, (match, id) => codeBlocks[id]));
