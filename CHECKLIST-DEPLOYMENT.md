# Checklist de Deployment - Validação Premium

Lista completa de verificação para colocar o sistema em produção.

---

## Fase 1: Setup Inicial

### Supabase

- [ ] Criar projeto no Supabase
- [ ] Executar script SQL (`server/database/supabase-setup.sql`)
- [ ] Verificar criação da tabela `purchases`
- [ ] Verificar criação de índices
- [ ] Verificar criação da função `check_premium_access`
- [ ] Verificar RLS policies ativas
- [ ] Testar inserção manual de dados
- [ ] Obter URL do projeto
- [ ] Obter Service Role Key (NÃO a Anon Key!)
- [ ] Salvar credenciais em local seguro

### Stripe (Modo Teste)

- [ ] Criar conta no Stripe (se necessário)
- [ ] Ativar modo teste
- [ ] Criar produtos para templates premium
- [ ] Copiar Price IDs de cada produto
- [ ] Obter Publishable Key (teste)
- [ ] Obter Secret Key (teste)
- [ ] Configurar webhook local (Stripe CLI)
- [ ] Obter Webhook Secret (teste)
- [ ] Salvar credenciais em `.env`

### Backend

- [ ] Copiar `.env.example` para `.env`
- [ ] Preencher todas variáveis de ambiente
- [ ] Instalar dependências (`npm install`)
- [ ] Verificar se rotas foram importadas
- [ ] Iniciar servidor (`node server/secure-backend.js`)
- [ ] Verificar health check (`GET /health`)
- [ ] Verificar logs iniciais

### Frontend

- [ ] Atualizar `STRIPE_PRODUCTS` com Price IDs
- [ ] Configurar `VITE_BACKEND_URL`
- [ ] Configurar `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Iniciar desenvolvimento (`npm run dev`)
- [ ] Verificar console sem erros

---

## Fase 2: Testes Locais

### Testes de API

- [ ] **Test 1**: Health check
  ```bash
  curl http://localhost:3001/health
  ```
  Esperado: `{ "status": "OK" }`

- [ ] **Test 2**: Conceder acesso (webhook test)
  ```bash
  curl -X POST http://localhost:3001/api/webhooks/stripe/test \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","templateId":"premium-executive"}'
  ```
  Esperado: `{ "success": true }`

- [ ] **Test 3**: Verificar acesso
  ```bash
  curl "http://localhost:3001/api/premium/check/premium-executive?email=test@example.com"
  ```
  Esperado: `{ "hasAccess": true }`

- [ ] **Test 4**: Listar compras
  ```bash
  curl "http://localhost:3001/api/premium/purchases?email=test@example.com"
  ```
  Esperado: `{ "purchases": [...] }`

### Testes de Supabase

- [ ] Abrir Supabase Table Editor
- [ ] Verificar registro em `purchases`
- [ ] Executar função SQL manualmente:
  ```sql
  SELECT * FROM check_premium_access('test@example.com', 'premium-executive');
  ```
- [ ] Verificar resultado: `has_access = true`

### Testes de Stripe

- [ ] Instalar Stripe CLI
- [ ] Executar `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
- [ ] Em outra aba: `stripe trigger checkout.session.completed`
- [ ] Verificar logs do backend
- [ ] Verificar registro no Supabase

### Testes de Frontend

- [ ] Acessar template premium
- [ ] Verificar se abre Stripe Checkout
- [ ] Usar cartão de teste: `4242 4242 4242 4242`
- [ ] Verificar redirecionamento após pagamento
- [ ] Verificar acesso liberado
- [ ] Verificar console sem erros

---

## Fase 3: Preparação para Produção

### Stripe (Modo Live)

- [ ] Ativar conta Stripe (verificação pode demorar)
- [ ] Ativar modo live
- [ ] Criar produtos LIVE (mesmo setup do teste)
- [ ] Copiar Price IDs LIVE
- [ ] Obter Publishable Key LIVE
- [ ] Obter Secret Key LIVE
- [ ] Configurar webhook PRODUCTION
  - URL: `https://seu-dominio.com/api/webhooks/stripe`
  - Eventos: `checkout.session.completed`, `charge.refunded`
- [ ] Copiar Webhook Secret LIVE
- [ ] Salvar credenciais em variáveis de ambiente de produção

### Backend (Produção)

- [ ] Escolher plataforma de deploy (Heroku/Railway/Vercel/AWS)
- [ ] Configurar variáveis de ambiente de produção
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `STRIPE_SECRET_KEY` (LIVE)
  - [ ] `STRIPE_WEBHOOK_SECRET` (LIVE)
  - [ ] `JWT_SECRET` (novo, seguro)
  - [ ] `ADMIN_PASSWORD_HASH`
  - [ ] `FRONTEND_URL` (produção)
- [ ] Fazer build de produção
- [ ] Deploy do backend
- [ ] Verificar health check em produção
- [ ] Configurar SSL/HTTPS
- [ ] Configurar domínio customizado (opcional)

### Frontend (Produção)

