# Guia Rápido de Deploy - Lua Active

## 🚀 Opções de Deploy

### 1. Railway (Mais Fácil)
```bash
# Instalar CLI
npm install -g @railway/cli
railway login

# Deploy
railway init
railway up
```

### 2. Heroku
```bash
# Instalar CLI
heroku login
heroku create lua-active-api

# Deploy
git push heroku main
```

### 3. Render
- Conecte repositório Git
- Configure Python runtime
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port 10000`

## 🔧 Configurações Necessárias

### Variáveis de Ambiente
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-super-secret-key
SENTRY_DSN=https://your-sentry-dsn
ENVIRONMENT=production
```

### Banco de Dados
- Railway: PostgreSQL automático
- Heroku: `heroku addons:create heroku-postgresql`
- Render: PostgreSQL incluído

## 📱 Deploy do Frontend

### Netlify
```bash
cd frontend
npm run build
# Deploy via drag-and-drop ou Git
```

### Vercel
```bash
vercel --prod
```

## ✅ Checklist Pré-Deploy

- [ ] SECRET_KEY forte gerada
- [ ] SENTRY_DSN configurado (opcional)
- [ ] Banco PostgreSQL configurado
- [ ] Migrações executadas
- [ ] Seed de dados executado
- [ ] Frontend buildado
- [ ] Testes locais funcionando

## 🔍 URLs de Produção

- API: https://your-app-name.railway.app
- Docs: https://your-app-name.railway.app/docs
- Frontend: https://your-app-name.netlify.app