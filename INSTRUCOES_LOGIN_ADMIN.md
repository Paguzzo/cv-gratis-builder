# 🔐 INSTRUÇÕES DE LOGIN ADMIN - LEIA COM ATENÇÃO

## ⚠️ IMPORTANTE: COMO FAZER LOGIN

### Credenciais de Acesso
```
Usuário: admin
Senha: Cvgratis@917705
```

### Passo a Passo COMPLETO

#### 1️⃣ PRIMEIRO: Limpar o Cache do Navegador
**MUITO IMPORTANTE!** Antes de tentar fazer login:

1. Abra o navegador
2. Pressione `F12` (ou clique com botão direito > Inspecionar)
3. Vá na aba **Application** (Chrome) ou **Storage** (Firefox)
4. No menu esquerdo, clique em **Local Storage**
5. Clique em `http://localhost:8080`
6. **APAGUE TUDO** (clique com botão direito > Clear)
7. Feche o DevTools (F12 novamente)

OU simplesmente:
- **Chrome/Edge**: `Ctrl + Shift + Delete` > Limpar dados de navegação > Cookies e cache
- **Firefox**: `Ctrl + Shift + Delete` > Limpar histórico recente > Cookies e cache

#### 2️⃣ Iniciar os Servidores

**Terminal 1 - Backend:**
```bash
cd cv-gratis-builder/server
npm start
```
Aguarde até ver: "🔒 Servidor seguro iniciado!"

**Terminal 2 - Frontend:**
```bash
cd cv-gratis-builder
npm run dev
```
Aguarde até ver o endereço do servidor (geralmente http://localhost:8080)

#### 3️⃣ Acessar o Painel Admin

1. Abra o navegador
2. Digite: `http://localhost:8080/admin-login`
3. Preencha:
   - **Usuário**: `admin`
   - **Senha**: `Cvgratis@917705`
4. Clique em "Entrar" ou "Login"

## 🚨 Se AINDA Não Funcionar

### Verificar Console do Navegador
1. Pressione `F12`
2. Vá na aba **Console**
3. Tente fazer login novamente
4. Procure por mensagens:
   - ✅ "Admin logged in successfully" = SUCESSO
   - ❌ "Invalid admin credentials" = ERRO

### Verificar Código Fonte
Abra o arquivo: `src/contexts/AdminContext.tsx`

Linha 14 DEVE estar assim:
```typescript
password: 'Cvgratis@917705'
```

Se estiver diferente, corrija e reinicie o frontend.

### Forçar Reload Completo
1. Com a página aberta no navegador
2. Pressione `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)
3. Isso força o navegador a recarregar TUDO sem usar cache

## 📋 Checklist de Troubleshooting

- [ ] Cache do navegador limpo (localStorage vazio)
- [ ] Servidor backend rodando na porta 3001
- [ ] Servidor frontend rodando na porta 8080
- [ ] Arquivo `AdminContext.tsx` tem senha correta na linha 14
- [ ] Página recarregada com `Ctrl + Shift + R`
- [ ] Console do navegador não mostra erros

## 🎯 Localização dos Arquivos Importantes

### Senha Hardcoded (PRINCIPAL):
- **Arquivo**: `src/contexts/AdminContext.tsx`
- **Linha**: 14
- **Valor atual**: `password: 'Cvgratis@917705'`

### Hashes de Senha (Backend - Secundário):
- `server/.env` - Linha 10
- `.env` - Linha 38
- Esses são usados apenas se o sistema usar autenticação via backend

## 💡 Dica Final

O sistema atualmente usa **AUTENTICAÇÃO LOCAL** (hardcoded no AdminContext.tsx).
Isso significa que a senha está diretamente no código fonte, não no backend.

Por isso, o que importa é:
1. Senha correta no `AdminContext.tsx`
2. Cache do navegador limpo
3. Página recarregada

## ✅ Teste Rápido

Execute no console do navegador (F12 > Console):
```javascript
localStorage.clear();
console.log('Cache limpo! Recarregue a página e tente novamente.');
```

---

**Última atualização**: 2025-11-13
**Senha atual**: Cvgratis@917705
