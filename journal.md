### Date: 2026-08-03
**Goal:** Migrate dynamic JS-rendered portfolio pages to full SSG architecture.

**What did we do:**
- Updated `index.html`, `projects.html`, `blogs.html`, `certifications.html`, and `events.html` to use Nunjucks loops ({% raw %}`{% for item in collection %}`{% endraw %}).
- Sourced list data directly from `_data/` JSON files at build time.
- Removed redundant `fetch()` API calls and DOM injection scripts for these sections from `assets/js/script.js`.
- Added `htmlTemplateEngine: "njk"` to `.eleventy.js` to fix LiquidJS parsing errors and properly process loops inside `.html` files.

**Why did we do it:**
- Replace client-side rendering with server-side generation (SSG) for perfect SEO.
- Remove empty `<noscript>` fallbacks.
- Reduce client-side JavaScript execution and eliminate UI loading layout shifts.
- Make the codebase strictly adhere to Eleventy best practices.
