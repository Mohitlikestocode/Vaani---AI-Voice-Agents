import os
from dataclasses import dataclass
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Swara Backend")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    api_prefix: str = os.getenv("API_PREFIX", "/api")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    jwt_secret: str = os.getenv("JWT_SECRET", "swara-dev-secret-change-in-prod")
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@swara.com")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "swara123")


settings = Settings()
