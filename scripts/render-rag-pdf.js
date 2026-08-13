const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const PDF_FILE = path.join(__dirname, '..', 'output', 'pdf', 'smart-scale-systems-agency-chatbot-guide.pdf');
const OUTPUT_DIR = path.join(__dirname, '..', 'tmp', 'pdfs');

async function main() {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const parser = new PDFParse({ data: fs.readFileSync(PDF_FILE) });
  const screenshots = await parser.getScreenshot({
    desiredWidth: 900,
    imageDataUrl: false,
    imageBuffer: true,
  });
  const textResult = await parser.getText();
  await parser.destroy();

  const pageFiles = [];
  for (let index = 0; index < screenshots.pages.length; index += 1) {
    const file = path.join(OUTPUT_DIR, `page-${String(index + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(file, screenshots.pages[index].data);
    pageFiles.push(file);
  }

  const columns = 4;
  const thumbWidth = 210;
  const thumbHeight = 297;
  const labelHeight = 24;
  const gap = 16;
  const rows = Math.ceil(pageFiles.length / columns);
  const sheet = createCanvas(
    columns * (thumbWidth + gap) + gap,
    rows * (thumbHeight + labelHeight + gap) + gap
  );
  const context = sheet.getContext('2d');
  context.fillStyle = '#d7d7d7';
  context.fillRect(0, 0, sheet.width, sheet.height);
  context.font = 'bold 13px Arial';
  context.textAlign = 'center';

  for (let index = 0; index < pageFiles.length; index += 1) {
    const image = await loadImage(pageFiles[index]);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = gap + column * (thumbWidth + gap);
    const y = gap + row * (thumbHeight + labelHeight + gap);
    context.fillStyle = '#ffffff';
    context.fillRect(x, y, thumbWidth, thumbHeight);
    context.drawImage(image, x, y, thumbWidth, thumbHeight);
    context.fillStyle = '#222222';
    context.fillText(`Page ${index + 1}`, x + thumbWidth / 2, y + thumbHeight + 17);
  }

  const contactSheet = path.join(OUTPUT_DIR, 'contact-sheet.png');
  fs.writeFileSync(contactSheet, sheet.toBuffer('image/png'));

  const knowledgeUnits = (textResult.text.match(/KNOWLEDGE UNIT:/g) || []).length;
  console.log(`Rendered pages: ${pageFiles.length}`);
  console.log(`Extracted knowledge units: ${knowledgeUnits}`);
  console.log(`Contact sheet: ${contactSheet}`);

  if (pageFiles.length !== 25) {
    throw new Error(`Expected 25 pages but rendered ${pageFiles.length}.`);
  }
  if (knowledgeUnits !== 23) {
    throw new Error(`Expected 23 knowledge units but extracted ${knowledgeUnits}.`);
  }
}

main().catch(error => {
  console.error('PDF render check failed:', error);
  process.exit(1);
});
