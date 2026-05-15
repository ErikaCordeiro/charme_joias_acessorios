@echo off
echo 🚀 Iniciando Backend Lua Active...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado!
    echo 📥 Instale Python de: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python encontrado!

REM Criar ambiente virtual se não existir
if not exist venv (
    echo 🐍 Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
echo 🔧 Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Instalar dependências Python
echo 📦 Instalando dependências...
pip install -r requirements.txt

REM Executar migrações do banco
echo 🗄️ Executando migrações...
alembic upgrade head

REM Executar seed de dados
echo 🌱 Populando banco de dados...
python scripts/seed.py

echo ✅ Setup completo!
echo 🚀 Iniciando servidor...
echo.
echo 📱 API disponível em: http://localhost:8000
echo 📚 Documentação em: http://localhost:8000/docs
echo.

REM Iniciar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000