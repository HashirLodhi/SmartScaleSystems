const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const DEFAULT_PDF = path.join(__dirname, 'output', 'pdf', 'smart-scale-systems-agency-chatbot-guide.pdf');
const OUT_DIR = path.join(__dirname, 'content');
const OUT_FILE = path.join(OUT_DIR, 'rag-index.json');

const PINNED_FACTS = [
  {
    id: 'core-company',
    section: 'company-overview',
    title: 'Company overview',
    content: 'Smart Scale Systems is a global AI solutions company established in 2021. It serves businesses worldwide across the full AI lifecycle: data creation and annotation, model development and evaluation, automation, integration, and deployment support.',
  },
  {
    id: 'core-services',
    section: 'service-router',
    title: 'Primary services',
    content: 'Smart Scale Systems offers AI Model Training, AI Automation, Computer Vision, NLP, LLM Solutions, Data Annotation, AI Training Data Creation, and Custom AI Solutions.',
  },
  {
    id: 'core-contact',
    section: 'contact-and-project-start',
    title: 'Contact and project start',
    content: 'The official website is https://www.smartscalesystems.tech. The Contact page is /contact and the public email is contact@smartscalesystems.tech. The website states that inquiries receive a response within one business day with a clear action plan.',
  },
  {
    id: 'core-pricing-timeline',
    section: 'pricing-timelines',
    title: 'Pricing and timelines',
    content: 'Smart Scale Systems does not publish a fixed price list or universal project timeline. Pricing and delivery plans depend on scope, data, volume, complexity, integrations, quality targets, risk, and support. Direct visitors to /contact for a custom proposal.',
  },
  {
    id: 'team-hashir-founder',
    section: 'team',
    title: 'Muhammad Hashir Lodhi',
    content: 'Muhammad Hashir Lodhi, also called Hashir, is the Founder of Smart Scale Systems. He founded the agency, leads its technical direction, and focuses on AI strategy, machine learning, automation, computer vision, deep learning, and scalable AI systems.',
  },
  {
    id: 'team-nouman-engineer',
    section: 'team',
    title: 'Muhammad Nouman Qadeer',
    content: 'Muhammad Nouman Qadeer, also called Nouman, is an AI Engineer at Smart Scale Systems. He works on machine learning workflows, model development, data processing, AI integration, and reliable production-oriented AI solutions.',
  },
  {
    id: 'team-mudassir-annotator',
    section: 'team',
    title: 'Muhammad Mudassir',
    content: 'Muhammad Mudassir is the AI Data Annotator and Labeling Expert at Smart Scale Systems. He specializes in dataset preparation, data labeling, image annotation, bounding boxes, polygons, and annotation quality assurance.',
  },
  {
    id: 'team-shahryar-marketing',
    section: 'team',
    title: 'Muhammad Shahryar',
    content: 'Muhammad Shahryar, also called Shahryar, is the Marketing Expert at Smart Scale Systems. His published work includes B2B lead research, lead generation, CRM optimization, sales workflow automation, GoHighLevel, HubSpot, n8n, and API integrations.',
  },
  {
    id: 'core-answer-boundary',
    section: 'answer-contract',
    title: 'Answer boundaries',
    content: 'ScaleBot must not invent prices, timelines, client identities, certifications, office addresses, private team details, project guarantees, or legal conclusions. When a fact is not published, say so and direct the visitor to Contact Us. If a visitor is rude, stay calm and keep helping without lecturing.',
  },
];

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'for', 'from', 'has', 'have',
  'how', 'i', 'in', 'is', 'it', 'its', 'me', 'my', 'of', 'on', 'or', 'our', 'should', 'so',
  'that', 'the', 'their', 'this', 'to', 'us', 'we', 'what', 'when', 'where', 'who', 'with',
  'you', 'your',
]);
const SHORT_TERMS = new Set(['ai', 'cv', 'qa', '3d']);

function normalizeText(text) {
  return String(text || '')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function cleanPdfText(text) {
  return normalizeText(text)
    .replace(/SMART SCALE SYSTEMS\s*/gi, '')
    .replace(/ScaleBot Business Knowledge Base\s+\d+\s*\/\s*\d+/gi, '')
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./]+/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => (token.length > 2 || SHORT_TERMS.has(token)) && !STOP_WORDS.has(token));
}

