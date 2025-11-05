# 🔐 Credenciais de Acesso Administrativo

## Informações de Login

### Painel Administrativo
- **URL de Acesso**: http://localhost:8080/admin-login
- **Usuário**: `admin`
- **Senha**: `Admin@2024!`

### Segurança

#### Hash da Senha
A senha está armazenada de forma segura usando bcrypt com 10 rounds de salt:
```
$2b$10$PP6NZicoSzFQSTyL9MfzI.Ht0z54F28NlFvTZxQXj1qx9qCcpUjrK
```

#### JWT Secret
O token JWT usa a seguinte chave secreta (definida no .env):
```
cv-gratis-super-secret-jwt-key-2024-production-change-this
```

⚠️ **IMPORTANTE**: Altere o JWT_SECRET antes de colocar em produção!

## Fluxo de Autenticação

### 1. Login
```
POST /api/secure/admin/login
Body: {
  "username": "admin",
  "password": "Admin@2024!"
}

Response: {
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-001",
    "username": "admin",
    "email": "admin@curriculogratisonline.com",
    "role": "admin",
    "permissions": ["*"]
  },
  "expiresIn": 86400
}
```

### 2. Verificar Token
```
POST /api/secure/admin/verify
Headers: {
  "Authorization": "Bearer <token>"
}

Response: {
  "valid": true,
  "user": { ... }
}
```

### 3. Refresh Token
```
POST /api/secure/admin/refresh
Body: {
  "refreshToken": "<refresh_token>"
}

Response: {
  "success": true,
  "token": "novo_token_aqui",
  "expiresIn": 86400
}
```

### 4. Logout
```
POST /api/secure/admin/logout
Headers: {
  "Authorization": "Bearer <token>"
}

Response: {
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

## Expiração de Tokens

- **Access Token**: 24 horas
- **Refresh Token**: 7 dias

Após a expiração, é necessário fazer login novamente.

## Rate Limiting

### Proteção contra Brute Force

- **Tentativas de Login**: Máximo 5 tentativas a cada 15 minutos por IP
- **API Geral**: Máximo 100 requisições a cada 15 minutos por IP

Se exceder o limite, você verá:
```json
{
  "error": "Muitas tentativas de login. Tente novamente em 15 minutos."
}
```

## Gerar Novo Hash de Senha

Para alterar a senha do administrador:

```bash
cd server
node generate-password-hash.js "NovaSenhaAqui"
```

Copie o hash gerado e atualize no arquivo `.env`:
```
ADMIN_PASSWORD_HASH=<novo_hash_aqui>
```

Reinicie o servidor backend para aplicar as mudanças.

## Testando a Autenticação

### 1. Iniciar o Backend
```bash
cd server
npm start
```

### 2. Iniciar o Frontend
```bash
npm run dev
```

### 3. Acessar
- Frontend: http://localhost:8080
- Login Admin: http://localhost:8080/admin-login
- Painel Admin: http://localhost:8080/admin

### 4. Fazer Login
1. Acesse http://localhost:8080/admin-login
2. Digite:
   - Usuário: `admin`
   - Senha: `Admin@2024!`
3. Clique em "Entrar no Painel"
4. Você será redirecionado para /admin

## Segurança em Produção

### ⚠️ ANTES DE IR PARA PRODUÇÃO:

1. **Altere o JWT_SECRET**
   ```bash
   # Gere um secret forte e aleatório
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Altere a Senha Admin**
   ```bash
   node server/generate-password-hash.js "SuaSenhaForteAqui123!@#"
   ```

3. **Configure HTTPS**
   - Nunca use HTTP em produção
   - Configure certificado SSL/TLS

4. **Configure Variáveis de Ambiente**
   - Use variáveis de ambiente do servidor de produção
   - Nunca commite o arquivo .env para repositórios públicos

5. **Configure CORS**
   - Defina FRONTEND_URL com o domínio de produção
   - Remova wildcards em produção

6. **Monitore Logs**
   - Todas as tentativas de login são registradas
   - Monitore atividades suspeitas

## Suporte

Para problemas com autenticação:

1. Verifique se o backend está rodando (http://localhost:3001/health)
2. Verifique os logs do console do navegador (F12)
3. Verifique os logs do servidor backend
4. Confirme que as variáveis de ambiente estão corretas

## Arquivos de Configuração

- **Backend**: `server/secure-backend.js`
- **Middleware**: `server/middleware/auth.js`
- **Controller**: `server/controllers/adminController.js`
- **Frontend Hook**: `src/hooks/useAdminAuth.ts`
- **Componente Login**: `src/components/admin/AdminLoginForm.tsx`
- **Página Login**: `src/pages/AdminLogin.tsx`
- **Painel Admin**: `src/pages/AdminPanel.tsx`
