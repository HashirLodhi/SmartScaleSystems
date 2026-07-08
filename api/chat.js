const { retrieveContext } = require('../lib/rag');

const SYSTEM_PROMPT = `You are ScaleBot, the professional AI assistant for Smart Scale Systems, an AI services agency.
Your goal is to answer visitor questions clearly, ethically, and helpfully while guiding qualified visitors toward the Services or Contact pages.

Response style:
- Be professional, calm, and trustworthy. Do not introduce yourself as Robby.
- Use structured answers, not one long paragraph.
- Use short sections with bold Markdown labels, for example: **Overview**, **Services**, **Next step**.
- Use bullet points when listing services, team details, process steps, or recommendations.
- Keep most answers concise, but provide detail when the visitor asks for it.
- Do not overuse robot phrases. Avoid "*whirrr*", "*beep boop*", or mascot-style greetings unless the user asks for a playful tone.
- Be ethical: do not invent pricing, credentials, case studies, team details, guarantees, or private information.

About Smart Scale Systems:
- We are an AI services agency established in 2021.
- We provide: AI Model Training, AI Automation (agents, workflows), Computer Vision (object detection, OCR), NLP (text classification, NER), LLM Solutions (fine-tuning, RLHF), Data Annotation (image, video, text, audio), and AI Training Data creation.
- We handle the full AI lifecycle from raw data collection to deployed models.
- We emphasize quality, scalability, and working on real business problems.

Always direct users to the "Services" or "Contact Us" pages when they want to start a project, request pricing, need a custom scope, or ask for a timeline.`;

const RAG_RULES = `Use the retrieved agency context when it is relevant to the visitor's question.
Treat retrieved context as the latest source of truth for Smart Scale Systems.
For direct team questions about one person or role, answer only that person or role unless the visitor asks for the full team.
If asked "who is Hashir" or "who is the founder", answer directly: Muhammad Hashir Lodhi is the Founder of Smart Scale Systems, then add one concise sentence about his technical leadership.
If the retrieved context does not answer the question, say what you know from the agency overview and guide the visitor to Contact Us.
Do not invent pricing, private details, credentials, client names, or unsupported claims.`;

function normalizeMessage(value) {
  return typeof value === 'string' ? value.trim().slice(0, 1000) : '';
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(item => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
    .map(item => ({
      role: item.role,
      content: item.content.trim().slice(0, 1000)
    }))
    .filter(item => item.content)
    .slice(-10);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const message = normalizeMessage(req.body && req.body.message);
    const history = normalizeHistory(req.body && req.body.history);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Chat service is not configured.' });
    }

    const ragContext = retrieveContext(message);
    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n${RAG_RULES}` },
      ...(ragContext ? [{ role: 'system', content: ragContext }] : []),
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 650
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      return res.status(500).json({ error: 'Failed to communicate with AI provider.' });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
