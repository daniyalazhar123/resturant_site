import re, os
os.chdir(r'D:\Desktop4\resturant_site')
c=open('./backend/routers/webhooks.py').read()
# look for whsec pattern
m = re.search(r'whsec_[a-zA-Z0-9]+', c)
if m:
    print('FOUND whsec:', m.group())
else:
    print('no whsec')
# look for STRIPE_SECRET
m2 = re.search(r'STRIPE_SECRET\s*=\s*([^\n]+)', c)
if m2:
    print('STRIPE_SECRET:', m2.group(1))
# look for patterns
for line in c.splitlines():
    if 'whsec' in line or 'stripe_secret' in line.lower() or 'STRIPE' in line:
        print('LINE:', repr(line))
