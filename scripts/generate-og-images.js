const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const seo = require('../seo.config.cjs');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'public', 'og');
const fallbackPath = path.join(root, 'public', 'og.png');
const logoPath = path.join(root, 'public', 'logo-main.png');
const backgroundPath = path.join(root, 'public', 'og-master-background.png');
const WIDTH = 1200;
const HEIGHT = 630;

const copy = {
  '/': ['AI SYSTEMS', 'Built to move business forward.', 'Agents / Automation / Machine Learning'],
  '/services': ['CAPABILITIES', 'Applied AI, from first signal to production.', 'Explore our AI engineering services'],
  '/projects': ['SELECTED WORK', 'Ideas engineered into working systems.', 'Prototypes / Products / Production'],
  '/team': ['ABOUT US', 'A focused team for ambitious AI projects.', 'Engineering / Data / Automation'],
  '/contact': ['START A PROJECT', 'Bring us the problem worth solving.', 'Let\'s build what comes next'],
  '/services/ai-model-training': ['01 / MODEL TRAINING', 'Models trained for the real world.', 'Data-first / Evaluated / Deployment-ready'],
  '/services/ai-automation': ['02 / AI AUTOMATION', 'Turn repetitive work into intelligent flow.', 'Reliable / Measurable / Human-aware'],
  '/services/custom-ai-agents': ['03 / AI AGENTS', 'Agents that act with purpose and control.', 'Tools / Guardrails / Human oversight'],
  '/services/data-analytics': ['04 / DATA ANALYTICS', 'From scattered data to clear decisions.', 'Dashboards / Forecasting / Intelligence'],
  '/services/ai-integrations': ['05 / AI INTEGRATIONS', 'Add intelligence to the tools you already use.', 'Products / Platforms / Internal systems'],
  '/services/business-automations': ['06 / BUSINESS AUTOMATION', 'Better operations, built into the workflow.', 'Sales / Support / Back office'],
  '/services/computer-vision': ['07 / COMPUTER VISION', 'Make visual data operational.', 'Detection / OCR / Video intelligence'],
  '/services/nlp': ['08 / LANGUAGE AI', 'Understand language at business scale.', 'Classification / Search / Extraction'],
  '/services/llm': ['09 / LLM SOLUTIONS', 'Language models shaped around your use case.', 'RAG / Fine-tuning / AI assistants'],
  '/services/data-annotation': ['10 / DATA ANNOTATION', 'Precision labels. Defensible quality.', 'Image / Video / Text / Audio'],
  '/services/ai-training-data': ['11 / TRAINING DATA', 'Better datasets build better models.', 'Curated / Traceable / Model-first'],
  '/services/custom': ['12 / CUSTOM AI', 'When the problem does not fit a template.', 'Strategy / Prototype / Production'],
  '/privacy-policy': ['PRIVACY', 'Clear commitments around your information.', 'Smart Scale Systems'],
  '/terms-of-service': ['TERMS', 'The terms that guide our work together.', 'Smart Scale Systems'],
};

function slug(route) {
  return route.path === '/' ? 'home' : route.path.replace(/^\//, '').replace(/\//g, '-');
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (!current || ctx.measureText(test).width <= maxWidth) current = test;
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines;
}

function drawCover(ctx, image) {
  const scale = Math.max(WIDTH / image.width, HEIGHT / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
}

function drawRouteAccent(ctx, index) {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  const cx = 1010;
  const cy = 126 + (index % 4) * 18;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, 42 + i * 23, -0.7 + index * 0.08, 2.2 + index * 0.04);
    ctx.stroke();
  }
  ctx.restore();
}

function opaqueBounds(image) {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, image.width, image.height).data;
  let minX = image.width;
  let minY = image.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (pixels[(y * image.width + x) * 4 + 3] > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function drawLogo(ctx, logo, bounds) {
  const scale = Math.min(190 / bounds.width, 64 / bounds.height);
  const w = bounds.width * scale;
  const h = bounds.height * scale;
  ctx.save();
  ctx.filter = 'invert(1)';
  ctx.drawImage(
    logo,
    bounds.x, bounds.y, bounds.width, bounds.height,
    58, 54, w, h
  );
  ctx.restore();
}

function drawFrame(ctx) {
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(25.5, 25.5, WIDTH - 51, HEIGHT - 51);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(25, 25, 42, 2);
  ctx.fillRect(25, 25, 2, 42);
  ctx.fillRect(WIDTH - 67, HEIGHT - 27, 42, 2);
  ctx.fillRect(WIDTH - 27, HEIGHT - 67, 2, 42);
}

async function render(route, index, logo, logoBounds, background) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  drawCover(ctx, background);

  const shade = ctx.createLinearGradient(0, 0, WIDTH, 0);
  shade.addColorStop(0, 'rgba(0,0,0,0.98)');
  shade.addColorStop(0.48, 'rgba(0,0,0,0.88)');
  shade.addColorStop(0.72, 'rgba(0,0,0,0.2)');
  shade.addColorStop(1, 'rgba(0,0,0,0.05)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const bottom = ctx.createLinearGradient(0, 330, 0, HEIGHT);
  bottom.addColorStop(0, 'rgba(0,0,0,0)');
  bottom.addColorStop(1, 'rgba(0,0,0,0.66)');
  ctx.fillStyle = bottom;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawFrame(ctx);
  drawRouteAccent(ctx, index);
  drawLogo(ctx, logo, logoBounds);

  const [eyebrow, headline, detail] = copy[route.path];
  ctx.fillStyle = 'rgba(255,255,255,0.67)';
  ctx.font = '700 15px "Segoe UI", Arial, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(eyebrow, 58, 190);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 58px "Segoe UI", Arial, sans-serif';
  ctx.letterSpacing = '-2px';
  const lines = wrap(ctx, headline, 650).slice(0, 3);
  lines.forEach((line, lineIndex) => ctx.fillText(line, 58, 260 + lineIndex * 66));

  const detailY = Math.max(476, 282 + lines.length * 66);
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '400 21px "Segoe UI", Arial, sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText(detail, 58, detailY);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '600 14px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SMARTSCALESYSTEMS.TECH', 58, 574);
  ctx.textAlign = 'right';
  ctx.fillText(String(index + 1).padStart(2, '0'), 1140, 574);
  return canvas.toBuffer('image/png');
}

async function main() {
  for (const required of [logoPath, backgroundPath]) {
    if (!fs.existsSync(required)) throw new Error(`Required asset not found: ${required}`);
  }
  fs.mkdirSync(outputDir, { recursive: true });
  const [logo, background] = await Promise.all([loadImage(logoPath), loadImage(backgroundPath)]);
  const logoBounds = opaqueBounds(logo);
  for (let index = 0; index < seo.routes.length; index += 1) {
    const route = seo.routes[index];
    const buffer = await render(route, index, logo, logoBounds, background);
    const output = path.join(outputDir, `${slug(route)}.png`);
    fs.writeFileSync(output, buffer);
    if (route.path === '/') fs.writeFileSync(fallbackPath, buffer);
    console.log(`Wrote ${path.relative(root, output)}`);
  }
  console.log(`Updated ${path.relative(root, fallbackPath)}`);
}

main().catch((error) => {
  console.error(`OG image generation failed: ${error.message}`);
  process.exit(1);
});
