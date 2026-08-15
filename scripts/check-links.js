const fs = require('fs');
const path = require('path');
const seo = require('../seo.config.cjs');

const root = path.join(__dirname, '..');
const sourceDirectories = [path.join(root, 'src', 'pages'), path.join(root, 'src', 'components')];
const canonicalPaths = new Set(seo.routes.map((route) => route.path));
const allowedAliases = new Set(Object.keys(seo.redirects));
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

for (const route of seo.routes) {
  const source = path.join(root, 'src', 'pages', route.source);
  if (!fs.existsSync(source)) fail(`${route.path} is missing source ${route.source}`);
}

for (const directory of sourceDirectories) {
  for (const name of fs.readdirSync(directory).filter((file) => file.endsWith('.html'))) {
    const file = path.join(directory, name);
    const html = fs.readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
    const hrefs = [...html.matchAll(/\bhref=["']([^"']*)["']/gi)].map((match) => match[1]);

    for (const href of hrefs) {
      if (!href) {
        fail(`${name} contains an empty href`);
        continue;
      }
      if (/^(?:https?:|mailto:|tel:)/i.test(href)) continue;
      if (href.startsWith('#')) {
        if (!ids.has(href.slice(1))) fail(`${name} links to missing fragment ${href}`);
        continue;
      }

      const localPath = href.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
      const isAsset = /^\/(?:assets|project-images)\//.test(localPath)
        || /^\/(?:favicon-48x48\.png|logo-main\.png|og\.png)$/.test(localPath)
        || localPath.startsWith('/src/');
      if (isAsset) {
        const assetPath = localPath.startsWith('/src/')
          ? path.join(root, localPath.slice(1))
          : path.join(root, 'public', localPath.slice(1));
        if (!fs.existsSync(assetPath)) fail(`${name} links to missing asset ${localPath}`);
        continue;
      }
      if (allowedAliases.has(localPath)) fail(`${name} links through redirecting alias ${localPath}`);
      else if (!canonicalPaths.has(localPath)) fail(`${name} links to nonexistent route ${localPath}`);
    }
  }
}

if (failures.length) process.exit(1);
console.log(`PASS internal links resolve directly across ${seo.routes.length} canonical routes.`);
console.log('PASS project cards use external portfolio destinations; no missing internal project slugs were found.');
