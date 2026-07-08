require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { retrieveContext } = require('./lib/rag');

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

// Serve favicon from assets
app.use('/src/assets/images/Favicon.png', express.static(path.join(__dirname, 'src/assets/images/Favicon.png')));

// Serve public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `You are ScaleBot, the professional AI assistant for Smart Scale Systems, an AI services agency.
Your goal is to answer visitor questions clearly, ethically, and helpfully while guiding qualified visitors toward the Services or Contact pages.

Response style:
- Be professional, calm, and trustworthy. Do not introduce yourself as Robby.
- Use structured answers, not one long paragraph.
- Use short sections with bold Markdown labels, for example: **Overview**, **Services**, **Next step**.
- Use bullet points when listing services, team details, process steps, or recommendations.
- Keep most answers concise, but provide detail when the visitor asks for it.
- Do not overuse robot phrases. Avoid "*whirrr*", "*beep boop*", or mascot-style greetings unless the user asks for a playful tone.
- Be ethical: do not invent pricing, credentials, case studies, team details, guarantees, or private information.

About Smart Scale Systems:
- We are an AI services agency established in 2021.
- We provide: AI Model Training, AI Automation (agents, workflows), Computer Vision (object detection, OCR), NLP (text classification, NER), LLM Solutions (fine-tuning, RLHF), Data Annotation (image, video, text, audio), and AI Training Data creation.
- We handle the full AI lifecycle from raw data collection to deployed models.
- We emphasize quality, scalability, and working on real business problems.

Always direct users to the "Services" or "Contact Us" pages when they want to start a project, request pricing, need a custom scope, or ask for a timeline.`;

const RAG_RULES = `Use the retrieved agency context when it is relevant to the visitor's question.
Treat retrieved context as the latest source of truth for Smart Scale Systems.
For direct team questions about one person or role, answer only that person or role unless the visitor asks for the full team.
If asked "who is Hashir" or "who is the founder", answer directly: Muhammad Hashir Lodhi is the Founder of Smart Scale Systems, then add one concise sentence about his technical leadership.
If the retrieved context does not answer the question, say what you know from the agency overview and guide the visitor to Contact Us.
Do not invent pricing, private details, credentials, client names, or unsupported claims.`;

function normalizeChatMessage(value) {
  return typeof value === 'string' ? value.trim().slice(0, 1000) : '';
}

function normalizeChatHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
    .map(item => ({
      role: item.role,
      content: item.content.trim().slice(0, 1000)
    }))
    .filter(item => item.content)
    .slice(-10);
}

async function handleChat(req, res) {
  try {
    const message = normalizeChatMessage(req.body && req.body.message);
    const history = normalizeChatHistory(req.body && req.body.history);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Chat service is not configured.' });
    }

    const ragContext = retrieveContext(message);
    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${RAG_RULES}` },
      ...(ragContext ? [{ role: 'system', content: ragContext }] : []),
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 650
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      return res.status(500).json({ error: 'Failed to communicate with AI provider.' });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

app.post('/chat', handleChat);
app.post('/api/chat', handleChat);

// Contact form email endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, nationality, subject, message } = req.body;

    if (!name || !email || !phone || !nationality || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000000; border-bottom: 2px solid #666666; padding-bottom: 8px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Nationality</td><td style="padding: 8px 0;">${nationality}</td></tr>
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
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nNationality: ${nationality}\nSubject: ${subject}\n\n${message}`,
      html: htmlBody
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
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
  'careers',
  'testimonials',
  'contact',
  'ai-agency-pakistan',
  'ai-services-pakistan',
  'service-ai-model-training',
  'service-ai-automation',
  'service-computer-vision',
  'service-nlp',
  'service-llm',
  'service-data-annotation',
  'service-ai-training-data'
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
  sendPrecompressed(req, res, reactIndex, () => {
    res.sendFile(reactIndex, err => {
      if (err) res.status(404).send('Page not found');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Website is accessible at http://localhost:3000');
});
