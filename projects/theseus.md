---
layout: project.njk
title: Ship of Theseus
subtitle: Does a codebase remain the same if every line is replaced? A monthly pulse on software entropy.
permalink: /projects/Theseus/
badges: 
  - Python 3.12+
  - Vanilla JS
  - GitHub Pages
  - GitHub Actions
  - Black Style
github_link: https://github.com/Asifdotexe/Theseus.git
live_link: "https://theseus.asifdotexe.workers.dev/"
doc_link: "https://github.com/Asifdotexe/Theseus/tree/main/docs"
image: /assets/images/projects/theseus.webp
---

## The Problem

Software projects change over time. Repositories can live for decades as developers leave and architectures shift, which makes it hard to track codebase churn and see if any original code survives.

This project is a visualization engine that measures codebase entropy using the Ship of Theseus paradox. It tracks when lines of code were written and how long they survive.

The visualization shows teams their codebase health. It helps them find "fossils" (the oldest surviving lines of code) and see the actual timeline of major rewrites.

## Architecture

The system separates data generation in Python from the Vanilla JS frontend. They communicate through static JSON files, which means the entire dashboard can be hosted for free on GitHub Pages without a backend server.

### 1. Data Pipeline

The pipeline calls the native `git` binary directly instead of using Python wrappers to improve speed. The extraction runs incrementally, skipping months the system has already analyzed.

<div class="mermaid" style="background: var(--onyx); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid var(--jet); overflow-x: auto; max-width: 100%;">
flowchart TD
    A[Start: read `theseus.config.json`] --> B{Has Data File?}
    B -- No --> C[Full Clone & 1st Commit]
    B -- Yes --> D[Look at Last Snapshot Date]
    D --> E[Is Last Snapshot < Current Month?]
    E -- Yes --> F[Clone & Jump to Next Month]
    E -- No --> G[Skip: Up to Date]
    C --> H[Run Git Blame Parallel]
    F --> H
    H --> I[Count Lines by Authorship Year]
    I --> J[Append Snapshot to JSON]
</div>

It uses ThreadPools to run `git blame --line-porcelain` concurrently across all tracked files and extracts line ages with regular expressions.

<a href="https://github.com/Asifdotexe/Theseus/blob/main/docs/ARCHITECTURE.md" target="_blank" class="read-more-btn">
    Read Pipeline Docs
</a>

### 2. Fossil Extraction

The system calculates fossils (pointers to the oldest surviving code) independently from the main timeline. The **Genesis** protocol finds the first line of code pushed to the repository. The **Survivor** protocol recursively blames `HEAD` to find the oldest line that is still in use today.

<div class="mermaid" style="background: var(--onyx); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid var(--jet); overflow-x: auto; max-width: 100%;">
stateDiagram-v2
    direction LR
    [*] --> ReadManifest
    state "Fossil Extractor" as extractor {
        GenesisFossil: Historical Genesis
        SurvivorFossil: Living Survivor
        GenesisFossil --> SortCommits
        SortCommits --> FindOldestBlamedLine
        SurvivorFossil --> CheckoutHEAD
        CheckoutHEAD --> FindOldestStillAlive
    }
    ReadManifest --> extractor
    extractor --> AppendMetadataJSON
</div>

### 3. UI and Data Delivery

The frontend fetches the configuration file and builds the repository selection grid. When you click a repository, the app fetches that dataset and renders the D3.js chart.

<div class="mermaid" style="background: var(--onyx); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid var(--jet); overflow-x: auto; max-width: 100%;">
sequenceDiagram
    participant Browser
    participant app.js
    participant config.json
    participant data.json
    Browser->>app.js: Load index.html
    app.js->>config.json: fetch("theseus.config.json")
    config.json-->>app.js: Returns [{repo1}, {repo2}]
    app.js->>Browser: Renders UI Selection Grid
    Browser->>app.js: Click Repo 1
    app.js->>Browser: Shows CSS Skeleton Loader Overlay
    app.js->>data.json: fetch("data/repo1_data.json")
    data.json-->>app.js: Loads Timeseries + Fossils
    app.js->>Browser: Computes D3/DOM Chart & Hides Skeleton
</div>

## Automation

GitHub Actions runs monthly updates on the configured repositories. The workflow generates incremental JSON snapshots and commits the new data back to the repository.

The pipeline runs in three steps. First, it clones the repo and loads the configuration. Second, it runs the incremental analysis and updates the survivor fossils. Finally, it minifies the data payloads and commits the changes back to the origin.

The pipeline only evaluates missing months and updates the "Living Fossil" pointer. It skips re-evaluating the entire history to save time in CI environments. A bot then pushes the updated payloads to the `main` branch.

<a href="https://github.com/Asifdotexe/Theseus/blob/main/docs/DEVOPS.md" target="_blank" class="read-more-btn">
    Read DevOps Docs
</a>

## Source Code & Documentation

To see the code, read the full API documentation, or run this project locally, head over to the [GitHub Repository](https://github.com/Asifdotexe/Theseus).

## What's Next

I plan to integrate the tool more deeply into CI/CD pipelines so it can track fossils on every major release. I also want to add support for tracking architecture changes across multiple repositories at once.
