from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from api.routes import router as api_router
from database.connection import init_db

app = FastAPI(
    title="PathGen-AI API",
    description="Backend API for PathGen-AI Roadmap Generator",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()  # Database initialized on startup
    pass

app.include_router(api_router, prefix="/api")

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "PathGen-AI Backend"}
