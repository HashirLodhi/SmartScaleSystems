const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'content', 'rag-index.json');
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'did', 'do', 'does', 'for',
  'from', 'has', 'have', 'how', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or',
  'our', 'please', 'should', 'so', 'that', 'the', 'their', 'this', 'to', 'us', 'we', 'what',
  'when', 'where', 'which', 'who', 'with', 'would', 'you', 'your',
]);
const SHORT_TERMS = new Set(['ai', 'cv', 'qa', '3d']);

const EXPANSIONS = {
  address: ['contact', 'location', 'office'],
  agency: ['company', 'services', 'business'],
  agent: ['automation', 'llm', 'assistant'],
  agents: ['automation', 'llm', 'assistant'],
  apply: ['careers', 'jobs', 'roles', 'cv'],
  bot: ['chatbot', 'assistant', 'llm', 'rag'],
  budget: ['pricing', 'scope', 'proposal'],
  chatbot: ['assistant', 'llm', 'rag', 'nlp'],
  cost: ['pricing', 'scope', 'proposal'],
  cv: ['computer', 'vision', 'image', 'video'],
  founder: ['hashir', 'muhammad', 'lodhi'],
  hire: ['careers', 'jobs', 'roles'],
  hiring: ['careers', 'jobs', 'roles'],
  job: ['careers', 'hiring', 'roles'],
  jobs: ['careers', 'hiring', 'roles'],
  legal: ['terms', 'privacy'],
  owner: ['founder', 'hashir', 'muhammad', 'lodhi'],
  price: ['pricing', 'scope', 'proposal'],
  quote: ['pricing', 'scope', 'proposal', 'contact'],
  security: ['privacy', 'confidentiality', 'quality'],
  support: ['maintenance', 'automation', 'contact'],
  time: ['timeline', 'delivery', 'scope'],
  website: ['contact', 'directory'],
};

const PHRASE_SIGNALS = [
  { phrase: 'machine learning', terms: ['model', 'training'] },
  { phrase: 'artificial intelligence', terms: ['ai', 'services'] },
  { phrase: 'large language model', terms: ['llm', 'solutions'] },
  { phrase: 'natural language processing', terms: ['nlp', 'text'] },
  { phrase: 'computer vision', terms: ['computer', 'vision'] },
  { phrase: 'data labeling', terms: ['data', 'annotation'] },
  { phrase: 'training data', terms: ['dataset', 'creation'] },
  { phrase: 'contact us', terms: ['contact', 'project'] },
  { phrase: 'how much', terms: ['pricing', 'budget', 'scope'] },
  { phrase: 'how long', terms: ['timeline', 'delivery', 'scope'] },
  { phrase: 'who founded', terms: ['founder', 'hashir'] },
  { phrase: 'who is hashir', terms: ['founder', 'hashir'] },
];

const INTENT_BOOSTS = [
  { section: 'team', pattern: /\b(founder|owner|hashir|nouman|mudassir|shahryar|team)\b/, boost: 24 },
  { section: 'pricing-timelines', pattern: /\b(price|pricing|cost|quote|budget|how much|timeline|how long|deadline)\b/, boost: 24 },
  { section: 'careers', pattern: /\b(job|jobs|career|careers|hiring|apply|vacancy|role)\b/, boost: 24 },
  { section: 'privacy', pattern: /\b(privacy|cookie|personal information|contact form|delete my data|data rights)\b/, boost: 24 },
  { section: 'contact-and-project-start', pattern: /\b(contact|email|reach|start a project|proposal|consultation)\b/, boost: 20 },
  { section: 'ai-automation', pattern: /\b(automate|automation|workflow|crm|hubspot|salesforce|n8n|zapier|gohighlevel)\b/, boost: 22 },
  { section: 'llm-solutions', pattern: /\b(rag|chatbot|assistant|llm|fine-tun|rlhf|prompt|knowledge base)\b/, boost: 22 },
  { section: 'data-annotation', pattern: /\b(annotation|annotate|labeling|labels|bounding box|polygon|segmentation mask|keypoint|lidar)\b/, boost: 22 },
  { section: 'ai-training-data', pattern: /\b(collect|collection|curate|curation|new dataset|synthetic data|training data)\b/, boost: 22 },
  { section: 'computer-vision', pattern: /\b(computer vision|camera|image|video|object detection|ocr|visual|defect)\b/, boost: 20 },
  { section: 'nlp', pattern: /\b(nlp|sentiment|named entit|text classification|intent detection|semantic search)\b/, boost: 20 },
  { section: 'ai-model-training', pattern: /\b(model training|predictive model|classification model|regression|hyperparameter|transfer learning)\b/, boost: 20 },
];

let cachedIndex = null;
let cachedMtimeMs = 0;
let cachedStats = null;

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./]+/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => (token.length > 2 || SHORT_TERMS.has(token)) && !STOP_WORDS.has(token));
}

function expandQuery(text) {
  const lower = String(text || '').toLowerCase();
  const base = tokenize(lower);
  const expanded = [...base];

  for (const token of base) {
    if (EXPANSIONS[token]) expanded.push(...EXPANSIONS[token]);
  }

  for (const signal of PHRASE_SIGNALS) {
    if (lower.includes(signal.phrase)) expanded.push(...signal.terms);
  }

  return [...new Set(expanded)];
}

