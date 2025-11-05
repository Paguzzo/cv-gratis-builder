# 🔧 TROUBLESHOOTING - SISTEMA DE EMAIL

## 📧 PROBLEMAS COMUNS E SOLUÇÕES

### 1. EMAIL NÃO CHEGA NA CAIXA DE ENTRADA

#### ✅ VERIFICAÇÕES BÁSICAS
1. **Verificar spam/lixo eletrônico**
   - Emails do Resend podem ir para spam inicialmente
   - Verificar pastas: Spam, Lixo Eletrônico, Promoções

2. **Verificar domínio do remetente**
   - ✅ Usando: `contato@app.curriculogratisonline.com` (domínio verificado)
   - ✅ Domínio `app.curriculogratisonline.com` foi verificado no Resend
   - ✅ Nova API key foi configurada e está ativa

3. **Verificar chave da API**
   - Chave atual: `re_Qvn98zSZ_35gBFN9Bak1a3ju1566pgm45`
   - Status: ✅ Configurada no .env

#### 🔍 LOGS PARA VERIFICAR
```javascript
// No console do navegador, procurar por:
📧 Enviando email via Resend...
📧 Dados do email: {...}
📧 Resposta da API Resend: {...}
📧 Status da resposta: 200
✅ Email enviado com sucesso via Resend!
✅ ID do email: [ID_DO_EMAIL]
```

### 2. COMO TESTAR O SISTEMA

#### 🧪 TESTE MANUAL
1. Acesse `/admin`
2. Clique em "🧪 Testar Email"
3. Verifique os logs no console
4. Anote o ID do email retornado

#### 🧪 TESTE VIA POPUP
1. Acesse a página principal
2. Ative o popup de bônus
3. Preencha o formulário
4. Verifique os logs no console

### 3. LIMITAÇÕES CONHECIDAS

#### ⚠️ MODO SANDBOX (RESEND)
- Emails só são enviados para endereços verificados
- Para produção, verificar domínio personalizado
- Limite de 100 emails/dia no plano gratuito

#### ⚠️ DOMÍNIO PERSONALIZADO
- `curriculogratisonline.com` não está verificado
- Necessário configurar DNS records
- Usar `onboarding@resend.dev` temporariamente

### 4. PRÓXIMOS PASSOS

#### 🎯 CONFIGURAÇÃO DOMÍNIO
1. Acessar https://resend.com/domains
2. Adicionar `curriculogratisonline.com`
3. Configurar registros DNS:
   ```
   TXT: resend._domainkey.curriculogratisonline.com
   CNAME: bounce.curriculogratisonline.com
   ```

#### 🎯 VERIFICAÇÃO DE ENTREGA
1. Implementar webhook do Resend
2. Monitorar status de entrega
3. Logs de bounce/spam

### 5. CÓDIGOS DE ERRO COMUNS

| Código | Descrição | Solução |
|--------|-----------|----------|
| 400 | Bad Request | Verificar formato do email |
| 401 | Unauthorized | Verificar chave da API |
| 403 | Forbidden | Domínio não verificado |
| 422 | Validation Error | Verificar campos obrigatórios |
| 429 | Rate Limited | Aguardar ou upgrade do plano |

### 6. CONTATOS PARA SUPORTE

- **Resend Support**: https://resend.com/support
- **Documentação**: https://resend.com/docs
- **Status Page**: https://status.resend.com

---

## 📝 LOG DE TESTES

### Teste 1 - [DATA]
- **Email**: [EMAIL_TESTE]
- **Status**: [SUCESSO/FALHA]
- **ID**: [ID_EMAIL]
- **Observações**: [NOTAS]

### Teste 2 - [DATA]
- **Email**: [EMAIL_TESTE]
- **Status**: [SUCESSO/FALHA]
- **ID**: [ID_EMAIL]
- **Observações**: [NOTAS]