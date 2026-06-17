# Charme Joias e Acessorios

E-commerce premium da Charme Joias e Acessorios, preparado para producao com:

- Frontend: Vercel
- Backend/API: Railway
- Banco de dados: PostgreSQL no Railway
- Imagens e midia: Cloudinary

## Estrutura

```txt
app/              FastAPI, routers, models, schemas e services
alembic/          Migrations do PostgreSQL
frontend/         React + Vite para deploy na Vercel
scripts/          Scripts de seed, limpeza e criacao de admin local
railway.toml      Configuracao do backend no Railway
vercel.json       Configuracao do frontend na Vercel
```

## Ambiente Local

Backend:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
python scripts/create_admin_local.py
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

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API v1: `http://localhost:8000/api/v1`
- Health check: `http://localhost:8000/healthz`
- Docs: `http://localhost:8000/docs`

## Variaveis de Ambiente

Backend no Railway:

```env
APP_NAME=Charme Joias Acessorios
API_V1_PREFIX=/api/v1
DATABASE_URL=${{ Postgres.DATABASE_URL }}
SECRET_KEY=<secret-forte-gerado-no-railway>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=production
ADMIN_EMAILS=admin@seudominio.com
CORS_ORIGINS=https://www.seudominio.com,https://seu-projeto.vercel.app
FRONTEND_URL=https://www.seudominio.com
SEED_DEFAULT_PRODUCTS=false
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
CLOUDINARY_DEFAULT_FOLDER=charme/produtos
SENTRY_DSN=
```

Frontend na Vercel:

```env
VITE_API_BASE_URL=https://sua-api.up.railway.app/api/v1
VITE_SITE_URL=https://www.seudominio.com
VITE_SITE_NAME=Charme Joias e Acessorios
```

Nunca coloque `DATABASE_URL`, `SECRET_KEY`, `CLOUDINARY_API_SECRET` ou qualquer outro segredo no frontend.

## PostgreSQL e Migrations

Rodar migrations localmente:

```bash
alembic upgrade head
```

Rodar migrations em producao no Railway:

```bash
railway run alembic upgrade head
```

Criar nova migration:

```bash
alembic revision --autogenerate -m "descricao_da_migration"
```

O banco de producao deve usar `DATABASE_URL` do PostgreSQL Railway. Mantenha ambientes local e producao separados.

## Cloudinary

O projeto nao deve salvar imagens em disco local em producao. Uploads passam pelo backend e retornam `secure_url` do Cloudinary.

Pastas recomendadas:

- `charme/produtos`
- `charme/banners`
- `charme/categorias`

Endpoint administrativo:

```txt
POST /api/v1/media/upload
```

Use imagens em HTTPS e prefira WebP/otimizacao via Cloudinary quando publicar novos produtos, banners e categorias.

## Deploy Backend no Railway

1. Crie um projeto no Railway.
2. Adicione PostgreSQL ao projeto.
3. Conecte este repositorio como servico backend.
4. Configure as variaveis do backend.
5. Garanta que `DATABASE_URL` aponte para o PostgreSQL do Railway.
6. Configure o start command, se necessario:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

7. Rode as migrations:

```bash
railway run alembic upgrade head
```

8. Teste:

```txt
https://sua-api.up.railway.app/healthz
```

## Deploy Frontend na Vercel

1. Importe o repositorio na Vercel.
2. Use:

```txt
Build Command: cd frontend && npm ci && npm run build
Output Directory: frontend/dist
```

3. Configure as variaveis do frontend.
4. Aponte `VITE_API_BASE_URL` para a API Railway com `/api/v1`.
5. Configure o dominio customizado na Vercel.
6. Inclua o dominio final em `CORS_ORIGINS` e `FRONTEND_URL` no Railway.

## Admin

Crie ou atualize o admin local:

```bash
python scripts/create_admin_local.py
```

Em producao, defina `ADMIN_EMAILS` no Railway e crie o usuario admin com senha forte. Rotas administrativas exigem token e permissao de admin no backend.

## Seguranca

- Rotas internas no frontend exigem login.
- Rotas administrativas exigem usuario admin no backend.
- CORS deve listar somente dominios confiaveis em producao.
- Secrets ficam apenas no Railway.
- Cloudinary API secret nunca vai para a Vercel.
- Use HTTPS nos dominios finais.
- Nao commitar `.env`, logs, bancos locais, chaves ou credenciais reais.

## Checklist de Producao

- `npm run lint` passa em `frontend/`.
- `npm run build` passa em `frontend/`.
- `pip install -r requirements.txt` passa no backend.
- `alembic upgrade head` executado no PostgreSQL Railway.
- `/healthz` retorna status OK.
- `VITE_API_BASE_URL` aponta para `https://...railway.app/api/v1`.
- `CORS_ORIGINS` inclui Vercel e dominio customizado.
- Upload Cloudinary testado no admin.
- Produtos usam URLs seguras de imagem.
