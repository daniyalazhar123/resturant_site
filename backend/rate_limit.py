"""Shared slowapi limiter with trusted reverse proxy client IP detection."""
import os
from fastapi import Request
from slowapi import Limiter


def get_trusted_client_ip(request: Request) -> str:
    """
    Extract the real client IP address behind reverse proxies (Next.js, Nginx, Cloudflare).
    Reads the first comma-separated address from X-Forwarded-For if present,
    falling back to the client host IP.
    """
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
        if client_ip:
            return client_ip

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()

    if request.client and request.client.host:
        return request.client.host

    return "127.0.0.1"


# Uses Redis when RATE_LIMIT_STORAGE_URI is set (e.g. redis://localhost:6379/0),
# otherwise falls back to in-memory storage for local development.
limiter = Limiter(
    key_func=get_trusted_client_ip,
    storage_uri=os.getenv("RATE_LIMIT_STORAGE_URI", "memory://"),
)
