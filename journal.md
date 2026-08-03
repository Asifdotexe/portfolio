### 2026-08-03

**Goal:** Move the portfolio from client-side JS rendering to Eleventy SSG.

**What we did:**
- Swapped out client-side rendering for Nunjucks loops ({% raw %}`{% for item in collection %}`{% endraw %}) in `index.html`, `projects.html`, `blogs.html`, `certifications.html`, and `events.html`.
- Wired those loops to pull data directly from `_data/` JSON files at build time.
- Stripped the old `fetch()` calls and DOM injection logic out of `assets/js/script.js`.
- Set `htmlTemplateEngine: "njk"` in `.eleventy.js`. This stopped LiquidJS from choking on the Nunjucks loops inside `.html` files.

**Why:**
- Doing this at build time means better SEO and no weird layout shifts when the page loads. 
- It let us drop the empty `<noscript>` tags.
- The site now actually follows standard Eleventy patterns instead of fighting the framework.

**Goal:** Clean up the codebase, fix a few bugs, and make it easier to run locally.

**What we did:**
- Added a `run.bat` script to wrap the local dev server and build commands.
- Found and removed a trailing comma in `assets/data/last_updated.json` that was breaking the projects fetch.
- Gutted the rest of the dead API functions from `assets/js/script.js` (specifically `populateEducation`, `populateExperience`, `populateCertifications`, and `populateEvents`).
- Replaced the JS `onclick` redirects in `_includes/sections/about.njk` with standard `<a>` tags.
- Fixed the Nunjucks category filter in `_includes/sections/projects.njk` by changing `downcase` to `lower`, and deleted some leftover `<noscript>` blocks.
- Set the Web3Forms `access_key` in `_includes/sections/contact.njk` to an empty build variable so the raw placeholder doesn't get submitted.

**Why:**
- To drop dead code and cut down the client bundle.
- The JSON parsing bug was stopping dynamic content from loading. 
- JS shouldn't be doing work that a standard HTML link handles out of the box.

**Goal:** Finish migrating the last pieces of hardcoded HTML to static loops.

**What we did:**
- Replaced the hardcoded blog entries in `_includes/sections/blogs.njk` with a Nunjucks loop pointing to `blogs.json`.
- Dropped a loop into `_includes/sections/certifications.njk`. It was still an empty shell from the old JS setup, so we gave it the proper markup to render cards at build time.

**Why:**
- The SSG migration wasn't complete until these were fixed. Now all content grids actually render out of the box without client-side fetches.
