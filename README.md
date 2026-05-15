# Lua Active

API backend para e-commerce de roupas fitness com temática nerd, geek e anime.

## 🚀 Como Executar

### Opção 1: Scripts Automáticos (Windows)

#### Projeto Completo (Backend + Frontend):
```bash
# Execute o script de inicialização
start.bat
```

#### Apenas Backend:
```bash
# Execute apenas o backend
start-backend.bat
```

### Opção 2: Docker (Recomendado)

```bash
# Construir e executar tudo
docker-compose up --build

# Ou usar o script
./run.sh
```

### Opção 3: Manual

#### Backend:
```bash
# Criar ambiente virtual
python -m venv venv
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar banco (PostgreSQL)
# Editar .env com DATABASE_URL

# Executar migrações
alembic upgrade head

# Popular banco
python scripts/seed.py

# Iniciar servidor
uvicorn app.main:app --reload
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

## 📱 URLs de Acesso

- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000

## 📋 Pré-requisitos

- **Python 3.11+**: https://www.python.org/downloads/
- **Node.js 18+**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/download/
- **Docker** (opcional): https://www.docker.com/products/docker-desktop
