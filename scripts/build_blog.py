import os, re, json, shutil
import frontmatter
import markdown
from jinja2 import Template
from datetime import datetime

TOC_DEPTH = '1'

ARTICLES_DIR = '_articles'
OUTPUT_DIR   = 'blog/posts'
BLOG_INDEX   = 'blog/index.html'
IMAGES_SRC   = '_articles/images'
IMAGES_DST   = 'blog/images'

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(IMAGES_DST, exist_ok=True)

# ── Copier les images vers blog/images/ ───────────────────────────────────────
if os.path.exists(IMAGES_SRC):
    for f in os.listdir(IMAGES_SRC):
        src_path = os.path.join(IMAGES_SRC, f)
        dst_path = os.path.join(IMAGES_DST, f)
        if os.path.isfile(src_path):
            shutil.copy2(src_path, dst_path)
            print(f"📸 {f}")

# ── Convertir la syntaxe Obsidian ![[image.png|caption]] → HTML ───────────────
def convert_obsidian_images(text):
    pattern = r'!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]'
    def replace(m):
        filename = m.group(1).strip()
        caption  = m.group(2).strip() if m.group(2) else ''
        return (
            f'<figure class="article-figure">'
            f'<img src="../images/{filename}" alt="{caption}" style="max-width:100%;border-radius:6px">'
            f'{"<figcaption>" + caption + "</figcaption>" if caption else ""}'
            f'</figure>'
        )
    return re.sub(pattern, replace, text)

# ── Templates HTML ────────────────────────────────────────────────────────────
ARTICLE_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <link id="theme-style" rel="stylesheet" href="../../assets/css/light.css">
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="stylesheet" href="../blog.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">

  <!-- Image zoom -->
  <style>
  .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      z-index: 9999;
      cursor: zoom-out;
      align-items: center;
      justify-content: center;
  }
  .modal-overlay.active {
      display: flex;
  }
  .modal-overlay img {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 6px;
      object-fit: contain;
      cursor: default;
  }
  .modal-close {
      position: fixed;
      top: 16px; right: 20px;
      color: white;
      font-size: 28px;
      cursor: pointer;
      background: none;
      border: none;
      line-height: 1;
      opacity: 0.8;
  }
  .modal-close:hover { opacity: 1; }
  .article-figure img {
      cursor: zoom-in;
      transition: opacity 0.15s;
  }
  .article-figure img:hover { opacity: 0.85; }
  </style>
</head>
<body data-assets-prefix="../../">
    <nav class="blog-nav">
      <div class="header d-flex flex-column">
        <a class="name-link" href="../../index.html">
          <h1 id="name">Maguette Diop</h1>
          <small>DevOps - SysAdmin</small>
        </a>
      </div>
      <div class="nav-right">
        <a class="back" href="../../index.html">Portfolio</a>
        <a class="back" href="../index.html">Blog</a>
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Changer de thème">
          <img id="theme-icon" src="../../assets/icons/moon.png" alt="">
        </button>
      </div>
    </nav>
  <div class="page">
    <header class="topbar">
      <a class="brand" href="../index.html"><span class="dot"></span> Blog</a>
    </header>
    <section class="post-hero">
      <p class="eyebrow">Article</p>
      <h1>{{ title }}</h1>
      <p class="description">{{ description }}</p>
      <p class="meta">
        <span class="date">{{ date }}</span>
        {% for tag in tags %}<span class="tag">{{ tag }}</span>{% endfor %}
      </p>
    </section>
    <article class="post">
      {% if toc %}
      <div class="toc-box">
        {{ toc }}
      </div>
      {% endif %}
      <div class="content">{{ content }}</div>
    </article>
  </div>
  <script src="../theme-blog.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>

  <!-- Copy code -->
  <script>
  document.querySelectorAll('pre code').forEach(block => {
      const pre = block.parentElement;
      pre.style.position = 'relative';

      const btn = document.createElement('button');
      btn.innerText = 'Copier';
      btn.style.cssText = `
          position: absolute; top: 10px; right: 10px;
          background: #2E75B6; color: white;
          border: none; border-radius: 4px;
          padding: 3px 10px; font-size: 12px;
          cursor: pointer; opacity: 0;
          transition: opacity 0.2s;
      `;

      pre.addEventListener('mouseenter', () => btn.style.opacity = '1');
      pre.addEventListener('mouseleave', () => btn.style.opacity = '0');

      btn.addEventListener('click', () => {
          navigator.clipboard.writeText(block.innerText).then(() => {
              btn.innerText = '✓ Copié';
              btn.style.background = '#27ae60';
              setTimeout(() => {
                  btn.innerText = 'Copier';
                  btn.style.background = '#2E75B6';
              }, 2000);
          });
      });

      pre.appendChild(btn);
  });
  </script>

  <!-- Image modal -->
  <div class="modal-overlay" id="imgModal">
      <button class="modal-close" id="modalClose">✕</button>
      <img id="modalImg" src="" alt="">
  </div>

  <script>
  const modal    = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.getElementById('modalClose');

  // Ouvrir au clic sur n'importe quelle image de l'article
  document.querySelectorAll('.content img').forEach(img => {
      img.addEventListener('click', () => {
          modalImg.src = img.src;
          modalImg.alt = img.alt;
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
      });
  });

  // Fermer en cliquant sur l'overlay ou le bouton ✕
  modal.addEventListener('click', (e) => {
      if (e.target !== modalImg) closeModal();
  });
  closeBtn.addEventListener('click', closeModal);

  // Fermer avec Échap
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
  }
  </script>
