const { spawn } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const webPort = '3190';
const apiPort = '3191';
let output = '';

const dev = spawn(process.execPath, [path.join(root, 'scripts', 'dev.js')], {
  cwd: root,
  env: {
    ...process.env,
    WEB_PORT: webPort,
    API_PORT: apiPort,
    API_ORIGIN: `http://127.0.0.1:${apiPort}`,
    GROQ_API_KEY: '',
    NO_COLOR: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

dev.stdout.on('data', chunk => {
  output += chunk.toString();
});
dev.stderr.on('data', chunk => {
  output += chunk.toString();
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForWebsite() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (dev.exitCode !== null) {
      throw new Error(`Development stack stopped early.\n${output}`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${webPort}/`);
      if (response.ok) return;
    } catch (_error) {
      // The servers are still starting.
    }
    await wait(250);
  }
  throw new Error(`Development website did not become ready.\n${output}`);
}

async function stopDevelopmentStack() {
  if (dev.exitCode !== null) return;
  dev.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => dev.once('exit', resolve)),
    wait(2500),
  ]);
}

async function main() {
  try {
    await waitForWebsite();
    const response = await fetch(`http://127.0.0.1:${webPort}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Who is Hashir?', history: [] }),
    });
    const data = await response.json();

    if (!response.ok) throw new Error(`Chat proxy returned HTTP ${response.status}.`);
    if (!/muhammad hashir lodhi/i.test(data.reply || '')) {
      throw new Error(`Chat proxy returned an unexpected answer: ${data.reply || 'empty reply'}`);
    }

    console.log('PASS npm run dev starts the website and chat API together.');
    console.log('PASS /api/chat works through the development proxy.');
  } finally {
    await stopDevelopmentStack();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
