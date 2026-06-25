# Deploy 100% no Render

Arquitetura oficial:

- PostgreSQL: Render PostgreSQL
- Backend FastAPI: Render Web Service `charme-joias-api`
- Frontend React/Vite: Render Static Site `charme-joias-web`
- Midia: Cloudinary opcional

Nao misture Neon, Supabase ou outro banco com o Render neste projeto. A API, as migrations, o Shell e o admin devem usar a mesma variavel `DATABASE_URL`.

## 1. PostgreSQL no Render

1. No Render, crie um PostgreSQL para o projeto.
2. Nome recomendado: `charme-joias-db`.
3. Copie a **Internal Database URL**.
4. No servico `charme-joias-api`, configure `DATABASE_URL` com essa URL interna.

Se usar o Blueprint `render.yaml`, o banco `charme-joias-db` ja fica declarado e o `DATABASE_URL` da API e preenchido pelo Render.

## 2. API no Render

Servico: `charme-joias-api`

Build command:

```bash
pip install --upgrade pip && pip install -r requirements.txt
```

Start command:

```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Variaveis principais:

```env
DATABASE_URL=<Internal Database URL do Render PostgreSQL>
SECRET_KEY=<gerada pelo Render ou valor forte>
ENVIRONMENT=production
ADMIN_EMAILS=cjoiaseacessorios@gmail.com
CORS_ORIGINS=https://charme-joias-web.onrender.com
FRONTEND_URL=https://charme-joias-web.onrender.com
SEED_DEFAULT_PRODUCTS=false
AUTO_CREATE_SCHEMA=false
```

Cloudinary, se for usar upload:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_DEFAULT_FOLDER=charme/produtos
```

## 3. Web no Render

Servico: `charme-joias-web`

Root directory:

```txt
frontend
```

Build command:

```bash
npm ci && npm run build
```

Publish directory:

```txt
dist
```

Variaveis:

```env
VITE_API_BASE_URL=https://charme-joias-api.onrender.com/api/v1
VITE_SITE_URL=https://charme-joias-web.onrender.com
VITE_SITE_NAME=Charme Joias e Acessorios
```

## 4. Shell do Render

Todos os comandos abaixo devem ser executados no Shell do servico `charme-joias-api`.

Primeiro rode as migrations:

```bash
alembic upgrade head
```

Depois crie ou atualize o admin:

```bash
ADMIN_EMAIL=cjoiaseacessorios@gmail.com ADMIN_PASSWORD="troque-esta-senha" python scripts/create_admin_local.py
```

Para confirmar se o banco correto esta sendo usado:

```bash
python - <<'PY'
import asyncio
from sqlalchemy import text
from app.database import engine

async def main():
    async with engine.connect() as conn:
        result = await conn.execute(text(
            "select table_name from information_schema.tables "
            "where table_schema='public' order by table_name"
        ))
        print(result.fetchall())

asyncio.run(main())
PY
```

O resultado esperado deve incluir `users`, `products`, `carts`, `orders`, `cart_items` e `order_items`.

## 5. Validacao

Depois do deploy:

- API: `https://charme-joias-api.onrender.com/healthz`
- Banco: `https://charme-joias-api.onrender.com/readyz`
- Docs: `https://charme-joias-api.onrender.com/docs`
- Produtos: `https://charme-joias-api.onrender.com/api/v1/products/`
- Frontend: `https://charme-joias-web.onrender.com`

Teste manualmente:

1. Cadastro de cliente.
2. Login de cliente.
3. Login do admin.
4. Dashboard admin.
5. Produtos, carrinho e checkout.

## 6. Pagamento

O checkout atual ainda usa fluxo simulado. Antes de vender de verdade, integre um provedor de pagamento, valide webhooks e implemente idempotencia.
