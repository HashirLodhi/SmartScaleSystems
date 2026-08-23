function getZohoAccountsUrl() {
  return 'https://accounts.zoho.com';
}

function getZohoTokenUrl() {
  return `${getZohoAccountsUrl()}/oauth/v2/token`;
}

function getZohoAuthUrl() {
  return `${getZohoAccountsUrl()}/oauth/v2/auth`;
}

function getZohoMailApiUrl() {
  return 'https://mail.zoho.com/api';
}

module.exports = {
  getZohoAccountsUrl,
  getZohoAuthUrl,
  getZohoMailApiUrl,
  getZohoTokenUrl,
};
