import json
import os
import re
import yaml
from datetime import datetime
import markdown

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
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Render markdown to HTML
    html_content = markdown.markdown(data['content'])
    
    # Fix relative paths for assets
    html = html.replace('"../assets/', '"../../assets/')
    
    # Create the blog article HTML
    try:
        date_obj = datetime.strptime(data['date'], '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d-%m-%Y')
    except ValueError:
        formatted_date = data['date']
        
    article_html = f"""
    <header>
        <h2 class="h2 article-title" style="margin-bottom: 10px;">{data['title']}</h2>
        <div style="color: var(--light-gray-70); font-size: var(--fs-6); margin-bottom: 30px;">{formatted_date}</div>
    </header>
    <section class="blog-content" style="color: var(--light-gray); font-size: var(--fs-4); line-height: 1.6;">
        <style>
            .blog-content h1, .blog-content h2, .blog-content h3 {{ color: var(--white-2); margin-top: 20px; margin-bottom: 10px; }}
            .blog-content p {{ margin-bottom: 15px; }}
            .blog-content a {{ color: var(--vibrant-green); text-decoration: none; }}
            .blog-content a:hover {{ color: var(--light-gray); text-decoration: underline; }}
            .blog-content ul {{ list-style-type: disc; margin-left: 20px; margin-bottom: 15px; }}
            .blog-content ol {{ list-style-type: decimal; margin-left: 20px; margin-bottom: 15px; }}
            .blog-content li {{ margin-bottom: 5px; }}
            @media (min-width: 1024px) {{
                .blogs header {{ padding-top: 80px; }}
            }}
        </style>
        {html_content}
    </section>
    """
    
    # Replace the <article class="blogs active" ...>...</article> content
    # We find the start and end of the article
    article_pattern = re.compile(r'(<article class="blogs active" data-page="blogs">)(.*?)(</article>)', re.DOTALL)
    
    if article_pattern.search(html):
        html = article_pattern.sub(r'\1\n' + article_html + r'\n\3', html)
        
    # Also remove the Blog Modal code as it's no longer needed on the individual page
    modal_pattern = re.compile(r'<div class="modal-container" data-blog-modal-container>.*?</div>', re.DOTALL)
    html = modal_pattern.sub('', html)
    
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
