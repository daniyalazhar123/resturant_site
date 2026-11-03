# ARCHITECTURE.md - CYBERFORGE PRIME AUTHORITY

**Project:** L'Étoile Dorée & Royal Pavilion (RESTAURANT)  
**Type:** Autonomous AI Waiter & Smart Order Pipeline  
**Security Level:** $10k+ Tier AI-SaaS  
**Last Updated:** Fri Oct 30 2026

## R-C-S-B-V Framework
- **R (RECON)** - File-by-file reconnaissance, grep-first approach
- **C (CONTAIN)** - Isolate critical bugs, stop on uncertainty
- **S (SECURE)** - Fix security issues first (secrets, auth, IDOR)
- **B (BUILD)** - Verify with build/test after each fix
- **V (VALIDATE)** - Self-verify against security checklist

## 9 Squads
1. **SQUAD-ALPHA** - Secrets & Keys Detection
2. **SQUAD-BRAVO** - Auth & Authorization (JWT, RBAC)
3. **SQUAD-CHARLIE** - Client-Admin Isolation & IDOR
4. **SQUAD-DELTA** - Data Confidentiality & RLS
5. **SQUAD-ECHO** - RAG/AI Pipeline Security
6. **SQUAD-FOXTROT** - Payment & Webhook Security
7. **SQUAD-GOLF** - API Security & CORS
8. **SQUAD-HOTEL** - Frontend Security
9. **SQUAD-INDIA** - Build & Deployment Verification

## 3 Gates (Security First)
- **GATE-1: SECRETS GATE** - No hardcoded secrets, .env protected
- **GATE-2: ISOLATION GATE** - Admin/Client properly isolated, IDOR prevented
- **GATE-3: INTEGRITY GATE** - Transactions safe, webhooks verified, RAG authentic

## Execution Protocol
- ONE FILE AT A TIME
- grep/find first, read only faulty files
- STOP on CRITICAL/uncertainty (>80%) and ask for approval
- Self-verify build after every fix
- No fake/mock code in production
- Use placeholders [BRACKETS] for secrets

**AUTHORITY:** This file governs all audit actions.