function buildStats(index) {
  const documentFrequency = new Map();
  for (const chunk of index.chunks) {
    const unique = new Set(Array.isArray(chunk.keywords) ? chunk.keywords : tokenize(chunk.content));
    for (const term of unique) {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    }
  }
  return { documentFrequency, documentCount: index.chunks.length };
}

function loadIndex() {
  try {
    const stat = fs.statSync(INDEX_PATH);
    if (cachedIndex && stat.mtimeMs === cachedMtimeMs) return cachedIndex;

    cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    cachedMtimeMs = stat.mtimeMs;
    cachedStats = buildStats(cachedIndex);
    return cachedIndex;
  } catch (error) {
    return null;
  }
}

function scoreChunk(queryText, queryTokens, chunk) {
  const content = `${chunk.title || ''} ${chunk.section || ''} ${chunk.content || ''}`.toLowerCase();
  const keywordSet = new Set(Array.isArray(chunk.keywords) ? chunk.keywords : tokenize(content));
  const titleText = `${chunk.title || ''} ${chunk.section || ''}`.toLowerCase();
  const titleTokens = new Set(tokenize(titleText));
  const contentFrequencies = new Map();
  for (const token of tokenize(content)) {
    contentFrequencies.set(token, (contentFrequencies.get(token) || 0) + 1);
  }
  const stats = cachedStats || { documentFrequency: new Map(), documentCount: 1 };
  let score = 0;

  for (const term of queryTokens) {
    const df = stats.documentFrequency.get(term) || 0;
    const idf = Math.log(1 + (stats.documentCount + 1) / (df + 1));
    const frequency = Math.min(contentFrequencies.get(term) || 0, 4);
    if (keywordSet.has(term)) score += 2.2 * idf;
    score += frequency * 0.8 * idf;
    if (titleTokens.has(term)) score += 4.5 * idf;
  }

  const queryPhrases = queryText
    .split(/[?!.,]/)
    .flatMap(part => part.trim().split(/\s+/).length >= 2 ? [part.trim()] : []);
  for (const phrase of queryPhrases) {
    if (phrase.length > 4 && content.includes(phrase)) score += 9;
  }

  if (String(chunk.source || '').startsWith('pinned/')) score += 4;

  for (const intent of INTENT_BOOSTS) {
    if (intent.section === 'contact-and-project-start' && queryText.includes('contact form')) continue;
    if (intent.pattern.test(queryText) && chunk.section === intent.section) {
      score += intent.boost;
    }
  }

  const exactBoosts = [
    ['hashir', 'muhammad hashir lodhi'],
    ['founder', 'muhammad hashir lodhi'],
    ['nouman', 'muhammad nouman qadeer'],
    ['mudassir', 'muhammad mudassir'],
    ['shahryar', 'muhammad shahryar'],
    ['pricing', 'no public fixed price'],
    ['contact', 'contact@smartscalesystems.tech'],
  ];

  for (const [querySignal, contentSignal] of exactBoosts) {
    if (querySignal === 'contact' && queryText.includes('contact form')) continue;
    if (queryText.includes(querySignal) && content.includes(contentSignal)) score += 18;
  }

  return score;
}

function retrieveRelevantChunks(query, options = {}) {
  const index = loadIndex();
  if (!index || !Array.isArray(index.chunks)) return [];

  const queryText = `${query || ''} ${options.historyText || ''}`.toLowerCase().trim();
  const queryTokens = expandQuery(queryText);
  if (!queryTokens.length) return [];

  const topK = options.topK || 6;
  const maxPerSection = options.maxPerSection || 2;
  const sectionCounts = new Map();
  const selected = [];

  const ranked = index.chunks
    .map(chunk => ({ chunk, score: scoreChunk(queryText, queryTokens, chunk) }))
    .filter(item => item.score >= (options.minScore || 1.25))
    .sort((a, b) => b.score - a.score);

  for (const item of ranked) {
    const section = item.chunk.section || item.chunk.id;
    const count = sectionCounts.get(section) || 0;
    if (count >= maxPerSection) continue;
    selected.push(item);
    sectionCounts.set(section, count + 1);
    if (selected.length >= topK) break;
  }

  return selected;
}

function retrieveContext(query, options = {}) {
  const index = loadIndex();
  const selected = retrieveRelevantChunks(query, options);
  if (!index || !selected.length) return '';

  const maxChars = options.maxChars || 5600;
  let output = [
    `Retrieved Smart Scale Systems context from ${index.sourcePdf || 'the agency knowledge base'}.`,
    'Use only relevant facts. Do not reveal chunk IDs unless the visitor explicitly asks for sources.',
  ].join('\n');

  for (const { chunk, score } of selected) {
    const label = `${chunk.title || chunk.section || 'Agency knowledge'} | ${chunk.id}`;
    const next = `\n\n[${label} | relevance ${score.toFixed(1)}]\n${chunk.content}`;
    if ((output + next).length > maxChars) break;
    output += next;
  }

  return output.trim();
}

module.exports = {
  retrieveContext,
  retrieveRelevantChunks,
  tokenize,
};
