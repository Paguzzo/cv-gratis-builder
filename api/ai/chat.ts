import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { message, systemPrompt, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: message'
      });
    }

    const apiKey = process.env.GROK_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'AI API key not configured'
      });
    }

    const isGrok = !!process.env.GROK_API_KEY;
    const baseUrl = isGrok ? 'https://api.x.ai/v1' : 'https://api.openai.com/v1';
    const model = isGrok ? 'grok-beta' : 'gpt-4o-mini';

    const defaultSystemPrompt = `Você é o JobAI, um assistente de carreira brasileiro especializado.
Você ajuda candidatos com:
- Dicas para entrevistas de emprego
- Orientação sobre desenvolvimento de carreira
- Preparação para processos seletivos
- Networking profissional
- Negociação salarial
- Transição de carreira

Seja amigável, profissional e forneça conselhos práticos e acionáveis.
Responda sempre em português brasileiro.`;

    const messages = [
      { role: 'system', content: systemPrompt || defaultSystemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.8,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI API Error:', errorData);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content?.trim() || '';

    return res.status(200).json({
      response: responseText,
      generatedText: responseText,
      message: responseText
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat message'
    });
  }
}
