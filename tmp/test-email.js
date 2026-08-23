require('dotenv').config();
const { sendZohoEmail } = require('../lib/zoho-mail');

async function test() {
  console.log('--- Test 1: Contact form (same to/from) ---');
  try {
    const r1 = await sendZohoEmail({
      to: process.env.ZOHO_TO_EMAIL,
      subject: 'Manual Form Test - Contact',
      html: '<p>Test from contact form simulation</p>'
    });
    console.log('Contact result:', JSON.stringify(r1.status));
  } catch(e) { console.error('Contact FAIL:', e.message); }

  console.log('--- Test 2: Lead auto-reply (external email) ---');
  try {
    const r2 = await sendZohoEmail({
      to: 'hashir@smartscalesystems.tech',
      subject: 'Lead Auto-Reply Test',
      html: '<p>Test auto-reply to external address</p>'
    });
    console.log('Lead result:', JSON.stringify(r2.status));
  } catch(e) { console.error('Lead FAIL:', e.message); }
}
test();
