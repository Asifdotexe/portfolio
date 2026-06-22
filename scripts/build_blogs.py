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
            
        # Update meta tags
        for meta in soup.find_all('meta'):
            if meta.get('name') in ['title', 'twitter:title']:
                meta['content'] = f"{title} | Asif Sayyed Portfolio"
            elif meta.get('property') == 'og:title':
                meta['content'] = f"{title} | Asif Sayyed Portfolio"
            elif meta.get('name') in ['description', 'twitter:description']:
                meta['content'] = description
            elif meta.get('property') == 'og:description':
                meta['content'] = description
            elif meta.get('property') == 'og:url':
                meta['content'] = f"https://sayyedasif.com/blogs/{slug}/"
                
        # Update canonical
        canonical = soup.find('link', rel='canonical')
        if canonical:
            canonical['href'] = f"https://sayyedasif.com/blogs/{slug}/"
        
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
            
            if date:
                date_div = soup.new_tag('div', attrs={'style': 'color: var(--light-gray-70); font-size: 14px; margin-bottom: 20px;'})
                date_div.string = f"Published: {date}"
                section.append(date_div)
            
            # The content
            content_div = soup.new_tag('div', attrs={'class': 'blog-post-content'})
            content_div.append(BeautifulSoup(html_content, 'html.parser'))
            section.append(content_div)
            
            article.append(header)
            article.append(section)
            
        blog_html = str(soup).replace('./assets/', '../../assets/')
            
        with open(os.path.join(blog_output_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(blog_html)
            
    # Sort blogs by date descending
    blogs.sort(key=lambda x: x.get('date', ''), reverse=True)

    # Now generate the main /blogs/index.html
    soup = BeautifulSoup(base_html, 'html.parser')
    
    # Update title and meta
    if soup.title:
        soup.title.string = "Blogs | Asif Sayyed Portfolio"
        
    for meta in soup.find_all('meta'):
        if meta.get('name') in ['title', 'twitter:title']:
            meta['content'] = "Blogs | Asif Sayyed Portfolio"
        elif meta.get('property') == 'og:title':
            meta['content'] = "Blogs | Asif Sayyed Portfolio"
        elif meta.get('name') in ['description', 'twitter:description']:
            meta['content'] = "Read Asif Sayyed's latest articles and blogs on data science, machine learning, and programming."
        elif meta.get('property') == 'og:description':
            meta['content'] = "Read Asif Sayyed's latest articles and blogs on data science, machine learning, and programming."
        elif meta.get('property') == 'og:url':
            meta['content'] = "https://sayyedasif.com/blogs/"
            
    canonical = soup.find('link', rel='canonical')
    if canonical:
        canonical['href'] = "https://sayyedasif.com/blogs/"
        
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
            a_tag = soup.new_tag('a', href=f"../blogs/{blog['slug']}/", attrs={
                'class': 'pf-v6-c-simple-list__item-link'
            })
            if blog['date']:
                title_span = soup.new_tag('span')
                title_span.string = blog['title']
                date_span = soup.new_tag('span', attrs={'style': 'color: var(--light-gray-70); font-size: 12px; margin-left: 10px;'})
                date_span.string = blog['date']
                a_tag.append(title_span)
                a_tag.append(date_span)
            else:
                a_tag.string = blog['title']
            li.append(a_tag)
            ul.append(li)
            
        list_container.append(ul)
        section.append(list_container)
        
        article.append(header)
        article.append(section)
        
    with open(os.path.join(output_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(str(soup).replace('./assets/', '../assets/'))
        
    # Write JSON for dynamic loading if needed
    os.makedirs('assets/data', exist_ok=True)
    with open('assets/data/blogs.json', 'w', encoding='utf-8') as f:
        # Avoid saving full HTML to json if it gets big, but for dynamic popout it might be easiest
        json.dump(blogs, f, indent=4)

if __name__ == '__main__':
    build_blogs()
