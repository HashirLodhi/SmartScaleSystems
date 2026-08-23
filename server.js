require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { createChatReply } = require('./lib/chat-service');
const seo = require('./seo.config.cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');
const reactIndex = path.join(distDir, 'index.html');
const compressedTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function acceptsGzip(req) {
  return /\bgzip\b/.test(req.headers['accept-encoding'] || '');
}

function sendPrecompressed(req, res, filePath, fallback) {
  const gzipPath = `${filePath}.gz`;
  const ext = path.extname(filePath);
  if (acceptsGzip(req) && compressedTypes.has(ext) && fs.existsSync(gzipPath)) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', compressedTypes.get(ext));
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable');
    return res.sendFile(gzipPath);
  }
  return fallback();
}

function sendReactIndex(req, res) {
  return sendPrecompressed(req, res, reactIndex, () => res.sendFile(reactIndex));
}

function sendStaticDocument(req, res, filePath, status = 200) {
  res.status(status);
  res.setHeader('Cache-Control', 'no-cache');
  return sendPrecompressed(req, res, filePath, () => res.sendFile(filePath));
}

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  const hostname = String(req.headers['x-forwarded-host'] || req.headers.host || req.hostname || '')
    .split(':')[0]
    .toLowerCase();
  if (!['www.smartscalesystems.tech', 'smartscalesystems.tech', '127.0.0.1', 'localhost'].includes(hostname)) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
  next();
});
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
  next();
});

const canonicalPaths = new Set(seo.routes.map((route) => route.path));
app.get(['/index', '/index.html'], (req, res) => res.redirect(301, '/'));
Object.entries(seo.redirects).forEach(([from, to]) => {
  app.get([from, `${from}/`, `${from}.html`, `${from}.html/`], (req, res) => res.redirect(301, to));
});
seo.gone.forEach((route) => {
  app.get([route, `${route}/`], (req, res) => {
    const gone = path.join(distDir, '410.html');
    return sendStaticDocument(req, res, gone, 410);
  });
});
app.get(/^\/(.+)\/$/, (req, res, next) => {
  const canonical = `/${req.params[0]}`;
  if (!canonicalPaths.has(canonical)) return next();
  return res.redirect(301, canonical);
});
app.get(/^\/(.+)\.html\/?$/, (req, res, next) => {
  const canonical = `/${req.params[0]}`;
  if (!canonicalPaths.has(canonical)) return next();
  return res.redirect(301, canonical);
});

app.get(/\.(css|html|js|json|svg|txt|xml)$/, (req, res, next) => {
  const requestedPath = path.normalize(path.join(distDir, req.path));
  if (!requestedPath.startsWith(distDir)) return next();
  if (!fs.existsSync(requestedPath)) return next();
  return sendPrecompressed(req, res, requestedPath, () => next());
});

app.use(express.static(distDir, {
  maxAge: '1y',
  immutable: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// Serve public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

async function handleChat(req, res) {
  try {
    const result = await createChatReply(
      req.body && req.body.message,
      req.body && req.body.history
    );
    res.json(result);
  } catch (error) {
    if (error.code === 'INVALID_MESSAGE') {
      return res.status(400).json({ error: error.message });
    }
    console.error('ScaleBot server error:', error);
    res.status(500).json({ error: 'ScaleBot could not process that message.' });
  }
}

app.post('/chat', handleChat);
app.post('/api/chat', handleChat);

// API form handlers
app.post('/api/contact', (req, res) => require('./api/contact')(req, res));
app.post('/api/custom-service', (req, res) => require('./api/custom-service')(req, res));
app.post('/api/lead', async (req, res) => {
  const leadHandler = require('./api/lead');
  return leadHandler(req, res);
});

// ── Zoho OAuth routes ─────────────────────────────────────────────────────────
app.get('/auth/zoho', (req, res) => {
  const redirectUri = process.env.ZOHO_REDIRECT_URI || 'http://localhost:3000/auth/callback';
  // access_type=offline + prompt=consent forces Zoho to always return a refresh_token
  const url = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE,ZohoMail.accounts.READ&client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&access_type=offline&prompt=consent&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code received');

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      code,
      access_type: 'offline',
      redirect_uri: process.env.ZOHO_REDIRECT_URI || 'http://localhost:3000/auth/callback',
    });

    const tokenRes = await fetch(`https://accounts.zoho.com/oauth/v2/token?${params}`, { method: 'POST' });
    const data = await tokenRes.json();

    if (data.access_token && data.refresh_token) {
      // Auto-save refresh token to .env and live process so forms work immediately
      try {
        let envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
        envContent = envContent.includes('ZOHO_REFRESH_TOKEN=')
          ? envContent.replace(/ZOHO_REFRESH_TOKEN=.*/m, `ZOHO_REFRESH_TOKEN=${data.refresh_token}`)
          : envContent + `\nZOHO_REFRESH_TOKEN=${data.refresh_token}`;
        fs.writeFileSync(path.join(__dirname, '.env'), envContent, 'utf8');
        process.env.ZOHO_REFRESH_TOKEN = data.refresh_token;
      } catch (writeErr) {
        console.error('Could not auto-save refresh token to .env:', writeErr.message);
      }
      res.send(`
        <html><body style="font-family:sans-serif;padding:40px;text-align:center">
          <h2 style="color:#22c55e">&#10003; Authorization Successful</h2>
          <p style="color:#16a34a">Refresh token saved automatically. All contact forms are now active.</p>
          <p>Refresh token (backup copy):</p>
          <textarea style="width:100%;max-width:500px;height:60px;padding:8px;font-size:13px;font-family:monospace" readonly>${data.refresh_token}</textarea>
          <p style="color:#666;margin-top:20px">You can close this tab.</p>
        </body></html>
      `);
    } else if (data.access_token) {
      // Got access token but no refresh token — prompt user to re-authorize
      const redirectUri = process.env.ZOHO_REDIRECT_URI || 'http://localhost:3000/auth/callback';
      const reAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE,ZohoMail.accounts.READ&client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&access_type=offline&prompt=consent&redirect_uri=${encodeURIComponent(redirectUri)}`;
      res.send(`
        <html><body style="font-family:sans-serif;padding:40px;text-align:center">
          <h2 style="color:#e67e22">Almost There — One More Step</h2>
          <p>Zoho returned an access token but <strong>no refresh token</strong>.</p>
          <p><a href="${reAuthUrl}" style="display:inline-block;margin-top:12px;padding:12px 24px;background:#0070f3;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold">Re-authorize to get Refresh Token &rarr;</a></p>
        </body></html>
      `);
    } else {
      res.status(400).send('Token exchange failed: ' + JSON.stringify(data));
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// Canonical static documents are generated at build time for crawler-safe HTML.
app.get('/', (req, res) => sendReactIndex(req, res));

seo.routes.filter((route) => route.path !== '/').forEach((route) => {
  const output = path.join(distDir, `${route.path.slice(1)}.html`);
  app.get(route.path, (req, res) => sendStaticDocument(req, res, output));
});

// Catch-all fallback
app.use((req, res) => {
  const notFound = path.join(distDir, '404.html');
  if (fs.existsSync(notFound)) return sendStaticDocument(req, res, notFound, 404);
  return res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Chat API is available at http://localhost:${PORT}/api/chat`);
});
