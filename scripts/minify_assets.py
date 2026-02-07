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
    # Remove space around symbols (exclude colon to preserve descendant selectors)
    content = re.sub(r'\s*([\{\};,])\s*', r'\1', content)
    # Remove space after colon only (safe for properties)
    content = re.sub(r':\s+', ':', content)
    # Remove final semicolon in block
    content = re.sub(r';}', '}', content)
    return content.strip()


def minify_js(content: str) -> tuple[str, bool]:
    """
    Minifies JavaScript content using the jsmin library.

    :param content: JavaScript content to minify
    :return: Tuple containing (Minified JavaScript content, success flag)
    """
    try:
        from jsmin import jsmin
        return jsmin(content), True
    except ImportError:
        print("Error: 'jsmin' module not found. Please install it using 'pip install jsmin' or 'pip install -r requirements.txt'")
        # Return original content to avoid data loss, but unminified
        return content, False


def process_assets() -> None:
    """
    Processes CSS and JavaScript files by minifying them.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, 'assets')

    css_path = os.path.join(assets_dir, 'css', 'style.css')
    min_css_path = os.path.join(assets_dir, 'css', 'style.min.css')

    js_path = os.path.join(assets_dir, 'js', 'script.js')
    min_js_path = os.path.join(assets_dir, 'js', 'script.min.js')

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
            min_js, was_minified = minify_js(js_content)

        with open(min_js_path, 'w', encoding='utf-8') as f:
            f.write(min_js)

        if was_minified:
            print(f"Minified JS: {min_js_path}")
        else:
            print(f"Copied JS (no minification): {min_js_path}")


if __name__ == "__main__":
    process_assets()
