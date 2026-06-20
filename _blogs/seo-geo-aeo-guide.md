---
title: "Implementing SEO, AEO, and GEO in a Developer Portfolio"
published: true
date: "2026-06-20"
description: "A complete guide on optimizing your portfolio for Search Engines (SEO), Answer Engines (AEO), and Generative Engines (GEO)."
tags: ["seo", "webdev", "ai", "tutorial"]
---

When building a modern portfolio, ranking on Google is no longer enough. With the rise of AI search tools like Perplexity, ChatGPT, and Google's AI Overviews, we need to optimize for a new generation of crawlers.

In my recent portfolio project, I implemented a three-pronged approach to discoverability:
1. **SEO (Search Engine Optimization):** Traditional optimization for Google, Bing, etc.
2. **AEO (Answer Engine Optimization):** Structuring data so AI can directly answer questions about me.
3. **GEO (Generative Engine Optimization):** Providing clean, markdown-based context specifically for Large Language Models (LLMs).

Here is a complete, straight-to-the-point guide on how I implemented this, complete with code snippets so you can do the same.

---

## 1. SEO: The Foundation (Meta Tags, Sitemap, Robots.txt)

Before optimizing for AI, your traditional SEO needs to be rock solid. We implemented semantic HTML (`<nav>`, `<article>`, `<section>`), canonical links, and a comprehensive set of meta tags.

### Submitting to Google Search Console
A critical step in traditional SEO is ensuring search engines actually index your site. After deploying your site, you should:
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your website as a property (either via Domain or URL prefix).
3. Verify ownership (we added a `<meta name="google-site-verification" content="..." />` tag in our HTML).
4. Navigate to the **Sitemaps** section and submit your `sitemap.xml` URL so Google knows exactly what pages to crawl.

### Meta Tags & Open Graph
To ensure the site looks great when shared on platforms like LinkedIn or Twitter, and is easily indexed by search engines, we added Open Graph and Twitter Card tags.

[View `index.html` on GitHub](https://github.com/Asifdotexe/portfolio/blob/main/index.html)
```html
<!-- Primary Meta Tags -->
<title>Asif Sayyed | Data Scientist — Python, Machine Learning & AI Portfolio</title>
<meta name="description" content="Portfolio of Asif Sayyed, a Data Scientist at Marsh McLennan specializing in Python, Machine Learning, NLP, and Cyber Risk Analytics." />
<meta name="keywords" content="Data Scientist, Python Developer, Machine Learning Engineer, AI Portfolio" />
<link rel="canonical" href="https://sayyedasif.com/" />

<!-- Open Graph / LinkedIn / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://sayyedasif.com/" />
<meta property="og:title" content="Asif Sayyed | Data Scientist Portfolio" />
<meta property="og:description" content="Data Scientist specializing in Python, Machine Learning, NLP, and Cyber Risk Analytics." />
<meta property="og:image" content="https://sayyedasif.com/assets/images/my-memoji.webp" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Asif Sayyed | Data Scientist Portfolio" />
```

### Sitemap & Robots.txt
We also created a `sitemap.xml` to map out the portfolio's directories (`/projects`, `/events`, etc.) and a `robots.txt` to guide traditional crawlers.

[View `robots.txt` on GitHub](https://github.com/Asifdotexe/portfolio/blob/main/robots.txt)
```text
# robots.txt
User-agent: *
Allow: /

Sitemap: https://sayyedasif.com/sitemap.xml
```

---

## 2. AEO: Answer Engine Optimization (JSON-LD)

Answer engines (like Perplexity or Google's AI Overviews) don't just index pages; they extract *entities* and relationships. To feed them exact facts about my career, skills, and certifications, I used **JSON-LD Structured Data** following the [Schema.org](https://schema.org/docs/schemas.html) vocabulary.

By explicitly defining myself as a `Person` and linking my `EducationalOccupationalCredential` (certifications) and `Organization` (employers), answer engines can confidently pull my information.

[View `index.html` on GitHub](https://github.com/Asifdotexe/portfolio/blob/main/index.html)
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://sayyedasif.com/#person",
    "name": "Asif Sayyed",
    "jobTitle": "Specialist - Data Science",
    "url": "https://sayyedasif.com/",
    "worksFor": {
        "@type": "Organization",
        "name": "Marsh McLennan"
    },
    "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Mumbai University"
    },
    "knowsAbout": [
        "Data Science",
        "Python",
        "Machine Learning",
        "Natural Language Processing",
        "Deep Learning"
    ],
    "sameAs": [
        "https://github.com/Asifdotexe",
        "https://www.linkedin.com/in/sayyedasif/"
    ]
}
</script>
```

---

## 3. GEO: Generative Engine Optimization (`llms.txt`)

Generative engines and LLMs often struggle with parsing complex HTML, CSS, and interactive JavaScript. To solve this, we implemented a standard gaining rapid adoption: **`llms.txt`**.

The `llms.txt` file (and its detailed counterpart, `llms-full.txt`) is placed at the root of the website. It provides a clean, markdown-formatted summary of the entire website's content. When an AI agent or LLM scrapes the site, it can read this file to get perfectly structured context without the noise of HTML tags.

### Example of `llms.txt`

[View `llms.txt` on GitHub](https://github.com/Asifdotexe/portfolio/blob/main/llms.txt)
```markdown
# Asif Sayyed - Data Scientist Portfolio

> I am a Data Scientist at Marsh McLennan's Cyber Risk Intelligence Center (CRIC), specializing in Python, Machine Learning, NLP, and Computer Vision.

## Quick Links
- [GitHub](https://github.com/Asifdotexe)
- [LinkedIn](https://linkedin.com/in/sayyedasif)

## Core Skills
- **Languages:** Python, R, SQL
- **AI/ML:** TensorFlow, PyTorch, Scikit-learn, NLP, Computer Vision
- **Data & Cloud:** AWS, Databricks, PySpark, MongoDB

## Full Context
For a complete dump of my projects, certifications, and experience, AI agents can read the full context file at:
[Full Portfolio Details](https://sayyedasif.com/llms-full.txt)
```

By providing a separate `llms-full.txt`, we can supply exhaustive details about every project's architecture, tools used, and outcomes—perfect for RAG (Retrieval-Augmented Generation) pipelines.

---

## Conclusion

By combining SEO (for traditional discovery), AEO (for entity extraction), and GEO (for LLM context), you ensure that your portfolio is discoverable no matter how a recruiter, developer, or AI agent is searching for you.

Have you implemented `llms.txt` in your projects yet? Let me know in the comments!
