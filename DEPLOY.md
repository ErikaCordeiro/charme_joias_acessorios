# Deploy no Neon + Render

Arquitetura:

- PostgreSQL: Neon
- Backend FastAPI: Render Web Service
- Frontend React/Vite: Render Static Site
- Midia: Cloudinary opcional

## 1. Neon PostgreSQL

1. Crie um projeto no Neon.
2. Abra **Connect** e copie a connection string PostgreSQL.
3. Prefira a URL pooled para a aplicacao web.
4. Configure a URL completa somente como `DATABASE_URL` no backend do Render.

Formato esperado:

```env
DATABASE_URL=postgresql://usuario:senha@ep-exemplo-pooler.regiao.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

O backend converte a URL para `postgresql+asyncpg`, preserva SSL, remove o parametro `channel_binding` incompatível com asyncpg e desativa o cache de prepared statements em conexoes pooled.

Nunca coloque `DATABASE_URL` no frontend ou no repositorio.

## 2. Blueprint no Render

1. Conecte o repositorio GitHub ao Render.
2. Selecione **New > Blueprint**.
3. Escolha o repositorio e confirme o `render.yaml`.
4. O Render criara `charme-joias-api` e `charme-joias-web`.

### Variaveis do backend

```env
DATABASE_URL=<URL-DO-NEON>
SECRET_KEY=<gerada-pelo-Render>
ENVIRONMENT=production
ADMIN_EMAILS=cjoiaseacessorios@gmail.com
CORS_ORIGINS=https://URL-DO-FRONTEND.onrender.com
FRONTEND_URL=https://URL-DO-FRONTEND.onrender.com
SEED_DEFAULT_PRODUCTS=false
AUTO_CREATE_SCHEMA=false
```

Cloudinary, se utilizado:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

O start command executa `alembic upgrade head` antes do Uvicorn.

### Variaveis do frontend

```env
VITE_API_BASE_URL=https://URL-DO-BACKEND.onrender.com/api/v1
VITE_SITE_URL=https://URL-DO-FRONTEND.onrender.com
VITE_SITE_NAME=Charme Joias e Acessorios
```

Como o Blueprint define `rootDir: frontend`, o build usa `npm ci && npm run build` e publica `dist`. Em uma configuracao manual sem `rootDir`, use `cd frontend && npm ci && npm run build` e publique `frontend/dist`.

## 3. Admin principal

O cadastro publico nunca concede permissao administrativa, mesmo quando o email aparece em `ADMIN_EMAILS`.

Para criar ou promover o admin principal, configure localmente `DATABASE_URL` com a URL Neon e execute:

```powershell
$env:ADMIN_EMAIL='cjoiaseacessorios@gmail.com'
python scripts/create_admin_local.py
```

O script solicita uma senha de 10 a 72 caracteres, com letras e numeros, sem exibi-la. Nao salve a senha no repositorio ou permanentemente no Render.

## 4. Catalogo inicial

Com `SEED_DEFAULT_PRODUCTS=false`, rode uma vez:

```powershell
python scripts/seed.py
```

Execute com `DATABASE_URL` apontando para o Neon. O seed sincroniza apenas o catalogo Charme.

## 5. Validacao

- API: `https://URL-DO-BACKEND.onrender.com/healthz`
- Banco: `https://URL-DO-BACKEND.onrender.com/readyz`
- Docs: `https://URL-DO-BACKEND.onrender.com/docs`
- Produtos: `https://URL-DO-BACKEND.onrender.com/api/v1/products/`
- Frontend: URL do Static Site

`/healthz` verifica o processo da API. `/readyz` executa `SELECT 1` no Neon.

## 6. Ordem recomendada

1. Criar Neon.
2. Criar Blueprint no Render.
3. Configurar `DATABASE_URL`, CORS e URLs.
4. Aguardar a migration e o health check.
5. Rodar o seed uma vez.
6. Criar o admin principal.
7. Testar login, produtos, carrinho, checkout, conta e dashboard.

## 7. Observacao de pagamento

O checkout atual usa um simulador bancario sandbox. Ele nao processa pagamentos reais. Antes de aceitar vendas reais, integre um provedor de pagamento, valide webhooks e implemente idempotencia.
