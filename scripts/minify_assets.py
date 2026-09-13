"""
This script bundles CSS partials and minifies CSS and JavaScript files.
"""

import re
import os

CSS_PARTIALS = [
    'variables.css',
    'reset.css',
    'animations.css',
    'layout.css',
    'components.css',
    'blog-post.css',
    'responsive.css',
]


def bundle_css(partials_dir: str) -> str:
    """
    Concatenates CSS partials in defined order into a single stylesheet string.

    :param partials_dir: Directory containing CSS partials
    :return: Bundled CSS content
    """
    bundled = []
    for partial in CSS_PARTIALS:
        path = os.path.join(partials_dir, partial)
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
            header = f"/* === PARTIAL: {partial} === */"
            bundled.append(f"{header}\n{content}\n")
        else:
            print(f"Warning: Partial not found: {path}")

    return "\n".join(bundled)


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
    Processes CSS and JavaScript files: bundles partials and minifies them.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(base_dir, 'assets')
    partials_dir = os.path.join(assets_dir, 'css', 'partials')

    css_path = os.path.join(assets_dir, 'css', 'style.css')
    min_css_path = os.path.join(assets_dir, 'css', 'style.min.css')

    js_path = os.path.join(assets_dir, 'js', 'script.js')
    min_js_path = os.path.join(assets_dir, 'js', 'script.min.js')

    # 1. Bundle CSS from partials if partials directory exists
    if os.path.exists(partials_dir):
        bundled_css = bundle_css(partials_dir)
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(bundled_css)
        print(f"Bundled CSS from partials: {css_path}")
        css_content = bundled_css
    elif os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()
    else:
        css_content = ""

    # 2. Minify CSS
    if css_content:
        min_css = minify_css(css_content)
        with open(min_css_path, 'w', encoding='utf-8') as f:
            f.write(min_css)
        print(f"Minified CSS: {min_css_path}")

    # 3. Minify JS
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
