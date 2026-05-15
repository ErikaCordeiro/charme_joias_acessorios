@echo off
echo 🚀 Iniciando Lua Active...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado!
    echo 📥 Instale Python de: https://www.python.org/downloads/
    echo Ou via Microsoft Store: "Python 3.11"
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo 📥 Instale Node.js de: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Dependências encontradas!

REM Criar ambiente virtual se não existir
if not exist venv (
    echo 🐍 Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
echo 🔧 Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Instalar dependências Python
echo 📦 Instalando dependências Python...
pip install -r requirements.txt

REM Executar migrações do banco
echo 🗄️ Executando migrações...
alembic upgrade head

REM Executar seed de dados
echo 🌱 Populando banco de dados...
python scripts/seed.py

echo ✅ Backend pronto!

REM Abrir novo terminal para o frontend
echo 🎨 Iniciando frontend...
start cmd /k "cd frontend && npm install && npm start"

REM Iniciar backend
echo 🚀 Iniciando backend...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000