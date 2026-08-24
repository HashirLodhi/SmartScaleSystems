const fs = require('fs');
const path = require('path');
const {
  getCachedZohoTokens,
  getZohoMailApiUrl,
  getZohoTokenUrl,
} = require('./zoho-config');

const TOKEN_CACHE_PATH = path.join(__dirname, '..', 'Zoho automation', 'zoho_tokens.json');

function saveCachedZohoTokens(tokens) {
  try {
    if (!fs.existsSync(TOKEN_CACHE_PATH)) return;
    fs.writeFileSync(TOKEN_CACHE_PATH, JSON.stringify(tokens, null, 2));
  } catch {
    // Cache updates are best-effort only.
  }
}

async function refreshAccessToken() {
  const cachedTokens = getCachedZohoTokens();
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN || cachedTokens?.refresh_token;
  if (!refreshToken) {
    throw new Error('ZOHO_REFRESH_TOKEN is not set and no cached refresh token was found. Run /auth/zoho to authorize.');
  }

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: refreshToken
  });

  const res = await fetch(`${getZohoTokenUrl()}?${params}`, {
    method: 'POST',
    headers: { Accept: 'application/json' }
  });
  const data = await res.json();

  if (data.access_token) {
    saveCachedZohoTokens({
      ...(cachedTokens || {}),
      access_token: data.access_token,
      accounts_server: data.api_domain || cachedTokens?.accounts_server,
      refresh_token: cachedTokens?.refresh_token || refreshToken,
    });
    return data.access_token;
  }
  throw new Error('Failed to refresh Zoho token: ' + JSON.stringify(data));
}

async function getAccountId(accessToken) {
  if (process.env.ZOHO_ACCOUNT_ID) return process.env.ZOHO_ACCOUNT_ID;

  const res = await fetch(`${getZohoMailApiUrl()}/accounts`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Zoho-oauthtoken ${accessToken}`
    }
  });
  const data = await res.json();

  if (data.data && data.data.length > 0) return data.data[0].accountId;
  throw new Error('Could not detect Zoho Account ID');
}

async function sendZohoEmail({ to, subject, html, text, replyTo, ccAddress, bccAddress, fromAddress }) {
  const accessToken = await refreshAccessToken();
  const accountId = await getAccountId(accessToken);

  const content = html || (text ? text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>') : '');
  if (!content) throw new Error('Either html or text content is required to send a Zoho email.');

  const emailBody = {
    fromAddress: fromAddress || process.env.ZOHO_FROM_EMAIL,
    toAddress: to || process.env.ZOHO_TO_EMAIL,
    subject,
    content,
    mailFormat: 'html'
  };

  if (replyTo) emailBody.replyTo = replyTo;
  if (ccAddress) emailBody.ccAddress = ccAddress;
  if (bccAddress) emailBody.bccAddress = bccAddress;

  const res = await fetch(`${getZohoMailApiUrl()}/accounts/${accountId}/messages`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailBody)
  });

  const raw = await res.text();
  let result;
  try {
    result = raw ? JSON.parse(raw) : {};
  } catch {
    result = { raw };
  }

  const code = result?.status?.code || res.status;
  if (code === 200 || code === 201) return result;

  const details = result?.message || result?.data?.message || result?.raw || raw || `HTTP ${res.status}`;
  throw new Error(`Zoho Mail API error (${res.status}): ${details}`);
}

module.exports = { sendZohoEmail };
