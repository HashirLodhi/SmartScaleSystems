const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'content', 'rag-index.json');
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'for', 'from', 'has', 'have',
  'how', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'our', 'should', 'so',
  'that', 'the', 'their', 'this', 'to', 'us', 'we', 'what', 'when', 'where', 'who', 'with',
  'you', 'your',
]);

let cachedIndex = null;
let cachedMtimeMs = 0;

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./ -]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function loadIndex() {
  try {
    const stat = fs.statSync(INDEX_PATH);
    if (cachedIndex && stat.mtimeMs === cachedMtimeMs) return cachedIndex;

    cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    cachedMtimeMs = stat.mtimeMs;
    return cachedIndex;
  } catch (error) {
    return null;
  }
}

function scoreChunk(queryTokens, chunk) {
  const keywords = new Set(Array.isArray(chunk.keywords) ? chunk.keywords : tokenize(chunk.content));
  const content = String(chunk.content || '').toLowerCase();
  const queryText = queryTokens.join(' ');
  let score = 0;

  for (const token of queryTokens) {
    if (keywords.has(token)) score += 3;
    if (content.includes(token)) score += 1;
  }

  if (String(chunk.source || '').startsWith('pinned/')) score += 8;

  const exactSignals = [
    'hashir',
    'muhammad hashir',
    'founder',
    'shahryar',
    'muhammad shahryar',
    'marketing',
    'nouman',
    'mudassir',
  ];

  for (const signal of exactSignals) {
    if (queryText.includes(signal) && content.includes(signal)) score += 12;
  }

  if (queryText.includes('founder') && content.includes('muhammad hashir lodhi')) score += 16;

  return score;
}

function retrieveContext(query, options = {}) {
  const index = loadIndex();
  if (!index || !Array.isArray(index.chunks)) return '';

  const topK = options.topK || 4;
  const maxChars = options.maxChars || 3200;
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return '';

  const selected = index.chunks
    .map(chunk => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);

  if (!selected.length) return '';

  let output = `Latest Smart Scale Systems RAG context from ${index.sourcePdf || 'agency knowledge file'}:\n`;
  for (const chunk of selected) {
    const next = `\n[${chunk.id}]\n${chunk.content}\n`;
    if ((output + next).length > maxChars) break;
    output += next;
  }

  return output.trim();
}

module.exports = {
  retrieveContext,
};
