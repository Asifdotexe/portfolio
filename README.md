# Asif Sayyed Portfolio

Personal portfolio built with **Eleventy (11ty)**. Content is data-driven via Markdown collections and JSON data files.

---

## 🗺️ Quick Cheat Sheet: Where to Edit

| What you want to change | File to edit | Notes |
|---|---|---|
| **Site Name, Bio SEO, Social Links, Canonical URL** | `_data/site.json` | Injected into `<head>`, OG tags, JSON-LD schemas, and footer |
| **About Page (Intro Bio & Services)** | `index.html` | Work history & education auto-pull from JSON below |
| **Work Experience** | `_data/experience.json` | Roles, company, dates, description |
| **Education** | `_data/education.json` | Degrees, institutions, years |
| **Projects (Grid Cards)** | `projects/<slug>.md` | Markdown frontmatter; automatically rendered on the projects grid |
| **Blogs (Articles & Listing)** | `blogs/<slug>.md` | Markdown with frontmatter; automatically added to blog listing, RSS & sitemap |
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
| `_includes/` | **Shared layouts.** Contains base shell (`base.njk`) and blog layout (`blog.njk`). Only touch when changing global layout structure or schema markup. |
| `.eleventy.js` | **SSG engine config.** Handles pass-through copies and template filters. |

---

## 📝 How to Update Pages

### 1. Adding a Project

Create a new file `projects/<slug>.md`:
```markdown
---
title: "My Cool AI App"
image: "/assets/images/projects/my-cool-app.webp"
alt: "My Cool AI App"
category: "tools" # tools | models | analytics | knowledge
category_desc: "Tools"
github: "Asifdotexe/repo-name"
is_private: false
deployment_url: "https://example.com"
doc_link: "https://example.com/docs" # (Optional) book icon link
journal_link: "https://example.com/blog" # (Optional) quill icon link
date: "2026-11-01"
tags:
  - python
  - fastapi
---
```
*(The card appears automatically in `/projects/` on build. No JSON registration required).*

### 2. Adding a Blog Post

Create a new file `blogs/<slug>.md`:
```markdown
---
title: "My New Article Title"
date: "2026-11-01"
tags: ["ai", "python"]
description: "One-sentence summary for search engines and RSS."
---

Article content here...
```
*(The article appears automatically on `/blogs/`, `/feed.xml`, and `/sitemap.xml` on build. No JSON registration required).*

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
*Compiles the static site into `_site/`.*

### Assets Build (CSS/JS minification)
```bash
npm run build:assets
```
*Runs `scripts/minify_assets.py` to bundle and minify CSS and JS.*
