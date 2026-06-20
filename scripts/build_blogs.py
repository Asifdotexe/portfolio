import os
import glob
import json
import frontmatter
import markdown
from bs4 import BeautifulSoup
import re

def build_blogs():
    blogs_dir = '_blogs'
    output_dir = 'blogs'
    base_template_path = 'index.html'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    md = markdown.Markdown(extensions=['fenced_code', 'codehilite', 'tables'])
    
    with open(base_template_path, 'r', encoding='utf-8') as f:
        base_html = f.read()
        
    blogs = []
    
    # Process each markdown file
    for filepath in glob.glob(os.path.join(blogs_dir, '*.md')):
        with open(filepath, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            
        slug = os.path.splitext(os.path.basename(filepath))[0]
        title = post.get('title', slug)
        date = post.get('date', '')
        description = post.get('description', '')
        
        # Convert markdown to html
        html_content = md.convert(post.content)
        
        blogs.append({
            'slug': slug,
            'title': title,
            'date': date,
            'description': description,
            'html_content': html_content
        })
        
        # Create individual blog endpoint
        blog_output_dir = os.path.join(output_dir, slug)
        if not os.path.exists(blog_output_dir):
            os.makedirs(blog_output_dir)
            
        soup = BeautifulSoup(base_html, 'html.parser')
        
        # Update title and meta
        if soup.title:
            soup.title.string = f"{title} | Asif Sayyed Portfolio"
        
        # Update active nav link
        for nav_link in soup.find_all('a', class_='navbar-link'):
            nav_link['class'] = [c for c in nav_link.get('class', []) if c != 'active']
            if nav_link.text.lower() == 'events': # Temp, we'll replace the nav entirely later
                pass
                
        # Inject blog content
        article = soup.find('article')
        if article:
            article['class'] = 'blogs active'
            article['data-page'] = 'blog-post'
            article.clear()
            
            header = soup.new_tag('header')
            h2 = soup.new_tag('h2', attrs={'class': 'h2 article-title'})
            h2.string = title
            header.append(h2)
            
            section = soup.new_tag('section', attrs={'class': 'blog-content-section'})
            
            # The back button
            back_btn = soup.new_tag('a', href='/blogs/', attrs={'class': 'blog-back-btn', 'style': 'display: inline-block; margin-bottom: 20px; color: var(--vibrant-green); text-decoration: none;'})
            back_btn.string = '← Back to Blogs'
            section.append(back_btn)
            
            # The content
            content_div = soup.new_tag('div', attrs={'class': 'blog-post-content'})
            content_div.append(BeautifulSoup(html_content, 'html.parser'))
            section.append(content_div)
            
            article.append(header)
            article.append(section)
            
        blog_html = str(soup).replace('../assets/', '../../assets/')
            
        with open(os.path.join(blog_output_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(blog_html)
            
    # Now generate the main /blogs/index.html
    soup = BeautifulSoup(base_html, 'html.parser')
    
    # Update title and meta
    if soup.title:
        soup.title.string = "Blogs | Asif Sayyed Portfolio"
        
    # Update active nav link
    for nav_link in soup.find_all('a', class_='navbar-link'):
        nav_link['class'] = [c for c in nav_link.get('class', []) if c != 'active']
        if 'blogs' in nav_link.text.lower():
            nav_link['class'].append('active')
    
    article = soup.find('article')
    if article:
        article['class'] = 'blogs active'
        article['data-page'] = 'blogs'
        article.clear()
        
        header = soup.new_tag('header')
        h2 = soup.new_tag('h2', attrs={'class': 'h2 article-title'})
        h2.string = 'Blogs'
        header.append(h2)
        
        section = soup.new_tag('section', attrs={'class': 'blogs'})
        
        list_container = soup.new_tag('div', attrs={'class': 'pf-v6-c-simple-list'})
        ul = soup.new_tag('ul', attrs={'class': 'pf-v6-c-simple-list__list', 'role': 'list'})
        
        for blog in blogs:
            li = soup.new_tag('li', attrs={'class': 'pf-v6-c-simple-list__item'})
            btn = soup.new_tag('button', attrs={
                'class': 'pf-v6-c-simple-list__item-link', 
                'type': 'button',
                'data-blog-slug': blog['slug'],
                'onclick': f"openBlogModal('{blog['slug']}')"
            })
            btn.string = blog['title']
            li.append(btn)
            ul.append(li)
            
        list_container.append(ul)
        section.append(list_container)
        
        article.append(header)
        article.append(section)
        
        # Add modal HTML
        modal_html = """
        <div id="blog-modal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg-color, #1e1e1f); z-index: 9999; overflow-y: auto;">
            <div class="modal-content" style="max-width: 800px; margin: 0 auto; padding: 40px 20px; color: var(--light-gray);">
                <button onclick="closeBlogModal()" style="display: inline-block; margin-bottom: 20px; color: var(--vibrant-green, #00ff00); background: none; border: none; cursor: pointer; font-size: 16px; font-weight: bold;">← Back to Blogs</button>
                <div id="blog-modal-body"></div>
            </div>
        </div>
        """
        modal_soup = BeautifulSoup(modal_html, 'html.parser')
        soup.body.append(modal_soup)
        
        # Add JS script
        script_js = """
        <script>
            let blogData = null;
            
            async function loadBlogData() {
                if (!blogData) {
                    const response = await fetch('/assets/data/blogs.json');
                    blogData = await response.json();
                }
            }
            
            async function openBlogModal(slug) {
                await loadBlogData();
                const blog = blogData.find(b => b.slug === slug);
                if (blog) {
                    document.getElementById('blog-modal-body').innerHTML = '<h2 style="margin-bottom: 20px; font-size: 2em; color: white;">' + blog.title + '</h2>' + blog.html_content;
                    document.getElementById('blog-modal').style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    window.history.pushState({slug: slug}, blog.title, '/blogs/' + slug + '/');
                }
            }
            
            function closeBlogModal() {
                document.getElementById('blog-modal').style.display = 'none';
                document.body.style.overflow = '';
                window.history.pushState({}, 'Blogs', '/blogs/');
            }
            
            window.addEventListener('popstate', function(event) {
                if (window.location.pathname === '/blogs/') {
                    document.getElementById('blog-modal').style.display = 'none';
                    document.body.style.overflow = '';
                } else {
                    // Note: if they go to /blogs/slug/ via back button, we could technically re-open modal.
                    // But if it's a full page load, the actual /blogs/slug/index.html will load.
                }
            });
        </script>
        """
        script_soup = BeautifulSoup(script_js, 'html.parser')
        soup.body.append(script_soup)
        
    with open(os.path.join(output_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(str(soup))
        
    # Write JSON for dynamic loading if needed
    os.makedirs('assets/data', exist_ok=True)
    with open('assets/data/blogs.json', 'w', encoding='utf-8') as f:
        # Avoid saving full HTML to json if it gets big, but for dynamic popout it might be easiest
        json.dump(blogs, f, indent=4)

if __name__ == '__main__':
    build_blogs()
