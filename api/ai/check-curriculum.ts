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
    const { type, content, prompt } = req.body;

    if (!type || !content) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, content'
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

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'grammar_check':
        systemPrompt = `Você é um revisor de textos profissional brasileiro.
Analise o texto fornecido e identifique:
- Erros gramaticais
- Erros de ortografia
- Problemas de concordância
- Sugestões de melhoria na clareza
Forneça feedback construtivo e específico em português brasileiro.`;
        userPrompt = `Revise o seguinte texto de currículo e aponte correções necessárias:\n\n${content}`;
        break;

      case 'evaluation':
        systemPrompt = `Você é um especialista em recrutamento e seleção brasileiro.
Avalie o currículo fornecido considerando:
- Clareza e objetividade
- Relevância das informações
- Formatação profissional
- Pontos fortes e fracos
- Sugestões de melhoria
Dê uma nota de 1 a 10 e justifique.`;
        userPrompt = `Avalie este currículo:\n\n${content}`;
        break;

      case 'optimization':
        systemPrompt = `Você é um especialista em otimização de currículos para ATS (Applicant Tracking Systems).
Analise o currículo e sugira:
- Palavras-chave que estão faltando
- Como melhorar a visibilidade para sistemas ATS
- Estruturação mais eficiente
- Métricas e resultados que poderiam ser adicionados`;
        userPrompt = `Otimize este currículo para sistemas ATS:\n\n${content}`;
        break;

      default:
        systemPrompt = 'Você é um assistente especializado em currículos.';
        userPrompt = prompt || content;
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('AI API Error:', errorData);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content?.trim() || '';

    return res.status(200).json({
      success: true,
      generatedText: generatedText,
      type: type
    });
  } catch (error: any) {
    console.error('Error checking curriculum:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to check curriculum'
    });
  }
}
