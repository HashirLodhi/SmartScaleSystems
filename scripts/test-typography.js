const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const html = read('index.html');
const styles = `${read('src/styles/style.css')}\n${read('src/styles/carousel.css')}`;
const chatbot = read('src/scripts/robot-mascot.js');
const pageSources = fs.readdirSync(path.join(root, 'src', 'pages'))
  .filter((name) => name.endsWith('.html'))
  .map((name) => read(path.join('src', 'pages', name)))
  .join('\n');
const uiSource = `${html}\n${styles}\n${chatbot}\n${pageSources}`;

const checks = [
  [
    'root document loads Cabin from Google Fonts',
    /fonts\.googleapis\.com\/css2\?family=Cabin:ital,wght@0,400\.\.700;1,400\.\.700/,
  ],
  [
    'display and body tokens both use Cabin',
    () =>
      /--font-display:\s*'Cabin',\s*sans-serif/.test(styles) &&
      /--font-body:\s*'Cabin',\s*sans-serif/.test(styles),
  ],
  [
    'form controls use the site font token',
    /button,\s*input,\s*select,\s*textarea\s*\{[\s\S]*?font-family:\s*var\(--font-body\)/,
  ],
  [
    'ScaleBot inherits Cabin',
    /font-family:\s*var\(--font-body,\s*'Cabin',\s*Arial,\s*sans-serif\)/,
  ],
  [
    'all Google font links request Cabin',
    () => {
      const links = uiSource.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/g) || [];
      return links.length > 0 && links.every((link) => link.includes('family=Cabin:'));
    },
  ],
  [
    'legacy Roboto, Outfit, and Inter families are removed',
    () => !/\b(?:Roboto|Outfit|Inter)\b/.test(uiSource),
  ],
  [
    'styles use only Cabin-supported numeric weights',
    () => {
      const weights = [...`${styles}\n${chatbot}`.matchAll(/font-weight:\s*(\d+)/g)]
        .map((match) => Number(match[1]));
      return weights.every((weight) => weight >= 400 && weight <= 700);
    },
  ],
];

let failures = 0;
for (const [label, condition] of checks) {
  const passed = typeof condition === 'function' ? condition() : condition.test(uiSource);
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`);
  if (!passed) failures += 1;
}

if (failures) {
  console.error(`Typography failed ${failures} of ${checks.length} checks.`);
  process.exit(1);
}

console.log(`Cabin typography passed ${checks.length} of ${checks.length} checks.`);
