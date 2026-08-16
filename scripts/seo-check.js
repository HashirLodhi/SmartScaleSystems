const { spawn } = require('child_process');
const seo = require('../seo.config.cjs');

const port = 4187;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['server.js'], {
  cwd: require('path').join(__dirname, '..'),
  env: { ...process.env, PORT: String(port), GROQ_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const value = (html, pattern) => html.match(pattern)?.[1] || '';

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(origin, { redirect: 'manual' });
      if (response.status === 200) return;
    } catch {}
    await wait(100);
  }
  throw new Error('Local production server did not start');
}

async function checkRoute(route) {
  const response = await fetch(`${origin}${route.path}`, { redirect: 'manual' });
  const html = await response.text();
  const expectedCanonical = `${seo.siteUrl}${route.path === '/' ? '' : route.path}`;
  const title = value(html, /<title>([\s\S]*?)<\/title>/i);
  const canonical = value(html, /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || value(html, /<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const robots = value(html, /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const h1s = (html.match(/<h1\b/gi) || []).length;
  const jsonLd = value(html, /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  const valid = response.status === 200 && title === route.title.replace(/&/g, '&amp;')
    && canonical === expectedCanonical && h1s === 1 && !/noindex/i.test(robots);
  if (!valid) throw new Error(`FAIL ${route.path} status=${response.status} title=${Boolean(title)} canonical=${canonical} h1=${h1s} robots=${robots}`);
  JSON.parse(jsonLd);
  if (/vercel\.app|localhost|127\.0\.0\.1/i.test(html)) throw new Error(`FAIL ${route.path} contains a non-production metadata URL`);
  if (/pakistan/i.test(`${title} ${value(html, /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)/i)}`)) {
    throw new Error(`FAIL ${route.path} contains Pakistan wording in global metadata`);
  }
  console.log(`PASS ${route.path}`);
}

async function checkRedirect(from, to) {
  const response = await fetch(`${origin}${from}`, { redirect: 'manual' });
  if (response.status !== 301 || response.headers.get('location') !== to) {
    throw new Error(`FAIL ${from} expected 301 -> ${to}, got ${response.status} -> ${response.headers.get('location')}`);
  }
  console.log(`PASS ${from} -> ${to}`);
}

async function run() {
  await waitForServer();
  for (const route of seo.routes) await checkRoute(route);
  for (const [from, to] of Object.entries(seo.redirects)) await checkRedirect(from, to);
  await checkRedirect('/services/', '/services');
  await checkRedirect('/services.html', '/services');

  const gone = await fetch(`${origin}/testimonials`, { redirect: 'manual' });
  const goneHtml = await gone.text();
  if (gone.status !== 410 || !/noindex, follow/i.test(goneHtml)) throw new Error('FAIL /testimonials is not a noindex 410');
  console.log('PASS /testimonials (410 Gone)');

  const preview = await fetch(origin, { headers: { 'X-Forwarded-Host': 'preview.vercel.app' }, redirect: 'manual' });
  if (preview.headers.get('x-robots-tag') !== 'noindex, nofollow') throw new Error('FAIL preview hostname lacks X-Robots-Tag');
  console.log('PASS preview hostname is noindex');

  for (const missing of ['/this-page-does-not-exist-test', '/projects/this-project-does-not-exist', '/careers', '/ai-agency-pakistan']) {
    const response = await fetch(`${origin}${missing}`, { redirect: 'manual' });
    const html = await response.text();
    if (response.status !== 404 || !/noindex, follow/i.test(html)) throw new Error(`FAIL ${missing} is not a true noindex 404`);
    console.log(`PASS ${missing} (intentional 404)`);
  }

  for (const asset of ['/sitemap.xml', '/robots.txt', '/og.png', '/logo-main.png', '/favicon-48x48.png']) {
    const response = await fetch(`${origin}${asset}`, { redirect: 'manual' });
    if (response.status !== 200) throw new Error(`FAIL ${asset} returned ${response.status}`);
    console.log(`PASS ${asset}`);
  }
}

run()
  .then(() => console.log(`SEO route health passed for ${seo.routes.length} canonical routes.`))
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => server.kill());
