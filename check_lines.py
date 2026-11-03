import os
os.chdir(r'D:\Desktop4\resturant_site')
c=open('backend/routers/webhooks.py').read()
for i,l in enumerate(c.splitlines(),1):
    if 're_digest' in l:
        print('WH:',i,l)
        break
else:
    print('no re_digest')
c2=open('backend/rag_chatbot.py').read()
for i,l in enumerate(c2.splitlines(),1):
    if 're_client' in l:
        print('RAG:',i,l)
        break
else:
    print('no re_client')
