from fastapi import APIRouter, Request
from schemas import ChatbotQuerySchema
from rag_chatbot import query_rag_engine
from rate_limit import limiter

router = APIRouter(prefix="/api/v1/chatbot", tags=["RAG Chatbot"])

@router.post("/query")
@limiter.limit("10/minute")
def query_chatbot(request: Request, payload: ChatbotQuerySchema):
    answer = query_rag_engine(payload.query)
    return {
        "success": True,
        "query": payload.query,
        "answer": answer,
        "engine": "LangChain & RAG Vector Knowledge Engine"
    }
