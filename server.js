require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Nodemailer Gmail transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '')
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Serve static files from src directory
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve favicon from root
app.use('/Favicon.png', express.static(path.join(__dirname, 'Favicon.png')));

// Serve public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `You are the cute, helpful floating robot mascot for Smart Scale Systems, an AI services agency.
Your goal is to answer visitor questions about our company in a friendly, enthusiastic, and concise manner. Keep your answers brief (1-3 sentences) unless asked for details.

About Smart Scale Systems:
- We are an AI services agency established in 2021.
- We provide: AI Model Training, AI Automation (agents, workflows), Computer Vision (object detection, OCR), NLP (text classification, NER), LLM Solutions (fine-tuning, RLHF), Data Annotation (image, video, text, audio), and AI Training Data creation.
- We handle the full AI lifecycle from raw data collection to deployed models.
- We emphasize quality, scalability, and working on real business problems.

Always be polite, use cute robot-like excitement occasionally (e.g., *beep boop*, *whirrr*), and direct users to the "Services" or "Contact Us" pages when they want to start a project.`;

app.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
        max_tokens: 500
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
});

// Contact form email endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, nationality, subject, message } = req.body;

    if (!name || !email || !phone || !nationality || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #778873; border-bottom: 2px solid #A1BC98; padding-bottom: 8px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Nationality</td><td style="padding: 8px 0;">${nationality}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px 0;">${subject}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #A1BC98;">
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
  res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

// Page routes
const pages = [
  'index',
  'services',
  'team',
  'careers',
  'testimonials',
  'contact',
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
    res.sendFile(path.join(__dirname, 'src', 'pages', `${page}.html`));
  });
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', `${page}.html`));
  });
});

// Catch-all fallback
app.use((req, res) => {
  // Try to serve as HTML file
  const htmlFile = path.join(__dirname, 'src', 'pages', req.path + '.html');
  res.sendFile(htmlFile, err => {
    if (err) {
      res.status(404).send('Page not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Website is accessible at http://localhost:3000');
});