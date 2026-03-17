import os, json
import frontmatter
import markdown
from jinja2 import Template
from datetime import datetime

ARTICLES_DIR = '_articles'
OUTPUT_DIR   = 'blog/posts'
BLOG_INDEX   = 'blog/index.html'

# Template HTML d'un article (adapte les couleurs à ton portfolio)
ARTICLE_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <link id="theme-style" rel="stylesheet" href="../../assets/css/light.css">
  <link rel="stylesheet" href="../../assets/css/style.css">
  <link rel="stylesheet" href="../blog.css">
</head>
<body data-assets-prefix="../../">
  <div class="page">
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
    <header class="topbar">
      <a class="brand" href="../index.html"><span class="dot"></span> Blog</a>
    </header>
    <section class="post-hero">
      <p class="eyebrow">Article</p>
      <h1>{{ title }}</h1>
      <p class="meta">{{ date }} · {% for tag in tags %}<span class="tag">{{ tag }}</span>{% endfor %}</p>
      <p class="description">{{ description }}</p>
    </section>
    <article class="post">
      <div class="content">{{ content }}</div>
    </article>
  </div>
  <script src="../theme-blog.js"></script>
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
  <div class="page">
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

os.makedirs(OUTPUT_DIR, exist_ok=True)
articles = []

for filename in os.listdir(ARTICLES_DIR):
    if not filename.endswith('.md'):
        continue

    post = frontmatter.load(os.path.join(ARTICLES_DIR, filename))

    # Ignorer les articles non publiés
    if not post.get('published', False):
        continue

    slug    = filename.replace('.md', '')
    content = markdown.markdown(post.content, extensions=['fenced_code', 'tables', 'toc'])
    date    = str(post.get('date', ''))[:10]

    # Générer le HTML de l'article
    html = Template(ARTICLE_TEMPLATE).render(
        title=post.get('title', slug),
        date=date,
        description=post.get('description', ''),
        tags=post.get('tags', []),
        content=content
    )
    with open(f"{OUTPUT_DIR}/{slug}.html", 'w') as f:
        f.write(html)

    articles.append({
        'slug': slug, 'title': post.get('title', slug),
        'date': date, 'description': post.get('description', ''),
        'tags': post.get('tags', [])
    })
    print(f"✅ {slug}.html généré")

# Trier par date décroissante
articles.sort(key=lambda x: x['date'], reverse=True)

# Générer l'index du blog
with open(BLOG_INDEX, 'w') as f:
    f.write(Template(INDEX_TEMPLATE).render(articles=articles))

print(f"✅ blog/index.html généré ({len(articles)} articles)")
