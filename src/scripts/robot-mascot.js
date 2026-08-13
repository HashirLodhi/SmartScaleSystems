(function () {
  if (window.__smartScaleMascotLoaded) return;
  window.__smartScaleMascotLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    #smart-scale-mascot-wrap,
    #smart-scale-mascot-wrap * {
      box-sizing: border-box;
    }

    #smart-scale-mascot-wrap {
      --chat-ink: #0a0a0a;
      --chat-muted: #707070;
      --chat-line: #e4e4e4;
      --chat-soft: #f4f4f4;
      --chat-accent: #000000;
      position: fixed;
      right: clamp(18px, 2.5vw, 34px);
      bottom: clamp(18px, 3vw, 30px);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      max-width: calc(100vw - 24px);
      color: var(--chat-ink);
      font-family: var(--font-body, 'Cabin', Arial, sans-serif);
    }

    #smart-scale-mascot {
      position: relative;
      width: 72px;
      height: 82px;
      flex: 0 0 auto;
      cursor: pointer;
      animation: float-mascot 3.2s ease-in-out infinite;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.2));
      transition: transform 180ms ease, filter 180ms ease;
    }

    #smart-scale-mascot:hover {
      transform: translateY(-2px) scale(1.035);
      filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.24));
    }

    #smart-scale-mascot:focus-visible,
    .chat-icon-btn:focus-visible,
    .chat-suggestion-btn:focus-visible,
    .chat-send-btn:focus-visible,
    .chat-msg a:focus-visible {
      outline: 3px solid #000000;
      outline-offset: 3px;
      box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.9);
    }

    @keyframes float-mascot {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }

    .mascot-eye-pupil {
      transition: cx 90ms ease-out, cy 90ms ease-out;
    }

    .mascot-message {
      position: absolute;
      right: 50%;
      bottom: calc(100% + 8px);
      transform: translateX(50%) translateY(6px);
      max-width: 190px;
      padding: 8px 11px;
      border-radius: 9px;
      background: var(--chat-ink);
      color: #fff;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
      font-size: 0.76rem;
      font-weight: 600;
      line-height: 1.2;
      opacity: 0;
      pointer-events: none;
      white-space: nowrap;
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .mascot-message::after {
      position: absolute;
      top: 100%;
      left: 50%;
      width: 0;
      height: 0;
      border: 6px solid transparent;
      border-top-color: var(--chat-ink);
      content: '';
      transform: translateX(-50%);
    }

    #smart-scale-mascot:hover .mascot-message {
      transform: translateX(50%) translateY(0);
      opacity: 1;
    }

    #mascot-chat-window {
      width: min(392px, calc(100vw - 32px));
      height: min(610px, calc(100dvh - 128px));
      min-height: 390px;
      margin-bottom: 14px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 22px;
      background: #fff;
      box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.2),
        0 4px 18px rgba(0, 0, 0, 0.08);
      transform-origin: bottom right;
      animation: chat-pop-in 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      isolation: isolate;
    }

    #mascot-chat-window[data-open='true'] {
      display: flex;
    }

    @keyframes chat-pop-in {
      from { opacity: 0; transform: translateY(14px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .chat-header {
      min-width: 0;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 15px 15px 14px 16px;
      background: #000000;
      color: #fff;
    }

    .chat-brand {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .chat-brand-mark {
      width: 42px;
      height: 42px;
      flex: 0 0 auto;
      overflow: hidden;
      border: 1px solid #d8d8d8;
      border-radius: 13px;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
    }

    .chat-brand-mark img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
      padding: 3px;
    }

    .chat-brand-copy {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .chat-title {
      overflow: hidden;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.1;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-status {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #bdbdbd;
      font-size: 0.7rem;
      font-weight: 500;
      line-height: 1.2;
      white-space: nowrap;
    }

    .chat-status-dot {
      width: 6px;
      height: 6px;
      flex: 0 0 auto;
      border-radius: 50%;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.16);
    }

    .chat-header-actions {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .chat-icon-btn {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      appearance: none;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #cecece;
      cursor: pointer;
      transition: color 160ms ease, background 160ms ease;
    }

    .chat-icon-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .chat-icon-btn svg {
      width: 17px;
      height: 17px;
      pointer-events: none;
    }

    .chat-body {
      min-width: 0;
      min-height: 0;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      gap: 11px;
      width: 100%;
      padding: 18px 15px 20px;
      overflow-x: hidden;
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-color: #b5b5b5 transparent;
      scrollbar-gutter: stable;
    }

    .chat-body::-webkit-scrollbar {
      width: 6px;
    }

    .chat-body::-webkit-scrollbar-track {
      background: transparent;
    }

    .chat-body::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: #b9b9b9;
    }

    .chat-msg {
      min-width: 0;
      max-width: min(88%, 330px);
      flex: 0 0 auto;
      padding: 11px 13px;
      border-radius: 15px;
      font-size: 0.875rem;
      line-height: 1.52;
      overflow-wrap: anywhere;
      word-break: normal;
      white-space: normal;
    }

    .chat-msg.bot {
      align-self: flex-start;
      border: 1px solid #e8e8e8;
      border-bottom-left-radius: 5px;
      background: var(--chat-soft);
      color: #171717;
    }

    .chat-msg.user {
      align-self: flex-end;
      border-bottom-right-radius: 5px;
      background: var(--chat-ink);
      color: #fff;
    }

    .chat-msg p,
    .chat-msg ul,
    .chat-msg ol {
      max-width: 100%;
      margin: 0;
      padding: 0;
    }

    .chat-msg p + p,
    .chat-msg p + ul,
    .chat-msg p + ol,
    .chat-msg ul + p,
    .chat-msg ol + p {
      margin-top: 8px;
    }

    .chat-msg ul,
    .chat-msg ol {
      padding-left: 18px;
    }

    .chat-msg li {
      margin: 3px 0;
      padding-left: 1px;
    }

    .chat-msg strong {
      font-weight: 700;
    }

    .chat-msg code {
      padding: 1px 4px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.07);
      font-family: var(--font-body, 'Cabin', Arial, sans-serif);
      font-size: 0.86em;
    }

    .chat-msg a {
      color: #000000;
      font-weight: 700;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .chat-msg.user a {
      color: #fff;
    }

    .chat-suggestions {
      min-width: 0;
      max-width: 100%;
      flex: 0 0 auto;
      align-self: flex-start;
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }

    .chat-suggestion-btn {
      max-width: 100%;
      appearance: none;
      border: 1px solid #dcdcdc;
      border-radius: 999px;
      padding: 8px 11px;
      background: #fff;
      color: #202020;
      cursor: pointer;
      font: inherit;
      font-size: 0.73rem;
      font-weight: 500;
      line-height: 1.15;
      overflow-wrap: anywhere;
      transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;
    }

    .chat-suggestion-btn:hover {
      border-color: #9c9c9c;
      background: #f7f7f7;
      transform: translateY(-1px);
    }

    .chat-composer {
      min-width: 0;
      flex: 0 0 auto;
      padding: 11px 12px 12px;
      border-top: 1px solid var(--chat-line);
      background: #fff;
    }

    .chat-input-shell {
      min-width: 0;
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 6px 6px 6px 13px;
      border: 1px solid #dcdcdc;
      border-radius: 18px;
      background: #fff;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }

    .chat-input-shell:focus-within {
      border-color: #000000;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
    }

    .chat-composer textarea {
      min-width: 0;
      min-height: 34px;
      max-height: 104px;
      flex: 1 1 auto;
      resize: none;
      overflow-y: auto;
      appearance: none;
      border: 0;
      outline: 0;
      padding: 7px 0 5px;
      background: transparent;
      color: #171717;
      font: inherit;
      font-size: 0.86rem;
      line-height: 1.35;
    }

    .chat-composer textarea::placeholder {
      color: #8c8c8c;
    }

    .chat-composer textarea:focus,
    .chat-composer textarea:focus-visible {
      outline: none !important;
      outline-offset: 0 !important;
      box-shadow: none !important;
    }

    .chat-send-btn {
      width: 36px;
      height: 36px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      appearance: none;
      border: 0;
      border-radius: 12px;
      background: var(--chat-ink);
      color: #fff;
      cursor: pointer;
      transition: transform 150ms ease, background 150ms ease, opacity 150ms ease;
    }

    .chat-send-btn:hover:not(:disabled) {
      background: var(--chat-accent);
      transform: translateY(-1px);
    }

    .chat-send-btn:disabled,
    .chat-composer textarea:disabled {
      cursor: not-allowed;
      opacity: 0.52;
    }

    .chat-send-btn svg {
      width: 17px;
      height: 17px;
      pointer-events: none;
    }

    .chat-composer-note {
      margin: 7px 5px 0;
      color: #949494;
      font-size: 0.62rem;
      line-height: 1.25;
      text-align: center;
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 38px;
      padding: 2px 1px;
    }

    .chat-cosmos {
      position: relative;
      width: 34px;
      height: 34px;
      flex: 0 0 34px;
      display: block;
      animation: galaxy-float 2.4s ease-in-out infinite;
    }

    .chat-globe {
      position: absolute;
      inset: 6px;
      display: block;
      overflow: hidden;
      border: 1.5px solid #101010;
      border-radius: 50%;
      background:
        radial-gradient(circle at 34% 28%, #ffffff 0 2px, transparent 2.5px),
        linear-gradient(145deg, #1a1a1a, #5d5d5d);
      box-shadow:
        inset -4px -3px 7px rgba(0, 0, 0, 0.25),
        0 3px 8px rgba(0, 0, 0, 0.14);
    }

    .chat-globe::before {
      position: absolute;
      inset: 2px 6px;
      border-right: 1px solid rgba(255, 255, 255, 0.7);
      border-left: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      content: '';
      animation: globe-longitude 2.2s ease-in-out infinite;
    }

    .chat-globe::after {
      position: absolute;
      top: 50%;
      right: 2px;
      left: 2px;
      border-top: 1px solid rgba(255, 255, 255, 0.7);
      content: '';
      transform: translateY(-50%);
    }

    .chat-orbit {
      position: absolute;
      inset: 8px -1px;
      display: block;
      border: 1px solid #898989;
      border-radius: 50%;
      animation: galaxy-orbit 2.8s linear infinite;
    }

    .chat-orbit::after {
      position: absolute;
      top: -2.5px;
      left: 50%;
      width: 5px;
      height: 5px;
      border: 1px solid #ffffff;
      border-radius: 50%;
      background: #000000;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.28);
      content: '';
      transform: translateX(-50%);
    }

    .typing-copy {
      width: auto;
      height: auto;
      display: block;
      border-radius: 0;
      background: linear-gradient(90deg, #252525 0%, #929292 48%, #252525 100%);
      background-size: 210% 100%;
      color: #3f3f3f;
      font-size: 0.72rem;
      font-weight: 500;
      line-height: 1.25;
      white-space: nowrap;
      animation: galaxy-shimmer 2.2s linear infinite;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @keyframes galaxy-float {
      0%, 100% { transform: translateY(1px) rotate(-2deg); }
      50% { transform: translateY(-2px) rotate(2deg); }
    }

    @keyframes globe-longitude {
      0%, 100% { transform: scaleX(0.72); opacity: 0.68; }
      50% { transform: scaleX(1.18); opacity: 1; }
    }

    @keyframes galaxy-orbit {
      from { transform: rotate(-24deg); }
      to { transform: rotate(336deg); }
    }

    @keyframes galaxy-shimmer {
      from { background-position: 110% 0; }
      to { background-position: -110% 0; }
    }

    @media (max-width: 520px) {
      #smart-scale-mascot-wrap {
        right: 12px;
        bottom: max(12px, env(safe-area-inset-bottom));
        left: 12px;
        max-width: none;
      }

      #mascot-chat-window {
        width: 100%;
        height: min(68dvh, 570px);
        min-height: 360px;
        border-radius: 20px;
      }

      #smart-scale-mascot {
        width: 62px;
        height: 72px;
      }

      .chat-body {
        padding-right: 13px;
        padding-left: 13px;
      }

      .chat-msg {
        max-width: 90%;
      }
    }

    @media (max-height: 570px) {
      #mascot-chat-window {
        height: calc(100dvh - 96px);
        min-height: 300px;
        margin-bottom: 8px;
      }

      #smart-scale-mascot {
        width: 52px;
        height: 60px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #smart-scale-mascot,
      #mascot-chat-window,
      .chat-cosmos,
      .chat-globe::before,
      .chat-orbit,
      .typing-copy {
        animation: none;
      }

      #smart-scale-mascot,
      .chat-icon-btn,
      .chat-suggestion-btn,
      .chat-send-btn {
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement('div');
  wrapper.id = 'smart-scale-mascot-wrap';
  wrapper.innerHTML = `
    <section id="mascot-chat-window" role="dialog" aria-modal="false" aria-labelledby="chat-title" data-open="false">
      <header class="chat-header">
        <div class="chat-brand">
          <div class="chat-brand-mark" aria-hidden="true">
            <img src="/assets/chatbot/scalebot-logo-transparent.png?v=20260726" alt="">
          </div>
          <div class="chat-brand-copy">
            <span class="chat-title" id="chat-title">ScaleBot</span>
            <span class="chat-status"><span class="chat-status-dot"></span><span id="chat-status-text">Business AI assistant</span></span>
          </div>
        </div>
        <div class="chat-header-actions">
          <button type="button" class="chat-icon-btn" id="chat-reset-btn" aria-label="Start a new conversation" title="New conversation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M12 5a7 7 0 1 1-6.65 4.82"/><path d="M4 4v5h5"/>
            </svg>
          </button>
          <button type="button" class="chat-icon-btn" id="chat-close-btn" aria-label="Close chat" title="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18"/>
            </svg>
          </button>
        </div>
      </header>
      <div class="chat-body" id="chat-body" aria-live="polite" aria-relevant="additions"></div>
      <form class="chat-composer" id="chat-form">
        <div class="chat-input-shell">
          <textarea id="chat-input" rows="1" maxlength="1600" placeholder="Ask about services, pricing, or your project..." aria-label="Message ScaleBot"></textarea>
          <button type="submit" class="chat-send-btn" id="chat-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
              <path d="M21 3L10.4 13.6"/><path d="M21 3l-6.7 18-3.9-7.4L3 9.7 21 3z"/>
            </svg>
          </button>
        </div>
        <div class="chat-composer-note">Grounded in Smart Scale Systems business information</div>
      </form>
    </section>

    <div id="smart-scale-mascot" role="button" tabindex="0" aria-label="Open ScaleBot chat" aria-expanded="false" aria-controls="mascot-chat-window">
      <div class="mascot-message">Ask ScaleBot</div>
      <svg viewBox="0 0 100 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="50" y1="30" x2="50" y2="10" stroke="#e5e5e5" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="8" r="6" fill="#666666"/>
        <rect x="10" y="55" width="10" height="20" rx="3" fill="#e5e5e5"/>
        <rect x="80" y="55" width="10" height="20" rx="3" fill="#e5e5e5"/>
        <rect x="18" y="30" width="64" height="64" rx="16" fill="#666666"/>
        <rect x="26" y="42" width="48" height="36" rx="8" fill="#ffffff"/>
        <circle cx="36" cy="56" r="8" fill="#e5e5e5"/>
        <circle cx="64" cy="56" r="8" fill="#e5e5e5"/>
        <circle id="pupil-left" class="mascot-eye-pupil" cx="36" cy="56" r="4" fill="#000000"/>
        <circle id="pupil-right" class="mascot-eye-pupil" cx="64" cy="56" r="4" fill="#000000"/>
        <path d="M42 68q8 8 16 0" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M40 94h20l-5 10H45z" fill="#e5e5e5"/>
        <path d="M30 104h40c7 0 7 12 0 12H30c-7 0-7-12 0-12z" fill="#666666"/>
      </svg>
    </div>
  `;
  document.body.appendChild(wrapper);

  const mascot = document.getElementById('smart-scale-mascot');
  const chatWindow = document.getElementById('mascot-chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  const resetBtn = document.getElementById('chat-reset-btn');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const statusText = document.getElementById('chat-status-text');
  const leftPupil = document.getElementById('pupil-left');
  const rightPupil = document.getElementById('pupil-right');

  let chatHistory = [];
  let isChatOpen = false;
  let isSending = false;

  const suggestions = [
    ['Find my service', 'Which Smart Scale Systems service is right for my business?'],
    ['Explore capabilities', 'What services does Smart Scale Systems provide?'],
    ['Meet the team', 'Tell me about the Smart Scale Systems team.'],
    ['Start a project', 'How can I start a project with Smart Scale Systems?'],
  ];

  function setStatus(text) {
    statusText.textContent = text;
  }

  function scrollToLatest() {
    requestAnimationFrame(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    });
  }

  function isSafeHref(href) {
    if (typeof href !== 'string') return false;
    if (/^\/(?!\/)/.test(href)) return true;
    if (/^mailto:contact@smartscalesystems\.tech$/i.test(href)) return true;
    try {
      const url = new URL(href);
      return url.protocol === 'https:' && /(^|\.)smartscalesystems\.com$/i.test(url.hostname);
    } catch (_error) {
      return false;
    }
  }

  function appendTextWithBareLinks(parent, text) {
    const bareUrl = /(https?:\/\/[^\s<]+|contact@smartscalesystems\.tech)/gi;
    let cursor = 0;
    let match;
    while ((match = bareUrl.exec(text)) !== null) {
      if (match.index > cursor) parent.appendChild(document.createTextNode(text.slice(cursor, match.index)));
      const value = match[0];
      const href = value.includes('@') ? `mailto:${value}` : value.replace(/[),.;]+$/, '');
      const trailing = value.slice(href.replace(/^mailto:/, '').length);
      if (isSafeHref(href)) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = value.includes('@') ? value : href;
        if (href.startsWith('https://')) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        parent.appendChild(link);
        if (trailing) parent.appendChild(document.createTextNode(trailing));
      } else {
        parent.appendChild(document.createTextNode(value));
      }
      cursor = match.index + value.length;
    }
    if (cursor < text.length) parent.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function appendInlineMarkdown(parent, text) {
    const tokenPattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let cursor = 0;
    let match;

    while ((match = tokenPattern.exec(text)) !== null) {
      if (match.index > cursor) appendTextWithBareLinks(parent, text.slice(cursor, match.index));

      if (match[2] && match[3]) {
        if (isSafeHref(match[3])) {
          const link = document.createElement('a');
          link.href = match[3];
          link.textContent = match[2];
          if (match[3].startsWith('https://')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          parent.appendChild(link);
        } else {
          parent.appendChild(document.createTextNode(match[2]));
        }
      } else if (match[4]) {
        const strong = document.createElement('strong');
        strong.textContent = match[4];
        parent.appendChild(strong);
      } else if (match[5]) {
        const code = document.createElement('code');
        code.textContent = match[5];
        parent.appendChild(code);
      }

      cursor = match.index + match[0].length;
    }

    if (cursor < text.length) appendTextWithBareLinks(parent, text.slice(cursor));
  }

  function formatBotMessage(text) {
    const fragment = document.createDocumentFragment();
    const lines = String(text || '').replace(/\r/g, '').split('\n');
    let activeList = null;
    let activeListType = '';

    function resetList() {
      activeList = null;
      activeListType = '';
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        resetList();
        continue;
      }

      const unordered = line.match(/^[-*]\s+(.+)/);
      const ordered = line.match(/^\d+[.)]\s+(.+)/);
      if (unordered || ordered) {
        const listType = ordered ? 'ol' : 'ul';
        if (!activeList || activeListType !== listType) {
          activeList = document.createElement(listType);
          activeListType = listType;
          fragment.appendChild(activeList);
        }
        const item = document.createElement('li');
        appendInlineMarkdown(item, (unordered || ordered)[1]);
        activeList.appendChild(item);
        continue;
      }

      resetList();
      const paragraph = document.createElement('p');
      const headingMatch = line.match(/^#{1,3}\s+(.+)/);
      if (headingMatch) {
        const strong = document.createElement('strong');
        appendInlineMarkdown(strong, headingMatch[1]);
        paragraph.appendChild(strong);
      } else {
        appendInlineMarkdown(paragraph, line);
      }
      fragment.appendChild(paragraph);
    }

    return fragment;
  }

  function appendMessage(text, sender) {
    const message = document.createElement('div');
    message.className = `chat-msg ${sender}`;
    if (sender === 'bot') {
      message.appendChild(formatBotMessage(text));
    } else {
      message.textContent = text;
    }
    chatBody.appendChild(message);
    scrollToLatest();
    return message;
  }

  function appendSuggestions() {
    const container = document.createElement('div');
    container.className = 'chat-suggestions';
    container.setAttribute('aria-label', 'Suggested questions');
    for (const [label, question] of suggestions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chat-suggestion-btn';
      button.dataset.question = question;
      button.textContent = label;
      container.appendChild(button);
    }
    chatBody.appendChild(container);
  }

  function renderWelcome() {
    chatBody.replaceChildren();
    appendMessage(
      '**Hi, I am ScaleBot.** I can help you explore our AI services, choose the right solution, learn about the team, or plan your next project.',
      'bot'
    );
    appendSuggestions();
  }

  function appendTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.setAttribute('aria-label', 'Agent drifting through galaxies');
    typing.innerHTML = '<div class="typing-indicator"><span class="chat-cosmos" aria-hidden="true"><span class="chat-globe"></span><span class="chat-orbit"></span></span><span class="typing-copy">Agent drifting through galaxies...</span></div>';
    chatBody.appendChild(typing);
    scrollToLatest();
    return typing;
  }

  function autoSizeInput() {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 104)}px`;
  }

  function setSending(sending) {
    isSending = sending;
    chatInput.disabled = sending;
    chatSendBtn.disabled = sending;
    setStatus(sending ? 'Exploring...' : 'Business AI assistant');
  }

  function setChatOpen(open) {
    isChatOpen = open;
    chatWindow.dataset.open = String(open);
    mascot.setAttribute('aria-expanded', String(open));
    mascot.setAttribute('aria-label', open ? 'Close ScaleBot chat' : 'Open ScaleBot chat');
    if (open) {
      window.setTimeout(() => chatInput.focus(), 50);
      scrollToLatest();
    } else {
      mascot.focus();
    }
  }

  function resetConversation() {
    chatHistory = [];
    chatInput.value = '';
    autoSizeInput();
    setStatus('Business AI assistant');
    renderWelcome();
    chatInput.focus();
  }

  async function sendMessage() {
    if (isSending) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const suggestionContainer = chatBody.querySelector('.chat-suggestions');
    if (suggestionContainer) suggestionContainer.remove();
    appendMessage(text, 'user');
    chatInput.value = '';
    autoSizeInput();
    setSending(true);

    const typing = appendTyping();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 32000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.reply !== 'string') {
        throw new Error(data.error || 'ScaleBot returned an invalid response.');
      }

      typing.remove();
      appendMessage(data.reply, 'bot');
      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'assistant', content: data.reply });
      if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);
    } catch (error) {
      typing.remove();
      const message = error.name === 'AbortError'
        ? 'That took longer than expected. Please try once more, or use [Contact Us](/contact) if your request is urgent.'
        : 'I could not connect just now. Please try again, or reach the team through [Contact Us](/contact).';
      appendMessage(message, 'bot');
      console.error('ScaleBot chat error:', error);
    } finally {
      window.clearTimeout(timeoutId);
      setSending(false);
      chatInput.focus();
    }
  }

  mascot.addEventListener('click', () => setChatOpen(!isChatOpen));
  mascot.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setChatOpen(!isChatOpen);
    }
  });
  closeBtn.addEventListener('click', () => setChatOpen(false));
  resetBtn.addEventListener('click', resetConversation);
  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    sendMessage();
  });
  chatInput.addEventListener('input', autoSizeInput);
  chatInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  chatBody.addEventListener('click', event => {
    const suggestion = event.target.closest('.chat-suggestion-btn');
    if (!suggestion || isSending) return;
    chatInput.value = suggestion.dataset.question || suggestion.textContent.trim();
    autoSizeInput();
    sendMessage();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isChatOpen) setChatOpen(false);
  });

  const baseX = { left: 36, right: 64 };
  const baseY = 56;
  const maxMove = 3;
  document.addEventListener('mousemove', event => {
    if (!leftPupil || !rightPupil) return;
    const rect = mascot.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    if (!distance) return;
    const ratio = Math.min(distance / 500, 1);
    const moveX = (dx / distance) * maxMove * ratio;
    const moveY = (dy / distance) * maxMove * ratio;
    leftPupil.setAttribute('cx', baseX.left + moveX);
    leftPupil.setAttribute('cy', baseY + moveY);
    rightPupil.setAttribute('cx', baseX.right + moveX);
    rightPupil.setAttribute('cy', baseY + moveY);
  }, { passive: true });

  renderWelcome();
  autoSizeInput();
})();
