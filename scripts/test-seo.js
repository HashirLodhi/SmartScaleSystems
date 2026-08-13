const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src', 'main.jsx'), 'utf8');
const favicon = fs.readFileSync(path.join(root, 'public', 'favicon-48x48.png'));
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const pageSources = fs.readdirSync(path.join(root, 'src', 'pages'))
  .filter((name) => name.endsWith('.html'))
  .map((name) => fs.readFileSync(path.join(root, 'src', 'pages', name), 'utf8'))
  .join('\n');

const expectedTitles = [
  'Smart Scale Systems | Global AI Solutions Company',
  'AI Services | Automation, Models and Data',
  'Our Team | AI Engineers and Specialists',
  'Careers | Build Practical AI Systems',
  'Client Testimonials | AI Success Stories',
  'Contact Us | Start Your AI Project',
  'Privacy Policy | Data Protection and Security',
  'Terms of Service | Website Usage Policies',
  'AI Model Training | Custom Machine Learning Models',
  'AI Automation | Business Workflow Automation',
  'Computer Vision | Image and Video AI',
  'NLP Services | Natural Language Processing',
  'LLM Solutions | Custom AI Assistants',
  'Data Annotation | Training Data Services',
  'AI Training Data | Dataset Creation Services',
  'Custom AI Solutions | AI Development Services',
  'Access Denied | Permission Required',
  'Page Not Found | Return to Home',
  'Server Error | Please Try Again',
];

function check(condition, message) {
  if (!condition) throw new Error(`FAIL ${message}`);
  console.log(`PASS ${message}`);
}

check(
  html.includes('<title>Smart Scale Systems | Global AI Solutions Company</title>'),
  'home tab starts with Smart Scale Systems'
);
check(
  (html.match(/href="\/favicon-48x48\.png\?v=20260811"/g) || []).length === 3,
  'favicon links use the supplied cache-busted favicon'
);
check(
  favicon.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  'favicon is a valid PNG asset'
);
check(favicon.length > 1000, 'real company logo contains visible artwork');
check(
  vercelConfig.routes.some((route) =>
    route.src === '/favicon-48x48.png' && route.dest === '/favicon-48x48.png'
  ),
  'Vercel serves the favicon before the SPA fallback'
);
check(
  expectedTitles.every((title) =>
    html.includes(title) ||
    app.includes(`title: '${title}'`) ||
    pageSources.includes(`<title>${title}</title>`)
  ),
  'every route has the intended tab title'
);
check(
  app.includes('document.title = title;') &&
    app.includes('updateDocumentSeo(rawPage, pathname);'),
  'client navigation updates the browser tab title'
);

console.log(`SEO and favicon behavior passed 7 checks across ${expectedTitles.length} route titles.`);
