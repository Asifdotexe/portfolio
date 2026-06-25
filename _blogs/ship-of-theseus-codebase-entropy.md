---
title: "Building the Ship of Theseus: Visualizing Codebase Entropy"
published: true
date: "2026-06-22"
description: "How I built an interactive tool to visualize codebase entropy and answer a simple question: how much of the original code is left?"
tags: ["data-science", "software-engineering", "github-actions", "visualization", "d3js"]
---

## The Live App

This post covers the technical implementation of the tool. If you haven't seen the actual app yet, the technical details won't make much sense. I recommend taking a moment to [look at the live website](https://asifdotexe.github.io/Theseus/) and explore the different repositories. Come back here once you've seen how codebase entropy looks in action.

![Theseus](./assets/images/blogs/theseus.webp)

## The Origin

Most developers look at a massive legacy repository and wonder how it got so big. I had a different question: *how much of the original code is actually left?*

I was reading about the *[Ship of Theseus](https://second-brain.asifdotexe.workers.dev/?stackedNotes=ship-of-theseus)*. It is an ancient Greek thought experiment that asks a simple question. If you have a famous wooden ship and slowly replace every decaying plank until no original wood remains, is it still the same ship?

This happens in software engineering every day. Repositories live for years. The original developers leave, architectures change, and eventually the very last line of the original code gets overwritten. The repository keeps its name and its URL, but the contents are entirely new. I wanted to build something that visualizes this cycle of decay and renewal.

## What the Tool Does

The app visualizes how codebases change over time. It includes a few distinct views:

- **The Chronological View:** A stacked area chart showing the age composition of a repository over time. You can watch eras of code expand and get overwritten by newer refactors.
- **The Identity View:** This answers the main question. How much of the 2015 code is still alive in 2025?
- **Code Fossils:** The tool tracks the absolute oldest surviving lines of code. It is surprisingly fun to find a single comment or edge-case logic from 14 years ago that survived 10,000 commits. It gives some personality to the raw data.

## Architecture and Database as Code

I wanted to keep the system cheap to run. The architecture splits into a disconnected data generator and a UI visualizer. They communicate through static JSON files.

*(For a full breakdown of the system flow, check out the [ARCHITECTURE.md](https://github.com/Asifdotexe/Theseus/blob/main/docs/ARCHITECTURE.md) file in the repo).*

The frontend is intentionally lightweight. There is no React or heavy bundler. It uses plain HTML, CSS, and JavaScript to fetch `theseus.config.json` and render a D3 chart.

Since this is a static site hosted on GitHub Pages, the repository itself acts as the database.

## GitHub Actions

Codebases never stop evolving, so the data generation relies on GitHub Actions to create an autonomous monthly update.

A scheduled Action runs every month. The engine is strictly incremental. It checks the last snapshot date and the current calendar date, then processes the missing months in between. If the resulting JSON payloads change, a bot commits the diff back to the `main` branch.

This approach has limits. GitHub Actions gives free users a strict 6-hour execution cap per workflow. Processing repositories with millions of lines of code and tens of thousands of commits will easily hit this wall. I had to optimize the Python engine aggressively to ensure it could catch up on missing months within the limit.

## Performance Hacks

Execution time was the biggest problem. If the script takes too long, the CI cap kills the process. I solved it four ways:

- **Ditching Python Git Libraries:** Shelling out directly to native `git` commands is much faster than using Python wrappers. Git is written in C and runs quickly on its own.
- **Parallelizing `git blame`:** Taking a snapshot means blaming every tracked text file. Doing that sequentially for a large repo takes weeks. I filter out binary files with `git ls-files`, then use a `ThreadPoolExecutor` (see [`analyse_repository.py`](https://github.com/Asifdotexe/Theseus/blob/679ac75ecc2aa3956c7650b160ae6c6af1f1632e/scripts/analyse_repository.py#L134-L136)) to run concurrent blame processes.
- **Using `--line-porcelain`:** Standard `git blame` output is a pain to parse. The `--line-porcelain` flag outputs a machine-readable format where each line gets a metadata block with a UNIX timestamp:
   ```text
   8c3f2... 1 1
   author-time 1684320000
   summary Add initial config
   filename src/config.js
   	const config = { ... };
   ```
   This let me strip timestamps with a fast regex and bin them into years without writing a brittle parser.
- **The Fossil Protocol:** Repos imported from SVN or Mercurial often have inaccurate committer timestamps. The script sorts all commits by `author-time` using `git log --all --pretty=format:%H %at` ([`add_fossils.py`](https://github.com/Asifdotexe/Theseus/blob/679ac75ecc2aa3956c7650b160ae6c6af1f1632e/scripts/add_fossils.py#L121-L124)). This preserves the true origin date regardless of messy branch history.

## Building the UI

I am an engineer, not a UI designer. But I knew I wanted an atmospheric, bold look for the app. To bridge my design gap, I built the UI using AI agents.

I started with **[StitchMCP](https://stitch.withgoogle.com/docs/mcp/setup)** and the **[Frontend skill](https://github.com/sickn33/antigravity-awesome-skills)** from the Awesome Antigravity Skills repository to scaffold the layout. Once the core foundation existed, I used **[impeccable](https://second-brain.asifdotexe.workers.dev/?stackedNotes=ship-of-theseus)** to iterate quickly, tweak micro-animations, and fix accessibility issues. I will write a follow-up post detailing this exact process later.

## Scaling Up

The current architecture works for a personal project because it leans on GitHub Actions and a Git-based database. If I needed to track thousands of repos or provide real time updates, it would break.

To scale it, I would stop writing JSON back to the repo and move the datasets to an object store like S3 or Cloudflare R2. I would replace the single machine thread pool with a distributed worker queue for parallel blame operations. I would also add a real database like PostgreSQL or ClickHouse to allow instant querying of historical trends.

---

**About the author**  
I am a developer focusing on data science and cybersecurity. [Check out my portfolio](https://sayyedasif.com) or read my other deep-dives on [my blog](https://sayyedasif.com/blogs/).
