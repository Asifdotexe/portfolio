# Asif Sayyed Portfolio

This is the source code for the personal portfolio of Asif Sayyed.

## How to Add a New Blog Post

Since each blog is rendered as a standalone HTML page, adding a new one takes just a few steps:

### 1. Create a New Directory
Inside the `blogs/` folder, create a new directory for your new blog post. The name of the directory will become the URL slug for your post. 
- Example: `blogs/my-new-blog/`

### 2. Create the Blog's `index.html` File
Inside the newly created directory, create an `index.html` file. This file will hold the actual content of your blog post.
- **Tip:** The easiest way to get started is to copy an existing blog post (such as `blogs/seo-geo-aeo-guide/index.html`) and use it as a template. This ensures that the sidebar, navigation, and relative paths to CSS/JS (which should be `../../assets/...`) remain correct.
- Update the `<title>`, `<meta>` tags, `<h2 class="h2 article-title">`, and the actual content inside the `<div class="blog-post-content">`.

### 3. Link the Blog in `blogs/index.html`
For visitors to find your new blog, you need to add a link to it on the main Blogs page.
- Open `blogs/index.html`.
- Locate the unordered list with the class `<ul class="pf-v6-c-simple-list__list">`.
- Add a new list item (`<li>`) containing an anchor tag (`<a>`) pointing to your new blog's directory. For example:
  ```html
  <li class="pf-v6-c-simple-list__item">
      <a class="pf-v6-c-simple-list__item-link" href="/blogs/my-new-blog/">Your New Blog Title</a>
  </li>
  ```
### 4. Update the Sitemap

Add the new URL to `sitemap.xml` in the root directory so search engines index the new post.
