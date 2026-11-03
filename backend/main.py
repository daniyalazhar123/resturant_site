import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import reservations, chatbot, menu, orders, auth, webhooks

# Auto-create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="L'Étoile Dorée & Royal Pavilion API",
    description="Python FastAPI backend powering Michelin-Starred Haute Gastronomie & RAG AI Chatbot",
    version="1.0.0",
)

# Configure CORS Middleware - SECURITY FIX
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
    allow_headers=["*"],
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
