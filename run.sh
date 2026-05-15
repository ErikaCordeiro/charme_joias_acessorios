#!/bin/bash

# Script para executar o projeto Lua Active

echo "🚀 Iniciando Lua Active..."

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verifica se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

echo "🐳 Construindo e iniciando containers..."
docker-compose up --build

echo "✅ Projeto iniciado!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 Documentação API: http://localhost:8000/docs"