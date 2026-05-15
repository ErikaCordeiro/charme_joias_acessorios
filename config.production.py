# Configurações adicionais para produção

# CORS para produção
ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    "https://lua-active.vercel.app",
    "https://lua-active.netlify.app"
]

# Configurações de segurança
SECURE_COOKIES = True
HTTPS_ONLY = True

# Limites de rate limiting (se implementar)
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 60  # segundos

# Configurações de email (para notificações futuras)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "your-email@gmail.com"
SMTP_PASSWORD = "your-app-password"