const fs = require('fs');
const path = require('path');
const seo = require('../seo.config.cjs');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const seenTitles = new Set();
const seenDescriptions = new Set();
const canonicalPaths = new Set(seo.routes.map((route) => route.path));

function check(condition, message) {
  if (!condition) throw new Error(`FAIL ${message}`);
}

function attr(html, tagPattern, attribute) {
  const tag = html.match(tagPattern)?.[0] || '';
  return tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'))?.[1] || '';
}

for (const route of seo.routes) {
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  const html = fs.readFileSync(path.join(dist, file), 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
  const description = attr(html, /<meta\s+[^>]*name=["']description["'][^>]*>/i, 'content');
  const canonical = attr(html, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, 'href');
  const expectedCanonical = `${seo.siteUrl}${route.path === '/' ? '' : route.path}`;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const plainText = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ');

  check(title.includes(route.title.replace('&', '&amp;')) || title === route.title, `${route.path} has its configured title`);
  check(description === route.description.replace(/&/g, '&amp;').replace(/"/g, '&quot;'), `${route.path} has its configured description`);
  check(canonical === expectedCanonical, `${route.path} has a self-referencing canonical`);
  check(h1Count === 1, `${route.path} has exactly one H1`);
  check(html.includes(`property="og:url" content="${expectedCanonical}"`), `${route.path} has its route-specific Open Graph URL`);
  check(html.includes('property="og:image:width" content="1536"') && html.includes('property="og:image:height" content="1024"'), `${route.path} declares social image dimensions`);
  check(html.includes('application/ld+json'), `${route.path} has JSON-LD`);
  const jsonLd = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)?.[1] || '';
  check(Boolean(JSON.parse(jsonLd)['@graph']), `${route.path} has valid JSON-LD serialization`);
  const schemaGraph = JSON.parse(jsonLd)['@graph'];
  check(schemaGraph.some((node) => node['@type'] === 'Organization' && node.contactPoint), `${route.path} schema has an organization contact point`);
  check(schemaGraph.some((node) => node['@type'] === 'WebSite'), `${route.path} schema includes the parent website`);
  check(JSON.parse(jsonLd)['@graph'].some((node) => node.dateModified === seo.lastmod), `${route.path} schema has a freshness signal`);
  check(!/noindex/i.test(attr(html, /<meta\s+[^>]*name=["']robots["'][^>]*>/i, 'content')), `${route.path} is indexable`);
  check(!seenTitles.has(title), `${route.path} has a unique title`);
  check(!seenDescriptions.has(description), `${route.path} has a unique description`);
  check(description.length >= 120 && description.length <= 165, `${route.path} description has a search-friendly length`);
  check(!/vercel\.app|localhost|127\.0\.0\.1/.test(html), `${route.path} contains no staging URLs`);

  const imageTags = html.match(/<img\b[^>]*>/gi) || [];
  imageTags.forEach((tag) => {
    check(/\bwidth=["']\d+["']/.test(tag) && /\bheight=["']\d+["']/.test(tag), `${route.path} images reserve intrinsic space`);
    check(/\balt=["'][^"']*["']/.test(tag), `${route.path} images declare alt text`);
  });

  const internalLinks = [...html.matchAll(/href=["'](\/[^"'#?]*)/gi)].map((match) => match[1]);
  internalLinks.forEach((href) => {
    const isAsset = /^\/(?:assets|project-images|favicon-48x48\.png|logo-main\.png|og\.png)/.test(href);
    check(canonicalPaths.has(href) || isAsset, `${route.path} links only to canonical routes or public assets (${href})`);
  });
  seenTitles.add(title);
  seenDescriptions.add(description);

  if (route.path === '/') {
    check(description.length >= 120 && description.length <= 160, 'homepage description is within the recommended length');
    check((plainText.match(/\b[\w'-]+\b/g) || []).length >= 500, 'homepage has at least 500 words of indexable text');
    check(!/<img\b[^>]*alt=["']{2}/i.test(html), 'homepage contains no empty image alternatives');
  }
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
check((sitemap.match(/<loc>/g) || []).length === seo.routes.length, 'sitemap contains every canonical route');
check((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length === seo.routes.length, 'sitemap has valid lastmod values');
check(!/\.html<\/loc>|\/404<\/loc>|\/api\//.test(sitemap), 'sitemap excludes redirects, errors, and APIs');
check(!/testimonials/i.test(sitemap), 'sitemap excludes removed testimonials URL');

const notFound = fs.readFileSync(path.join(dist, '404.html'), 'utf8');
check(/name="robots" content="noindex, follow"/.test(notFound), '404 document is noindex');
check(!/rel="canonical"/.test(notFound), '404 document has no canonical');

console.log(`Rendered SEO validation passed for ${seo.routes.length} routes plus sitemap and 404.`);
