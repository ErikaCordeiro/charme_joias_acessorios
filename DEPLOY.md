# Deploy no Render

## 1) Pre-requisitos

- Repositorio no GitHub atualizado
- Conta no Render conectada ao GitHub

## 2) Deploy com Blueprint (`render.yaml`)

1. No Render, clique em **New +** -> **Blueprint**.
2. Selecione o repositorio `ErikaCordeiro/Lua_Active`.
3. O Render vai detectar o arquivo `render.yaml` e criar:
   - `lua-active-db` (PostgreSQL)
   - `lua-active-api` (FastAPI)
   - `lua-active-web` (Frontend estatico)
4. Durante a criacao, preencha:
   - `VITE_API_BASE_URL`: URL publica do backend (ex.: `https://lua-active-api.onrender.com`)
   - `SENTRY_DSN` (opcional)

## 3) Variaveis importantes (backend)

- `DATABASE_URL`: preenchida automaticamente via `fromDatabase`
- `SECRET_KEY`: gerada automaticamente
- `ENVIRONMENT=production`
- `ADMIN_EMAILS=erikagcordeiro25@gmail.com`
- `CORS_ORIGINS=*` (modo teste)

## 4) Validacao apos deploy

- API health: `https://<api-service>.onrender.com/healthz`
- API docs: `https://<api-service>.onrender.com/docs`
- Frontend: `https://<web-service>.onrender.com`

## 5) Observacao sobre CORS em producao

Para ambiente definitivo, troque `CORS_ORIGINS=*` por dominios explicitos, por exemplo:

`https://lua-active-web.onrender.com`
