---
title: "Building the Ship of Theseus: Visualizing Codebase Entropy"
published: true
date: "2026-06-22"
description: "A deep dive into how I built an interactive tool to visualize codebase entropy and answer the philosophical question: how much of the original code is left?"
tags: ["data-science", "software-engineering", "github-actions", "visualization", "d3js"]
---

## Before We Begin...

Let's address the elephant in the room: this blog post dives deep into the technical guts of a tool. If you haven't seen what the tool actually is, a lot of this won't make sense! I highly recommend you take a moment to [look at the live website](https://asifdotexe.github.io/Theseus/), play around with the interactive charts, and explore the different repositories. Once you've seen codebase entropy in action, come back here to see how it was built. 

## Abstract & The Philosophical Origin

Most developers, when looking at a massive legacy repository, are primarily interested in how the codebase grew to such an enormous extent. But my curiosity was slightly different: *how much of the original code is actually left?* 

This question came to me while I was reading about an ancient Greek thought experiment known as the *Ship of Theseus*. The paradox asks a profound question: if you have a famous wooden ship, and over the years you slowly replace every single decaying plank with a new one until no original wood remains, is it still the same ship?

It hit me that this exact paradox plays out daily in modern software engineering. Repositories live for years, sometimes decades. The original developers leave, entire architectural paradigms shift, and eventually, the very last line of the original "genesis" code is overwritten. Yet, the repository retains its name, its URL, and its identity. I wanted to build something that pulls back the curtain on this continuous decay and renewal, proving visually whether our software ships are entirely new constructs or if they still carry pieces of their original hulls.

## What Exactly Does Ship of Theseus Do?

At its core, the tool provides a visceral, data-driven understanding of how codebases are constantly being reborn. It helps us with a few distinct views:

- **The Chronological View:** A stacked area chart showing the age composition of a repository over time. You can literally watch eras of code expand and get overwritten by newer refactors.
- **The Identity View:** Answering the philosophical question—how much of the 2015 code is still alive in 2025? 
- **Ancient Code Fragments & Fossils:** We track "Fossils"—the absolute oldest surviving lines of code. It's an incredibly fun insight to find a single comment or edge-case logic from 14 years ago that survived 10,000 commits of refactoring. It gives personality to the data.

## The Architecture & Database as Code

When designing the system, I wanted to keep it as accessible and cheap to run as possible. The architecture is split into a disconnected backend (the data generator) and frontend (the UI visualizer). They communicate entirely via an intermediary static JSON format. 

*(For a full breakdown of the system flow, you can check out the [ARCHITECTURE.md](file:///D:/Theseus/docs/ARCHITECTURE.md) file in the repo).*

The frontend is intentionally lightweight—no React, no massive dependency chains, and no heavy bundlers. It's just Vanilla HTML, CSS, and JS fetching a centralized `theseus.config.json` to dynamically render a D3 chart.

Because this is a static site hosted for free on GitHub Pages, we essentially use the repository itself as the database. 

## Extensive GitHub Actions (and Fighting the Limits)

Codebases never stop evolving, so the data generation relies on GitHub Actions to create a completely autonomous, zero-maintenance "monthly pulse."

A scheduled Action kicks off every month. Because the engine is strictly incremental, it looks at the last snapshot date, checks the current calendar date, and knows it only needs to check out and process the missing months in between. Finally, if the resulting JSON payloads have changed, the GitHub Actions bot commits the diff and forces a write back to the `main` branch. 

However, this wasn't without its drawbacks. GitHub Actions for free users have a strict 6-hour execution cap per workflow. When you are processing repositories with millions of lines of code and tens of thousands of commits, you can easily hit this wall. This constraint forced me to optimize the Python engine aggressively to ensure it could catch up on missing months well within the limit.

## Learnings & Smart Hacks

Execution time was the main concern during development. If the script takes too long, the 6-hour CI cap kills the process. I solved it four ways:

- **Ditching Python Git Libraries** - Shelling out directly to native `git` shell commands is orders of magnitude faster than Python wrappers because `git` is written in C.
- **Parallelizing `git blame`** - Taking a snapshot means blaming every tracked text file. Doing that sequentially for a large repo takes weeks. I filter out binary files with `git ls-files`, then use a `ThreadPoolExecutor` (see [`analyse_repository.py`](file:///D:/Theseus/scripts/analyse_repository.py#L134-L136)) to fire off concurrent blame processes.
- **Using `--line-porcelain`** - Standard `git blame` output is meant for humans and a pain to parse. `git blame --line-porcelain` gives a machine-readable format where each line gets a metadata block with a UNIX timestamp:
   ```text
   8c3f2... 1 1
   author-time 1684320000
   summary Add initial config
   filename src/config.js
   	const config = { ... };
   ```
   This let me strip timestamps with a fast regex and bin them into years without a brittle parser.
- **The Fossil Protocol and SVN Ghost Commits** - Repos imported from SVN or Mercurial often have inaccurate committer timestamps. The Historical (Genesis) Protocol sorts all commits by `author-time` using `git log --all --pretty=format:%H %at` ([`add_fossils.py`](file:///D:/Theseus/scripts/add_fossils.py#L121-L124)), so the true origin is preserved regardless of wonky branch history.

## Development Methodology: AI as a Thought Partner

The way this project was developed is a testament to the modern engineering workflow. Rather than solo-coding in a vacuum, I heavily leveraged AI agents throughout the process. I acted more as a systems architect and orchestrator, bouncing algorithmic ideas for the git parser off my AI partner, reviewing its proposed implementations, and tweaking the pipeline. This tight iterative loop drastically accelerated the core engine's development.

## Vibe Coding the UI

I'm an engineer at heart, not a UI/UX designer. But I had a clear vision for the brand personality—atmospheric, bold, and narrative. To bridge my design gap, I "vibe coded" the UI. 

I started by using **StitchMCP** combined with the **Frontend skill** from the Awesome Antigravity Skills repository to rapidly scaffold out the visual identity and layout. Once the core foundation was there, I used **impeccable** to rapidly iterate, tweak micro-animations, and polish the accessibility until it matched the exact vibe I wanted. I'll be writing a dedicated follow-up blog post diving deep into the exact vibecoding process I used. Stay tuned for that!

## How We Would Scale This

The current architecture is simple because it leans on GitHub Actions and a Git-based database. That works for a personal project. If I needed to track thousands of repos or provide real-time entropy, it would break.

To scale it, I would stop writing JSON back to the repo and move datasets to an object store like S3 or Cloudflare R2. I would replace the single-machine thread pool with a distributed worker queue (Celery, BullMQ, SQS) for parallel blame operations. And I would add a real database, PostgreSQL or ClickHouse, so historical trends can be queried instantly.

---

**About the author**  
I am a developer focusing on data science and cybersecurity. [Check out my portfolio](https://sayyedasif.com) or read my other deep-dives on [my blog](https://sayyedasif.com/blogs/).
