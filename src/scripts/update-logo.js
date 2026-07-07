const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\web1';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const replacement = `<a href="index.html" class="nav-logo">
      <img src="/logo-main.png" alt="Smart Scale Systems Logo" class="nav-logo-img" />
    </a>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the nav-logo anchor and its contents
  const regex = /<a href="index\.html" class="nav-logo">[\s\S]*?<\/a>/;
  
  if (regex.test(content) && !content.includes('<img src="/logo-main.png"')) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated logo in ${file}`);
  }
}
