(function() {
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #smart-scale-mascot-wrap {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: 'Inter', sans-serif;
    }

    #smart-scale-mascot {
      width: 80px;
      height: 90px;
      cursor: pointer;
      animation: float-mascot 3s ease-in-out infinite;
      filter: drop-shadow(0 4px 12px rgba(119, 136, 115, 0.2));
      transition: transform 0.3s ease;
      position: relative;
    }
    #smart-scale-mascot:hover {
      transform: scale(1.05);
    }
    @keyframes float-mascot {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .mascot-eye-pupil {
      transition: cx 0.1s ease-out, cy 0.1s ease-out;
    }

    .mascot-message {
      position: absolute;
      bottom: 100%;
      right: 50%;
      transform: translateX(50%) translateY(10px);
      background: #778873;
      color: #FDF6ED;
      padding: 8px 12px;
      border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .mascot-message::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      border-width: 6px;
      border-style: solid;
      border-color: #778873 transparent transparent transparent;
    }
    #smart-scale-mascot:hover .mascot-message {
      opacity: 1;
      transform: translateX(50%) translateY(-10px);
    }

    /* Chat Window */
    #mascot-chat-window {
      width: 320px;
      height: 400px;
      background: #FDF6ED;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      border: 1px solid #DCCFC0;
      margin-bottom: 20px;
      display: none;
      flex-direction: column;
      overflow: hidden;
      transform-origin: bottom right;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes popIn {
      0% { opacity: 0; transform: scale(0.8) translateY(20px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    .chat-header {
      background: #778873;
      color: #FDF6ED;
      padding: 16px;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chat-close {
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .chat-close:hover { opacity: 1; }

    .chat-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .chat-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .chat-msg.bot {
      align-self: flex-start;
      background: #EBE1D5;
      color: #3a3d38;
      border-bottom-left-radius: 4px;
    }
    .chat-msg.user {
      align-self: flex-end;
      background: #A1BC98;
      color: #1A2617;
      border-bottom-right-radius: 4px;
    }

    .chat-input-area {
      padding: 12px;
      border-top: 1px solid #DCCFC0;
      display: flex;
      gap: 8px;
      background: #fff;
    }
    .chat-input-area input {
      flex: 1;
      border: 1px solid #DCCFC0;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 0.9rem;
      outline: none;
      font-family: 'Inter', sans-serif;
      background: #FDF6ED;
      transition: border-color 0.2s;
    }
    .chat-input-area input:focus {
      border-color: #A1BC98;
    }
    .chat-input-area button {
      background: #778873;
      color: white;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .chat-input-area button:hover {
      background: #5a6b56;
    }
    .chat-input-area button svg {
      width: 16px;
      height: 16px;
    }

    /* Loading dots */
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 4px 8px;
    }
    .typing-indicator span {
      width: 6px;
      height: 6px;
      background: #778873;
      border-radius: 50%;
      animation: blink 1.4s infinite both;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink {
      0% { opacity: 0.2; }
      20% { opacity: 1; }
      100% { opacity: 0.2; }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML structure
  const wrapper = document.createElement('div');
  wrapper.id = 'smart-scale-mascot-wrap';
  
  wrapper.innerHTML = `
    <div id="mascot-chat-window">
      <div class="chat-header">
        <span>ScaleBot</span>
        <span class="chat-close" id="chat-close-btn">&times;</span>
      </div>
      <div class="chat-body" id="chat-body">
        <div class="chat-msg bot">Hi! I'm ScaleBot. What can I help you with today?</div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" placeholder="Ask me anything..." autocomplete="off"/>
        <button id="chat-send-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    </div>

    <div id="smart-scale-mascot">
      <div class="mascot-message">Always here to help!</div>
      <svg viewBox="0 0 100 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="30" x2="50" y2="10" stroke="#DCCFC0" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="8" r="6" fill="#A1BC98"/>
        <rect x="10" y="55" width="10" height="20" rx="3" fill="#DCCFC0"/>
        <rect x="80" y="55" width="10" height="20" rx="3" fill="#DCCFC0"/>
        <rect x="18" y="30" width="64" height="64" rx="16" fill="#A1BC98"/>
        <rect x="26" y="42" width="48" height="36" rx="8" fill="#FDF6ED"/>
        <circle cx="36" cy="56" r="8" fill="#DCCFC0"/>
        <circle cx="64" cy="56" r="8" fill="#DCCFC0"/>
        <circle id="pupil-left" class="mascot-eye-pupil" cx="36" cy="56" r="4" fill="#778873"/>
        <circle id="pupil-right" class="mascot-eye-pupil" cx="64" cy="56" r="4" fill="#778873"/>
        <path d="M 42 68 Q 50 72 58 68" stroke="#778873" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 40 94 L 60 94 L 55 104 L 45 104 Z" fill="#DCCFC0"/>
        <path d="M 30 104 L 70 104 C 75 104 75 116 70 116 L 30 116 C 25 116 25 104 30 104 Z" fill="#A1BC98"/>
      </svg>
    </div>
  `;
  document.body.appendChild(wrapper);

  // Eye tracking logic
  const leftPupil = document.getElementById('pupil-left');
  const rightPupil = document.getElementById('pupil-right');
  const mascot = document.getElementById('smart-scale-mascot');
  const chatWindow = document.getElementById('mascot-chat-window');
  const closeBtn = document.getElementById('chat-close-btn');
  
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  let chatHistory = [];
  let isChatOpen = false;

  const baseX = { left: 36, right: 64 };
  const baseY = 56;
  const maxMove = 3;

  document.addEventListener('mousemove', (e) => {
    if(!leftPupil || !rightPupil) return;
    const rect = mascot.getBoundingClientRect();
    const mascotCenterX = rect.left + rect.width / 2;
    const mascotCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - mascotCenterX;
    const dy = e.clientY - mascotCenterY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance === 0) return;
    const moveRatio = Math.min(distance / 500, 1);
    const moveX = (dx / distance) * maxMove * moveRatio;
    const moveY = (dy / distance) * maxMove * moveRatio;

    leftPupil.setAttribute('cx', baseX.left + moveX);
    leftPupil.setAttribute('cy', baseY + moveY);
    rightPupil.setAttribute('cx', baseX.right + moveX);
    rightPupil.setAttribute('cy', baseY + moveY);
  });

  // Chat UI Logic
  mascot.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    chatWindow.style.display = isChatOpen ? 'flex' : 'none';
    if(isChatOpen) chatInput.focus();
  });

  closeBtn.addEventListener('click', () => {
    isChatOpen = false;
    chatWindow.style.display = 'none';
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function appendTyping() {
    const id = 'typing-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', 'bot');
    msgDiv.id = id;
    msgDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if(el) el.remove();
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';

    const typingId = appendTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory })
      });

      removeTyping(typingId);

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      appendMessage(data.reply, 'bot');
      
      chatHistory.push({ role: 'user', content: text });
      chatHistory.push({ role: 'assistant', content: data.reply });

      // Keep history limited to last 10 messages
      if (chatHistory.length > 10) chatHistory = chatHistory.slice(chatHistory.length - 10);

    } catch (err) {
      removeTyping(typingId);
      appendMessage("Sorry, my circuits are tangled. Please try again later!", 'bot');
      console.error('Chat error:', err);
    }
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

})();
