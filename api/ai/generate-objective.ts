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
    const { userInput, keywords } = req.body;

    if (!userInput || !keywords) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userInput, keywords'
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

    const systemPrompt = `Você é um especialista em recursos humanos e recrutamento brasileiro.
Sua tarefa é criar objetivos profissionais concisos e impactantes para currículos.
O objetivo deve ter no máximo 3-4 linhas e destacar as principais competências do candidato.
Use linguagem profissional e formal em português brasileiro.
Não use primeira pessoa. Comece com "Profissional com..." ou similar.`;

    const userPrompt = `Com base nas seguintes informações do candidato:
${userInput}

E considerando estas palavras-chave da área de atuação:
${keywords}

Crie um objetivo profissional impactante e conciso para o currículo.`;

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
        temperature: 0.7,
        max_tokens: 300
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
      suggestions: [
        'Revise se o objetivo está alinhado com a vaga desejada',
        'Verifique se as competências principais foram destacadas',
        'Considere adicionar resultados quantificáveis se possível'
      ]
    });
  } catch (error: any) {
    console.error('Error generating objective:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate objective'
    });
  }
}
