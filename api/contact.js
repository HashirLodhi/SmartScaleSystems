const nodemailer = require('nodemailer');

const SMTP_USER = process.env.GMAIL_USER;
const CONTACT_RECIPIENT = process.env.CONTACT_EMAIL || process.env.MAIL_TO || 'contact@smartscalesystems.tech';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '')
  },
  tls: { rejectUnauthorized: false }
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!SMTP_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({ error: 'Email service is not configured.' });
    }

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
      from: `"Smart Scale Systems" <${SMTP_USER}>`,
      to: CONTACT_RECIPIENT,
      replyTo: `"${name}" <${email}>`,
      subject: `Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nNationality: ${nationality}\nSubject: ${subject}\n\n${message}`,
      html: htmlBody
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
