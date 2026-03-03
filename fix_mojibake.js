const fs = require('fs');
let c = fs.readFileSync('.github/workflows/add-cover.yml', 'utf-8');
c = c.replace(/âœ…/g, '✅')
     .replace(/â„¹ï¸ /g, 'ℹ️ ')
     .replace(/â„¹ï¸/g, 'ℹ️')
     .replace(/âœ✨|âœ¨/g, '✨')
     .replace(/âš ï¸/g, '⚠️')
     .replace(/âš /g, '⚠️')
     .replace(/âŒ/g, '❌');
fs.writeFileSync('.github/workflows/add-cover.yml', c, 'utf-8');
console.log('Fixed');
