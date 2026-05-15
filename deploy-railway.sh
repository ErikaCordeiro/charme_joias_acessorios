#!/bin/bash

# Script de deploy para Railway

echo "🚀 Fazendo deploy do Lua Active no Railway..."

# Verifica se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não está instalado."
    echo "Instale com: npm install -g @railway/cli"
    exit 1
fi

# Login no Railway (se necessário)
railway login

# Deploy
railway deploy

echo "✅ Deploy concluído!"
echo "Verifique o status em: https://railway.app"