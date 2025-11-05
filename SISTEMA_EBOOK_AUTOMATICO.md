# 📚 Sistema de Envio Automático de Ebook

## 🎯 Visão Geral

Sistema completo e automático para:
- ✅ Upload de PDF do ebook via dashboard administrativo
- ✅ Envio automático via email quando lead se cadastra no popup de bônus
- ✅ Gerenciamento de leads que receberam o ebook
- ✅ Teste de envio antes de ativar
- ✅ Estatísticas de envios

---

## 🚀 Como Usar (Passo a Passo)

### **1. Acesse o Painel Administrativo**

1. Vá para: `/admin-login`
2. Faça login com suas credenciais
3. Você será redirecionado para `/admin`

### **2. Faça Upload do Ebook**

1. No painel administrativo, clique na aba **"Ebook"**
2. Você verá uma área de upload com drag-and-drop
3. **Duas formas de fazer upload:**

   **Opção A: Arrastar e Soltar**
   - Arraste o arquivo PDF para a área indicada
   - Solte o arquivo

   **Opção B: Selecionar**
   - Clique em "Selecionar PDF"
   - Escolha o arquivo do seu computador

4. O sistema vai:
   - ✅ Validar que é um PDF
   - ✅ Verificar se é menor que 10MB
   - ✅ Converter para base64
   - ✅ Salvar no localStorage
   - ✅ Mostrar mensagem de sucesso

### **3. Verificar se foi Salvo**

Após o upload, você verá:
- **Card verde** com informações do arquivo:
  - Nome do arquivo
  - Tamanho
  - Data de upload
- **Badge verde** "Configurado" nas estatísticas
- Botões para:
  - 📥 Download (testar o arquivo)
  - 🗑️ Remover (apagar o ebook)

### **4. Enviar Email de Teste**

**IMPORTANTE:** Sempre teste antes de ativar!

1. Na mesma aba "Ebook", role até **"Enviar Email de Teste"**
2. Preencha:
   - **Nome:** Seu nome
   - **Email:** Seu email de teste
3. Clique em **"Enviar Email de Teste"**
4. Aguarde alguns segundos
5. Verifique sua caixa de entrada

**O que esperar:**
- Email com assunto: "🎁 Seu Bônus Exclusivo: Guia Secreto de Entrevistas"
- Mensagem personalizada com seu nome
- PDF anexado

### **5. Ativar o Sistema**

Depois que o teste funcionar:
- ✅ O sistema já está ATIVO automaticamente!
- ✅ Todos que se cadastrarem no popup de bônus receberão o ebook
- ✅ Você verá os envios na lista "Leads que Receberam o Ebook"

---

## 🎨 Fluxo Completo do Usuário

```
1. Usuário visita a homepage
   └─> Popup de bônus aparece (10 segundos ou exit intent)

2. Usuário preenche nome e email
   └─> Clica em "QUERO MEU BÔNUS GRÁTIS AGORA!"

3. Sistema verifica se ebook está configurado
   └─> Se SIM: Envia email com PDF anexado
   └─> Se NÃO: Mostra erro "Ebook não disponível"

4. Usuário recebe email
   └─> Abre email
   └─> Baixa PDF anexado

5. Admin vê registro no painel
   └─> Tab "Ebook" > Lista de leads
   └─> Nome, email, data de envio
```

---

## 📊 Estatísticas e Monitoramento

Na aba "Ebook" você vê:

### **Cards de Estatísticas:**

1. **Status do Ebook**
   - Verde: Configurado
   - Vermelho: Não configurado
   - Nome do arquivo atual

2. **Total Enviados**
   - Número total de emails enviados
   - Atualiza automaticamente

3. **Tamanho do Arquivo**
   - Tamanho do PDF em MB/KB

### **Lista de Leads:**

- 10 leads mais recentes que receberam o ebook
- Informações:
  - Nome
  - Email
  - Data e hora do envio
  - Status: "Enviado"

---

## ⚙️ Configurações Técnicas

### **Armazenamento:**

O ebook é salvo em **localStorage** do navegador:
- Chave: `cvgratis-ebook-data`
- Formato: Base64
- Limite: 10MB

**Importante:**
- Se limpar o cache do navegador, o ebook será perdido
- Recomendado: Fazer backup do PDF original

### **Envio de Email:**

Integração com **Resend** (API já configurada):
- Endpoint: `/api/send-email`
- Suporta anexos PDF em base64
- From: `contato@app.curriculogratisonline.com`
- Template HTML formatado automaticamente

### **Validações:**

- ✅ Apenas arquivos PDF
- ✅ Tamanho máximo: 10MB
- ✅ Email válido (regex)
- ✅ Campos obrigatórios (nome e email)

---

## 🔧 Solução de Problemas

### **Problema: Upload não funciona**

**Solução:**
1. Verifique se é um arquivo PDF
2. Verifique o tamanho (máx 10MB)
3. Tente com outro PDF
4. Limpe o cache do navegador

### **Problema: Email não chega**

**Possíveis causas:**
1. **Ebook não configurado**
   - Verifique se fez upload no admin
   - Status deve estar "Configurado"

2. **Problema com Resend API**
   - Verifique se `VITE_RESEND_API_KEY` está configurado
   - Teste o endpoint `/api/send-email`

3. **Email na caixa de spam**
   - Peça ao usuário verificar spam
   - Configure SPF/DKIM no domínio

