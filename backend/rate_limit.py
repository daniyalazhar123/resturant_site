"""Shared slowapi limiter (kept separate from main.py to avoid circular imports)."""
import os
from slowapi import Limiter
from slowapi.util import get_remote_address

# Uses Redis when RATE_LIMIT_STORAGE_URI is set (e.g. redis://localhost:6379/0),
# otherwise falls back to in-memory storage for local development.
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=os.getenv("RATE_LIMIT_STORAGE_URI", "memory://"),
)