- [ ] Criar arquivo `.env.production`
- [ ] Configurar variáveis de produção:
  - [ ] `VITE_BACKEND_URL` (produção)
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY` (LIVE)
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Atualizar `STRIPE_PRODUCTS` com Price IDs LIVE
- [ ] Fazer build de produção
- [ ] Deploy do frontend
- [ ] Verificar funcionamento

---

## Fase 4: Testes de Produção

### Testes Críticos

- [ ] **Teste 1**: Compra real com valor baixo (R$ 0,50)
  - [ ] Escolher template
  - [ ] Preencher checkout
  - [ ] Confirmar pagamento
  - [ ] Verificar redirecionamento
  - [ ] Verificar acesso liberado
  - [ ] Verificar registro no Supabase
  - [ ] Verificar webhook no Stripe Dashboard

- [ ] **Teste 2**: Acesso após compra
  - [ ] Fechar navegador
  - [ ] Abrir novamente
  - [ ] Acessar template com email
  - [ ] Verificar acesso mantido

- [ ] **Teste 3**: Acesso negado sem compra
  - [ ] Tentar acessar template premium
  - [ ] Usar email diferente
  - [ ] Verificar redirecionamento
  - [ ] Verificar mensagem de erro

- [ ] **Teste 4**: Webhook em produção
  - [ ] Verificar logs do Stripe Dashboard
  - [ ] Verificar eventos recebidos
  - [ ] Verificar status de sucesso

### Testes de Segurança

- [ ] Tentar burlar acesso via DevTools
- [ ] Verificar RLS policies no Supabase
- [ ] Verificar rate limiting
- [ ] Verificar validação de entrada
- [ ] Verificar CORS configurado corretamente
- [ ] Verificar chaves SECRET não expostas

---

## Fase 5: Monitoramento

### Configurar Logs

- [ ] Configurar logging no backend
- [ ] Configurar alertas de erro
- [ ] Configurar monitoramento de uptime
- [ ] Configurar analytics de conversão

### Métricas Importantes

- [ ] Taxa de conversão (checkout iniciado vs completado)
- [ ] Templates mais vendidos
- [ ] Receita total
- [ ] Reembolsos
- [ ] Erros de webhook

### Dashboards

- [ ] Stripe Dashboard (pagamentos)
- [ ] Supabase Dashboard (compras)
- [ ] Backend Logs (erros)
- [ ] Google Analytics (conversões)

---

## Fase 6: Documentação

### Documentação Interna

- [ ] Criar runbook de operações
- [ ] Documentar processo de reembolso
- [ ] Documentar acesso administrativo
- [ ] Criar FAQ de troubleshooting

### Documentação para Usuários

- [ ] Página de FAQ
- [ ] Email de confirmação de compra
- [ ] Email de acesso ao template
- [ ] Política de reembolso

---

## Fase 7: Backup e Recuperação

### Backup

- [ ] Configurar backup automático do Supabase
- [ ] Backup das variáveis de ambiente
- [ ] Backup da configuração do Stripe
- [ ] Documentar processo de restauração

### Plano de Recuperação

- [ ] Testar restauração de backup
- [ ] Documentar tempo de recuperação
- [ ] Definir responsáveis
- [ ] Criar contatos de emergência

---

## Fase 8: Otimizações

### Performance

- [ ] Configurar cache de respostas
- [ ] Otimizar queries do Supabase
- [ ] Implementar CDN para frontend
- [ ] Comprimir assets

### UX

- [ ] Loading states claros
- [ ] Mensagens de erro amigáveis
- [ ] Feedback visual de sucesso
- [ ] Email de confirmação automático

---

## Checklist de Lançamento

### Dia do Lançamento

- [ ] **-1 dia**: Último teste end-to-end
- [ ] **-1 dia**: Backup de tudo
- [ ] **-1 dia**: Verificar todas credenciais
- [ ] **Hora H**: Deploy do backend
- [ ] **Hora H**: Deploy do frontend
- [ ] **Hora H**: Smoke test completo
- [ ] **Hora H**: Ativar webhook do Stripe
- [ ] **+1 hora**: Monitorar logs
- [ ] **+1 hora**: Fazer compra teste real
- [ ] **+24 horas**: Verificar métricas

### Primeira Semana

- [ ] Monitorar conversões diariamente
- [ ] Verificar erros de webhook
- [ ] Verificar feedback de usuários
- [ ] Ajustar conforme necessário

---

## Problemas Comuns e Soluções

### Webhook não está disparando

**Causa:** URL incorreta ou firewall
**Solução:**
1. Verificar URL no Stripe Dashboard
2. Verificar se backend está acessível
3. Testar manualmente: `stripe trigger checkout.session.completed`

### hasAccess retorna false após compra

**Causa:** Email diferente ou webhook falhou
**Solução:**
1. Verificar logs do webhook no Stripe
2. Verificar tabela `purchases` no Supabase
3. Verificar se email é o mesmo
4. Reprocessar webhook manualmente

### Erro "CORS blocked"

**Causa:** Frontend URL não autorizada
**Solução:**
1. Verificar `FRONTEND_URL` no `.env`
2. Reiniciar backend
3. Verificar configuração CORS

---

## Contatos de Emergência

- **Stripe Support:** https://support.stripe.com
- **Supabase Support:** https://supabase.com/support
- **Documentação:** `server/PREMIUM-VALIDATION.md`

---

## Status Final

### Antes de considerar completo:

- [ ] Todos os testes passando
- [ ] Webhook funcionando 100%
- [ ] Métricas configuradas
- [ ] Backup configurado
- [ ] Documentação completa
- [ ] Equipe treinada

---

**Data de Início:** ___/___/___
**Data de Conclusão:** ___/___/___
**Responsável:** _______________
**Status:** [ ] Em Progresso [ ] Completo

---

**Use este checklist para garantir um deployment perfeito!**
**Marque cada item conforme completa.**