4. **Email inválido**
   - Verifique se o email está correto
   - Teste com outro email

### **Problema: Erro ao enviar teste**

**Console mostra:**
```
❌ Erro ao enviar ebook: Failed to fetch
```

**Solução:**
1. Verifique se o servidor backend está rodando
2. Verifique se o endpoint `/api/send-email` está funcionando
3. Olhe os logs do servidor
4. Verifique a chave da API Resend

### **Problema: Ebook sumiu**

**Causa:** Cache do navegador foi limpo

**Solução:**
1. Faça upload novamente
2. Mantenha o PDF original em local seguro
3. Considere migrar para cloud storage (Dropbox, Google Drive)

---

## 📁 Arquivos do Sistema

| Arquivo | Descrição |
|---------|-----------|
| `src/services/ebookService.ts` | Serviço de upload, armazenamento e envio |
| `src/components/admin/EbookManager.tsx` | Interface de gerenciamento no admin |
| `src/components/ui/bonus-popup.tsx` | Popup de captura de leads (integrado) |
| `src/pages/AdminPanel.tsx` | Painel admin com tab "Ebook" |

---

## 🎁 Template do Email Enviado

```
Assunto: 🎁 Seu Bônus Exclusivo: Guia Secreto de Entrevistas

Olá [NOME]! 👋

Parabéns por garantir seu bônus exclusivo!

Anexado a este email você encontra o **Guia Secreto de Entrevistas**
- um material completo que vai te ajudar a se destacar nas suas
entrevistas de emprego.

📚 O que você vai encontrar no guia:

✅ 50+ Perguntas e Respostas de Entrevista
✅ Técnicas de Persuasão para Impressionar
✅ Checklist Completo do Candidato Perfeito
✅ Template de Follow-up Pós-Entrevista

💡 Dica: Leia o guia antes da sua próxima entrevista e aplique
as técnicas. Você vai perceber a diferença!

Boa sorte na sua jornada profissional! 🚀

---
Equipe CV Grátis Online
www.curriculogratisonline.com

[PDF ANEXADO]
```

---

## 🚦 Checklist de Ativação

Antes de ativar o sistema em produção:

- [ ] Upload do PDF do ebook feito
- [ ] PDF testado (download do admin)
- [ ] Email de teste enviado e recebido
- [ ] Email não caiu em spam
- [ ] PDF anexado está correto
- [ ] Mensagem do email está personalizada
- [ ] Popup de bônus está ativo na homepage
- [ ] Exit intent está funcionando
- [ ] API Resend está configurada (`VITE_RESEND_API_KEY`)
- [ ] Servidor backend está rodando
- [ ] Endpoint `/api/send-email` está funcionando

---

## 📈 Métricas de Sucesso

Acompanhe na aba "Ebook":

- **Taxa de conversão:** Quantos visitantes viraram leads?
- **Total de envios:** Quantos ebooks foram enviados?
- **Taxa de entrega:** Emails chegaram? (verifique bounces)
- **Taxa de abertura:** Usuários abriram o email?
- **Taxa de download:** Usuários baixaram o PDF?

---

## 🔒 Segurança

**Dados armazenados:**
- Nome do lead
- Email do lead
- Data de cadastro
- Data de envio

**Privacidade:**
- Dados em localStorage (client-side)
- Não compartilhados com terceiros
- Conforme LGPD (Lei Geral de Proteção de Dados)

**Recomendações:**
- Migrar para banco de dados em produção
- Implementar criptografia
- Adicionar política de privacidade clara
- Permitir opt-out (descadastro)

---

## 🎯 Próximos Passos (Melhorias Futuras)

### **Curto Prazo:**
- [ ] Migrar armazenamento para Supabase/Database
- [ ] Adicionar tracking de abertura de email
- [ ] Adicionar tracking de download do PDF
- [ ] Email de boas-vindas adicional (drip campaign)

### **Médio Prazo:**
- [ ] Hospedagem do PDF em cloud (Dropbox, AWS S3)
- [ ] Múltiplos ebooks (diferentes lead magnets)
- [ ] A/B testing de subject lines
- [ ] Integração com CRM (HubSpot, RD Station)

### **Longo Prazo:**
- [ ] Funil de email marketing completo
- [ ] Segmentação de leads por interesse
- [ ] Analytics avançado (Google Analytics)
- [ ] Automação de remarketing

---

## 🆘 Suporte

**Problemas técnicos:**
1. Verifique os logs no console (F12)
2. Verifique os logs do servidor backend
3. Teste o endpoint `/api/send-email` diretamente

**Logs úteis:**
```javascript
// No console do navegador (F12)
localStorage.getItem('cvgratis-ebook-data') // Ver ebook
localStorage.getItem('cvgratis-ebook-leads') // Ver leads
```

---

## ✅ Resumo Rápido

1. **Upload:** Aba "Ebook" > Arrastar PDF > Upload
2. **Teste:** Preencher nome/email > Enviar teste
3. **Ativar:** Já está ativo! Só esperar leads se cadastrarem
4. **Monitorar:** Aba "Ebook" > Ver lista de leads

**Tempo de configuração:** 5-10 minutos

**Dificuldade:** ⭐ Fácil (interface drag-and-drop)

---

**Criado em:** 2025-11-02
**Última atualização:** 2025-11-02
**Versão:** 1.0
**Status:** ✅ Pronto para produção
