@echo off
echo Iniciando Backend Charme Joias e Acessorios...
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python nao encontrado.
    echo Instale Python em: https://www.python.org/downloads/
    pause
    exit /b 1
)

if not exist venv (
    echo Criando ambiente virtual...
    python -m venv venv
)

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo Instalando dependencias...
pip install -r requirements.txt

echo Executando migrations...
alembic upgrade head

echo Sincronizando produtos Charme...
python scripts/seed.py

echo Backend disponivel em: http://localhost:8000
echo Documentacao em: http://localhost:8000/docs
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
