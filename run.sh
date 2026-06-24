#!/bin/bash

set -euo pipefail

echo "Iniciando Charme Joias e Acessorios..."

if ! command -v docker &> /dev/null; then
    echo "Docker nao esta instalado."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose nao esta instalado."
    exit 1
fi

echo "Construindo e iniciando containers..."
docker-compose up --build

echo "Projeto iniciado."
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "Documentacao API: http://localhost:8000/docs"
