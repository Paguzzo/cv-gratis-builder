# 🔒 Backend Seguro - CV Grátis Builder

Este é o backend seguro que gerencia todas as APIs sensíveis do CV Grátis Builder, mantendo as chaves de API no servidor e longe do frontend.

## 🛡️ Recursos de Segurança

- **JWT Authentication**: Sistema de autenticação real para administradores
- **Rate Limiting**: Proteção contra abuso de APIs
- **Input Validation**: Validação rigorosa de todas as entradas
- **CORS Configurado**: Acesso restrito apenas ao frontend autorizado
- **Helmet.js**: Headers de segurança HTTP
- **Sanitização**: Proteção contra XSS e injeção

## 📡 Endpoints Disponíveis

### Email
- `POST /api/secure/send-email` - Envio seguro de emails via Resend

### Inteligência Artificial
- `POST /api/secure/ai/grok` - Geração de conteúdo com GROK AI
- `POST /api/secure/ai/openai` - Geração de conteúdo com OpenAI

### Autenticação Admin
- `POST /api/secure/admin/login` - Login com JWT
- `POST /api/secure/admin/verify` - Verificação de token

### Pagamentos
- `POST /api/secure/payments/create-intent` - Criação de intenção de pagamento

### Sistema
- `GET /health` - Health check do servidor

## 🚀 Instalação e Execução

### 1. Instalar Dependências
```bash
cd server
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Editar .env com suas chaves reais
```

### 3. Gerar Hash da Senha Admin
```bash
node -e "console.log(require('bcrypt').hashSync('sua-senha-admin', 10))"
```

### 4. Iniciar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## ⚙️ Configuração das Variáveis de Ambiente

### Obrigatórias
- `JWT_SECRET`: Chave secreta para JWT (mínimo 32 caracteres)
- `ADMIN_USERNAME`: Nome de usuário do administrador
- `ADMIN_PASSWORD_HASH`: Hash bcrypt da senha admin

### APIs Externas (pelo menos uma é necessária)
- `RESEND_API_KEY`: Para envio de emails
- `GROK_API_KEY`: Para IA GROK
- `OPENAI_API_KEY`: Para OpenAI
- `STRIPE_SECRET_KEY`: Para pagamentos

### Opcionais
- `PORT`: Porta do servidor (padrão: 3001)
- `FRONTEND_URL`: URL do frontend (padrão: http://localhost:8080)
- `FROM_EMAIL`: Email de origem (padrão: contato@curriculogratisonline.com)

## 🔐 Configuração da Senha Admin

Para gerar o hash da senha admin:

```bash
# Instalar bcrypt globalmente
npm install -g bcrypt

# Gerar hash (substitua 'MinhaSuper3nha!' pela sua senha)
node -e "console.log(require('bcrypt').hashSync('MinhaSuper3nha!', 10))"
```

Cole o hash resultante na variável `ADMIN_PASSWORD_HASH` do arquivo `.env`.

## 🌐 Integração com Frontend

O frontend deve ser configurado para usar estas URLs:

```javascript
// Em desenvolvimento
const API_BASE_URL = 'http://localhost:3001/api/secure';

// Em produção
const API_BASE_URL = 'https://your-backend-domain.com/api/secure';
```

## 📊 Monitoramento

### Health Check
```bash
curl http://localhost:3001/health
```

### Logs de Segurança
O servidor registra todas as tentativas de acesso, erros e atividades suspeitas.

## 🚦 Rate Limits

- **APIs gerais**: 100 requests por 15 minutos por IP
- **Login admin**: 5 tentativas por 15 minutos por IP

## ⚠️ Considerações de Produção

1. **HTTPS Obrigatório**: Use sempre HTTPS em produção
2. **Variáveis de Ambiente**: Nunca commitar o arquivo `.env`
3. **Firewall**: Configurar firewall para permitir apenas tráfego necessário
4. **Logs**: Implementar sistema de logs robusto
5. **Backup**: Fazer backup das configurações
6. **Updates**: Manter dependências atualizadas

## 🔄 Deployment

### Docker (Recomendado)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 (Alternativa)
```bash
npm install -g pm2
pm2 start secure-backend.js --name cv-backend
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

### Erro: JWT_SECRET não configurado
```bash
# Gerar uma chave segura
openssl rand -base64 32
```

### Erro: Conexão CORS
Verificar se `FRONTEND_URL` está correto no `.env`.

### Erro: Rate limit atingido
Aguardar 15 minutos ou reiniciar o servidor em desenvolvimento.

## 📝 Logs

```bash
# Ver logs em tempo real
tail -f logs/app.log

# Logs de erro
tail -f logs/error.log
```

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.