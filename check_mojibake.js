const fs = require('fs');
let c = fs.readFileSync('.github/workflows/add-cover.yml', 'utf-8');
const mojos = new Set(c.match(/[^\x00-\x7F]/g) || []);
console.log([...mojos]);
