import os
root=r'C:\Users\malco\Downloads\AmplerLauncher-Updated'
image_exts={'.png','.jpg','.jpeg','.gif','.webp','.svg'}
ignore_dirs={'node_modules','.git','mc'}
text_files=[]
for dirpath, dirnames, filenames in os.walk(root):
    rel=os.path.relpath(dirpath,root)
    if rel=='.': rel=''
    if any(part in ignore_dirs for part in rel.split(os.sep)): continue
    for fname in filenames:
        if os.path.splitext(fname)[1].lower() in image_exts: continue
        if fname.lower().endswith(('.html','.css','.js','.json','.md','.txt','.ts','.tsx','.scss','.sass','.less')):
            text_files.append(os.path.join(dirpath,fname))
img_root=os.path.join(root,'assets','images')
image_files=[]
for dirpath, dirnames, filenames in os.walk(img_root):
    for fname in filenames:
        if os.path.splitext(fname)[1].lower() in image_exts:
            image_files.append(os.path.join(dirpath,fname))
unused=[]
for img in sorted(image_files):
    fname=os.path.basename(img)
    found=False
    for tf in text_files:
        try:
            with open(tf,'r',encoding='utf-8',errors='ignore') as f:
                data=f.read()
        except:
            continue
        if fname in data:
            found=True
            break
    if not found:
        unused.append(img)
print('TEXT FILES:',len(text_files))
print('TOTAL IMAGES:',len(image_files))
print('UNUSED IMAGES:',len(unused))
for u in unused:
    print(os.path.relpath(u,root))
