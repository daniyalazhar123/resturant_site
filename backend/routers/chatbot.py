from fastapi import APIRouter
from schemas import ChatbotQuerySchema
from rag_chatbot import query_rag_engine

router = APIRouter(prefix="/api/v1/chatbot", tags=["RAG Chatbot"])

@router.post("/query")
def query_chatbot(payload: ChatbotQuerySchema):
    answer = query_rag_engine(payload.query)
    return {
        "success": True,
        "query": payload.query,
        "answer": answer,
        "engine": "LangChain & RAG Vector Knowledge Engine"
    }
