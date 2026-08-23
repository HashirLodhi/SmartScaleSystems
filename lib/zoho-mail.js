const ZOHO_ACCOUNTS_URL = 'https://accounts.zoho.com';
const ZOHO_MAIL_API_URL = 'https://mail.zoho.com/api';

async function refreshAccessToken() {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!refreshToken) throw new Error('ZOHO_REFRESH_TOKEN is not set. Run /auth/zoho to authorize.');

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: refreshToken
  });

  const res = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token?${params}`, { method: 'POST' });
  const data = await res.json();

  if (data.access_token) return data.access_token;
  throw new Error('Failed to refresh Zoho token: ' + JSON.stringify(data));
}

async function getAccountId(accessToken) {
  if (process.env.ZOHO_ACCOUNT_ID) return process.env.ZOHO_ACCOUNT_ID;

  const res = await fetch(`${ZOHO_MAIL_API_URL}/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });
  const data = await res.json();

  if (data.data && data.data.length > 0) return data.data[0].accountId;
  throw new Error('Could not detect Zoho Account ID');
}

async function sendZohoEmail({ to, subject, html, text, replyTo }) {
  const accessToken = await refreshAccessToken();
  const accountId = await getAccountId(accessToken);

  const emailBody = {
    fromAddress: process.env.ZOHO_FROM_EMAIL,
    toAddress: to || process.env.ZOHO_TO_EMAIL,
    subject,
    content: html,
    mailFormat: 'html'
  };

  const res = await fetch(`${ZOHO_MAIL_API_URL}/accounts/${accountId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailBody)
  });

  const result = await res.json();

  if (result.status && result.status.code === 200) return result;
  throw new Error(result.message || 'Zoho Mail API error: ' + JSON.stringify(result));
}

module.exports = { sendZohoEmail };
