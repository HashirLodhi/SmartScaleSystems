require('dotenv').config();
const { sendZohoEmail } = require('../lib/zoho-mail');

sendZohoEmail({
  to: process.env.ZOHO_TO_EMAIL,
  subject: 'Contact: Testing',
  html: '<div><h2>New Contact Form Submission</h2><p><strong>Name:</strong> Muhammad Hashir Lodhi</p><p><strong>Email:</strong> hashirlodhi145@gmail.com</p><p><strong>Subject:</strong> Testing</p><p><strong>Message:</strong> Zaba da ba do</p></div>',
  replyTo: '"Muhammad Hashir Lodhi" <hashirlodhi145@gmail.com>'
}).then(function(r) { console.log('SENT:', JSON.stringify(r.status)); })
  .catch(function(e) { console.error('FAILED:', e.message); });
