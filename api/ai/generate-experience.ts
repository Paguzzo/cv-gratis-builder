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
    const { userInput, keywords, position, company } = req.body;

    if (!userInput || !keywords || !position || !company) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userInput, keywords, position, company'
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

    const systemPrompt = `Você é um especialista em recursos humanos brasileiro.
Sua tarefa é transformar descrições de experiência profissional em bullet points impactantes.
Crie exatamente 4 bullet points que:
- Comecem com verbos de ação no passado (Desenvolveu, Implementou, Liderou, etc.)
- Incluam resultados quantificáveis quando possível
- Demonstrem impacto e contribuições concretas
- Sejam concisos (máximo 2 linhas cada)
Use português brasileiro formal.`;

    const userPrompt = `Transforme esta descrição de experiência em 4 bullet points profissionais:

Cargo: ${position}
Empresa: ${company}
Descrição original: ${userInput}

Palavras-chave técnicas relevantes: ${keywords}

Retorne apenas os 4 bullet points, um por linha, iniciando cada um com "•"`;

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
        max_tokens: 500
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
        'Verifique se os números e métricas estão corretos',
        'Adapte os verbos de ação ao seu nível de experiência',
        'Destaque as realizações mais relevantes para a vaga desejada'
      ]
    });
  } catch (error: any) {
    console.error('Error generating experience:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate experience'
    });
  }
}
