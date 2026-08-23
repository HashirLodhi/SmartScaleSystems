require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { getZohoAuthUrl, getZohoMailApiUrl, getZohoTokenUrl } = require('../lib/zoho-config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Zoho OAuth token management ──────────────────────────────────────────────
const TOKEN_PATH = path.join(__dirname, 'zoho_tokens.json');

function loadTokens() {
  if (fs.existsSync(TOKEN_PATH)) return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  return null;
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

async function refreshAccessToken() {
  const tokens = loadTokens();
  if (!tokens || !tokens.refresh_token) throw new Error('No refresh token found. Complete OAuth flow first.');

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: tokens.refresh_token
  });

  const res = await fetch(`${getZohoTokenUrl()}?${params}`, { method: 'POST' });
  const data = await res.json();
  if (data.access_token) {
    saveTokens({ ...tokens, access_token: data.access_token, accounts_server: data.api_domain });
    return data.access_token;
  }
  throw new Error('Failed to refresh token: ' + JSON.stringify(data));
}

async function getAccessToken() {
  const tokens = loadTokens();
  if (tokens && tokens.access_token) return tokens.access_token;
  return refreshAccessToken();
}

// ── Auto-fetch Zoho Account ID if not set ────────────────────────────────────
async function getAccountId(accessToken) {
  if (process.env.ZOHO_ACCOUNT_ID) return process.env.ZOHO_ACCOUNT_ID;
  const res = await fetch(`${getZohoMailApiUrl()}/accounts`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Zoho-oauthtoken ${accessToken}`
    }
  });
  const data = await res.json();
  if (data.data && data.data.length > 0) {
    const id = data.data[0].accountId;
    console.log('Auto-detected Account ID:', id);
    return id;
  }
  throw new Error('Could not detect Zoho Account ID');
}

// ── OAuth initiation (first-time setup) ──────────────────────────────────────
app.get('/auth/zoho', (req, res) => {
  const url = `${getZohoAuthUrl()}?scope=ZohoMail.messages.CREATE,ZohoMail.accounts.READ&client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.ZOHO_REDIRECT_URI)}`;
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code received');

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    code,
    redirect_uri: process.env.ZOHO_REDIRECT_URI
  });

  const tokenRes = await fetch(`${getZohoTokenUrl()}?${params}`, { method: 'POST' });
  const data = await tokenRes.json();

  if (data.access_token) {
    saveTokens({ access_token: data.access_token, refresh_token: data.refresh_token, accounts_server: data.api_domain });
    res.send('Authorization successful! You can close this tab and return to the form.');
  } else {
    res.status(400).send('Token exchange failed: ' + JSON.stringify(data));
  }
});

// ── Form submission → send email via Zoho Mail API ───────────────────────────
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const accessToken = await getAccessToken();
    const accountId = await getAccountId(accessToken);
    const fromAddress = process.env.ZOHO_FROM_EMAIL;
    const toAddress = process.env.ZOHO_TO_EMAIL;

    const emailBody = {
      fromAddress,
      toAddress,
      subject: subject || 'New Form Submission',
      content: `
        <h2>New Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      mailFormat: 'html'
    };

    const apiRes = await fetch(`${getZohoMailApiUrl()}/accounts/${accountId}/messages`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    const result = await apiRes.json();
    console.log('Zoho API response:', JSON.stringify(result, null, 2));
    if (result.status && result.status.code === 200) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, error: result.message || 'Failed to send email' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`First time? Visit http://localhost:${PORT}/auth/zoho to authorize`);
});
