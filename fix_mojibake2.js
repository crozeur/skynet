const fs = require('fs');

let c = fs.readFileSync('.github/workflows/add-cover.yml', 'latin1'); // Read as bytes

const fixes = [
    [Buffer.from('e29c85', 'hex').toString('latin1'), '✅'],
    [Buffer.from('e284b9efb88f', 'hex').toString('latin1'), 'ℹ️'],
    [Buffer.from('e284b9efb88f20', 'hex').toString('latin1'), 'ℹ️'],
    [Buffer.from('e29ca8', 'hex').toString('latin1'), '✨'],
    [Buffer.from('e29aa0efb88f', 'hex').toString('latin1'), '⚠️'],
    [Buffer.from('e29aa0efb88f20', 'hex').toString('latin1'), '⚠️'],
    [Buffer.from('e28c84', 'hex').toString('latin1'), '❌']
];

let changed = c;
for (const [bad, good] of fixes) {
    changed = changed.split(bad).join(good);
}

// Fallbacks for the literal mojibake we saw
changed = changed.replace(/âœ…/g, '✅')
    .replace(/â„¹ï¸ /g, 'ℹ️ ')
    .replace(/â„¹ï¸/g, 'ℹ️')
    .replace(/âœ¨/g, '✨')
    .replace(/âš ï¸ /g, '⚠️ ')
    .replace(/âš ï¸/g, '⚠️')
    .replace(/âŒ/g, '❌');


// It seems to be encoded as utf-8 twice. Let's try parsing it as UTF-8 when reading ANSI.
try {
  let utf8Text = fs.readFileSync('.github/workflows/add-cover.yml', 'utf-8');
  let doubleEncoded = Buffer.from(utf8Text, 'latin1').toString('utf-8');
  if(doubleEncoded.includes('✅') || doubleEncoded.includes('ℹ️')) {
      console.log('Detected double encoding');
      changed = doubleEncoded;
  }
} catch(e) {}

fs.writeFileSync('.github/workflows/add-cover.yml', changed, 'utf-8');
console.log('Fixed using robust replacement.');
