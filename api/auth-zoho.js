const { getZohoAuthUrl } = require('../lib/zoho-config');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const redirectUri = process.env.ZOHO_REDIRECT_URI || 'http://localhost:3000/auth/callback';
  const url = `${getZohoAuthUrl()}?scope=ZohoMail.messages.CREATE,ZohoMail.accounts.READ,offline_access&client_id=${process.env.ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(302, url);
};
