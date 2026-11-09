import os
from typing import Optional
from openai import OpenAI


class SyncRAGAgent:
    """
    Synchronous RAG Agent powered by Groq's Chat Completions API via OpenAI SDK.
    Designed for Michelin-starred luxury restaurant concierge recommendations.
    """

    def __init__(self, api_key: Optional[str] = None):
        key = api_key or os.getenv("GROQ_API_KEY", "").strip()
        self.client = OpenAI(
            api_key=key,
            base_url="https://api.groq.com/openai/v1",
        ) if key else None
        self.model = "llama-3.3-70b-versatile"
        self.system_prompt = (
            "You are the distinguished Head Concierge & Sommelier of L'Étoile Dorée & Royal Pavilion, "
            "a Michelin-starred haute gastronomie destination at 12 Place Vendôme, Paris. "
            "You speak with refined, polished elegance, warmth, and absolute culinary precision. "
            "Always utilize the provided culinary and cellar knowledge base context to provide accurate answers. "
            "Highlight food allergens (EU 1169/2011), cooking alchemy (Dum Pukht, live olive wood charcoal, French butter poaching), "
            "and prestigious wine pairings. Never invent menu items or prices outside the authoritative context."
        )

    def run(self, user_query: str, retrieved_context: str) -> str:
        """
        Execute completion against Groq LLaMA-3.3-70B using authoritative retrieved context.
        """
        if not self.client:
            return (
                "L'Étoile Dorée & Royal Pavilion welcomes your inquiry. Our automated concierge is "
                "currently offline, but our Maître d' at 12 Place Vendôme, Paris is delighted to host you."
            )

        messages = [
            {"role": "system", "content": self.system_prompt},
            {
                "role": "user",
                "content": (
                    f"Authoritative Context from our Kitchen & Cellar Archives:\n{retrieved_context}\n\n"
                    f"Guest Inquiry: {user_query}\n\n"
                    "Please provide a gracious, accurate concierge guidance tailored to the guest."
                ),
            },
        ]

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.3,
                max_tokens=600,
            )
            return response.choices[0].message.content.strip()
        except Exception as exc:
            return f"Concierge service temporarily unavailable: {exc}"
