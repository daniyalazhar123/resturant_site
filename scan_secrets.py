import os, re

pats = [
    r'sk-[a-zA-Z0-9]{20,}',
    r'OPENAI_API_KEY\s*=\s*[^\[\s]',
    r'COHERE_API_KEY\s*=\s*[^\[\s]',
    r'STRIPE_SECRET\s*=\s*[^\[\s]',
    r'JWT_SECRET\s*=\s*[^\[\s]',
    r'BETTER_AUTH_SECRET\s*=\s*[^\[\s]',
    r'QDRANT_API_KEY\s*=\s*[^\[\s]',
    r'GROK_API_KEY\s*=\s*[^\[\s]',
    r'NEON_DB_URL\s*=\s*[^\[\s]',
    r'gsk_[a-zA-Z0-9]+',
    r're_[a-zA-Z0-9]+',
    r'whsec_[a-zA-Z0-9]+',
    r'postgresql://[^:\[]+:[^@\[]+@'
]

found = []
for root, dirs, files in os.walk('.'):
    if any(n in root for n in ['node_modules', '.git', '__pycache__', 'venv']):
        continue
    for f in files:
        if f.endswith(('.ts', '.js', '.py', '.json')) or f.startswith('.env'):
            path = os.path.join(root, f)
            try:
                with open(path, encoding='utf-8', errors='ignore') as fh:
                    content = fh.read()
                for p in pats:
                    if re.search(p, content):
                        found.append(path)
                        break
            except:
                pass

print('COUNT:', len(found))
for x in found:
    print(x)
