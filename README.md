# Charme Joias Acessórios

E-commerce premium para joias, semijoias e acessórios femininos.

Arquitetura de produção:

- Frontend: Vercel
- Backend/API: Railway
- Banco de dados: PostgreSQL no Railway
- Imagens e mídia: Cloudinary

## Estrutura

```txt
app/              FastAPI, SQLAlchemy, routers, services e schemas
alembic/          Migrations do banco
frontend/         React + Vite para deploy na Vercel
railway.toml      Configuração do backend no Railway
vercel.json       Configuração do frontend na Vercel
```

## Variáveis de Ambiente

Backend Railway:

```env
APP_NAME=Charme Joias Acessorios
API_V1_PREFIX=/api/v1
DATABASE_URL=${{ Postgres.DATABASE_URL }}
SECRET_KEY=<secret forte gerado no Railway>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=production
ADMIN_EMAILS=admin@seudominio.com
CORS_ORIGINS=https://www.seudominio.com,https://seu-projeto.vercel.app
FRONTEND_URL=https://www.seudominio.com
SEED_DEFAULT_PRODUCTS=false
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>
CLOUDINARY_DEFAULT_FOLDER=charme/produtos
SENTRY_DSN=
```

Frontend Vercel:

```env
VITE_API_BASE_URL=https://sua-api.up.railway.app/api/v1
VITE_SITE_URL=https://www.seudominio.com
VITE_SITE_NAME=Charme Joias Acessórios
```

Nunca coloque `SECRET_KEY`, `DATABASE_URL` ou `CLOUDINARY_API_SECRET` no frontend.

## Rodar Localmente

Backend:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm ci
copy .env.example .env
npm run dev
```

URLs locais:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API v1: http://localhost:8000/api/v1
- Health check: http://localhost:8000/healthz
- Docs: http://localhost:8000/docs

## Deploy do Backend no Railway

1. Crie um novo projeto no Railway.
2. Adicione um serviço PostgreSQL.
3. Adicione o backend conectando este repositório.
4. Configure as variáveis de ambiente listadas acima.
5. Confirme que `DATABASE_URL` aponta para o PostgreSQL do Railway.
6. Configure o start command, se necessário:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

7. Verifique o health check:

```txt
https://sua-api.up.railway.app/healthz
```

## Migrations PostgreSQL

Rodar migrations localmente:

```bash
alembic upgrade head
```

Rodar migrations em produção no Railway:

```bash
railway run alembic upgrade head
```

Criar uma nova migration:

```bash
alembic revision --autogenerate -m "descricao_da_migration"
```

O projeto também cria tabelas no startup para compatibilidade, mas em produção a fonte de verdade deve ser o Alembic.

## Cloudinary

Crie uma conta no Cloudinary e configure no Railway:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_DEFAULT_FOLDER=charme/produtos
```

Pastas recomendadas:

- `charme/produtos`
- `charme/banners`
- `charme/categorias`

Uploads são feitos pelo backend, em rota administrativa protegida:

```txt
POST /api/v1/media/upload
```

O formulário de produtos no admin envia a imagem para o Cloudinary e preenche `image_url` com a `secure_url`. Em produção, não salve imagens em disco local.

## Deploy do Frontend na Vercel

1. Importe o repositório na Vercel.
2. Use as configurações do `vercel.json`.
3. Configure:

```txt
Build Command: cd frontend && npm ci && npm run build
Output Directory: frontend/dist
```

4. Adicione as variáveis do frontend.
5. Aponte `VITE_API_BASE_URL` para a API Railway com `/api/v1`.
6. Configure o domínio customizado na Vercel.
7. Adicione esse domínio em `CORS_ORIGINS` e `FRONTEND_URL` no Railway.

## Segurança

- Rotas administrativas usam autenticação e exigem usuário admin.
- CORS deve listar apenas domínios autorizados em produção.
- Secrets ficam somente no Railway.
- Cloudinary API secret nunca vai para a Vercel.
- Use HTTPS nos domínios finais.
- Não commitar `.env`, logs, bancos locais ou chaves.

## Checklist de Produção

- `npm run build` passa em `frontend/`.
- `pip install -r requirements.txt` passa no backend.
- `alembic upgrade head` executado no PostgreSQL Railway.
- `/healthz` retorna `{"status":"ok"}`.
- `VITE_API_BASE_URL` aponta para `https://...railway.app/api/v1`.
- `CORS_ORIGINS` inclui o domínio Vercel/customizado.
- Upload Cloudinary testado no admin.
- Produtos usam URLs `https://res.cloudinary.com/...`.
- Domínio customizado configurado na Vercel.
