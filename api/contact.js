const { sendZohoEmail } = require('../lib/zoho-mail');
const { cleanText, escapeHtml, validEmail } = require('../lib/form-utils');

const PUBLIC_CONTACT_EMAIL = process.env.PUBLIC_CONTACT_EMAIL || 'shahryar@smartscalesystems.tech';

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

    const notificationTo = process.env.ZOHO_TO_EMAIL || PUBLIC_CONTACT_EMAIL;

    await sendZohoEmail({
      to: notificationTo,
      subject: `Contact: ${subject}`,
      html: htmlBody,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      replyTo: `"${name}" <${email}>`,
      ccAddress: PUBLIC_CONTACT_EMAIL,
    });

    // Auto-reply to the user who submitted the contact form
    await sendZohoEmail({
      to: email,
      subject: 'We received your message — Smart Scale Systems',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h2 style="border-bottom:2px solid #111;padding-bottom:12px">We have received your message</h2>
        <p>Hi ${safe.name},</p>
        <p style="line-height:1.6">Thank you for reaching out to Smart Scale Systems. We have received your inquiry and our team will get back to you within 1 business day.</p>
        <div style="margin-top:20px;padding:18px;background:#f5f5f5;border-left:4px solid #111">
          <strong>Your submission details</strong>
          <p style="margin-bottom:0;line-height:1.6">Subject: ${safe.subject}</p>
        </div>
        <p style="margin-top:24px;line-height:1.6">If your matter is urgent, you can reach us directly at <a href="mailto:info@smartscalesystems.tech">info@smartscalesystems.tech</a>.</p>
        <p style="margin-top:24px;color:#666;font-size:13px">Smart Scale Systems — AI Solutions & Automation</p>
      </div>`,
      text: `Hi ${name},\n\nThank you for reaching out to Smart Scale Systems. We have received your inquiry and our team will get back to you within 1 business day.\n\nYour submission details:\nSubject: ${subject}\n\nIf your matter is urgent, you can reach us directly at info@smartscalesystems.tech.\n\nSmart Scale Systems — AI Solutions & Automation`,
      replyTo: `"Smart Scale Systems" <${process.env.ZOHO_FROM_EMAIL}>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
