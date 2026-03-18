import os, re, shutil

ARTICLES_DIR  = '_articles'
VAULT_ATTACHMENTS = '/home/jiem/Documents/ObsidianNotes/Assets/Attachments'
IMAGES_DST    = '_articles/images'

os.makedirs(IMAGES_DST, exist_ok=True)

# Scanner tous les .md dans _articles/
pattern = r'!\[\[([^\]|]+?)(?:\|[^\]]*)?\]\]'
copied, missing = [], []

for filename in os.listdir(ARTICLES_DIR):
    if not filename.endswith('.md'):
        continue
    
    filepath = os.path.join(ARTICLES_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    images = re.findall(pattern, content)
    
    for img in images:
        img = img.strip()
        src = os.path.join(VAULT_ATTACHMENTS, img)
        dst = os.path.join(IMAGES_DST, img)
        
        if os.path.exists(src):
            shutil.copy2(src, dst)
            copied.append(img)
            print(f"  ✅ {img}")
        else:
            missing.append(img)
            print(f"  ⚠️  Introuvable : {img}")

print(f"\n📸 {len(copied)} image(s) copiée(s)")
if missing:
    print(f"❌ {len(missing)} image(s) manquante(s) : {missing}")