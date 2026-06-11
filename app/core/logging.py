import logging
import os
import sys
from pathlib import Path

handlers: list[logging.Handler] = [logging.StreamHandler(sys.stdout)]

if os.getenv("ENVIRONMENT", "development") != "production":
    logs_dir = Path(__file__).parent.parent / "logs"
    logs_dir.mkdir(exist_ok=True)

    error_handler = logging.FileHandler(logs_dir / "error.log", encoding="utf-8")
    error_handler.setLevel(logging.ERROR)
    handlers.extend([
        logging.FileHandler(logs_dir / "app.log", encoding="utf-8"),
        error_handler,
    ])

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=handlers,
)

# Create logger
logger = logging.getLogger(__name__)
