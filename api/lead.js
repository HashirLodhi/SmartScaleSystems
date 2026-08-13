const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, ''),
  },
  tls: { rejectUnauthorized: false },
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fullName, workEmail, companyName, industry, projectDetails } = req.body || {};
    if (!fullName || !workEmail || !companyName || !industry || !projectDetails) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
      return res.status(400).json({ error: 'Enter a valid work email.' });
    }

    const safe = {
      fullName: escapeHtml(fullName),
      workEmail: escapeHtml(workEmail),
      companyName: escapeHtml(companyName),
      industry: escapeHtml(industry),
      projectDetails: escapeHtml(projectDetails).replace(/\n/g, '<br/>'),
    };

    await transporter.sendMail({
      from: `"Smart Scale Systems" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${fullName}" <${workEmail}>`,
      subject: `New Website Lead: ${companyName} - ${industry}`,
      text: `Full Name: ${fullName}\nWork Email: ${workEmail}\nCompany: ${companyName}\nIndustry: ${industry}\n\nProject Details:\n${projectDetails}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111">
        <h2 style="border-bottom:2px solid #111;padding-bottom:12px">New Website Project Lead</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;font-weight:bold;width:160px">Full Name</td><td>${safe.fullName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Work Email</td><td><a href="mailto:${safe.workEmail}">${safe.workEmail}</a></td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Company</td><td>${safe.companyName}</td></tr>
          <tr><td style="padding:8px 0;font-weight:bold">Industry</td><td>${safe.industry}</td></tr>
        </table>
        <div style="margin-top:20px;padding:18px;background:#f5f5f5;border-left:4px solid #111"><strong>Project Details</strong><p style="line-height:1.6">${safe.projectDetails}</p></div>
      </div>`,
    });

    await transporter.sendMail({
      from: `"Smart Scale Systems" <${process.env.GMAIL_USER}>`,
      to: workEmail,
      subject: 'Your Free AI Consultation Is Registered',
      text: `Hi ${fullName},\n\nThank you for registering for a free AI consultation with Smart Scale Systems. We have received your project details and our team will contact you shortly.\n\nCompany: ${companyName}\nIndustry: ${industry}\n\nSmart Scale Systems`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#111">
        <h2 style="border-bottom:2px solid #111;padding-bottom:12px">Your AI consultation is registered</h2>
        <p>Hi ${safe.fullName},</p>
        <p style="line-height:1.6">Thank you for registering for a free AI consultation with Smart Scale Systems. We have received your project details and our team will contact you shortly.</p>
        <div style="margin-top:20px;padding:18px;background:#f5f5f5;border-left:4px solid #111">
          <strong>Registration confirmed</strong>
          <p style="margin-bottom:0;line-height:1.6">Company: ${safe.companyName}<br/>Industry: ${safe.industry}</p>
        </div>
      </div>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Lead form error:', error);
    return res.status(500).json({ error: 'Failed to send your request. Please try again.' });
  }
};
