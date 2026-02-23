const fs = require('fs');
const path = require('path');

const blogDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

let changed = 0;

files.forEach(f => {
  const filePath = path.join(blogDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace Cloudinary URLs with version numbers (e.g., /v1234567890/)
  // with URLs without version numbers
  const newContent = content.replace(
    /coverImage:\s*"https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/v\d+\/([^"]+)"/g,
    'coverImage: "https://res.cloudinary.com/$1/image/upload/$2"'
  );
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    changed++;
    console.log(`Updated ${f}`);
  }
});

console.log(`Total files updated: ${changed}`);
