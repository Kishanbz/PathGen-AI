from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import Base, engine

# Import all models so SQLAlchemy can create tables
from models import db_models  # noqa: F401

# Import all routers
from routes import auth, assessment, learning_path, content, progress
from routes import recommendations, predictions, chat, reports, admin

# ─── Create all DB tables (if not exist) ────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ─── FastAPI App ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="PathGen AI — Backend API",
    description="AI-Powered Personalized Learning Path System — FastAPI Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS Middleware ──────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include All Routers ──────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(assessment.router)
app.include_router(learning_path.router)
app.include_router(content.router)
app.include_router(progress.router)
app.include_router(recommendations.router)
app.include_router(predictions.router)
app.include_router(chat.router)
app.include_router(reports.router)
app.include_router(admin.router)


# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "status": "running",
        "app": "PathGen AI Backend",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
