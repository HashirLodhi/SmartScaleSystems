const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const DEFAULT_PDF = path.join(__dirname, 'output', 'pdf', 'smart-scale-systems-agency-chatbot-guide.pdf');
const OUT_DIR = path.join(__dirname, 'content');
const OUT_FILE = path.join(OUT_DIR, 'rag-index.json');
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'for', 'from', 'has', 'have',
  'how', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'our', 'should', 'so',
  'that', 'the', 'their', 'this', 'to', 'us', 'we', 'what', 'when', 'where', 'who', 'with',
  'you', 'your',
]);

function normalizeText(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./ -]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function chunkText(text, maxWords = 115, overlapWords = 24) {
  const paragraphs = normalizeText(text)
    .split(/\n\s*\n/)
    .map(part => part.trim())
    .filter(Boolean);

  const chunks = [];
  let current = [];

  function flush() {
    if (!current.length) return;
    const content = current.join(' ').replace(/\s+/g, ' ').trim();
    if (content.length > 60) chunks.push(content);
    const overlap = content.split(/\s+/).slice(-overlapWords);
    current = overlap.length ? [overlap.join(' ')] : [];
  }

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    if (current.join(' ').split(/\s+/).length + words.length > maxWords) flush();

    if (words.length > maxWords) {
      for (let i = 0; i < words.length; i += maxWords - overlapWords) {
        chunks.push(words.slice(i, i + maxWords).join(' '));
      }
      current = [];
    } else {
      current.push(paragraph);
    }
  }

  flush();
  return chunks;
}

async function extractPdfText(pdfPath) {
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const data = await parser.getText();
  if (typeof parser.destroy === 'function') await parser.destroy();
  return normalizeText(data.text);
}

async function main() {
  const pdfPath = path.resolve(process.argv[2] || DEFAULT_PDF);

  if (!fs.existsSync(pdfPath)) {
    console.error(`RAG training failed: PDF not found at ${pdfPath}`);
    process.exit(1);
  }

  const text = await extractPdfText(pdfPath);
  const chunks = chunkText(text).map((content, index) => {
    const tokens = tokenize(content);
    return {
      id: `agency-${String(index + 1).padStart(3, '0')}`,
      source: path.relative(__dirname, pdfPath).replace(/\\/g, '/'),
      content,
      keywords: [...new Set(tokens)].slice(0, 60),
      tokenCount: tokens.length,
    };
  });

  const index = {
    version: 1,
    agency: 'Smart Scale Systems',
    createdAt: new Date().toISOString(),
    sourcePdf: path.relative(__dirname, pdfPath).replace(/\\/g, '/'),
    chunkCount: chunks.length,
    instructions: [
      'Use retrieved context as the latest agency source of truth.',
      'If retrieved context conflicts with older hardcoded prompt text, prefer retrieved context.',
      'Do not invent services, team members, pricing, credentials, or private details.',
    ],
    chunks,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(index, null, 2)}\n`);

  console.log(`RAG training complete.`);
  console.log(`Source PDF: ${pdfPath}`);
  console.log(`Chunks: ${chunks.length}`);
  console.log(`Index written: ${OUT_FILE}`);
}

main().catch(error => {
  console.error('RAG training failed:', error);
  process.exit(1);
});
