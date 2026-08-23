const { sendZohoEmail } = require('../lib/zoho-mail');
const { cleanText, escapeHtml, validEmail } = require('../lib/form-utils');

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
    const name = cleanText(req.body?.name, 120);
    const email = cleanText(req.body?.email, 254);
    const subject = cleanText(req.body?.subject, 160);
    const message = cleanText(req.body?.message, 5000);
    const website = cleanText(req.body?.website, 200);

    // Honeypot: accept the request without sending mail so bots cannot probe it.
    if (website) return res.status(200).json({ success: true });

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!validEmail(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      subject: escapeHtml(subject),
      message: escapeHtml(message).replace(/\n/g, '<br/>'),
    };

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000000; border-bottom: 2px solid #666666; padding-bottom: 8px;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Name</td><td style="padding: 8px 0;">${safe.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px 0;">${safe.subject}</td></tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #666666;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #555;">Message</p>
          <p style="margin: 0; color: #333; line-height: 1.6;">${safe.message}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Sent from Smart Scale Systems Contact Form</p>
      </div>
    `;

    await sendZohoEmail({
      to: process.env.ZOHO_TO_EMAIL,
      subject: `Contact: ${subject}`,
      html: htmlBody,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      replyTo: `"${name}" <${email}>`
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