function titleFromId(id) {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function chunkText(text, maxWords = 150, overlapWords = 22) {
  const paragraphs = normalizeText(text)
    .split(/\n\s*\n/)
    .map(part => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const chunks = [];
  let current = [];
  let currentWords = 0;

  function flush() {
    if (!current.length) return;
    const content = current.join('\n\n').trim();
    if (content.length > 80) chunks.push(content);
    const overlap = content.split(/\s+/).slice(-overlapWords).join(' ');
    current = overlap ? [overlap] : [];
    currentWords = overlap ? overlap.split(/\s+/).length : 0;
  }

  for (const paragraph of paragraphs) {
    const words = paragraph.split(/\s+/);
    if (currentWords + words.length > maxWords) flush();

    if (words.length > maxWords) {
      const step = maxWords - overlapWords;
      for (let i = 0; i < words.length; i += step) {
        const slice = words.slice(i, i + maxWords).join(' ');
        if (slice.length > 80) chunks.push(slice);
      }
      current = [];
      currentWords = 0;
    } else {
      current.push(paragraph);
      currentWords += words.length;
    }
  }

  flush();
  return chunks;
}

function splitKnowledgeUnits(text) {
  const source = cleanPdfText(text);
  const pattern = /KNOWLEDGE UNIT:\s*([a-z0-9-]+)/gi;
  const matches = [...source.matchAll(pattern)];

  if (!matches.length) {
    return [{ id: 'legacy-document', title: 'Agency knowledge', content: source }];
  }

  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    const id = match[1].toLowerCase();
    const content = cleanPdfText(source.slice(start, end));
    return { id, title: titleFromId(id), content };
  }).filter(unit => unit.content.length > 80);
}

async function extractPdfText(pdfPath) {
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const data = await parser.getText();
  if (typeof parser.destroy === 'function') await parser.destroy();
  return normalizeText(data.text);
}

function makeChunk({ id, section, title, source, content }) {
  const tokens = tokenize(content);
  return {
    id,
    section,
    title,
    source,
    content,
    keywords: [...new Set(tokens)].slice(0, 100),
    tokenCount: tokens.length,
  };
}

async function main() {
  const pdfPath = path.resolve(process.argv[2] || DEFAULT_PDF);

  if (!fs.existsSync(pdfPath)) {
    console.error(`RAG training failed: PDF not found at ${pdfPath}`);
    process.exit(1);
  }

  const text = await extractPdfText(pdfPath);
  const source = path.relative(__dirname, pdfPath).replace(/\\/g, '/');
  const units = splitKnowledgeUnits(text);
  const pdfChunks = [];

  for (const unit of units) {
    chunkText(unit.content).forEach((content, index) => {
      pdfChunks.push(makeChunk({
        id: `agency-${unit.id}-${String(index + 1).padStart(2, '0')}`,
        section: unit.id,
        title: unit.title,
        source,
        content,
      }));
    });
  }

  const pinnedChunks = PINNED_FACTS.map(fact => makeChunk({
    ...fact,
    source: 'pinned/core-facts',
  }));
  const chunks = [...pinnedChunks, ...pdfChunks];

  const index = {
    version: 2,
    agency: 'Smart Scale Systems',
    createdAt: new Date().toISOString(),
    sourcePdf: source,
    knowledgeUnitCount: units.length,
    chunkCount: chunks.length,
    instructions: [
      'Use retrieved context as the latest published agency source of truth.',
      'Treat performance targets, timelines, and outcomes as project-specific unless the knowledge source explicitly verifies them.',
      'Do not invent pricing, timelines, team details, client identities, credentials, locations, or guarantees.',
      'When a fact is not published, say so and direct the visitor to the Contact page.',
    ],
    chunks,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(index, null, 2)}\n`);

  console.log('RAG training complete.');
  console.log(`Source PDF: ${pdfPath}`);
  console.log(`Knowledge units: ${units.length}`);
  console.log(`Chunks: ${chunks.length}`);
  console.log(`Index written: ${OUT_FILE}`);
}

main().catch(error => {
  console.error('RAG training failed:', error);
  process.exit(1);
});
