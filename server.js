require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { createChatReply } = require('./lib/chat-service');

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

app.use(cors());
app.use(express.json());

// Nodemailer Gmail transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '')
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.get(/\.(css|html|js|json|svg|txt|xml)$/, (req, res, next) => {
  const requestedPath = path.normalize(path.join(distDir, req.path));
  if (!requestedPath.startsWith(distDir)) return next();
  if (!fs.existsSync(requestedPath)) return next();
  return sendPrecompressed(req, res, requestedPath, () => next());
});

// Serve static files from src directory
app.use('/src', express.static(path.join(__dirname, 'src'), {
  maxAge: '7d',
}));
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

// Contact form email endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000000; border-bottom: 2px solid #666666; padding-bottom: 8px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #666666;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #555;">Message</p>
          <p style="margin: 0; color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Sent from Smart Scale Systems Contact Form</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Smart Scale Systems" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: htmlBody
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.post('/api/lead', async (req, res) => {
  const leadHandler = require('./api/lead');
  return leadHandler(req, res);
});

// Root route
app.get('/', (req, res) => {
  sendReactIndex(req, res);
});

// Page routes
const pages = [
  'index',
  'services',
  'team',
  'contact',
  'service-ai-model-training',
  'service-ai-automation',
  'service-computer-vision',
  'service-nlp',
  'service-llm',
  'service-data-annotation',
  'service-ai-training-data',
  'service-custom-ai-agents',
  'service-data-analytics',
  'service-ai-integrations',
  'service-business-automations',
  'service-custom'
];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    sendReactIndex(req, res);
  });
  app.get(`/${page}.html`, (req, res) => {
    sendReactIndex(req, res);
  });
});

// Catch-all fallback
app.use((req, res) => {
  res.status(404);
  sendPrecompressed(req, res, reactIndex, () => {
    res.sendFile(reactIndex, err => {
      if (err) res.status(404).send('Page not found');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Chat API is available at http://localhost:${PORT}/api/chat`);
});
