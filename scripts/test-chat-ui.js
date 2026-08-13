const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'scripts', 'robot-mascot.js'),
  'utf8'
);
const logoFile = path.join(__dirname, '..', 'public', 'assets', 'chatbot', 'scalebot-logo-transparent.png');

const checks = [
  ['panel clamps to viewport width', /width:\s*min\(392px,\s*calc\(100vw - 32px\)\)/],
  ['panel clamps to viewport height', /height:\s*min\(610px,\s*calc\(100dvh - 128px\)\)/],
  ['message area blocks horizontal scrolling', /\.chat-body\s*\{[\s\S]*?overflow-x:\s*hidden/],
  ['messages can shrink inside flex layout', /\.chat-msg\s*\{[\s\S]*?min-width:\s*0/],
  ['long content wraps inside bubbles', /\.chat-msg\s*\{[\s\S]*?overflow-wrap:\s*anywhere/],
  ['links can wrap without widening the panel', /\.chat-msg a\s*\{[\s\S]*?word-break:\s*break-word/],
  ['mobile panel uses available width', /@media \(max-width:\s*520px\)[\s\S]*?#mascot-chat-window\s*\{[\s\S]*?width:\s*100%/],
  ['bot content uses the safe structured renderer', /message\.appendChild\(formatBotMessage\(text\)\)/],
  ['renderer validates links before creating anchors', /if \(isSafeHref\(match\[3\]\)\)/],
  ['chat inherits the Cabin website font token', /font-family:\s*var\(--font-body,\s*'Cabin'/],
  ['header uses the website solid black palette', /\.chat-header\s*\{[\s\S]*?background:\s*#000000/],
  ['header uses the transparent ScaleBot logo', /<img src="\/assets\/chatbot\/scalebot-logo-transparent\.png\?v=20260726" alt="">/],
  ['header logo fits cleanly inside its badge', /\.chat-brand-mark img\s*\{[\s\S]*?object-fit:\s*contain;[\s\S]*?padding:\s*3px/],
  ['header logo asset exists', () => fs.existsSync(logoFile) && fs.statSync(logoFile).size > 0],
  ['chat contains no violet design values', content => !/(#5959ff|#5757ff|#7777ff|#3e3ee7|#a5a5ff|89,\s*89,\s*255|113,\s*113,\s*255)/i.test(content)],
  ['chat uses website-supported font weights', content => !/font-weight:\s*(650|750)\b/.test(content)],
  ['working state includes the animated globe', /class="chat-globe"/],
  ['working state includes the orbit animation', /@keyframes galaxy-orbit/],
  ['working state uses the requested galaxy copy', /Agent drifting through galaxies\.\.\./],
  ['old three-dot loader is removed', content => !/chat-dot|<span><\/span><span><\/span><span><\/span>/.test(content)],
  ['textarea has no rectangular focus outline', /\.chat-composer textarea:focus,[\s\S]*?\.chat-composer textarea:focus-visible\s*\{[\s\S]*?outline:\s*none !important;[\s\S]*?box-shadow:\s*none !important/],
  ['rounded input shell retains a focus state', /\.chat-input-shell:focus-within\s*\{[\s\S]*?border-color:\s*#000000;[\s\S]*?border-radius|\.chat-input-shell:focus-within\s*\{[\s\S]*?box-shadow:/],
];

let failures = 0;
for (const [label, condition] of checks) {
  const passed = typeof condition === 'function' ? condition(source) : condition.test(source);
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`);
  if (!passed) failures += 1;
}

if (failures) {
  console.error(`ScaleBot UI failed ${failures} of ${checks.length} checks.`);
  process.exit(1);
}

console.log(`ScaleBot UI passed ${checks.length} of ${checks.length} checks.`);
