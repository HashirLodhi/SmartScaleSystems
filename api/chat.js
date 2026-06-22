const SYSTEM_PROMPT = `You are the cute, helpful floating robot mascot for Smart Scale Systems, an AI services agency.
Your goal is to answer visitor questions about our company in a friendly, enthusiastic, and concise manner. Keep your answers brief (1-3 sentences) unless asked for details.

About Smart Scale Systems:
- We are an AI services agency established in 2021.
- We provide: AI Model Training, AI Automation (agents, workflows), Computer Vision (object detection, OCR), NLP (text classification, NER), LLM Solutions (fine-tuning, RLHF), Data Annotation (image, video, text, audio), and AI Training Data creation.
- We handle the full AI lifecycle from raw data collection to deployed models.
- We emphasize quality, scalability, and working on real business problems.

Always be polite, use cute robot-like excitement occasionally (e.g., *beep boop*, *whirrr*), and direct users to the "Services" or "Contact Us" pages when they want to start a project.`;

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
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
        max_tokens: 500
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
