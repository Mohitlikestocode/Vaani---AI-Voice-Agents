from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.core import settings
from app.routers import health_router, agents_router, auth_router


app = FastAPI(title=settings.app_name, version=settings.app_version)

# Allow the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(agents_router, prefix=settings.api_prefix)
app.include_router(auth_router, prefix=settings.api_prefix)
