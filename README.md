# L'Étoile Dorée & Royal Pavilion 🍽️✨

A high-end, luxury restaurant & gourmet takeout web application inspired by Michelin-starred fine dining and royal Mughlai culinary heritage. Located virtually at *12 Place Vendôme, Paris*.

Built as a full-stack production application combining a **Next.js 16 (React 19)** frontend with a **FastAPI (Python)** backend, featuring real-time AI dining recommendations, PCI-DSS compliant checkout, and secure table bookings.

---

## What Makes This Project Special?

- 🎨 **Cinematic Luxury UI**: Fluid motion, 3D interactive dish cards, particle backdrops, and an interactive culinary flip-book menu designed with Tailwind CSS & Framer Motion.
- 💳 **PCI-DSS (SAQ-A) Compliant Checkout**: Zero raw credit card collection on our servers. All payments redirect to end-to-end encrypted Stripe Hosted Checkout sessions.
- 🛡️ **Hardened Backend Security**:
  - Fail-fast environment variable checks for high-entropy JWT secrets and Stripe webhook signatures.
  - HttpOnly, Strict, and Secure cookie architecture.
  - Per-IP rate limiting powered by `slowapi` to protect auth and AI routes from brute-force and Denial-of-Wallet (DoW) attacks.
  - Strict Pydantic v2 schemas validating emails, password lengths, and numeric parameters.
- 🤖 **AI Sommelier & Concierge**: An embedded RAG (Retrieval-Augmented Generation) knowledge engine ready to answer dining inquiries and suggest wine/course pairings.
- 📜 **GDPR Ready**: Dedicated data export (`/api/v1/auth/me/export`) and self-service account erasure (`DELETE /api/v1/auth/me`) endpoints, alongside clear Privacy Policy and Terms of Service.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Zod |
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2, Slowapi |
| **Database & Cache** | SQLite (Dev) / PostgreSQL (Prod), Redis (optional for rate-limit storage) |
| **Payments** | Stripe Checkout Sessions & Webhooks |
| **AI / Search** | Cohere Embeddings + Vector Similarity fallback |

---

## Project Structure

```text
resturant_site/
├── backend/
│   ├── auth.py              # JWT authentication & password hashing
│   ├── database.py          # SQLAlchemy engine & session setup
│   ├── dependencies.py      # Route guards & user extraction
│   ├── main.py              # FastAPI app & middleware setup
│   ├── models.py            # Database tables (Users, Orders, Reservations, Menu)
│   ├── rate_limit.py        # Shared Slowapi limiter instance
│   ├── requirements.txt     # Python dependencies
│   ├── schemas.py           # Pydantic v2 validation models
│   └── routers/             # API routes (auth, orders, reservations, menu, chatbot, webhooks)
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router (pages, layout, legal policies)
    │   ├── components/      # UI components (MenuBook, HeroCinematic, CardStack3D, etc.)
    │   ├── lib/             # Utility helpers & Zod-validated cart store
    │   └── proxy.ts         # Edge route protection & JWT verification
    ├── next.config.ts       # Security headers (CSP, HSTS, X-Frame-Options) & API rewrites
    └── package.json
```

---

## Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/daniyalazhar123/resturant_site.git
cd resturant_site
```

### 2. Backend Setup
1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
2. Install the backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Set up your backend environment variables:
   - Copy `backend/.env.example` to `backend/.env`.
   - Ensure `JWT_SECRET` is set to a secure string of at least 32 characters.
4. Launch the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
   *The backend documentation will be accessible at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 3. Frontend Setup
1. Open a new terminal window and navigate to `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Configure frontend environment variables:
   - Copy `frontend/.env.example` to `frontend/.env.local`.
   - Keep the `JWT_SECRET` synced with your backend secret.
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Visit [http://localhost:3000](http://localhost:3000) to view the luxury dining experience.*

---

## Security & Contribution Notes

- **Never commit `.env` or `.env.local` files**: All secrets and credential files are strictly ignored via `.gitignore`.
- **Authoritative Pricing**: Menu dish prices and totals are computed strictly on the backend to prevent client-side cart tampering.
- Pull requests are always welcome! If you're submitting a bug fix or new feature, please ensure all types and linting checks pass.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
