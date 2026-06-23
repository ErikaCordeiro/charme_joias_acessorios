# Charme Joias e Acessorios

E-commerce em React + Vite com API FastAPI, SQLAlchemy assincorno e PostgreSQL.

## Producao

- Banco: Neon PostgreSQL
- API: Render Web Service
- Frontend: Render Static Site
- Midia: Cloudinary

O passo a passo completo esta em [DEPLOY.md](DEPLOY.md).

## Estrutura

```txt
app/          API, modelos, schemas, routers e services
alembic/      migrations PostgreSQL
frontend/     React + Vite
scripts/      seed, admin e manutencao do catalogo
render.yaml   Blueprint do Render
```

## Ambiente local

Backend:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```powershell
Set-Location frontend
npm ci
Copy-Item .env.example .env
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- API v1: `http://localhost:8000/api/v1`
- Health: `http://localhost:8000/healthz`
- Banco: `http://localhost:8000/readyz`
- Docs: `http://localhost:8000/docs`

## Variaveis do backend

Use `.env.example` como base:

```env
DATABASE_URL=postgresql://usuario:senha@ep-exemplo-pooler.regiao.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SECRET_KEY=<segredo-aleatorio-com-32-ou-mais-caracteres>
ENVIRONMENT=production
ADMIN_EMAILS=cjoiaseacessorios@gmail.com
CORS_ORIGINS=https://seu-frontend.onrender.com
FRONTEND_URL=https://seu-frontend.onrender.com
AUTO_CREATE_SCHEMA=false
SEED_DEFAULT_PRODUCTS=false
```

Em producao, a aplicacao recusa iniciar com secret fraco, CORS `*`, origem localhost, banco nao PostgreSQL ou admin nao configurado.

## Variaveis do frontend

```env
VITE_API_BASE_URL=https://sua-api.onrender.com/api/v1
VITE_SITE_URL=https://seu-frontend.onrender.com
VITE_SITE_NAME=Charme Joias e Acessorios
```

Somente valores publicos usam o prefixo `VITE_`. Credenciais Neon, JWT e Cloudinary nunca devem ir para o frontend.

## Migrations

```powershell
alembic upgrade head
alembic current
alembic heads
```

As migrations usam exclusivamente `DATABASE_URL`. Em producao, `AUTO_CREATE_SCHEMA=false` deixa o Alembic como fonte de verdade do schema.

## Admin principal

```powershell
$env:ADMIN_EMAIL='cjoiaseacessorios@gmail.com'
python scripts/create_admin_local.py
```

O script usa o banco configurado em `DATABASE_URL`, solicita uma senha forte e grava somente o hash bcrypt. Cadastro publico nunca concede role admin.

## Seguranca aplicada

- JWT com expiracao e secret obrigatorio em producao.
- Hash bcrypt; hashes legados sao atualizados no proximo login.
- Rotas administrativas verificam `is_admin` no backend.
- Status de pedidos somente pode ser alterado por admin.
- Frete e total do pedido sao recalculados no backend.
- Estoque e pedido sao atualizados na mesma transacao.
- Uploads exigem admin, tipo/tamanho validos e pastas permitidas.
- CORS restrito em producao.
- API publica somente sob `/api/v1`, exceto health/docs.
- Logs nao incluem query string, token ou corpo da requisicao.

## Testes antes do deploy

```powershell
pip install -r requirements.txt
alembic upgrade head
python -m compileall app scripts alembic

Set-Location frontend
npm ci
npm run lint
npm run build
```

Teste manualmente:

1. `/healthz`, `/readyz` e `/docs`.
2. Listagem e filtros de produtos.
3. Cadastro e login.
4. Carrinho e checkout.
5. Minha Conta e pedidos.
6. Negacao de `/api/v1/admin/*` para cliente comum.
7. Dashboard com o admin principal.

## Limites atuais

- Pagamentos sao simulados em sandbox e nao podem receber vendas reais.
- Rate limiting distribuido e recuperacao de senha ainda devem ser adicionados antes de uma operacao comercial de maior escala.
- Cloudinary precisa ser configurado no Render para uploads administrativos.
