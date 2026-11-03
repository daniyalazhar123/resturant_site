"""
RAG (Retrieval-Augmented Generation) Engine for L'Étoile Dorée & Royal Pavilion
True Semantic Vector Search using pgvector + Cohere embeddings
"""
import os
import json
from typing import List, Dict, Any, Optional

try:
    import cohere
    COHERE_AVAILABLE = True
except ImportError:
    COHERE_AVAILABLE = False

from sqlalchemy import text
from database import SessionLocal

RESTAURANT_KNOWLEDGE_BASE = [
    {
        "topic": "Pakistani Royal Cuisine",
        "content": "For authentic Pakistani royal dining, our Executive Chef Mahnoor Khan recommends our Royal Mutton Dum Biryani Azafrán (€36) sealed with dough, Peshawari Lamb Karahi (€42) cooked in heavy iron woks, and 24-hour Shahi Nalli Nihari (€38) served with Roghani Naan.",
        "metadata": {"category": "cuisine", "cuisine_type": "pakistani"}
    },
    {
        "topic": "Seafood Delicacies",
        "content": "Our ocean delicacy is the Butter-Poached Maine Lobster Thermidor (€68), flambéed with Cognac & Gruyère, paired with Dom Pérignon Brut. We also serve wild-caught Pan-Seared Chilean Seabass (€49) in lemon-saffron reduction.",
        "metadata": {"category": "cuisine", "cuisine_type": "seafood"}
    },
    {
        "topic": "Asian & Chinese Imperial",
        "content": "Chef Mei-Ling Zhang prepares Imperial Peking Roast Duck (€58) carved table-side, Truffle Crystal Dim Sum (€34), and Royal Tom Yum Goong (€29) infused with lemongrass & giant river prawns.",
        "metadata": {"category": "cuisine", "cuisine_type": "asian"}
    },
    {
        "topic": "Desserts & Sweets",
        "content": "Indulge in Executive Pastry Chef Zara Shah's Gold Leaf Shahi Tukda Brioche (€20) with saffron rabri and 24K edible gold, or classic Tahitian Vanilla Crème Brûlée (€16).",
        "metadata": {"category": "desserts"}
    },
    {
        "topic": "Reservations & VIP Suites",
        "content": "L'Étoile Dorée is located at 12 Place Vendôme, Paris. Open 7 days: Lunch (12:00–15:30) and Dinner (18:00–23:30). Reserve online for complimentary private valet parking! Our VIP suites offer Place Vendôme views with dedicated sommelier service.",
        "metadata": {"category": "info"}
    }
]

class RAGEngine:
    def __init__(self):
        self.cohere_client = None
        if COHERE_AVAILABLE:
            api_key = os.getenv("COHERE_API_KEY", "[COHERE_API_KEY]")
            if api_key and api_key != "[COHERE_API_KEY]":
                try:
                    self.cohere_client = cohere.Client(api_key)
                except Exception:
                    self.cohere_client = None
    
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """Get embedding using Cohere embed-v3"""
        if not self.cohere_client:
            return None
        try:
            response = self.cohere_client.embed(
                texts=[text],
                model="embed-english-v3.0",
                input_type="search_query",
                embedding_types=["float"]
            )
            return response.embeddings.float[0]
        except Exception as e:
            print(f"Embedding error: {e}")
            return None
    
    def semantic_search(self, query: str, top_k: int = 5, client_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """True semantic search using pgvector cosine similarity"""
        db = SessionLocal()
        try:
            query_embedding = self.get_embedding(query)
            if query_embedding is None:
                # Fallback to keyword search if no embedding service
                return self._fallback_search(query, top_k)
            
            # Convert embedding to pgvector format
            embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'
            
            # Query using pgvector cosine distance operator <=> 
            sql = text("""
                SELECT 
                    content,
                    metadata,
                    1 - (embedding <=> :query_embedding::vector) AS similarity
                FROM rag_documents
                WHERE (:client_id IS NULL OR metadata->>'client_id' = :client_id)
                ORDER BY embedding <=> :query_embedding::vector
                LIMIT :top_k
            """)
            
            result = db.execute(sql, {
                "query_embedding": embedding_str,
                "client_id": client_id,
                "top_k": top_k
            })
            
            rows = result.fetchall()
            results = []
            for row in rows:
                results.append({
                    "content": row.content,
                    "metadata": json.loads(row.metadata) if isinstance(row.metadata, str) else row.metadata,
                    "similarity": float(row.similarity)
                })
            
            # Rerank with Cohere if available
            if self.cohere_client and results:
                try:
                    docs = [r["content"] for r in results]
                    rerank_response = self.cohere_client.rerank(
                        model="rerank-english-v3.0",
                        query=query,
                        documents=docs,
                        top_n=len(docs)
                    )
                    reranked = []
                    for r in rerank_response.results:
                        reranked.append(results[r.index])
                    results = reranked
                except Exception:
                    pass
            
            return results
        except Exception as e:
            print(f"Semantic search error: {e}")
            return self._fallback_search(query, top_k)
        finally:
            db.close()
    
    def _fallback_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
        """Fallback keyword search if vector DB not available"""
        query_lower = query.lower()
        scored = []
        for item in RESTAURANT_KNOWLEDGE_BASE:
            score = sum(1 for word in query_lower.split() if word in item["content"].lower())
            if score > 0:
                scored.append({
                    "content": item["content"],
                    "metadata": item["metadata"],
                    "similarity": score / 10.0
                })
        scored.sort(key=lambda x: x["similarity"], reverse=True)
        return scored[:top_k]
    
    def generate_answer(self, query: str) -> str:
        """Generate answer using RAG"""
        results = self.semantic_search(query)
        if not results:
            return "L'Étoile Dorée & Royal Pavilion at Place Vendôme, Paris celebrates haute French fine dining and royal Eastern gastronomy. You may reserve a table online or contact Concierge Alexander Vance via WhatsApp!"
        
        # Use top result
        return results[0]["content"]

rag_engine = RAGEngine()

def query_rag_engine(user_query: str) -> str:
    return rag_engine.generate_answer(user_query)
