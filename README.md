# Asif Sayyed Portfolio

Personal portfolio built with **Eleventy (11ty)**. Content is data-driven via JSON and Markdown templates.

---

## 🗺️ Quick Cheat Sheet: Where to Edit

| What you want to change | File to edit | Notes |
|---|---|---|
| **Site Name, Bio SEO, Social Links, Canonical URL** | `_data/site.json` | Injected into `<head>`, OG tags, JSON-LD schemas, and footer |
| **About Page (Intro Bio & Services)** | `index.html` | Work history & education auto-pull from JSON below |
| **Work Experience** | `_data/experience.json` | Roles, company, dates, description |
| **Education** | `_data/education.json` | Degrees, institutions, years |
| **Projects (Grid Card)** | `_data/projects.json` | Title, category, description, tags, image, link |
| **Projects (Detailed Case Study)** | `projects/<slug>.md` | Markdown with frontmatter (see guide below) |
| **Blogs (List Entry)** | `_data/blogs.json` | Title, slug, date, tags |
| **Blogs (Full Article)** | `blogs/<slug>.md` | Markdown with frontmatter; automatically added to RSS & sitemap |
| **Certifications** | `_data/certifications.json` | Title, issuer, date, image |
| **Events & Talks** | `_data/events.json` | Title, date, category, URL, image |
| **Contact Page & Map** | `contact.html` | Google Maps iframe & Web3Forms form |
| **CSS Styles** | `assets/css/partials/*.css` | Edit partial -> run `python scripts/minify_assets.py` |
| **Client JavaScript** | `assets/js/script.js` | Edit script -> run `python scripts/minify_assets.py` |

---

## 🚫 What NOT to Touch

| File / Folder | Why you should not edit directly |
|---|---|
| `_site/` | **Never touch.** Auto-generated build output. Any changes here will be wiped on `npm run build`. |
| `assets/css/style.css`<br>`assets/css/style.min.css` | **Compiled bundles.** Edit source files inside `assets/css/partials/` instead, then run `python scripts/minify_assets.py`. |
| `assets/js/script.min.js` | **Minified file.** Edit `assets/js/script.js` instead, then run `python scripts/minify_assets.py`. |
| `sitemap.njk`<br>`feed.njk` | **Dynamic generators.** Generates `/sitemap.xml` and `/feed.xml` automatically from `_data/site.json` and Markdown collections. |
| `_includes/` | **Shared layouts.** Contains base shell (`base.njk`), blog layout (`blog.njk`), and project layout (`project.njk`). Only touch when changing global layout structure or schema markup. |
| `.eleventy.js` | **SSG engine config.** Handles pass-through copies and template filters. |

---

## 📝 How to Update Pages

### 1. Adding a Project

1. **Add detailed page**: Create `projects/my-new-app.md`:
   ```markdown
   ---
   layout: project.njk
   title: My Cool AI App
   subtitle: An AI application that does cool things
   permalink: /projects/my-cool-ai-app/
   badges: 
     - Python
     - FastAPI
   github_link: https://github.com/Asifdotexe/repo-name
   live_link: https://example.com
   doc_link: https://example.com/docs
   image: /assets/images/project-banner.webp
   ---

   ## Problem Statement
   ...

   ## Architecture & Implementation
   ...
   ```
2. **Add to grid**: Open `_data/projects.json` and add a new object to the top of the array:
   ```json
   {
     "title": "My Cool AI App",
     "category": "Machine Learning",
     "description": "Short 1-line summary for card.",
     "image": "./assets/images/project-banner.webp",
     "url": "/projects/my-cool-ai-app/",
     "tags": ["python", "ai"]
   }
   ```

### 2. Adding a Blog Post

1. **Add article markdown**: Create `blogs/my-new-post.md`:
   ```markdown
   ---
   layout: blog.njk
   title: "My New Article Title"
   date: 2026-09-15
   tags: ["ai", "python"]
   permalink: /blogs/my-new-post/
   description: "One-sentence summary for search engines and RSS."
   image: /assets/images/blog-banner.webp
   ---

   Article content here...
   ```
2. **Register in list**: Open `_data/blogs.json` and add entry:
   ```json
   {
     "title": "My New Article Title",
     "slug": "my-new-post",
     "date": "2026-09-15",
     "tags": ["ai", "python"]
   }
   ```
*(Feed at `/feed.xml` and `/sitemap.xml` update automatically on build).*

### 3. Adding Experience or Education

- Open `_data/experience.json` or `_data/education.json`.
- Add new entry object to the array. `index.html` re-renders it automatically.

### 4. Adding Certifications or Events

- Open `_data/certifications.json` or `_data/events.json`.
- Add new item. Grid updates automatically.

### 5. Editing CSS / Styling

1. Edit the relevant file in `assets/css/partials/`:
   - `variables.css` (colors, tokens, light theme)
   - `reset.css` (base HTML tags)
   - `animations.css` (keyframes, tilt, typewriter)
   - `layout.css` (main, sidebar, navbar, footer)
   - `components.css` (cards, timeline, filter pills, contact inputs)
   - `blog-post.css` (markdown typography, code highlights, tables)
   - `responsive.css` (media query breakpoints)
2. Run asset build:
   ```bash
   python scripts/minify_assets.py
   ```

---

## 💻 Commands

### Local Development
```bash
npm start
```
*Runs `eleventy --serve` at `http://localhost:8080` with hot-reload.*

### Production Build
```bash
npm run build
```
*Compiles all templates, markdown, and feeds into `_site/`.*

### Re-bundle Assets (CSS/JS)
```bash
python scripts/minify_assets.py
```
*Rebuilds `style.css`, `style.min.css`, and `script.min.js`.*
