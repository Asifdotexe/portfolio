# Asif Sayyed Portfolio

This repository contains the source code for my personal portfolio. The site uses **Eleventy (11ty)**, so you can write content in Markdown while keeping a unified HTML layout.

## Adding a New Project

### 1. Create a Markdown File
Create a new `.md` file inside the `projects/` directory (e.g., `projects/my-new-app.md`). 

### 2. Add the Frontmatter
At the very top of your file, add a YAML frontmatter block to define your project's metadata. 

```markdown
---
title: My Cool AI App
subtitle: An AI application that does cool things
permalink: /projects/my-cool-ai-app/
badges: 
  - Python
  - NextJS
  - OpenAI
github_link: https://github.com/Asifdotexe/repo-name
live_link: https://example.com
doc_link: https://example.com/docs
image: /assets/images/og-banner.webp
---
```
*(Note: You can omit `github_link`, `live_link`, or `doc_link` if you don't have them, and the buttons will automatically hide!)*

### 3. Write the Content
Write your project details below the frontmatter using standard Markdown. 

**Recommended Structure for Portfolio Projects:**
Instead of copying your GitHub README, tailor your portfolio page to highlight your engineering skills. Keep the focus on *why* and *how* you built it, rather than *how to use it*.
- **The Problem:** What is this and why did you build it?
- **Architecture:** High-level system design (Mermaid diagrams work great here).
- **Challenges Overcome:** What went wrong and how did you engineer your way out of it?
- **Source Code / Call to Action:** End the page with a link out to your GitHub repository for installation and quick-start instructions, so you don't have to duplicate them here.

If you need a Mermaid diagram, use a standard markdown code block with the `mermaid` language identifier:
```markdown
    ```mermaid
    flowchart TD
        A[Start] --> B[End]
    ```
```
Note: Ensure there are no empty lines inside the mermaid block to avoid markdown parser issues.

### 4. Link the Project
To make the project appear in the main "Projects" grid:
1. Open `assets/data/projects.json`.
2. Add a new JSON object for your project at the top of the array so it shows up first. 
3. Set the `"url"` field to match your new project page (like `"/projects/my-cool-ai-app/"`). The UI uses this to route clicks to your Markdown page.


---

## Adding a Blog Post

The steps to add a blog post are mostly identical to adding a project.

### 1. Create a Markdown File
Create a new `.md` file inside the `blogs/` directory (e.g., `blogs/new-tech-post.md`).

### 2. Add the Frontmatter
Add the following block to the top of the file:
```markdown
---
title: "My New Tech Post: A Deep Dive"
date: 2026-08-01
tags: ["seo", "webdev", "ai"]
permalink: /blogs/new-tech-post/
---
```

### 3. Write the Content
Write the article using standard Markdown. Code blocks, headers, and lists will inherit the site's default styles.

### 4. Link the Blog
To add the blog to the main "Blogs" list:
1. Open `blogs.html`.
2. Add a new `<li>` entry into the `<ul class="pf-v6-c-simple-list__list">` that matches the existing entries.


---

## Local Development & Deployment

### Running Locally
Start a local server with hot-reloading:
```bash
npm start
```
*This runs `eleventy --serve`. The site will be available at `http://localhost:8080`.*

### Building for Production
To build the static HTML files for deployment:
```bash
npm run build
```
*This generates all files into the `_site/` directory.*

### Deployment (GitHub Pages, Cloudflare Pages, Vercel, etc.)
When configuring your hosting provider:
- **Build Command:** `npm run build`
- **Output/Publish Directory:** `_site`
