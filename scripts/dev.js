const path = require('path');
const { spawn } = require('child_process');

const root = path.join(__dirname, '..');
const apiPort = process.env.API_PORT || '3001';
const webPort = process.env.WEB_PORT || '3000';
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const children = [];
let shuttingDown = false;

function start(label, file, args, env = {}) {
  const child = spawn(file, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  children.push(child);

  child.on('error', error => {
    console.error(`${label} failed to start:`, error.message);
    shutdown(1);
  });

  child.on('exit', code => {
    if (!shuttingDown) {
      console.error(`${label} stopped unexpectedly.`);
      shutdown(typeof code === 'number' ? code : 1);
    }
  });

  return child;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill();
  }

  const timer = setTimeout(() => process.exit(exitCode), 1200);
  timer.unref();

  Promise.all(children.map(child => new Promise(resolve => {
    if (child.exitCode !== null) return resolve();
    child.once('exit', resolve);
  }))).then(() => process.exit(exitCode));
}

console.log(`Starting website on http://localhost:${webPort}`);
console.log(`Starting chat API on http://localhost:${apiPort}`);

start('Chat API', process.execPath, [path.join(root, 'scripts', 'start-api.js')], {
  PORT: apiPort,
});
start('Website', process.execPath, [viteBin, '--host', '127.0.0.1', '--port', webPort, '--strictPort'], {
  API_ORIGIN: `http://127.0.0.1:${apiPort}`,
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('SIGHUP', () => shutdown(0));
