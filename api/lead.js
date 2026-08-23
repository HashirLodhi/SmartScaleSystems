const { sendZohoEmail } = require('../lib/zoho-mail');
const { cleanText, escapeHtml, validEmail } = require('../lib/form-utils');

const PUBLIC_CONTACT_EMAIL = process.env.PUBLIC_CONTACT_EMAIL || 'info@smartscalesystems.tech';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const fullName = cleanText(req.body?.fullName, 120);
    const workEmail = cleanText(req.body?.workEmail, 254);
    const companyName = cleanText(req.body?.companyName, 160);
    const industry = cleanText(req.body?.industry, 100);
    const projectDetails = cleanText(req.body?.projectDetails, 5000);
    const website = cleanText(req.body?.website, 200);

    // Silently accept bot-filled honeypot submissions without sending email.
    if (website) return res.status(200).json({ success: true });
    if (!fullName || !workEmail || !industry || !projectDetails) {
      return res.status(400).json({ error: 'Name, email, industry, and project details are required.' });
    }
    if (!validEmail(workEmail)) {
      return res.status(400).json({ error: 'Enter a valid work email.' });
    }

    const safe = {
      fullName: escapeHtml(fullName),
      workEmail: escapeHtml(workEmail),
      companyName: escapeHtml(companyName || 'Not provided'),
      industry: escapeHtml(industry),
      projectDetails: escapeHtml(projectDetails).replace(/\n/g, '<br/>'),
    };

    // Email #1: Internal notification
    await sendZohoEmail({
      to: process.env.ZOHO_TO_EMAIL,
      subject: `New Website Lead: ${companyName || fullName} - ${industry}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111">
        <h2 style="border-bottom:2px solid #111;padding-bottom:12px">New Website Project Lead</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;font-weight:bold;width:160px">Full Name</td><td>${safe.fullName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Email</td><td><a href="mailto:${safe.workEmail}">${safe.workEmail}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Company</td><td>${safe.companyName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Industry</td><td>${safe.industry}</td></tr>
        </table>
        <div style="margin-top:20px;padding:18px;background:#f5f5f5;border-left:4px solid #111"><strong>Project Details</strong><p style="line-height:1.6">${safe.projectDetails}</p></div>
      </div>`,
      text: `Full Name: ${fullName}\nEmail: ${workEmail}\nCompany: ${companyName || 'Not provided'}\nIndustry: ${industry}\n\nProject Details:\n${projectDetails}`,
      replyTo: `"${fullName}" <${workEmail}>`,
      ccAddress: PUBLIC_CONTACT_EMAIL,
    });

    // Email #2: Auto-reply to lead
    await sendZohoEmail({
      to: workEmail,
      subject: 'Your Free AI Consultation Is Registered',
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111">
        <h2 style="border-bottom:2px solid #111;padding-bottom:12px">Your AI consultation is registered</h2>
        <p>Hi ${safe.fullName},</p>
        <p style="line-height:1.6">Thank you for registering for a free AI consultation with Smart Scale Systems. We have received your project details and our team will contact you shortly.</p>
        <div style="margin-top:20px;padding:18px;background:#f5f5f5;border-left:4px solid #111">
          <strong>Registration confirmed</strong>
          <p style="margin-bottom:0;line-height:1.6">Company: ${safe.companyName}<br/>Industry: ${safe.industry}</p>
        </div>
      </div>`,
      text: `Hi ${fullName},\n\nThank you for registering for a free AI consultation with Smart Scale Systems. We have received your project details and our team will contact you shortly.\n\nCompany: ${companyName || 'Not provided'}\nIndustry: ${industry}\n\nSmart Scale Systems`
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Lead form error:', error);
    return res.status(500).json({ error: 'Failed to send your request. Please try again.' });
  }
};
