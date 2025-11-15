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
    const { userInput, keywords, position, company, context } = req.body;

    if (!userInput || !position || !company) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userInput, position, company'
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
Sua tarefa é criar cartas de apresentação profissionais e persuasivas.
A carta deve:
- Ter 3-4 parágrafos bem estruturados
- Demonstrar entusiasmo genuíno pela oportunidade
- Conectar as experiências do candidato com os requisitos da vaga
- Usar tom profissional mas pessoal
- Terminar com um call-to-action para entrevista
Use português brasileiro formal e elegante.`;

    const userPrompt = `Crie uma carta de apresentação profissional com as seguintes informações:

Informações do candidato:
${userInput}

Vaga desejada: ${position}
Empresa: ${company}
${keywords ? `Requisitos/Contexto da vaga: ${keywords}` : ''}
${context ? `Informações adicionais: ${context}` : ''}

Crie uma carta de apresentação completa e formatada, pronta para envio.`;

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
        temperature: 0.8,
        max_tokens: 1000
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
        'Personalize os detalhes específicos da empresa',
        'Revise para garantir que não há erros gramaticais',
        'Adicione exemplos concretos das suas realizações'
      ]
    });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate cover letter'
    });
  }
}
