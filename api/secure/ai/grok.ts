import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { prompt, context = '', maxTokens = 1000 } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: prompt'
      });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GROK API key not configured'
      });
    }

    const systemPrompt = context || 'Você é um assistente especializado em recursos humanos e carreiras no Brasil.';

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: maxTokens
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GROK API Error:', errorData);
      throw new Error(`GROK API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim() || '';

    return res.status(200).json({
      content: content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    });
  } catch (error: any) {
    console.error('Error calling GROK:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to call GROK API'
    });
  }
}
