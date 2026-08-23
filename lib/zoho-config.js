const fs = require('fs');
const path = require('path');

const DEFAULT_ACCOUNTS_URL = 'https://accounts.zoho.com';
const DEFAULT_MAIL_API_URL = 'https://mail.zoho.com/api';
const TOKEN_CACHE_PATH = path.join(__dirname, '..', 'Zoho automation', 'zoho_tokens.json');

function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    if (!raw.trim()) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getCachedZohoTokens() {
  return readJsonFile(TOKEN_CACHE_PATH);
}

function normalizeBaseUrl(value, fallback) {
  const input = String(value || fallback).trim();
  if (!input) return fallback;
  try {
    return new URL(input).origin;
  } catch {
    return fallback;
  }
}

function getZohoAccountsUrl() {
  return normalizeBaseUrl(
    process.env.ZOHO_ACCOUNTS_URL || process.env.ZOHO_ACCOUNTS_SERVER,
    DEFAULT_ACCOUNTS_URL
  );
}

function getZohoTokenUrl() {
  return `${getZohoAccountsUrl()}/oauth/v2/token`;
}

function getZohoAuthUrl() {
  return `${getZohoAccountsUrl()}/oauth/v2/auth`;
}

function getZohoMailApiUrl() {
  if (process.env.ZOHO_MAIL_API_URL) {
    return normalizeBaseUrl(process.env.ZOHO_MAIL_API_URL, DEFAULT_MAIL_API_URL);
  }

  return DEFAULT_MAIL_API_URL;
}

module.exports = {
  getCachedZohoTokens,
  getZohoAccountsUrl,
  getZohoAuthUrl,
  getZohoMailApiUrl,
  getZohoTokenUrl,
};
