require('dotenv').config();
const fs = require('fs');
const tokens = JSON.parse(fs.readFileSync(__dirname + '/zoho_tokens.json', 'utf8'));

async function test() {
  const accountId = process.env.ZOHO_ACCOUNT_ID;
  const emailBody = {
    fromAddress: process.env.ZOHO_FROM_EMAIL,
    toAddress: process.env.ZOHO_TO_EMAIL,
    subject: 'Test Email from Web Form',
    content: '<h2>Test</h2><p>This is a test email from your web form.</p>',
    mailFormat: 'html'
  };

  console.log('Sending to account:', accountId);
  const sendRes = await fetch(`https://mail.zoho.com/api/accounts/${accountId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${tokens.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailBody)
  });
  const sendResult = await sendRes.json();
  console.log('Status:', sendRes.status);
  console.log('Response:', JSON.stringify(sendResult, null, 2));
}

test().catch(console.error);
