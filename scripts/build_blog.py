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
  <link rel="stylesheet" href="../../style.css">
  <link rel="stylesheet" href="../blog.css">
</head>
<body>
  <nav><a href="../../index.html">← Portfolio</a> / <a href="../index.html">Blog</a></nav>
  <article>
    <header>
      <h1>{{ title }}</h1>
      <p class="meta">{{ date }} · {% for tag in tags %}<span class="tag">{{ tag }}</span>{% endfor %}</p>
      <p class="description">{{ description }}</p>
    </header>
    <div class="content">{{ content }}</div>
  </article>
</body>
</html>"""

INDEX_TEMPLATE = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Blog</title>
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="blog.css">
</head>
<body>
  <nav><a href="../index.html">← Portfolio</a></nav>
  <h1>Articles</h1>
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

