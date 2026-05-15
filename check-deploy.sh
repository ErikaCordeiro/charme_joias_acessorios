#!/bin/bash

# Script de verificação pré-deploy

echo "🔍 Verificando configuração do projeto Lua Active..."

# Verifica se arquivos essenciais existem
files=("requirements.txt" "app/main.py" "alembic.ini" "frontend/package.json")
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo $file não encontrado!"
        exit 1
    fi
done

echo "✅ Arquivos essenciais encontrados"

# Verifica se .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis!"
fi

# Verifica se Docker está disponível
if command -v docker &> /dev/null; then
    echo "✅ Docker disponível"
else
    echo "⚠️  Docker não encontrado. Considere usar Railway ou Heroku"
fi

# Verifica se Railway CLI está disponível
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI disponível"
else
    echo "ℹ️  Railway CLI não encontrado. Instale com: npm install -g @railway/cli"
fi

echo "🎉 Verificação concluída! Projeto pronto para deploy."