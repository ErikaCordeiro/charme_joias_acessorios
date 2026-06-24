@echo off
echo Iniciando Charme Joias e Acessorios...
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python nao encontrado.
    echo Instale Python em: https://www.python.org/downloads/
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js nao encontrado.
    echo Instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo Dependencias base encontradas.

if not exist venv (
    echo Criando ambiente virtual...
    python -m venv venv
)

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo Instalando dependencias Python...
pip install -r requirements.txt

echo Executando migrations...
alembic upgrade head

echo Sincronizando produtos Charme...
python scripts/seed.py

echo Iniciando frontend...
start cmd /k "cd frontend && npm install && npm run dev -- --host 0.0.0.0"

echo Iniciando backend...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
