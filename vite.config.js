const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const gzipExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);

function gzipTextAssetsPlugin() {
  return {
    name: 'gzip-text-assets',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(outDir)) return;

      const compressFile = (filePath) => {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          fs.readdirSync(filePath).forEach((entry) => compressFile(path.join(filePath, entry)));
          return;
        }

        if (!gzipExtensions.has(path.extname(filePath)) || filePath.endsWith('.gz')) return;

        const source = fs.readFileSync(filePath);
        const compressed = zlib.gzipSync(source, { level: 9 });
        if (compressed.length < source.length) {
          fs.writeFileSync(`${filePath}.gz`, compressed);
        }
      };

      compressFile(outDir);
    },
  };
}

module.exports = defineConfig({
  plugins: [react(), gzipTextAssetsPlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
      '/chat': 'http://localhost:3001',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2500,
  },
});
