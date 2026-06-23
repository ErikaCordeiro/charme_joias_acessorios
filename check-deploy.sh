#!/bin/bash

set -euo pipefail

echo "Checking Charme Joias production readiness..."

required_files=(
    ".env.example"
    "requirements.txt"
    "app/main.py"
    "alembic.ini"
    "alembic/env.py"
    "frontend/package.json"
    "render.yaml"
    "scripts/create_admin_local.py"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Missing required file: $file"
        exit 1
    fi
done

if git ls-files | grep -E '^\.env($|\.|-)'; then
    echo "Tracked .env file detected. Remove secrets before deploy."
    exit 1
fi

if grep -R "Railway\|Supabase\|sb_publishable\|charme123456\|Admin123" \
    --exclude-dir=.git \
    --exclude-dir=node_modules \
    --exclude-dir=venv \
    --exclude-dir=dist \
    --exclude=check-deploy.sh \
    .; then
    echo "Legacy provider reference or unsafe credential found."
    exit 1
fi

echo "Pre-deploy checks passed for Render + Neon."
