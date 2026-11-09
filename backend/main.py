import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent / ".env"
    load_dotenv(dotenv_path=env_path)
except ImportError:
    pass

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from rate_limit import limiter
from database import engine, Base, SessionLocal
from routers import reservations, chatbot, menu, orders, auth, webhooks

# Auto-create database tables on startup and seed authoritative 16-dish menu catalog
Base.metadata.create_all(bind=engine)
with SessionLocal() as _startup_db:
    menu.seed_menu_items(_startup_db)
    from rag_chatbot import seed_rag_knowledge
    seed_rag_knowledge(_startup_db)

app = FastAPI(
    title="L'Étoile Dorée & Royal Pavilion API",
    description="Python FastAPI backend powering Michelin-Starred Haute Gastronomie & RAG AI Chatbot",
    version="1.0.0",
)

# Rate limiting (slowapi) — returns 429 when limits are exceeded
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS Middleware - STRICT SECURITY FIX
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
origins = [frontend_url]
# Allow additional origins if needed
additional_origins = os.getenv("ADDITIONAL_CORS_ORIGINS", "")
if additional_origins:
    origins.extend([o.strip() for o in additional_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-Forwarded-For"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(reservations.router)
app.include_router(chatbot.router)
app.include_router(menu.router)
app.include_router(orders.router)
app.include_router(webhooks.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "L'Étoile Dorée Python FastAPI Backend & RAG Engine",
        "docs": "http://localhost:8000/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
