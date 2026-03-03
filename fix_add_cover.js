const fs = require('fs');
const file = '.github/workflows/add-cover.yml';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `          git commit -m "✨ Add cover image to article"

          # Prevent occasional non-fast-forward failures when multiple dispatches land close together.
          # We serialize runs via \`concurrency\`, but still rebase+retry defensively.
          BRANCH="\${GITHUB_REF_NAME:-main}"`;

const newStr = `          git commit -m "✨ Add cover image to article"

          git stash --include-untracked || true

          # Prevent occasional non-fast-forward failures when multiple dispatches land close together.
          # We serialize runs via \`concurrency\`, but still rebase+retry defensively.
          BRANCH="\${GITHUB_REF_NAME:-main}"`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed add-cover.yml rebase issue');