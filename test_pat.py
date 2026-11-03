import re
s = '    stripe_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "[STRIPE_WEBHOOK_SECRET]")'
p = r'STRIPE_WEBHOOK_SECRET\s*=\s*[^\[\s]'
m = re.search(p, s)
print('yes' if m else 'no')
