# Production reference settings for Charme Joias Acessorios.
# Runtime configuration is read from environment variables in app/core/config.py.

ALLOWED_ORIGINS = [
    "https://www.seudominio.com",
    "https://your-vercel-domain.vercel.app",
]

SECURE_COOKIES = True
HTTPS_ONLY = True
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 60