</body>
</html>"""

INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Blog</title>
  <link id="theme-style" rel="stylesheet" href="../assets/css/light.css">
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="stylesheet" href="blog.css">
</head>
<body data-assets-prefix="../">
  <nav class="blog-nav">
    <div class="header d-flex flex-column">
      <a class="name-link" href="../index.html">
        <h1 id="name">Maguette Diop</h1>
        <small>DevOps - SysAdmin</small>
      </a>
    </div>
    <div class="nav-right">
      <a class="back" href="../index.html">Portfolio</a>
      <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Changer de thème">
        <img id="theme-icon" src="../assets/icons/moon.png" alt="">
      </button>
    </div>
  </nav>
  <div class="page">
    <header class="topbar">
      <a class="brand" href="../index.html"><span class="dot"></span> Blog</a>
    </header>
    <section class="hero">
      <p class="eyebrow">Blog</p>
      <h1>Notes & retours d'expérience</h1>
      <p class="subtitle">Découvrez mes expérimentations DevOps, mes pipelines CI/CD et les leçons apprises en production.</p>
    </section>
    <div class="articles-list">
      {% for article in articles %}
      <a href="posts/{{ article.slug }}.html" class="article-card">
        <h2>{{ article.title }}</h2>
        <p class="meta">{{ article.date }}</p>
        <p>{{ article.description }}</p>
        <div>{% for tag in article.tags %}<span class="tag">{{ tag }}</span>{% endfor %}</div>
      </a>
      {% endfor %}
    </div>
  </div>
  <script src="theme-blog.js"></script>
</body>
</html>"""

# ── Génération des articles ───────────────────────────────────────────────────
articles = []

def preserve_blank_lines(text):
    """Convertit les lignes vides multiples en <br> pour les préserver."""
    # Remplace 2+ lignes vides par un paragraphe vide explicite
    text = re.sub(r'\n{3,}', '\n\n&nbsp;\n\n', text)
    return text

for filename in os.listdir(ARTICLES_DIR):
    if not filename.endswith('.md'):
        continue

    post = frontmatter.load(os.path.join(ARTICLES_DIR, filename))

    # Ignorer les articles non publiés
    if not post.get('published', False):
        print(f"⏭️  Ignoré (non publié) : {filename}")
        continue

    slug = filename.replace('.md', '')
    date = str(post.get('date', ''))[:10]

    raw_content = convert_obsidian_images(post.content)
    raw_content = preserve_blank_lines(raw_content)

    md = markdown.Markdown(
        extensions=[
            'fenced_code',
            'codehilite', 
            'tables',
            'toc',
            'nl2br'
        ],
        extension_configs={
            'toc': {
                'toc_depth': TOC_DEPTH,
                'title': 'Sommaire',
            },
            'codehilite': {
                'use_pygments': False
            }
        }
    )
    
    content = md.convert(raw_content)
    toc = md.toc

    # 3. Générer le fichier HTML de l'article
    html = Template(ARTICLE_TEMPLATE).render(
        title=post.get('title', slug),
        date=date,
        description=post.get('description', ''),
        tags=post.get('tags', []),
        content=content,
        toc=toc
    )

    out_path = os.path.join(OUTPUT_DIR, f"{slug}.html")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    articles.append({
        'slug':        slug,
        'title':       post.get('title', slug),
        'date':        date,
        'description': post.get('description', ''),
        'tags':        post.get('tags', [])
    })
    print(f"✅ {slug}.html généré")

# ── Génération de l'index du blog ─────────────────────────────────────────────
articles.sort(key=lambda x: x['date'], reverse=True)

with open(BLOG_INDEX, 'w', encoding='utf-8') as f:
    f.write(Template(INDEX_TEMPLATE).render(articles=articles))

print(f"\n✅ blog/index.html généré ({len(articles)} article(s))")