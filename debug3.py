import re, os
os.chdir(r'D:\Desktop4\resturant_site')
c=open('./backend/routers/webhooks.py').read()
pats = [r'sk-[a-zA-Z0-9]{20,}',r'OPENAI_API_KEY\s*=\s*[^\[\s]',r'COHERE_API_KEY\s*=\s*[^\[\s]',r'STRIPE_SECRET\s*=\s*[^\[\s]',r'JWT_SECRET\s*=\s*[^\[\s]',r'BETTER_AUTH_SECRET\s*=\s*[^\[\s]',r'QDRANT_API_KEY\s*=\s*[^\[\s]',r'GROK_API_KEY\s*=\s*[^\[\s]',r'NEON_DB_URL\s*=\s*[^\[\s]',r'gsk_[a-zA-Z0-9]+',r're_[a-zA-Z0-9]+',r'whsec_[a-zA-Z0-9]+',r'postgresql://[^:\[]+:[^@\[]+@']
for p in pats:
    m=re.search(p,c)
    if m:
        print('MATCH')
        print(p)
        print(repr(m.group()))
        break
else:
    print('none')
