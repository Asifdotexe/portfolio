---
title: "Implementing SEO, AEO, and GEO in a Developer Portfolio"
published: true
date: "2026-06-20"
description: "A complete guide on optimizing your portfolio for Search Engines (SEO), Answer Engines (AEO), and Generative Engines (GEO)."
tags: ["seo", "webdev", "ai", "tutorial"]
---

Ranking on Google is not enough anymore. Not with AI tools like Perplexity, ChatGPT, and Google's AI Overviews also reading your site. A portfolio needs to work for all of them.

I took three approaches on my portfolio:
1. SEO for traditional search engines
2. AEO so AI can answer questions about me directly
3. GEO to give LLMs clean markdown context

What follows is what I did and the code I used, in case you want to do the same.

---

## 1. SEO: The foundation (meta tags, sitemap, robots.txt)

Traditional SEO still matters even when optimizing for AI. I used semantic HTML (`<nav>`, `<article>`, `<section>`), canonical links, and standard meta tags.

### Submitting to Google Search Console
Search engines need to know your site exists. After deploying:
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your website as a property (Domain or URL prefix).
3. Verify ownership. I added a `<meta name="google-site-verification" content="..." />` tag in the HTML.
4. In the **Sitemaps** section, submit your `sitemap.xml` URL so Google knows what pages to crawl.

### Meta tags and Open Graph
Open Graph and Twitter Card tags make the site look right when shared on LinkedIn or Twitter and help search engines index it.

[View `index.html` on GitHub](https://github.com/Asifdotexe/portfolio/blob/main/index.html)
```html
<!-- Primary Meta Tags -->
<title>Asif Sayyed | Data Scientist &mdash; Python, Machine Learning &amp; AI Portfolio</title>
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

### Sitemap and robots.txt
I also created a `sitemap.xml` covering `/projects`, `/events`, and other directories, plus a `robots.txt` to guide crawlers.

[View `robots.txt` on GitHub](https://github.com/Asifdotexe/portfolio/blob/main/robots.txt)
```text
# robots.txt
User-agent: *
Allow: /

Sitemap: https://sayyedasif.com/sitemap.xml
```

---

## 2. AEO: Answer engine optimization (JSON-LD)

Answer engines like Perplexity and Google's AI Overviews do not just index pages. They extract entities and relationships. To give them exact facts about my career and skills, I added JSON-LD structured data using the Schema.org vocabulary.

When I define myself as a `Person` and link my certifications and employers, answer engines can pull my information more reliably.

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

## 3. GEO: Generative engine optimization (llms.txt)

LLMs do not parse HTML and JavaScript particularly well. The `llms.txt` standard solves this. You place a markdown file at the root of your site with a clean summary of your content. When an AI agent crawls the site, it reads this file instead of wading through markup.

There is also `llms-full.txt` for the full version.

### Example of llms.txt

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

The separate `llms-full.txt` file lets me include details about each project's architecture, tools, and outcomes. That is useful for RAG pipelines.

---

## Conclusion

SEO handles traditional search. AEO helps answer engines extract your information. GEO gives LLMs clean context. Together they cover the ways someone might find you, whether they are a recruiter, a developer, or an AI agent.

If you have tried adding `llms.txt` to your site, I would like to hear how it went.
