import json
import os
import re

with open('assets/data/projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

for p in projects:
    # generate a slug from the title (or use alt if title is too long)
    # let's just use a simple slugify on alt
    slug = re.sub(r'[^a-z0-9]+', '-', p['alt'].lower()).strip('-')
    
    # special case for Theseus which already exists
    if slug == 'ship-of-theseus' or slug == 'theseus' or p.get('alt') == 'Ship of Theseus':
        p['url'] = '/projects/Theseus/'
        continue
        
    p['url'] = f'/projects/{slug}/'
    
    md_path = f'projects/{slug}.md'
    
    if not os.path.exists(md_path):
        title = p.get('title', '')
        image = p.get('image', '')
        github = p.get('github', '')
        if github:
            github_link = f"https://github.com/{github}"
        elif 'url' in p and p['url'].startswith('http'):
            github_link = p['url']
        else:
            github_link = "#"
            
        badges = [p.get('category_desc', '')] + p.get('tags', [])
        
        # Format badges for YAML array
        badges_yaml = "\n".join([f"  - {b}" for b in badges if b])
        
        content = f"""---
title: "{title}"
badges:
{badges_yaml}
github_link: {github_link}
live_link: "#"
doc_link: "#"
image: {image}
---

More details about **{title}** coming soon!

In the meantime, you can check out the source code on [GitHub]({github_link}).
"""
        with open(md_path, 'w', encoding='utf-8') as mf:
            mf.write(content)

with open('assets/data/projects.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, indent=2)

print("Migration complete!")
