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

    const { fullName, email, projectDetails } = req.body;

    if (!fullName || !email || !projectDetails) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000000; border-bottom: 2px solid #666666; padding-bottom: 8px;">New Custom Service Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Full Name</td><td style="padding: 8px 0;">${fullName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #666666;">
          <p style="margin: 0 0 8px 0; font-weight: bold; color: #555;">Project Details</p>
          <p style="margin: 0; color: #333; line-height: 1.6;">${projectDetails.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">Sent from Smart Scale Systems Custom Service Request</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Smart Scale Systems" <${SMTP_USER}>`,
      to: CONTACT_RECIPIENT,
      replyTo: `"${fullName}" <${email}>`,
      subject: `Custom Service Request: ${fullName}`,
      text: `Full Name: ${fullName}\nEmail: ${email}\n\nProject Details:\n${projectDetails}`,
      html: htmlBody
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Custom service form error:', error);
    return res.status(500).json({ error: 'Failed to send request. Please try again later.' });
  }
};
