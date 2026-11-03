import re, os
os.chdir(r'D:\Desktop4\resturant_site')
files = ['./backend/auth.py','./backend/routers/webhooks.py','./backend/rag_chatbot.py']
pats = [r'sk-[a-zA-Z0-9]{20,}',r'OPENAI_API_KEY\s*=\s*[^\[\s]',r'COHERE_API_KEY\s*=\s*[^\[\s]',r'STRIPE_SECRET\s*=\s*[^\[\s]',r'JWT_SECRET\s*=\s*[^\[\s]',r'BETTER_AUTH_SECRET\s*=\s*[^\[\s]',r'QDRANT_API_KEY\s*=\s*[^\[\s]',r'GROK_API_KEY\s*=\s*[^\[\s]',r'NEON_DB_URL\s*=\s*[^\[\s]',r'gsk_[a-zA-Z0-9]+',r're_[a-zA-Z0-9]+',r'whsec_[a-zA-Z0-9]+']
for f in files:
    c=open(f).read()
    bad=False
    for p in pats:
        if re.search(p,c):
            bad=True
            break
    print(f + ':' + ('BAD' if bad else 'OK'))
