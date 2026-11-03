# FIX PLAN - RESTAURANT SAAS SECURITY OVERHAUL

**Status:** PENDING APPROVAL  
**Priority:** CRITICAL - Security First  
**Target:** Production-ready for $10,000+ tier

## PROBLEM 1 - No Auth (CRITICAL)
**Issue:** No authentication, dashboard public, anyone can access everything

**Fix:**
- [ ] Create `backend/auth.py` - Better Auth clone with python-jose JWT (15m access, 7d refresh)
- [ ] Create `backend/dependencies.py` - `require_auth`, `require_admin` with role check
- [ ] Create `backend/routers/auth.py` - login/register/me endpoints
- [ ] Add User model updates with proper fields if needed
- [ ] Frontend: Create `frontend/src/middleware.ts` to guard `/dashboard`
- [ ] Frontend: Create `frontend/src/lib/session.ts` using httpOnly cookies via Next.js server actions (NOT localStorage)
- [ ] Protect all order/reservation endpoints to require auth, tie to `user_id = JWT sub`
- [ ] Add `user_id` foreign key to Order and Reservation models

**Security Test:** Unauthenticated GET to protected endpoint -> 401. Client can't access admin routes -> 403.

## PROBLEM 2 - CORS Wide Open (CRITICAL)
**Issue:** `allow_origins=["*"]` with credentials in backend/main.py:17-23

**Fix:**
- [ ] Update `backend/main.py`:
```python
origins = [os.getenv("FRONTEND_URL", "http://localhost:3000")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)
```
- [ ] Never use "*" 
- [ ] Add FRONTEND_URL to env

## PROBLEM 3 - FAKE RAG (CRITICAL)
**Issue:** Keyword matching in `backend/rag_chatbot.py`, not vector search

**Fix:**
- [ ] Create migration for pgvector: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Create `rag_documents` table with `embedding vector(1536)`, metadata JSON
- [ ] Update `backend/requirements.txt`: add `pgvector`, `cohere`, `openai`, `langchain`
- [ ] Replace `backend/rag_chatbot.py` with true semantic search using Cohere embed-v3
- [ ] Use `ORDER BY embedding <=> :query_embedding` (cosine similarity)
- [ ] Add reranking with Cohere rerank
- [ ] Support tenant isolation with `client_id` filter

**Test:** Query must use vector similarity, not ILIKE/keyword scoring.

## PROBLEM 4 - No Kafka/Stripe Pipeline (CRITICAL)
**Issue:** Missing async pipeline, no webhooks, order goes straight to "Paid"

**Fix:**
- [ ] Create `backend/utils/order_pipeline.py` - Kafka producer with states received->preparing->dispatched
- [ ] Create `backend/routers/webhooks.py` - Stripe webhook with signature verification
- [ ] Update Order model status flow
- [ ] Stripe webhook MUST update DB BEFORE publishing to Kafka
- [ ] Add idempotency checks
- [ ] Never collect card data in frontend - use Stripe Elements (update checkout page)
- [ ] Add stripe signature verification with HMAC

**Test:** Webhook with invalid signature -> 401. Order status updated in DB before Kafka publish.

## PROBLEM 5 - SQLite to Neon (HIGH)
**Issue:** Using SQLite, need PostgreSQL with async support

**Fix:**
- [ ] Update `backend/requirements.txt`: add `asyncpg`, `psycopg2-binary`, `alembic`
- [ ] Update `backend/database.py` for asyncpg
- [ ] Change to `postgresql+asyncpg://[NEON_URL]`
- [ ] Add connection pooling
- [ ] Enable pgvector extension support
- [ ] Add RLS considerations
- [ ] Migration strategy

## ADDITIONAL SECURITY FIXES
- [ ] Add rate limiting
- [ ] Add input validation everywhere
- [ ] Sanitize outputs
- [ ] No PII in logs
- [ ] Add security headers
- [ ] Implement proper error handling with no info leakage

## IMPLEMENTATION ORDER
1. Auth system (foundation)
2. Fix CORS
3. Update models with user_id, proper relationships
4. Secure existing endpoints
5. Add Kafka/Stripe pipeline
6. Implement true RAG with pgvector
7. Migrate to Neon/Postgres
8. Frontend auth guards

## VERIFICATION CHECKLIST
- [ ] Unauthenticated GET /api/v1/orders -> 401
- [ ] Client A JWT cannot fetch Client B order -> 403
- [ ] Admin endpoint requires role=admin -> 403 for non-admin
- [ ] CORS only allows specific origins
- [ ] No secrets hardcoded
- [ ] RAG uses vector similarity
- [ ] Stripe webhook verifies signature
- [ ] DB updated before Kafka
- [ ] No card data in frontend forms

**AWAITING APPROVAL: Type 'yes' to begin implementation.**
