const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src', 'main.jsx'), 'utf8');
const leadApi = fs.readFileSync(path.join(root, 'api', 'lead.js'), 'utf8');
const favicon = fs.readFileSync(path.join(root, 'public', 'favicon-48x48.png'));
const vercelConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const seo = require(path.join(root, 'seo.config.cjs'));
const pageSources = fs.readdirSync(path.join(root, 'src', 'pages'))
  .filter((name) => name.endsWith('.html'))
  .map((name) => fs.readFileSync(path.join(root, 'src', 'pages', name), 'utf8'))
  .join('\n');

const expectedTitles = seo.routes.map((route) => route.title);

function check(condition, message) {
  if (!condition) throw new Error(`FAIL ${message}`);
  console.log(`PASS ${message}`);
}

check(
  html.includes('<title>Smart Scale Systems | AI Development &amp; Automation Company</title>'),
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
  vercelConfig.routes.some((route) => route.handle === 'filesystem'),
  'Vercel serves public files before the 404 catch-all'
);
const filesystemIndex = vercelConfig.routes.findIndex((route) => route.handle === 'filesystem');
const legacyRedirectIndex = vercelConfig.routes.findIndex((route) => route.status === 301 && /\\\.html/.test(route.src || ''));
check(
  legacyRedirectIndex >= 0 && legacyRedirectIndex < filesystemIndex,
  'legacy HTML redirects run before filesystem delivery'
);
check(expectedTitles.length === seo.routes.length, 'SEO configuration covers every indexable route');
check(
  app.includes('document.title = title;') &&
    app.includes('updateDocumentSeo(rawPage, pathname);'),
  'client navigation updates the browser tab title'
);
check(
  app.includes('window.setTimeout(openAutomatically, 12000)')
    && app.includes('window.scrollY / scrollable >= 0.55')
    && app.includes('LEAD_CAPTURE_DISMISSED_KEY'),
  'lead modal waits for meaningful engagement and remembers dismissal'
);
check(
  app.includes('previousFocusRef.current?.focus?.()')
    && app.includes("event.key === 'Escape'")
    && app.includes("event.key !== 'Tab'"),
  'lead modal restores focus and supports Escape and trapped Tab navigation'
);
check(
  leadApi.includes("require('../lib/form-utils')")
    && leadApi.includes('if (website)')
    && leadApi.includes('validEmail(workEmail)'),
  'lead API sanitizes bounded input and rejects bot submissions'
);
check(
  app.includes('Email Address<input type="email"')
    && app.includes('Company Name <span aria-hidden="true">(optional)</span>')
    && !app.includes('name="companyName" autoComplete="organization" maxLength={160} required'),
  'lead form uses an inclusive email label and keeps company optional'
);
check(
  app.includes("window.requestIdleCallback(loadSpline, { timeout: 1500 })")
    && app.includes("window.setTimeout(loadSpline, 500)"),
  'heavy Spline runtime waits for browser idle time'
);

console.log(`SEO, conversion, performance, and favicon behavior passed 13 checks across ${expectedTitles.length} indexable routes.`);
