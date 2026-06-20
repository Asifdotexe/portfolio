import json
import os
import re
import yaml
from datetime import datetime

BLOGS_DIR = "_blogs"
OUTPUT_FILE = "assets/data/blogs.json"
TEMPLATE_FILE = "blogs/index.html"

def generate_slug(title, date_str):
    # Remove apostrophes completely
    clean_title = title.lower().replace("'", "").replace('"', '')
    slug_title = re.sub(r'[^a-z0-9]+', '-', clean_title).strip('-')
    
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d-%m-%Y')
    except ValueError:
        formatted_date = date_str
        
    return f"{slug_title}-{formatted_date}"

def parse_markdown(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    file_id = os.path.splitext(os.path.basename(file_path))[0]
    
    meta = {
        "id": file_id.lower(),
        "title": file_id.replace("-", " ").title(),
        "date": datetime.today().strftime('%Y-%m-%d'),
        "category": "Blog"
    }

    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", content, re.DOTALL)

    if match:
        try:
            frontmatter = yaml.safe_load(match.group(1)) or {}
            for key, value in frontmatter.items():
                meta[key] = str(value)
        except yaml.YAMLError:
            pass

        return {**meta, "content": match.group(2).strip()}
    
    return {**meta, "content": content.strip()}

def generate_html(data, slug):
    # Pass raw markdown to client side for marked.js to render
    raw_content_json = json.dumps(data['content'])
    
    try:
        date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
        formatted_date = date_obj.strftime('%b %d, %Y')
    except ValueError:
        formatted_date = data['date']
        
    html = f"""<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data['title']} | Asif Sayyed</title>
    <meta name="description" content="{data['title']} - Blog post by Asif Sayyed">
    
    <!-- Google Fonts for Editorial Brutalism -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    
    <!-- Prism.js for syntax highlighting -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    
    <style>
        :root {{
            --bg-color: #0d0d0d;
            --text-main: #e0e0e0;
            --text-muted: #888888;
            --accent: hsl(45, 100%, 72%); /* Keeping portfolio accent or switching to vibrant green */
            /* Using vibrant green to match portfolio */
            --vibrant-green: hsl(120, 100%, 75%);
            --border-color: #333333;
            --font-display: 'Space Grotesk', sans-serif;
            --font-body: 'EB Garamond', serif;
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: var(--font-body);
            font-size: 1.125rem;
            line-height: 1.7;
            -webkit-font-smoothing: antialiased;
        }}
        
        /* Navigation */
        nav {{
            padding: 2rem 5%;
            border-bottom: 1px solid var(--border-color);
            font-family: var(--font-display);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.85rem;
        }}
        
        nav a {{
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.3s ease;
        }}
        
        nav a:hover {{
            color: var(--vibrant-green);
        }}
        
        /* Brutalist Header */
        header {{
            padding: 10vh 5% 8vh;
            border-bottom: 1px solid var(--border-color);
            position: relative;
        }}
        
        header::before {{
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 8px;
            background-color: var(--vibrant-green);
        }}
        
        .header-content {{
            max-width: 900px;
            margin: 0 auto;
        }}
        
        h1.title {{
            font-family: var(--font-display);
            font-size: clamp(2.5rem, 5vw, 5rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: #ffffff;
            letter-spacing: -0.02em;
        }}
        
        .meta {{
            font-family: var(--font-display);
            color: var(--text-muted);
            font-size: 0.9rem;
            display: flex;
            gap: 2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        /* Content Layout */
        main {{
            padding: 4rem 5% 8rem;
        }}
        
        article {{
            max-width: 65ch;
            margin: 0 auto;
        }}
        
        /* Markdown Styling */
        article h1, article h2, article h3, article h4 {{
            font-family: var(--font-display);
            color: #ffffff;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.3;
        }}
        
        article h2 {{
            font-size: 2rem;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.5rem;
        }}
        
        article h3 {{
            font-size: 1.5rem;
        }}
        
        article p {{
            margin-bottom: 1.5rem;
        }}
        
        article a {{
            color: var(--vibrant-green);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s ease;
        }}
        
        article a:hover {{
            border-bottom-color: var(--vibrant-green);
        }}
        
        article ul, article ol {{
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }}
        
        article li {{
            margin-bottom: 0.5rem;
        }}
        
        article blockquote {{
            border-left: 4px solid var(--vibrant-green);
            padding-left: 1.5rem;
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 1.5rem;
            font-style: italic;
            color: var(--text-muted);
        }}
        
        article pre {{
            background: #1a1a1a;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 1.5rem;
            overflow-x: auto;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
        }}
        
        article code {{
            background: #1a1a1a;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 0.9em;
            color: var(--vibrant-green);
        }}
        
        article pre code {{
            background: transparent;
            padding: 0;
            color: inherit;
        }}
        
        article img {{
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 2rem 0;
            display: block;
        }}
        
        article hr {{
            border: 0;
            height: 1px;
            background: var(--border-color);
            margin: 3rem 0;
        }}
        
        article table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
        }}
        
        article th, article td {{
            border: 1px solid var(--border-color);
            padding: 0.75rem 1rem;
            text-align: left;
        }}
        
        article th {{
            background: #1a1a1a;
            font-family: var(--font-display);
        }}
        
    </style>
</head>
<body>

    <nav>
        <a href="../../index.html">&larr; Back to Portfolio</a>
    </nav>
    
    <header>
        <div class="header-content">
            <h1 class="title">{data['title']}</h1>
            <div class="meta">
                <span>{formatted_date}</span>
                <span>{data.get('category', 'Blog')}</span>
            </div>
        </div>
    </header>
    
    <main>
        <article id="rendered-content">
            <!-- Markdown content will be injected here -->
        </article>
    </main>
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>
    
    <script>
        const rawContent = {raw_content_json};
        
        // Configure marked to use Prism for syntax highlighting
        marked.setOptions({{
            highlight: function(code, lang) {{
                if (Prism.languages[lang]) {{
                    return Prism.highlight(code, Prism.languages[lang], lang);
                }} else {{
                    return code;
                }}
            }}
        }});
        
        document.getElementById('rendered-content').innerHTML = marked.parse(rawContent);
    </script>
</body>
</html>
"""
    
    # Write to directory
    blog_dir = os.path.join("blogs", slug)
    if not os.path.exists(blog_dir):
        os.makedirs(blog_dir)
        
    with open(os.path.join(blog_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)


def main():
    if not os.path.exists(BLOGS_DIR):
        os.makedirs(BLOGS_DIR)

    blogs_data = []

    for entry in os.listdir(BLOGS_DIR):
        if entry.endswith(".md"):
            full_path = os.path.join(BLOGS_DIR, entry)
            data = parse_markdown(full_path)
            
            # Format the date if it exists
            if 'date' in data:
                try:
                    date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
                    data['formattedDate'] = date_obj.strftime('%b %d, %Y')
                except ValueError:
                    data['formattedDate'] = data['date']
            
            slug = generate_slug(data['title'], data['date'])
            data['slug'] = slug
            
            # Remove content from JSON to save space, since it will be hosted on static pages
            blog_meta = {k: v for k, v in data.items() if k != 'content'}
            blogs_data.append(blog_meta)
            
            generate_html(data, slug)
            
    # Sort by date descending
    blogs_data.sort(key=lambda x: x.get('date', ''), reverse=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(blogs_data, f, indent=2)

    print(f"Build complete! Data written to {OUTPUT_FILE} and individual HTML pages generated.")

if __name__ == "__main__":
    main()
