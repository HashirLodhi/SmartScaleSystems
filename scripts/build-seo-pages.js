const fs = require('fs');
const path = require('path');
const seo = require('../seo.config.cjs');

const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const pagesDir = path.join(root, 'src', 'pages');
const baseHtmlPath = path.join(distDir, 'index.html');
const navHtml = fs.readFileSync(path.join(root, 'src', 'components', 'nav.html'), 'utf8');
const footerHtml = fs.readFileSync(path.join(root, 'src', 'components', 'footer.html'), 'utf8');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function canonicalUrl(routePath) {
  return `${seo.siteUrl}${routePath === '/' ? '' : routePath}`;
}

function stripPageChrome(source) {
  const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || source;
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<div[^>]+id=["']nav-placeholder["'][^>]*><\/div>/gi, '')
    .replace(/<div[^>]+id=["']footer-placeholder["'][^>]*><\/div>/gi, '')
    .replace(/<div[^>]+class=["'][^"']*noise-overlay[^"']*["'][^>]*><\/div>/gi, '')
    .trim();
}

function breadcrumbGraph(route, url) {
  if (route.path === '/') return null;
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: seo.siteUrl },
  ];
  if (route.type === 'service') {
    items.push({ '@type': 'ListItem', position: 2, name: 'Services', item: `${seo.siteUrl}/services` });
  }

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: route.title.split('|')[0].trim(),
    item: url,
  });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items,
  };
}

function structuredData(route) {
  const url = canonicalUrl(route.path);
  const organization = {
    '@type': 'Organization',
    '@id': `${seo.siteUrl}/#organization`,
    name: seo.brandName,
    url: seo.siteUrl,
    logo: seo.logoUrl,
    email: 'contact@smartscalesystems.tech',
    description: 'AI development company delivering automation, custom agents, model training, computer vision, NLP, LLM, analytics, integration, and data services worldwide.',
    areaServed: 'Worldwide',
    sameAs: seo.sameAs,
  };
  const graph = [organization];

  if (route.path === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${seo.siteUrl}/#website`,
      url: seo.siteUrl,
      name: seo.brandName,
      publisher: { '@id': `${seo.siteUrl}/#organization` },
    });
  }

  const pageType = route.type === 'contact' ? 'ContactPage' : route.type === 'collection' || route.type === 'projects' ? 'CollectionPage' : 'WebPage';
  graph.push({
    '@type': pageType,
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { '@id': `${seo.siteUrl}/#website` },
    about: { '@id': `${seo.siteUrl}/#organization` },
    dateModified: seo.lastmod,
  });

  if (route.type === 'service') {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: route.title.split('|')[0].trim(),
      description: route.description,
      url,
      provider: { '@id': `${seo.siteUrl}/#organization` },
      areaServed: 'Worldwide',
    });
  }

  if (route.path === '/team') {
    ['Muhammad Hashir Lodhi', 'Muhammad Nouman Qadeer', 'Muhammad Mudassir', 'Muhammad Shahryar'].forEach((name) => {
      graph.push({
        '@type': 'Person',
        name,
        url,
        worksFor: { '@id': `${seo.siteUrl}/#organization` },
      });
    });
  }

  const breadcrumbs = breadcrumbGraph(route, url);
  if (breadcrumbs) graph.push(breadcrumbs);
  return { '@context': 'https://schema.org', '@graph': graph };
}

function replaceMeta(html, attribute, value, replacement) {
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}=["']${value.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

function replaceLink(html, rel, replacement) {
  const pattern = new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*>`, 'i');
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

function replaceRoot(html, content) {
  const start = html.indexOf('<div id="root">');
  const end = html.indexOf('</div>', start);
  if (start < 0 || end < 0) throw new Error('Unable to locate the Vite root shell');
  const rendered = `<div id="root"><div class="noise-overlay"></div><header>${navHtml}</header><div class="route-shell"><main>${content}</main></div><div>${footerHtml}</div></div>`;
  return `${html.slice(0, start)}${rendered}${html.slice(end + 6)}`;
}

function renderRoute(baseHtml, route) {
  const url = canonicalUrl(route.path);
  const source = fs.readFileSync(path.join(pagesDir, route.source), 'utf8');
  let html = baseHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  html = replaceMeta(html, 'name', 'description', `<meta name="description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/\s*<meta\s+name=["']keywords["'][^>]*>/i, '');
  html = replaceMeta(html, 'name', 'robots', `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`);
  html = replaceLink(html, 'canonical', `<link rel="canonical" href="${url}" />`);
  html = html.replace(/\s*<link\s+[^>]*rel=["']alternate["'][^>]*>/gi, '');
  html = replaceMeta(html, 'property', 'og:title', `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
  html = replaceMeta(html, 'property', 'og:description', `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
  html = replaceMeta(html, 'property', 'og:type', '<meta property="og:type" content="website" />');
  html = replaceMeta(html, 'property', 'og:url', `<meta property="og:url" content="${url}" />`);
  html = replaceMeta(html, 'name', 'twitter:title', `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`);
  html = replaceMeta(html, 'name', 'twitter:description', `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`);
  html = html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">${JSON.stringify(structuredData(route))}</script>`);
  return replaceRoot(html, stripPageChrome(source));
}

function renderNotFound(baseHtml) {
  const source = fs.readFileSync(path.join(pagesDir, 'error-404.html'), 'utf8');
  const route = {
    path: '/404',
    title: 'Page Not Found | Smart Scale Systems',
    description: 'The requested page could not be found.',
  };
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
  html = replaceMeta(html, 'name', 'description', `<meta name="description" content="${route.description}" />`);
  html = replaceMeta(html, 'name', 'robots', '<meta name="robots" content="noindex, follow" />');
  html = html.replace(/\s*<link\s+[^>]*rel=["']canonical["'][^>]*>/i, '');
  html = html.replace(/\s*<link\s+[^>]*rel=["']alternate["'][^>]*>/gi, '');
  html = html.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i, '');
  return replaceRoot(html, stripPageChrome(source));
}

function buildSitemap() {
  const entries = seo.routes.map((route) => [
    '  <url>',
    `    <loc>${canonicalUrl(route.path)}</loc>`,
    `    <lastmod>${seo.lastmod}</lastmod>`,
    `    <changefreq>${route.changefreq}</changefreq>`,
    `    <priority>${route.priority}</priority>`,
    '  </url>',
  ].join('\n')).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /chat\n\nSitemap: ${seo.siteUrl}/sitemap.xml\n`;
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
seo.routes.forEach((route) => {
  const output = route.path === '/' ? baseHtmlPath : path.join(distDir, `${route.path.slice(1)}.html`);
  fs.writeFileSync(output, renderRoute(baseHtml, route));
});
fs.writeFileSync(path.join(distDir, '404.html'), renderNotFound(baseHtml));
fs.writeFileSync(path.join(distDir, '410.html'), renderNotFound(baseHtml).replace(
  '<title>Page Not Found | Smart Scale Systems</title>',
  '<title>Content Removed | Smart Scale Systems</title>'
));
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), buildSitemap());
fs.writeFileSync(path.join(distDir, 'robots.txt'), buildRobots());

console.log(`Generated ${seo.routes.length} crawlable route documents, sitemap.xml, robots.txt, and 404.html.`);
