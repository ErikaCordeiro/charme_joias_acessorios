from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.core.monitoring import init_sentry
from app.core.schema_sync import sync_schema
from app.database import engine
from app.models.base import Base
from app.routers.auth import router as auth_router
from app.routers.product import router as product_router
from app.routers.cart import router as cart_router
from app.routers.shipping import router as shipping_router
from app.routers.order import router as order_router
from app.routers.admin import router as admin_router
from app.core.exceptions import AppException

# Initialize monitoring
init_sentry()

app = FastAPI(
    title="Lua Active",
    description="API REST profissional para e-commerce de roupas fitness nerd, geek e anime.",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(sync_schema)


app.include_router(auth_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(shipping_router)
app.include_router(order_router)
app.include_router(admin_router)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"AppException: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.get("/", summary="API root")
async def root() -> dict:
    logger.info("Root requested")
    return {
        "message": "Lua Active API is running.",
        "health_check": "/healthz",
        "docs": "/docs",
    }


@app.get("/healthz", summary="Health check")
async def health_check() -> dict:
    logger.info("Health check requested")
    return {"status": "ok", "app": settings.APP_NAME}
