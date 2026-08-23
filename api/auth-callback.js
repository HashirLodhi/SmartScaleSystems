const { getZohoAuthUrl, getZohoTokenUrl } = require('../lib/zoho-config');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.query;
  if (!code) return res.status(400).send('No code received');
  const redirectUri = process.env.ZOHO_REDIRECT_URI || 'https://www.smartscalesystems.tech/auth/callback';

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      code,
      access_type: 'offline',
      redirect_uri: redirectUri
    });

    const tokenRes = await fetch(`${getZohoTokenUrl()}?${params}`, { method: 'POST' });
    const data = await tokenRes.json();

    if (data.access_token) {
      if (!data.refresh_token) {
        res.send(`
          <html><body style="font-family:sans-serif;padding:40px;text-align:center">
            <h2 style="color:#e67e22">No Refresh Token Returned</h2>
            <p>Zoho returned an access token but <strong>no refresh token</strong>.</p>
            <p>This happens if you authorized this app before. Try these steps:</p>
            <ol style="text-align:left;max-width:500px;margin:20px auto">
              <li>Go to <a href="${getZohoAuthUrl()}?scope=ZohoMail.messages.CREATE,ZohoMail.accounts.READ,offline_access&client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}&prompt=consent">re-authorize with forced consent</a></li>
              <li>Approve the app again</li>
              <li>The refresh token should appear this time</li>
            </ol>
            <p style="color:#666">Access token: <code>${data.access_token.substring(0, 20)}...</code></p>
          </body></html>
        `);
      } else {
        res.send(`
          <html><body style="font-family:sans-serif;padding:40px;text-align:center">
            <h2>Authorization Successful</h2>
            <p>Copy the refresh token below into your <code>.env</code> file as <code>ZOHO_REFRESH_TOKEN</code>:</p>
            <textarea style="width:100%;max-width:500px;height:60px;padding:8px;font-size:14px" readonly>${data.refresh_token}</textarea>
            <p style="color:#666;margin-top:20px">Access token expires in ${data.expires_in}s. You can close this tab.</p>
          </body></html>
        `);
      }
    } else {
      res.status(400).send('Token exchange failed: ' + JSON.stringify(data));
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
};
