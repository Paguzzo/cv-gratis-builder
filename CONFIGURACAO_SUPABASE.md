# 🗄️ Configuração do Supabase

## 📋 Pré-requisitos

Para usar a integração Supabase + Resend, você precisa:

1. **Conta no Supabase** (gratuita)
2. **Projeto criado no Supabase**
3. **Edge Function configurada**
4. **API Key do Resend**

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha um nome e senha para o banco
5. Aguarde a criação do projeto

### 2. Obter Credenciais

No painel do Supabase:

1. Vá em **Settings** → **API**
2. Copie a **Project URL**
3. Copie a **anon/public key**

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# 🗄️ SUPABASE - Backend e Edge Functions
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### 4. Criar Edge Function

No painel do Supabase:

1. Vá em **Edge Functions**
2. Clique em "Create Function"
3. Nome: `send-email`
4. Cole o código abaixo:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, text, html } = await req.json()

    // Validar dados obrigatórios
    if (!to || !subject) {
      return new Response(
        JSON.stringify({ error: 'Email e assunto são obrigatórios' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Enviar email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'contato@app.curriculogratisonline.com',
        to: [to],
        subject,
        text,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro no envio')
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

### 5. Configurar Variáveis da Edge Function

No painel do Supabase:

1. Vá em **Edge Functions** → **Settings**
2. Adicione a variável:
   - **Nome**: `RESEND_API_KEY`
   - **Valor**: Sua API key do Resend

### 6. Deploy da Edge Function

No painel do Supabase:

1. Clique em **Deploy** na função `send-email`
2. Aguarde o deploy completar
3. Teste a função

## 🧪 Testando a Configuração

### Método 1: Página de Teste

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:8080/test-supabase-integration.html`
3. Configure um email de teste
4. Clique em "🚀 Testar Supabase + Resend"

### Método 2: Console do Navegador

```javascript
// Verificar se está configurado
console.log('Supabase configurado:', !!window.supabase);

// Testar envio
if (window.supabase) {
  window.supabase.functions.invoke('send-email', {
    body: {
      to: 'seu-email@exemplo.com',
      subject: 'Teste Supabase',
      text: 'Teste de configuração'
    }
  }).then(console.log);
}
```

## ❌ Problemas Comuns

### "Supabase não está configurado"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. Verifique o arquivo `.env`
2. Confirme as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Reinicie o servidor: `npm run dev`

### "Edge Function não encontrada"

**Causa**: Função `send-email` não foi criada ou deployada

**Solução**:
1. Acesse o painel do Supabase
2. Vá em **Edge Functions**
3. Crie a função `send-email`
4. Faça o deploy

### "Unauthorized"

**Causa**: API Key do Resend não configurada na Edge Function

**Solução**:
1. Vá em **Edge Functions** → **Settings**
2. Adicione `RESEND_API_KEY` com sua chave do Resend
3. Redeploy a função

### "CORS Error"

**Causa**: Headers CORS não configurados na Edge Function

**Solução**:
1. Verifique se o código da Edge Function inclui os headers CORS
2. Certifique-se de que está tratando requisições OPTIONS

## 📊 Monitoramento

### Logs da Edge Function

1. Vá em **Edge Functions** → `send-email`
2. Clique na aba **Logs**
3. Monitore erros e sucessos

### Logs do Frontend

```javascript
// Habilitar logs detalhados
localStorage.setItem('debug-email', 'true');

// Ver configuração atual
console.log(window.supabase);
```

## 🔄 Fallback System

O sistema possui fallback automático:

1. **Supabase + Resend** (principal)
2. **MCP** (fallback 1)
3. **Resend Direto** (fallback 2)

Se o Supabase falhar, o sistema automaticamente tenta os outros métodos.

## 📞 Suporte

Se ainda tiver problemas:

1. Verifique os logs no console do navegador
2. Teste cada componente individualmente
3. Consulte a documentação oficial do Supabase
4. Use a página de teste para diagnóstico

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0.0