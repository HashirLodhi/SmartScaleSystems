const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const inputFile = path.resolve(
  process.argv[2] || path.join(root, 'ChatGPT Image Jul 26, 2026, 10_30_37 AM.png')
);
const outputFile = path.resolve(
  process.argv[3] || path.join(root, 'public', 'assets', 'chatbot', 'scalebot-logo-transparent.png')
);

const OUTPUT_SIZE = 512;
const BACKGROUND_THRESHOLD = 2;
const OPAQUE_THRESHOLD = 48;
const BOUNDS_THRESHOLD = 5;
const PADDING_RATIO = 0.08;

function smoothstep(start, end, value) {
  const position = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return position * position * (3 - 2 * position);
}

function luminance(red, green, blue) {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

async function main() {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input logo not found: ${inputFile}`);
  }

  const image = await loadImage(inputFile);
  const sourceCanvas = createCanvas(image.width, image.height);
  const sourceContext = sourceCanvas.getContext('2d');
  sourceContext.drawImage(image, 0, 0);
  const source = sourceContext.getImageData(0, 0, image.width, image.height);

  const matteCanvas = createCanvas(image.width, image.height);
  const matteContext = matteCanvas.getContext('2d');
  const matte = matteContext.createImageData(image.width, image.height);

  let minX = image.width;
  let minY = image.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const offset = (y * image.width + x) * 4;
      const light = luminance(
        source.data[offset],
        source.data[offset + 1],
        source.data[offset + 2]
      );

      // The supplied artwork is embossed black on a pure-black field. Its
      // visible relief is encoded in luminance, so luminance becomes the alpha
      // matte while the retained logo is normalized to solid black.
      const matteStrength = smoothstep(BACKGROUND_THRESHOLD, OPAQUE_THRESHOLD, light);
      const alpha = Math.round(255 * Math.pow(matteStrength, 0.72));

      matte.data[offset] = 0;
      matte.data[offset + 1] = 0;
      matte.data[offset + 2] = 0;
      matte.data[offset + 3] = alpha;

      if (light >= BOUNDS_THRESHOLD) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    throw new Error('No foreground artwork was detected.');
  }

  matteContext.putImageData(matte, 0, 0);

  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  const squareSize = Math.max(contentWidth, contentHeight);
  const padding = Math.round(squareSize * PADDING_RATIO);
  const cropSize = Math.min(
    Math.max(squareSize + padding * 2, 1),
    Math.min(image.width, image.height)
  );
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const cropX = Math.max(0, Math.min(image.width - cropSize, Math.round(centerX - cropSize / 2)));
  const cropY = Math.max(0, Math.min(image.height - cropSize, Math.round(centerY - cropSize / 2)));

  const outputCanvas = createCanvas(OUTPUT_SIZE, OUTPUT_SIZE);
  const outputContext = outputCanvas.getContext('2d');
  outputContext.imageSmoothingEnabled = true;
  outputContext.imageSmoothingQuality = 'high';
  outputContext.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  outputContext.drawImage(
    matteCanvas,
    cropX,
    cropY,
    cropSize,
    cropSize,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE
  );

  const outputData = outputContext.getImageData(0, 0, OUTPUT_SIZE, OUTPUT_SIZE).data;
  let visiblePixels = 0;
  for (let index = 3; index < outputData.length; index += 4) {
    if (outputData[index] > 8) visiblePixels += 1;
  }
  const coverage = visiblePixels / (OUTPUT_SIZE * OUTPUT_SIZE);
  const corners = [
    outputData[3],
    outputData[(OUTPUT_SIZE - 1) * 4 + 3],
    outputData[((OUTPUT_SIZE - 1) * OUTPUT_SIZE) * 4 + 3],
    outputData[(OUTPUT_SIZE * OUTPUT_SIZE - 1) * 4 + 3],
  ];

  if (Math.max(...corners) > 8) {
    throw new Error('Background removal validation failed: a corner is not transparent.');
  }
  if (coverage < 0.04 || coverage > 0.65) {
    throw new Error(`Background removal validation failed: ${(coverage * 100).toFixed(1)}% visible coverage.`);
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, outputCanvas.toBuffer('image/png'));

  console.log(`Transparent logo written: ${outputFile}`);
  console.log(`Source crop: ${cropSize}x${cropSize} at ${cropX},${cropY}`);
  console.log(`Visible coverage: ${(coverage * 100).toFixed(1)}%`);
  console.log('Corner alpha: 0');
}

main().catch(error => {
  console.error(`Logo background removal failed: ${error.message}`);
  process.exit(1);
});
