"""
This script minifies CSS and JavaScript files.
"""

import re
import os

def minify_css(content: str) -> str:
    """
    Minifies CSS content by removing comments and collapsing whitespace.

    :param content: CSS content to minify
    :return: Minified CSS content
    """
    # Remove comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Collapse whitespace
    content = re.sub(r'\s+', ' ', content)
    # Remove space around symbols
    content = re.sub(r'\s*([\{\}:;,])\s*', r'\1', content)
    # Remove final semicolon in block
    content = re.sub(r';}', '}', content)
    return content.strip()

def minify_js(content: str) -> str:
    """
    Minifies JavaScript content by removing comments and collapsing whitespace.

    :param content: JavaScript content to minify
    :return: Minified JavaScript content
    """
    # Basic JS minification (safe approach)
    lines = content.split('\n')
    minified_lines = []
    for line in lines:
        line = line.strip()
        # Remove single line comments (careful with URLs)
        if '//' in line and 'http' not in line: 
            line = line.split('//')[0].strip()
        
        if line:
            minified_lines.append(line)
    
    return '\n'.join(minified_lines)

def process_assets() -> None:
    """
    Processes CSS and JavaScript files by minifying them.
    """
    css_path = 'assets/css/style.css'
    min_css_path = 'assets/css/style.min.css'
    
    js_path = 'assets/js/script.js'
    min_js_path = 'assets/js/script.min.js'
    
    # Minify CSS
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
            min_css = minify_css(css_content)
        
        with open(min_css_path, 'w', encoding='utf-8') as f:
            f.write(min_css)
        print(f"Minified CSS: {min_css_path}")

    # Minify JS
    if os.path.exists(js_path):
        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
            min_js = minify_js(js_content)
        
        with open(min_js_path, 'w', encoding='utf-8') as f:
            f.write(min_js)
        print(f"Minified JS: {min_js_path}")

if __name__ == "__main__":
    process_assets()
